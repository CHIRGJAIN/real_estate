import Layout from '@/components/Layout';

const COOKIE_INFO = [
  {
    title: 'What Are Cookies',
    body:
      'Cookies are small files stored in your browser that help remember your preferences and improve site performance.',
  },
  {
    title: 'How We Use Cookies',
    body:
      'We use cookies to keep you signed in, save favorites, and personalize your experience. This demo stores data locally in your browser.',
  },
  {
    title: 'Managing Cookies',
    body:
      'You can update your browser settings to block or delete cookies. Doing so may impact some site features.',
  },
];

export default function CookiesPage() {
  return (
    <Layout>
      <div className="pt-28 pb-20 container max-w-3xl">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Legal</p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">Cookie Policy</h1>
        <p className="text-muted-foreground mb-10">
          This policy explains how cookies are used on the NCR RealtyHub website.
        </p>

        <div className="space-y-8">
          {COOKIE_INFO.map(item => (
            <div key={item.title} className="bg-card border border-border/50 rounded-xl p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
