import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { adminApi } from '../../api/adminApi';
import { marketsQueryKeys } from '../../hooks/useMarkets';
import { CreateMarketRequest } from '../../types/apiTypes';

export const CreateMarketForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    opensAt: '',
    closesAt: '',
    initialYesProbability: '0.50',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: adminApi.createMarket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.all });
      setFormData({
        title: '',
        description: '',
        opensAt: '',
        closesAt: '',
        initialYesProbability: '0.50'
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const probability = parseFloat(formData.initialYesProbability);
    const request: CreateMarketRequest = {
      title: formData.title,
      description: formData.description || undefined,
      opensAt: new Date(formData.opensAt).toISOString(),
      closesAt: new Date(formData.closesAt).toISOString(),
      initialYesProbability: probability >= 0.01 && probability <= 0.99 ? probability : undefined,
    };
    mutation.mutate(request);
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const probability = parseFloat(formData.initialYesProbability) || 0.5;
  const isProbabilityValid = probability >= 0.01 && probability <= 0.99;
  const isValid = formData.title.trim() && formData.opensAt && formData.closesAt && isProbabilityValid;

  return (
    <div className="bg-[#080018] rounded-xl">
      <div className="px-5 py-4 border-b border-white/10">
        <h2 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Create New Market</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-5 space-y-4">
          {showSuccess && (
            <div className="p-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[#22c55e] text-sm font-semibold">Market created!</span>
            </div>
          )}

          {mutation.error && <ErrorDisplay error={mutation.error as Error} />}

          <Input
            dark
            label="Title"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="e.g., Will Bitcoin reach $100k?"
            required
          />

          <div>
            <label className="block text-xs text-[#EAEAF0] uppercase tracking-wider mb-2 font-semibold">
              Description
            </label>
            <textarea
              className="block w-full px-4 py-3 bg-[#080018] border border-white/10 rounded-lg text-[#EAEAF0] placeholder-[#767771] text-sm focus:outline-none focus:border-[#C6FF2F] focus:ring-2 focus:ring-[#C6FF2F]/20 transition-all duration-150"
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Resolution criteria..."
            />
          </div>

          {/* Initial Probability */}
          <div>
            <label className="block text-xs text-[#EAEAF0] uppercase tracking-wider mb-2 font-semibold">
              Initial YES Probability
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.01"
                max="0.99"
                step="0.01"
                value={formData.initialYesProbability}
                onChange={handleChange('initialYesProbability')}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#3D0C63]"
              />
              <input
                type="number"
                min="0.01"
                max="0.99"
                step="0.01"
                value={formData.initialYesProbability}
                onChange={handleChange('initialYesProbability')}
                className="w-20 px-2 py-1.5 bg-[#080018] border border-white/10 rounded-lg text-[#EAEAF0] text-sm font-mono text-center focus:outline-none focus:border-[#C6FF2F]"
              />
            </div>
            <p className="mt-1.5 text-xs text-[#767771]">
              Market maker will place orders around {Math.round(probability * 100)}%
            </p>
          </div>

          <Input
            dark
            label="Opens At"
            type="datetime-local"
            value={formData.opensAt}
            onChange={handleChange('opensAt')}
            required
          />

          <Input
            dark
            label="Closes At"
            type="datetime-local"
            value={formData.closesAt}
            onChange={handleChange('closesAt')}
            required
          />
        </div>
        <div className="px-5 pb-5">
          <Button
            type="submit"
            variant="primary"
            isLoading={mutation.isPending}
            disabled={!isValid}
            className="w-full"
          >
            Create Market
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMarketForm;

