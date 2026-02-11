import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, GitCompareArrows, User, Search, LogOut, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const NAV_LINKS = [
  { label: 'Buy', href: '/listings?purpose=buy' },
  { label: 'Rent', href: '/listings?purpose=rent' },
  { label: 'New Projects', href: '/listings?newLaunch=1' },
  { label: 'Commercial', href: '/listings?purpose=commercial' },
  { label: 'Verified', href: '/listings?verified=1' },
  { label: 'Agents', href: '/agents' },
  { label: 'Home Loan', href: '/home-loan' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const [favorites] = useLocalStorage<string[]>('favorites', []);
  const [compareList] = useLocalStorage<string[]>('compareList', []);
  const [user] = useLocalStorage<{ name: string; email: string } | null>('user', null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-border/50' : 'bg-transparent'
      }`}
    >
      <div className="hidden md:block border-b border-border/30">
        <div className="container py-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Now serving Noida, Greater Noida & Delhi NCR | WhatsApp for instant response</span>
          <a
            href="https://wa.me/919971179127"
            className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp: +91 9971179127
          </a>
        </div>
      </div>
      <div className={`container flex items-center justify-between ${scrolled ? 'py-3' : 'py-5'}`}>
        <Link to="/" className="flex items-center gap-2" aria-label="NCR RealtyHub Home">
          <div className="w-8 h-8 gold-gradient rounded-sm" />
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            NCR RealtyHub
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 rounded-md"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/sell" className="ml-2">
            <Button variant="outline-gold" size="sm">List Property</Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/listings" className="lg:hidden" aria-label="Search properties">
            <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/favorites" aria-label={`Favorites (${favorites.length})`}>
            <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-primary">
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 gold-gradient rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  {favorites.length}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/compare" aria-label={`Compare (${compareList.length})`}>
            <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-primary">
              <GitCompareArrows className="h-5 w-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 gold-gradient rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  {compareList.length}
                </span>
              )}
            </Button>
          </Link>
          <ThemeToggle />

          {user ? (
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground/70 hover:text-primary gap-1"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl py-1 animate-fade-in">
                  <Link to="/favorites" className="block px-4 py-2 text-sm text-foreground/70 hover:text-primary hover:bg-secondary/50">Favorites</Link>
                  <Link to="/compare" className="block px-4 py-2 text-sm text-foreground/70 hover:text-primary hover:bg-secondary/50">Compare</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user');
                      window.location.reload();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary/50 flex items-center gap-2"
                  >
                    <LogOut className="h-3 w-3" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button variant="ghost-light" size="sm">Sign In</Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground/70"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden glass border-t border-border/50 animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-secondary/30 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/sell" className="px-4 py-3 text-sm font-medium text-primary hover:bg-secondary/30 rounded-md">
              List Property
            </Link>
            {!user && (
              <Link to="/login" className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-secondary/30 rounded-md">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
