// src/app/register/page.tsx
'use client'; // Form etkileşimi için istemci tarafı (client-side) gerekli

import { registerUser } from '@/lib/actions';
import { useState } from 'react';

export default function RegisterPage() {
    const [message, setMessage] = useState('');

    async function clientAction(formData: FormData) {
        const result = await registerUser(formData);
        if (result?.error) {
            setMessage(result.error);
        } else {
            setMessage('Registration successful! You can now log in.');
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Join GitWatcher</h1>
                <p className="text-gray-500 mb-8">Create an account to start tracking.</p>

                <form action={clientAction} className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input
                        name="githubUsername"
                        type="text"
                        placeholder="GitHub Username"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password (min 6 chars)"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Create Account
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center font-medium ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}