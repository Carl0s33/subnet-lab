import { ReactNode } from 'react';
import Rodape from './Rodape';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 bg-background">
        <div className="min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
      <Rodape />
    </div>
  );
}
