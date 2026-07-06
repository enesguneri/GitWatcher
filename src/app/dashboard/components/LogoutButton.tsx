// src/app/dashboard/components/LogoutButton.tsx
'use client';

import { useState } from 'react';
import { logoutUser } from '@/lib/actions';

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogout() {
        setIsLoading(true);
        await logoutUser();
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.6 : 1,
            }}
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    );
}
