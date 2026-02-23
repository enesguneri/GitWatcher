// src/lib/session.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// 1. Şifreli Token Oluşturma (Giriş yaparken kullanılacak)
export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün geçerli

    const session = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);

    // Token'ı HttpOnly Cookie olarak tarayıcıya kaydet
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true, // JavaScript ile erişilemez (XSS koruması)
        secure: process.env.NODE_ENV === 'production', // Sadece HTTPS'de çalışır
        expires: expiresAt,
        sameSite: 'lax', // CSRF koruması
        path: '/',
    });
}

// 2. Token'ı Çözme ve Doğrulama (Sayfaları korurken kullanılacak)
export async function verifySession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log('Geçersiz veya süresi dolmuş token.');
        return null;
    }
}