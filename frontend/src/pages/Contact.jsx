import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ContactForm from '../components/ContactForm';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import { useFetch } from '../hooks/useFetch';

const defaultBlocks = [
  { key: 'office', title: 'Our Office', icon: 'office', values: ['Dummy Office Address'] },
  { key: 'email', title: 'Email address', icon: 'email', values: ['info@example.com', 'hello@example.com'] },
  { key: 'hours', title: 'Working Hours', icon: 'hours', values: ['Mon-Sat', '10 am - 7 pm'] },
  { key: 'phone', title: 'Phone Number', icon: 'phone', values: ['Contact no : 0000000000', 'Whatsapp : 0000000000'] }
];

const fallback = {
  eyebrow: 'Contact Us',
  title: 'Get in touch',
  subtitle: 'Contact form, office information, Google maps, and social media links.',
  body: 'We respond to inquiries promptly and keep communication professional and confidential.',
  secondaryBody: '',
  jsonData: JSON.stringify(defaultBlocks.map((block) => ({ title: block.title, icon: block.icon, lines: block.values })))
};

const iconPaths = {
  office: <path d="M12 2c-4.4 0-8 3.4-8 7.7 0 5.8 8 12.3 8 12.3s8-6.5 8-12.3C20 5.4 16.4 2 12 2Zm0 10.2a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />,
  email: <path d="M4 6h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2Zm0 2v.3l8 5.2 8-5.2V8H4Zm16 8V10l-7.4 4.8c-.3.2-.6.2-.8 0L4 10v6h16Z" />,
  hours: <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm1 9.4 3 1.8-1 1.7-4-2.4V6h2Z" />,
  phone: <path d="M6.6 10.8c1.5 3 3.6 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10 21 3 14 3 5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2Z" />
};

export default function Contact() {
  const { data, loading, error } = useFetch('/site-pages', []);
  const page = data?.data?.find((item) => item.slug === 'contact') || fallback;
  const heroImageUrl = page.heroImageUrl || '';
  let contactBlocks = defaultBlocks;

  try {
    const parsed = page.jsonData ? JSON.parse(page.jsonData) : JSON.parse(fallback.jsonData);
    contactBlocks = defaultBlocks.map((block, index) => {
      const source = Array.isArray(parsed) ? parsed[index] || {} : {};
      const values = Array.isArray(source.lines) ? source.lines : Array.isArray(source.values) ? source.values : block.values;
      return { ...block, values };
    });
  } catch {
    contactBlocks = defaultBlocks;
  }
  const resolveIcon = (icon) => iconPaths[icon] || iconPaths.office;
  const contactCardClass = 'flex h-full min-h-[220px] flex-col items-center rounded-[2rem] border border-white/15 bg-white/6 px-5 py-6 text-center backdrop-blur-[2px] transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10';

  return (
    <div className="bg-background">
      <Seo title={page.title || 'Contact Us'} description={page.subtitle || fallback.subtitle} />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <section
        className="relative flex min-h-[380px] items-center overflow-hidden bg-cover bg-center bg-no-repeat py-12"
          style={{
          backgroundImage: heroImageUrl
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${heroImageUrl}')`
            : 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), linear-gradient(135deg,#1f2937,#111827)'
        }}
      >
        <div className="container-page relative z-10">
          <p
            className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 text-center text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase tracking-[0.28em] text-white/15 blur-[0.5px]"
            style={{ textShadow: '0 0 18px rgba(255,255,255,0.18)' }}
          >
            {page.eyebrow || fallback.eyebrow}
          </p>

          <div className="relative grid gap-5 pt-12 text-center text-white sm:grid-cols-2 xl:grid-cols-4 lg:pt-0">
            {contactBlocks.map((block) => (
              <div key={block.key} className={contactCardClass}>
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#e8622c] shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
                    {resolveIcon(block.icon)}
                  </svg>
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{block.title}</h2>
                <div className="mt-3 space-y-1 text-[15px] leading-6 text-gray-300">
                  {block.values.map((line) => (
                    <p key={line} className="break-words">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-10 sm:py-12">
        <div className="container-page">
          <SectionHeading eyebrow={page.eyebrow || 'Contact'} title={page.title || fallback.title} />
          <div className="card leading-7 text-muted">
            <p>{page.body || fallback.body}</p>
            {page.secondaryBody ? <p className="mt-3">{page.secondaryBody}</p> : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ContactForm />
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="text-lg font-semibold text-ink">Office information</h3>
              </div>
              <GoogleMapEmbed />
              <div className="card p-3">
                <h3 className="text-lg font-semibold text-ink">Social media</h3>
                <p className="mt-2 text-sm text-muted">LinkedIn | Instagram | X | Facebook</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
