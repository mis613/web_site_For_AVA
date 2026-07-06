import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useFetch } from '../hooks/useFetch';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const categories = ['GST', 'Income Tax', 'Audit', 'ROC', 'Company Law', 'Startup', 'Compliance', 'Accounting'];
const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Oldest', value: 'oldest' }
];

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
}

function getReadingTime(post) {
  if (post?.readingTime) return post.readingTime;
  const words = String(post?.content || post?.excerpt || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export default function Blog() {
  const { data, loading, error } = useFetch('/blogs', []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');

  const posts = data?.data || [];

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const next = posts.filter((post) => {
      const matchesSearch =
        !q ||
        [post.title, post.excerpt, post.category, post.slug]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      const matchesCategory = category === 'All' || String(post.category || '').toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    return [...next].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.publishDate || a.createdAt || 0) - new Date(b.publishDate || b.createdAt || 0);
      if (sort === 'popular') return String(b.title || '').length - String(a.title || '').length;
      return new Date(b.publishDate || b.createdAt || 0) - new Date(a.publishDate || a.createdAt || 0);
    });
  }, [posts, search, category, sort]);

  const featuredPost = filteredPosts[0] || posts[0];
  const secondaryPosts = filteredPosts.slice(1, 4);
  const popularPosts = posts.slice(0, 3);
  const recentPosts = posts.slice(0, 3);

  if (loading) return <div className="bg-background py-16"><div className="container-page"><LoadingState /></div></div>;
  if (error) return <div className="bg-background py-16"><div className="container-page"><ErrorState message={error} /></div></div>;

  return (
    <div className="bg-background py-16">
      <Seo title="Blog" description="Accounting and tax insights." />
      <div className="container-page">
        <section className="relative overflow-hidden rounded-[34px] border border-border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(155,139,184,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(201,154,62,0.14),_transparent_30%)]" />
          <div className="relative grid gap-10 px-6 py-10 md:px-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-12 lg:py-14">
            <div>
              <div className="inline-flex rounded-full border border-[#C99A3E]/25 bg-[#C99A3E]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#7c5a12]">
                BLOG
              </div>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">
                Insights &amp; Resources
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
                Stay updated with the latest articles on Taxation, GST, Company Law, Audit, Compliance, ROC Filings, Startup Advisory and Financial Planning.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn-primary" href="#all-posts">Explore Articles</a>
                <Link className="btn-secondary" to="/contact">Contact Expert</Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-[30px] border border-border bg-[#1f1633] p-6 shadow-[0_24px_70px_rgba(31,22,51,0.25)]"
            >
              <div className="absolute -left-8 top-6 h-28 w-28 rounded-full bg-[#c99a3e]/15 blur-3xl" />
              <div className="absolute right-4 top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                  {featuredPost?.featuredImage || featuredPost?.coverImage ? (
                    <img
                      src={featuredPost.featuredImage || featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="h-28 w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-28 rounded-2xl bg-[linear-gradient(135deg,rgba(201,154,62,0.9),rgba(155,139,184,0.7))]" />
                  )}
                  <p className="mt-4 text-xs uppercase tracking-[0.28em] text-white/60">Featured Article</p>
                  <p className="mt-2 text-sm leading-6 text-white/78">Abstract gradients, floating cards, and sharp contrast.</p>
                </div>
                <div className="relative">
                  <div className="absolute left-2 top-0 rounded-2xl border border-white/10 bg-white/90 px-4 py-3 text-sm font-semibold text-ink shadow-lg backdrop-blur">
                    Featured Article
                  </div>
                  <div className="absolute -right-1 top-12 rotate-6 rounded-2xl border border-white/10 bg-white/90 px-4 py-3 shadow-lg">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-primary-700">Reading</p>
                    <p className="mt-1 text-lg font-semibold text-ink">{getReadingTime(featuredPost)}</p>
                  </div>
                  <div className="mt-20 space-y-3">
                    <div className="h-24 rounded-[24px] bg-white/10" />
                    <div className="ml-8 h-20 rounded-[24px] bg-white/15" />
                    <div className="ml-16 h-16 rounded-[24px] bg-white/20" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mt-10 rounded-[30px] border border-border bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] md:p-6">
          <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Search &amp; Filter</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Find the right article quickly</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-[1.2fr_0.9fr_auto]">
              <input
                className="input min-w-[240px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
              />
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="All">All Categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
                {sortOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  category === item
                    ? 'border-[#c99a3e] bg-[#c99a3e]/10 text-[#7c5a12]'
                    : 'border-border bg-background text-ink hover:border-[#c99a3e]/50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div id="all-posts" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
              >
                <div className="relative">
                  {(post.featuredImage || post.coverImage) ? (
                    <img
                      src={post.featuredImage || post.coverImage}
                      alt={post.title}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-[#c99a3e] text-white">
                      <p className="text-sm uppercase tracking-[0.26em] text-white/70">No image</p>
                    </div>
                  )}
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-700 backdrop-blur">
                    {post.category || 'Article'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted">
                    <span>{formatDate(post.publishDate) || ''}</span>
                    <span>{getReadingTime(post)}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-ink">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-primary-700">{post.author || 'Editorial Team'}</span>
                    <Link className="btn-secondary inline-flex" to={`/blog/${post.slug}`}>
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
