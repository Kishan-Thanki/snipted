// components/shared/user-avatar.tsx
'use client';

interface UserAvatarProps {
    user: {
        id: number;
        username: string;
    };
    size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
    };

    const initials = user.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br from-blue-500 to-purple-600
        flex items-center justify-center text-white font-semibold
        border-2 border-white dark:border-gray-800
        shadow-sm
      `}
            title={user.username}
        >
            {initials}
        </div>
    );
}