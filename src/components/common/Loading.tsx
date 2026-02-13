interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const Loading = ({ size = 'md', message }: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-2 border-[#3D0C63] border-t-transparent rounded-full animate-spin`} />
      {message && (
        <p className="text-[#767771] text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export const LoadingOverlay = ({ message }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loading size="lg" message={message} />
    </div>
  );
};

export const LoadingSpinner = () => <Loading size="sm" />;

export default Loading;

