import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className = '', hoverable = false, glow = false, onClick }: CardProps) => {
  const baseClasses = 'card-dark rounded-2xl overflow-hidden';
  const hoverClasses = hoverable ? 'cursor-pointer hover:border-[#00d4ff]/40' : '';
  const glowClasses = glow ? 'card-glow' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={`px-6 py-4 border-b border-white/5 ${className}`}>
      {typeof children === 'string' ? (
        <h3 className="text-lg font-semibold text-white">{children}</h3>
      ) : (
        children
      )}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody = ({ children, className = '' }: CardBodyProps) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`px-6 py-4 border-t border-white/5 bg-white/[0.02] ${className}`}>
      {children}
    </div>
  );
};

export default Card;

