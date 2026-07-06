import Seo from '../components/Seo';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import GalleryShowcase from './gallery/GalleryShowcase';

const fallback = {
  eyebrow: 'Gallery',
  title: 'Explore Our Gallery',
  subtitle: 'Discover moments from our client meetings, seminars, office events, achievements and professional journey.',
  body: '',
  gallery: []
};

function parseItems(page) {
  try {
    const parsed = page?.jsonData ? JSON.parse(page.jsonData) : {};
    return Array.isArray(parsed) ? parsed : parsed.gallery || [];
  } catch {
    return [];
  }
}

export default function Gallery() {
  const { data, loading, error } = useFetch('/site-pages', []);
  const page = data?.data?.find((item) => item.slug === 'gallery') || fallback;
  const gallery = parseItems(page);

  return (
    <div className="relative overflow-hidden bg-white py-16">
      <Seo title={page.title || fallback.title} description={page.subtitle || fallback.subtitle} />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-primary-700/10 blur-3xl" />
        <div className="absolute right-[-120px] top-32 h-96 w-96 rounded-full bg-[#a78bfa]/10 blur-3xl" />
        <div className="absolute left-6 top-6 grid h-24 w-24 grid-cols-4 gap-1 opacity-35">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={`lt-${index}`} className="h-1 w-1 rounded-full bg-[#d9d4e6]" />
          ))}
        </div>
        <div className="absolute right-6 top-6 grid h-24 w-24 grid-cols-4 gap-1 opacity-35">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={`rt-${index}`} className="h-1 w-1 rounded-full bg-[#d9d4e6]" />
          ))}
        </div>
      </div>

      <div className="container-page relative z-10 max-w-[1280px]">
        <GalleryShowcase page={page} gallery={gallery} />
      </div>
    </div>
  );
}
