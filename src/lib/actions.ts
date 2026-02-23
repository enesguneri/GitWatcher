// src/lib/actions.ts
'use server'; // Bu dosyadaki tüm fonksiyonlar sadece sunucu tarafında çalışır

import connectToDatabase from './mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

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

        // 2. Siber Güvenlik: Şifreyi Hash'le (Hashing)
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