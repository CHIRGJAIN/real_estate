import { ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 animate-fade-in">{children}</main>
      <Footer />
      <a
        href="https://wa.me/919876543210"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full gold-gradient px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg hover:scale-[1.02] transition-transform"
        aria-label="WhatsApp NCR RealtyHub"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>
    </div>
  );
}
