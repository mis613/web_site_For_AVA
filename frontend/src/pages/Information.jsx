import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';

const informationCards = [
  { label: 'Team Member', to: '/team', description: 'Meet the people behind our work.' },
  { label: 'Careers', to: '/careers', description: 'Explore openings, internships, and reviews.' },
  { label: 'Gallery', to: '/gallery', description: 'Browse selected images and media.' },
  { label: 'Privacy Policy', to: '/privacy-policy', description: 'Read how we handle your data.' },
  { label: 'Contact Us', to: '/contact', description: 'Get in touch with our team.' }
];

export default function Information() {
  return (
    <div className="bg-background py-16">
      <div className="container-page">
        <Seo title="Information" description="Important information about our firm, compliance, and services." />
        <SectionHeading eyebrow="Information" title="Useful firm information" />
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {informationCards.map((card) => (
            <div key={card.to} className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
              <h2 className="text-lg font-semibold text-ink">{card.label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
              <div className="mt-4">
                <Link
                  to={card.to}
                  className="inline-flex rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]"
                >
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
