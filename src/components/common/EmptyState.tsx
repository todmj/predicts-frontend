import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 px-4">
      {icon && (
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#3D0C63]/20 border border-[#3D0C63]/30 mb-6">
          <span className="text-4xl">{icon}</span>
        </div>
      )}
      <h3 className="text-xl font-bold text-[#EAEAF0] mb-2">{title}</h3>
      {description && (
        <p className="text-[#767771] max-w-md mx-auto mb-6">{description}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;

