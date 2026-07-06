import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../../components/Reveal';

const filters = ['All', 'Events', 'Seminars', 'Achievements', 'Office', 'Team'];

function getCategory(item) {
  return String(item.category || item.type || 'Events');
}

function getType(item) {
  return item.type === 'video' ? 'video' : 'image';
}

function GalleryCard({ item, index, active, dimmed, onOpen }) {
  const heightClass = ['h-[220px]', 'h-[280px]', 'h-[240px]', 'h-[320px]', 'h-[260px]'][index % 5];
  const category = getCategory(item);
  const title = item.title || item.caption || 'Gallery item';

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.1, duration: 0.35, ease: 'easeOut' }}
      onClick={onOpen}
      className={[
        'group relative mb-5 block w-full overflow-hidden rounded-[24px] border border-border bg-white text-left shadow-[0_10px_28px_rgba(17,24,39,0.06)] transition duration-[300ms] break-inside-avoid',
        heightClass,
        active ? 'z-10 -translate-y-2 scale-[1.04] shadow-[0_26px_60px_rgba(17,24,39,0.16)]' : 'hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(17,24,39,0.14)]',
        dimmed ? 'opacity-70' : 'opacity-100'
      ].join(' ')}
    >
      {getType(item) === 'video' ? (
        <video src={item.image} className="h-full w-full object-cover" muted playsInline preload="metadata" />
      ) : (
        <img
          src={item.image}
          alt={item.alt || title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-[300ms] group-hover:scale-[1.08]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#120f1b]/90 via-[#120f1b]/30 to-transparent opacity-0 transition duration-[300ms] group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white opacity-90 transition duration-[300ms] group-hover:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">{category}</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-white" aria-hidden="true">
              <path d="M12 5l7 7-1.4 1.4L13 8.8V19h-2V8.8L6.4 13.4 5 12l7-7Z" />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function Lightbox({ open, items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrev();
      if (event.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose, onPrev, onNext]);

  const item = items[index];
  if (!open || !item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0a12]/80 p-4 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111018] shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">{getCategory(item)}</p>
              <h3 className="mt-1 text-lg font-semibold">{item.title || item.caption || 'Gallery item'}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onPrev} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10">Previous</button>
              <button type="button" onClick={onNext} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10">Next</button>
              <button type="button" onClick={onClose} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">Close</button>
            </div>
          </div>
          <div className="bg-black">
            {getType(item) === 'video' ? (
              <video src={item.image} controls className="max-h-[78vh] w-full object-contain bg-black" />
            ) : (
              <img src={item.image} alt={item.alt || item.title || 'Gallery image'} className="max-h-[78vh] w-full object-contain" />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function GalleryShowcase({ page, gallery }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return gallery.filter((item) => {
      const category = getCategory(item);
      const matchesFilter = activeFilter === 'All' || category.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = !q || [item.title, item.category, item.caption].filter(Boolean).some((value) => String(value).toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, gallery, search]);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const prev = () => setSelectedIndex((current) => (current === null ? null : (current - 1 + filteredItems.length) % filteredItems.length));
  const next = () => setSelectedIndex((current) => (current === null ? null : (current + 1) % filteredItems.length));

  const heroTitle = page.title || 'Explore Our Gallery';
  const heroSubtitle =
    page.subtitle ||
    'Discover moments from our client meetings, seminars, office events, achievements and professional journey.';

  return (
    <div>
      <Reveal>
        <section className="grid gap-8 py-0 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-700">
              {page.eyebrow || 'Gallery'}
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-ink md:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted">
              {heroSubtitle}
            </p>
          </div>

          <div className="max-w-md lg:justify-self-end">
            <p className="text-sm leading-7 text-muted">
              A curated visual archive of the firm&apos;s professional activities, client interactions, and team moments. Use search or filters to explore by theme.
            </p>
          </div>
        </section>
      </Reveal>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                type="button"
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-semibold transition duration-300',
                  active ? 'bg-purple-900 text-white shadow-[0_10px_24px_rgba(88,28,135,0.22)]' : 'border border-border bg-white text-ink hover:bg-purple-900 hover:text-white'
                ].join(' ')}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="w-full lg:max-w-sm">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search gallery..."
            className="w-full rounded-full border border-border bg-white px-5 py-3 text-sm text-ink outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      <div className="mt-12">
        {filteredItems.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-background/50 px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v10h16V7H4Zm2 8 3-4 2.25 3 3.25-4.25L18 15H6Z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-ink">No gallery images found.</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-muted">Try a different filter or search term.</p>
          </div>
        ) : (
          <div className="columns-1 gap-[20px] md:columns-2 xl:columns-3 2xl:columns-4">
            {filteredItems.map((item, index) => (
              <div key={item.title || item.caption || item.image || index} className="break-inside-avoid">
                <GalleryCard
                  item={item}
                  index={index}
                  active={selectedIndex === index}
                  dimmed={selectedIndex !== null && selectedIndex !== index}
                  onOpen={() => openLightbox(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16">
        <p className="text-sm text-muted">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'image' : 'images'} from the gallery archive.
        </p>
      </div>

      <Lightbox
        open={selectedIndex !== null}
        items={filteredItems}
        index={selectedIndex ?? 0}
        onClose={closeLightbox}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}
