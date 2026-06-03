import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MamaAlert AI - Maternal Health Emergency Detection',
  description: 'Advanced AI-powered maternal health monitoring and emergency detection system. Get real-time risk assessment and immediate access to healthcare services.',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
