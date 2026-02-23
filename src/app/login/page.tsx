// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/actions';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Butona basıldığında yükleniyor animasyonu için
    const router = useRouter();

    async function handleLogin(formData: FormData) {
        setIsLoading(true);
        setError(''); // Yeni denemede eski hatayı temizle

        const result = await loginUser(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.success) {
            // Başarılı giriş yapıldı! Kullanıcıyı panele (dashboard) yönlendir
            router.push('/dashboard');
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500 mb-8">Sign in to your GitWatcher account.</p>

                <form action={handleLogin} className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full p-3 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full p-3 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />

                    {/* Hata mesajı varsa burada kırmızı renkte gösteriyoruz */}
                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-semibold text-blue-600 hover:underline">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}