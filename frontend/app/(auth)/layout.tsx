import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MamaAlert AI - Authentication',
  description: 'Sign in or create an account to access MamaAlert AI',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFF5F5]">
      {children}
    </div>
  );
}
