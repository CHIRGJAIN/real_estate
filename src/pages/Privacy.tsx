import Layout from '@/components/Layout';

const SECTIONS = [
  {
    title: 'Information We Collect',
    body:
      'We collect information you share with us, such as your name, email, phone number, and property preferences when you contact us, create an account, or submit a listing.',
  },
  {
    title: 'How We Use Your Information',
    body:
      'Your information helps us deliver property recommendations, respond to inquiries, schedule visits, and improve our services. We do not sell your personal data.',
  },
  {
    title: 'Data Storage',
    body:
      'This demo site stores submissions locally in your browser for a smoother experience. In a production environment, data would be stored securely on our servers.',
  },
  {
    title: 'Your Choices',
    body:
      'You can request updates or deletion of your personal information at any time by contacting our support team.',
  },
];

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="pt-28 pb-20 container max-w-3xl">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Legal</p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">
          We respect your privacy and are committed to protecting your personal information.
        </p>

        <div className="space-y-8">
          {SECTIONS.map(section => (
            <div key={section.title} className="bg-card border border-border/50 rounded-xl p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
