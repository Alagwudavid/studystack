interface LoadingProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export function Loading({ className, size = 'md', text = 'Loading...' }: LoadingProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="text-center">
                <div className={`animate-spin rounded-full border-b-2 border-primary mx-auto mb-2 ${sizeClasses[size]}`}></div>
                <p className="text-muted-foreground text-sm">{text}</p>
            </div>
        </div>
    );
}

export default Loading;