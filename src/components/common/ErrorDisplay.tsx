import { Button } from './Button';
import { ApiError } from '../../types/apiTypes';

interface ErrorDisplayProps {
  error: Error | ApiError | string | unknown;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay = ({ error, onRetry, className = '' }: ErrorDisplayProps) => {
  let message = 'An unexpected error occurred';

  if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      message = error.message;
    }
  }

  return (
    <div className={`bg-[#080018] rounded-xl p-6 border border-[#ef4444]/30 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-[#ef4444]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#EAEAF0] mb-1">Something went wrong</h3>
          <p className="text-[#ef4444] text-sm mb-4">{message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;

