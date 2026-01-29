import React from 'react';

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[50vh] w-full">
            <div className="w-16 h-16 border-4 border-ink/10 border-t-accent rounded-full animate-spin"></div>
        </div>
    );
}
