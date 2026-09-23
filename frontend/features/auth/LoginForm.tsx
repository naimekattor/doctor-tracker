'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, Lock, Mail, Sparkles } from 'lucide-react';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@doctortracker.com');
    setPassword('AdminPassword123!');
    setErrorMessage(null);
  };

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#CF3B3B]/10 border border-[#CF3B3B]/20 text-[#CF3B3B] text-sm animate-in fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="leading-snug">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5C768D] block mb-1.5">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#5C768D]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@doctortracker.com"
              className="h-[40px] w-full rounded-[6px] border border-[#E8EDEB] bg-white pl-9 pr-3 text-[14px] text-[#1C2D38] placeholder:text-[#5C768D]/60 focus:border-[#00684A] focus:outline-none focus:ring-2 focus:ring-[#00ED64]/25"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5C768D] block mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#5C768D]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="h-[40px] w-full rounded-[6px] border border-[#E8EDEB] bg-white pl-9 pr-3 text-[14px] text-[#1C2D38] placeholder:text-[#5C768D]/60 focus:border-[#00684A] focus:outline-none focus:ring-2 focus:ring-[#00ED64]/25"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2 font-semibold shadow-md"
        >
          Sign In to Portal
        </Button>
      </form>

      {/* Quick Demo Helper */}
      <div className="pt-2 border-t border-[#E8EDEB]">
        <button
          type="button"
          onClick={handleFillDemo}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-[#00684A] hover:bg-[#00ED64]/10 rounded-md transition-colors border border-dashed border-[#00ED64]/40 cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#00ED64]" />
          Fill Demo Admin Credentials
        </button>
      </div>
    </div>
  );
}
