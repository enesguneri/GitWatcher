// src/lib/actions.ts
'use server'; // Bu dosyadaki tüm fonksiyonlar sadece sunucu tarafında çalışır

import connectToDatabase from './mongodb';
import User from '@/models/User';
import Analysis from '@/models/Analysis';
import bcrypt from 'bcryptjs';
import { createSession, verifySession } from './session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchDashboardData } from './github';
import {
    analyzeSecurityAudit,
    analyzeDeveloperPersona,
    analyzeRecommendations,
} from './ai';

export async function registerUser(formData: FormData) {
    try {
        await connectToDatabase();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const githubUsername = formData.get('githubUsername') as string;

        // 1. Kullanıcı zaten var mı kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'This email is already registered.' };
        }

        // 2. Şifreyi Hash'le (Hashing)
        // 10 "salt round" kullanarak şifreyi geri döndürülemez hale getiriyoruz
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Kullanıcıyı kaydet
        const newUser = new User({
            email,
            password: hashedPassword,
            githubUsername,
        });

        await newUser.save();
        console.log('User registered successfully! 🎉');

        return { success: true };
    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Something went wrong during registration.' };
    }
}

export async function loginUser(formData: FormData) {
    try {
        await connectToDatabase();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // 1. Kullanıcıyı e-posta adresinden bul
        const user = await User.findOne({ email });

        if (!user || !user.password) {
            return { error: 'Invalid email or password.' };
        }

        // 2. Girilen şifre ile veritabanındaki Hashed şifreyi karşılaştır
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { error: 'Invalid email or password.' };
        }

        // 3. Şifre doğruysa JWT oluştur ve Cookie'ye kaydet
        // user._id MongoDB'nin otomatik atadığı benzersiz kimliktir
        await createSession(user._id.toString());

        return { success: true };
    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Something went wrong during login.' };
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/login');
}

export async function getAnalysisResults() {
    try {
        const session = await verifySession();
        if (!session) return { error: 'Unauthorized' };

        await connectToDatabase();
        const analysis = await Analysis.findOne({ userId: session.userId })
            .sort({ analyzedAt: -1 })
            .lean();

        if (!analysis) return { data: null };

        // Convert MongoDB ObjectIds/Dates to plain serializable formats
        const serializedAnalysis = JSON.parse(JSON.stringify(analysis));
        return { data: serializedAnalysis };
    } catch (error) {
        console.error('Error fetching analysis results:', error);
        return { error: 'Failed to retrieve analysis results' };
    }
}

export async function runAnalysis(forceRefresh = false) {
    try {
        const session = await verifySession();
        if (!session) return { error: 'Unauthorized' };

        await connectToDatabase();
        const user = await User.findById(session.userId).select('githubUsername').lean();
        if (!user) return { error: 'User not found' };

        // Check if valid cached analysis exists (expiresAt > now)
        if (!forceRefresh) {
            const existingAnalysis = await Analysis.findOne({ userId: session.userId })
                .sort({ analyzedAt: -1 })
                .lean();

            if (existingAnalysis && new Date(existingAnalysis.expiresAt) > new Date()) {
                const serialized = JSON.parse(JSON.stringify(existingAnalysis));
                return { success: true, data: serialized };
            }
        }

        // Fetch user's GitHub data
        const ghData = await fetchDashboardData(user.githubUsername);

        // Run Gemini analyses in parallel using Promise.all
        const [securityAudit, developerPersona, recommendations] = await Promise.all([
            analyzeSecurityAudit(user.githubUsername, ghData.repos),
            analyzeDeveloperPersona(
                user.githubUsername,
                ghData.profile.public_repos,
                ghData.profile.followers,
                ghData.totalStars,
                ghData.languages,
                ghData.repos
            ),
            analyzeRecommendations(user.githubUsername, ghData.repos),
        ]);

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours caching

        // Create or update analysis record
        const analysis = await Analysis.create({
            userId: session.userId,
            githubUsername: user.githubUsername,
            securityAudit,
            developerPersona,
            recommendations,
            analyzedAt: new Date(),
            expiresAt,
        });

        const serialized = JSON.parse(JSON.stringify(analysis));
        return { success: true, data: serialized };
    } catch (error: any) {
        console.error('Error running AI analysis:', error);
        return { error: error.message || 'Failed to complete AI analysis' };
    }
}