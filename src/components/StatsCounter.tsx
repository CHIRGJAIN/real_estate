import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Stat {
  label: string;
  value: number;
  suffix: string;
}

const STATS: Stat[] = [
  { label: 'NCR Homes Closed', value: 3200, suffix: '+' },
  { label: 'Site Visits Arranged', value: 9500, suffix: '+' },
  { label: 'RERA-Verified Listings', value: 1200, suffix: '+' },
  { label: 'Years in Noida', value: 14, suffix: '' },
];

function AnimatedNumber({ target, active }: { target: number; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);

  return <span>{count.toLocaleString()}</span>;
}

export default function StatsCounter() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 border-y border-border/50">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                <AnimatedNumber target={stat.value} active={isVisible} />
                {stat.suffix}
              </p>
              <p className="text-sm text-muted-foreground tracking-wider uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
