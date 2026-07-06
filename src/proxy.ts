// src/proxy.ts
// Next.js 16 Proxy (formerly middleware) — Route protection via JWT verification
// Runs on Edge Runtime (no Node.js modules like fs, crypto, mongoose)

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('session')?.value;

    // Verify JWT token
    let isAuthenticated = false;
    if (sessionCookie) {
        try {
            await jwtVerify(sessionCookie, encodedKey, {
                algorithms: ['HS256'],
            });
            isAuthenticated = true;
        } catch {
            // Token is invalid or expired — treat as unauthenticated
            isAuthenticated = false;
        }
    }

    // Protected route check: redirect to /login if not authenticated
    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
    );

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Auth route check: redirect to /dashboard if already authenticated
    const isAuthRoute = authRoutes.includes(pathname);

    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Only run proxy on these specific routes (performance optimization)
export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
