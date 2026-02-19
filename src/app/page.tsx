'use client';

import { AuthProvider, useAuth } from '@/lib/auth';
import { AppProvider } from '@/lib/store';
import { MainLayout } from '@/components/layout/main-layout';
import { LoginPage } from '@/components/auth/login-page';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse">
            <span className="text-xl font-bold text-primary-foreground">V</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
