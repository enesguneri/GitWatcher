// src/lib/actions.ts
'use server'; // Bu dosyadaki tüm fonksiyonlar sadece sunucu tarafında çalışır

import connectToDatabase from './mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { createSession } from './session';

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