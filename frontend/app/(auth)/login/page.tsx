import React from 'react';
import { LoginForm } from '@/features/auth/LoginForm';
import { Activity, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | Doctor Tracker',
  description: 'Secure authentication portal for Doctor Tracker administration',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#001E2B] px-4 py-12 selection:bg-[#00ED64] selection:text-[#001E2B]">
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#023430] rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#00684A]/30 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ED64] text-[#001E2B] shadow-lg shadow-[#00ED64]/20 mb-1">
            <Activity className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Doctor Tracker
          </h1>
          <p className="text-sm text-[#5C768D] max-w-xs mx-auto">
            Administrative Healthcare Management & Analytics Portal
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-[#023430] bg-white p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-[#E8EDEB] pb-4">
            <div>
              <h2 className="text-base font-semibold text-[#1C2D38]">Portal Access</h2>
              <p className="text-xs text-[#5C768D]">Sign in with your administrative account</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#00684A] bg-[#00ED64]/15 px-2.5 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00684A]" />
              Secure
            </div>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#5C768D]">
          Protected by Enterprise-grade Authentication & RBAC.
        </p>
      </div>
    </div>
  );
}
