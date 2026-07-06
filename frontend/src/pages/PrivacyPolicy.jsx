import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { sanitizeRichHtml } from '../utils/sanitizeHtml';

const fallback = {
  eyebrow: 'Privacy Policy',
  title: 'How we handle your information',
  subtitle: 'Privacy policy for client and website visitors.',
  seoTitle: 'Privacy Policy',
  seoDescription: 'Privacy policy for client and website visitors.',
  body: '<p>We use contact details only for professional communication and service delivery.</p>',
  secondaryBody: '<p>Any future policy text can be expanded here without changing the route structure.</p>'
};

export default function PrivacyPolicy() {
  const { data, loading, error } = useFetch('/site-pages', []);
  const page = data?.data?.find((item) => item.slug === 'privacy-policy') || fallback;

  return (
    <div className="bg-background py-16">
      <div className="container-page">
        <Seo title={page.seoTitle || page.title || 'Privacy Policy'} description={page.seoDescription || page.subtitle || fallback.subtitle} />
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        <SectionHeading eyebrow={page.eyebrow || fallback.eyebrow} title={page.title || fallback.title} />
        <div className="card leading-7 text-muted">
          <div className="prose prose-slate max-w-none prose-headings:text-ink prose-p:text-muted prose-li:text-muted" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(page.body || fallback.body) }} />
          <div className="prose prose-slate mt-4 max-w-none prose-headings:text-ink prose-p:text-muted prose-li:text-muted" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(page.secondaryBody || fallback.secondaryBody) }} />
        </div>
      </div>
    </div>
  );
}
