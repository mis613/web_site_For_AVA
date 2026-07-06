import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import Reveal from '../components/Reveal';
import { useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

function StarRating({ rating = 5 }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${index < value ? 'fill-[#f59e0b] text-[#f59e0b]' : 'fill-none text-[#d4d4d8]'}`}
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M12 17.3l-6.2 3.8 1.7-7.1-5.5-4.8 7.2-.6L12 2l2.8 6.6 7.2.6-5.5 4.8 1.7 7.1z" />
        </svg>
      ))}
    </div>
  );
}

const fallback = {
  eyebrow: 'Careers',
  title: 'Build your career with us',
  subtitle: 'Join a team focused on finance, tax, audit, compliance, and advisory excellence.',
  body: 'We welcome qualified professionals and fresh talent interested in finance, tax, audit, and compliance.',
  secondaryBody: 'Please share your resume through the contact form for future opportunities.',
  jobs: [],
  internships: [],
  reviews: []
};

export default function Careers() {
  const { data, loading, error } = useFetch('/site-pages', []);
  const [activeFilter, setActiveFilter] = useState('all');
  const page = data?.data?.find((item) => item.slug === 'careers') || fallback;
  let parsed = {};
  try {
    parsed = page.jsonData ? JSON.parse(page.jsonData) : {};
  } catch {
    parsed = {};
  }
  const jobs = parsed.jobs || fallback.jobs;
  const internships = parsed.internships || fallback.internships;
  const reviews = parsed.reviews || fallback.reviews;
  const allItems = useMemo(() => {
    const jobItems = jobs.map((item) => ({ ...item, kind: 'job' }));
    const internshipItems = internships.map((item) => ({ ...item, kind: 'internship' }));
    return [...jobItems, ...internshipItems];
  }, [jobs, internships]);
  const filteredItems = activeFilter === 'all' ? allItems : allItems.filter((item) => item.kind === activeFilter);

  return (
    <div className="bg-background py-16">
      <div className="container-page">
        <Seo title={page.title || 'Careers'} description={page.subtitle || fallback.subtitle} />
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        <Reveal className="overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-[#1f1633] via-[#2d1f4a] to-[#f5efe7] text-white shadow-[0_16px_50px_rgba(17,24,39,0.15)]">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <SectionHeading eyebrow={page.eyebrow || fallback.eyebrow} title={page.title || fallback.title} description={page.subtitle || fallback.subtitle} />
              <div className="max-w-2xl space-y-3 text-sm leading-7 text-white/80">
                <p>{page.body || fallback.body}</p>
                <p>{page.secondaryBody || fallback.secondaryBody}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {['all', 'job', 'internship'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveFilter(item)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeFilter === item
                        ? 'bg-white text-[#24163d]'
                        : 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {item === 'all' ? 'All openings' : item === 'job' ? 'Jobs' : 'Internships'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Open roles</p>
                <div className="mt-2 text-4xl font-semibold">{jobs.length + internships.length}</div>
                <p className="mt-2 text-sm text-white/70">Active opportunities visible in the admin panel.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Reviews</p>
                <div className="mt-2 text-4xl font-semibold">{reviews.length}</div>
                <p className="mt-2 text-sm text-white/70">Intern feedback and ratings collected from admin.</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8">
          <SectionHeading eyebrow="Openings" title="Available positions" description="Browse current jobs and internships, then check the role details below." />
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredItems.map((item) => (
              <Reveal key={`${item.kind}-${item.title || item.role}`} className="rounded-3xl border border-border bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">{item.kind}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-ink">{item.title || item.role}</h3>
                    <p className="mt-2 text-sm text-muted">{item.location || item.duration || item.stipend || ''}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.kind === 'job' ? 'bg-primary-50 text-primary-700' : 'bg-amber-50 text-amber-700'}`}>
                    {item.status || 'Open'}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>
              </Reveal>
            ))}
            {filteredItems.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border bg-white p-6 text-sm text-muted">
                No openings for this filter yet.
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading eyebrow="Intern Reviews" title="What interns say" description="Ratings and reviews can be added from the admin panel." />
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Average rating</p>
              <div className="mt-2 flex items-end gap-3">
                <div className="text-4xl font-semibold text-ink">
                  {reviews.length ? (reviews.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / reviews.length).toFixed(1) : '0.0'}
                </div>
                <span className="pb-1 text-sm text-muted">/ 5</span>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Total reviews</p>
              <div className="mt-2 text-4xl font-semibold text-ink">{reviews.length}</div>
            </div>
            <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Feedback style</p>
              <div className="mt-3 flex gap-1">
                <StarRating rating={5} />
              </div>
              <p className="mt-3 text-sm text-muted">Use the admin panel to add ratings, comments, and reviewer details.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <Reveal key={`${review.name || review.author}-${review.rating || ''}`} className="rounded-3xl border border-border bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-ink">{review.name || review.author}</h3>
                    <p className="mt-1 text-sm text-muted">{review.role || review.designation || 'Intern'}</p>
                  </div>
                  <div className="text-right">
                    <StarRating rating={review.rating || 5} />
                    <span className="mt-1 block text-xs font-semibold text-emerald-700">{review.rating || '5'} / 5</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{review.review || review.comment}</p>
                <div className="mt-4 rounded-2xl bg-background px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  Intern Review
                </div>
              </Reveal>
            ))}
            {reviews.length === 0 && <p className="text-sm text-muted">No intern reviews added yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
