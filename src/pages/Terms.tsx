import Layout from '@/components/Layout';

const TERMS = [
  {
    title: 'Use of the Site',
    body:
      'NCR RealtyHub provides listings and related content for informational purposes. You agree to use the site responsibly and lawfully.',
  },
  {
    title: 'Listings and Availability',
    body:
      'Property details are provided by agents and owners. Availability, pricing, and specifications can change without notice.',
  },
  {
    title: 'No Legal Advice',
    body:
      'Information on this site does not constitute legal, financial, or real estate advice. Please consult qualified professionals for guidance.',
  },
  {
    title: 'Contact and Submissions',
    body:
      'When you submit inquiries or listings, you authorize our team to contact you regarding your request.',
  },
];

export default function TermsPage() {
  return (
    <Layout>
      <div className="pt-28 pb-20 container max-w-3xl">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Legal</p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">
          These terms outline how you can use our website and services.
        </p>

        <div className="space-y-8">
          {TERMS.map(term => (
            <div key={term.title} className="bg-card border border-border/50 rounded-xl p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-2">{term.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{term.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
