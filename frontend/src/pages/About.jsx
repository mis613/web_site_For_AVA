import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';



import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { stats as siteStats, testimonials as siteTestimonials, timeline as siteTimeline, values as siteValues } from '../data/site';

const fallback = {
  eyebrow: 'About Us',
  title: 'Company profile',
  subtitle: 'Company profile, mission, vision, timeline, and leadership.',
  body: 'We are a modern Chartered Accountant firm focused on dependable compliance, proactive financial advice, and long-term client partnerships.',
  secondaryBody: 'Mission: deliver accurate and practical financial solutions. Vision: become the most trusted advisory partner for growing businesses.',
  values: siteValues,
  timeline: siteTimeline,
  leadershipText: 'Add leadership profiles here, including partner photo, designation, and short bio.'
};

const heroParticles = [
  'left-[-80px] top-[-60px] h-72 w-72 bg-[#0F172A]/10',
  'right-[-60px] top-12 h-80 w-80 bg-[#C99A3E]/10',
  'left-1/2 top-[-140px] h-96 w-96 -translate-x-1/2 bg-[#0F172A]/5'
];

const featureItems = [
  { title: 'Compliance First', desc: 'Built around accuracy, timeliness, and audit-ready discipline.' },
  { title: 'Business Advisory', desc: 'Practical financial guidance for founders and growing firms.' },
  { title: 'Confidential Approach', desc: 'Private, professional handling of every engagement.' },
  { title: 'Modern Delivery', desc: 'Cloud-friendly, responsive, and process-driven service.' }
];

const processSteps = [
  { title: 'Consultation', desc: 'We understand the business, goals, and current compliance stack.' },
  { title: 'Planning', desc: 'We define the right structure, timelines, and responsibilities.' },
  { title: 'Execution', desc: 'Work is delivered with clear checkpoints and prompt updates.' },
  { title: 'Compliance', desc: 'We complete filings and reporting with precision.' },
  { title: 'Ongoing Support', desc: 'We stay available for follow-up, advisory, and renewals.' }
];

const teamPreview = [
  { name: 'Amit Sharma', designation: 'Managing Partner', photo: '' },
  { name: 'Neha Gupta', designation: 'Tax Advisory Lead', photo: '' },
  { name: 'Rahul Verma', designation: 'Compliance Manager', photo: '' }
];

const testimonials = siteTestimonials.map((item, index) => ({
  ...item,
  photo: [
    '',
    ''
  ][index % 2]
}));

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

function SectionShell({ eyebrow, title, description, children, className = '' }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      className={`py-24 ${className}`}
    >
      <div className="container-page max-w-7xl">
        <motion.div variants={itemVariants} className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex rounded-full border border-[#C99A3E]/25 bg-[#C99A3E]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0F172A]"
          >
            {eyebrow}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
            className="mt-6 text-4xl font-bold tracking-tight text-[#0F172A] md:text-5xl"
          >
            {title}
          </motion.h2>
          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
              className="mt-5 text-lg leading-8 text-slate-600"
            >
              {description}
            </motion.p>
          ) : null}
        </motion.div>
        {children}
      </div>
    </motion.section>
  );
}

function Counter({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numeric = Number.parseInt(String(value).replace(/\D/g, ''), 10) || 0;
    let start = 0;
    const duration = 900;
    const step = Math.max(1, Math.ceil(numeric / 45));
    const timer = window.setInterval(() => {
      start += step;
      if (start >= numeric) {
        setCount(numeric);
        window.clearInterval(timer);
        return;
      }
      setCount(start);
    }, duration / 45);

    return () => window.clearInterval(timer);
  }, [value]);

  const suffix = String(value).replace(/[\d\s]/g, '');
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.35 }}
    >
      {`${count}${suffix}`}
    </motion.span>
  );
}

export default function About() {
  const { data, loading, error } = useFetch('/site-pages/about', []);
  const teamData = useFetch('/team', []);
  const page = data?.data || fallback;

  let parsed = {};
  try {
    parsed = page.jsonData ? JSON.parse(page.jsonData) : {};
  } catch {
    parsed = {};
  }

  const values = parsed.values || fallback.values;
  const timeline = parsed.timeline || fallback.timeline;
  const leadershipText = parsed.leadershipText || fallback.leadershipText;
  const teamMembers = teamData.data?.data || [];
  const heroImageUrl = page.heroImageUrl || '';
  const sectionImageUrl = page.sectionImageUrl || '';

  const aboutStats = useMemo(
    () => [
      { value: '15+', label: 'Years Experience' },
      { value: '500+', label: 'Clients' },
      { value: '98%', label: 'Client Retention' },
      { value: '1000+', label: 'Projects' }
    ],
    []
  );

  const testimonialsList = testimonials.length ? testimonials : siteTestimonials;

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonialsList.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [testimonialsList.length]);

  const currentTestimonial = testimonialsList[activeTestimonial] || testimonialsList[0];

  return (
    <div className="bg-white text-slate-700">
      <Seo title={page.title || 'About Us'} description={page.subtitle || fallback.subtitle} />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <main className="overflow-hidden">
        <section className="relative overflow-hidden py-24 md:min-h-[70vh] md:py-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(147,51,234,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_32%)]" />
          {heroParticles.map((cls) => (
            <div key={cls} className={`pointer-events-none absolute rounded-full blur-3xl ${cls}`} />
          ))}
          <div className="container-page relative z-10 flex min-h-[60vh] max-w-7xl items-center">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <div className="inline-flex rounded-full border border-[#C99A3E]/25 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0F172A] shadow-sm backdrop-blur">
                  {page.eyebrow || fallback.eyebrow}
                </div>
                <h1 className="mt-6 max-w-2xl text-5xl font-bold tracking-tight text-[#0F172A] md:text-6xl">
                  Trusted Financial &amp; Compliance Experts
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  {page.subtitle || fallback.subtitle}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-[#581C87] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-900"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center rounded-full border border-[#C99A3E]/40 bg-white/80 px-6 py-3 text-sm font-semibold text-[#0F172A] shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#C99A3E] hover:bg-[#C99A3E]/10"
                  >
                    Explore Services
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 28, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative"
              >
                <div className="absolute -left-6 top-10 hidden rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-lg backdrop-blur md:block">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Since</p>
                  <p className="mt-1 text-2xl font-bold text-[#0F172A]">2010</p>
                </div>
                <div className="absolute -bottom-6 right-6 rounded-2xl border border-white/40 bg-white/80 px-4 py-3 shadow-lg backdrop-blur">
                
                  
                </div>
                <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
                  {heroImageUrl ? (
                    <img src={heroImageUrl} alt="Professional office" className="h-[420px] w-full object-cover md:h-[540px]" />
                  ) : (
                    <div className="h-[420px] w-full bg-slate-200 md:h-[540px]" />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <SectionShell
          eyebrow="Company Overview"
          title="Built for long-term financial clarity"
          description="We combine practical accounting, tax, audit, and compliance execution with a calm, premium client experience."
        >
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
                {sectionImageUrl ? (
                  <img src={sectionImageUrl} alt="Company overview" className="h-full min-h-[340px] w-full object-cover" />
                ) : (
                  <div className="h-full min-h-[340px] w-full bg-slate-200" />
                )}
              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-lg backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Experience</p>
                <p className="mt-1 text-2xl font-bold text-[#0F172A] ">15+ Years</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-[28px] border border-slate-200 bg-[#FBFCFE] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <h3 className="text-3xl font-bold text-[#0F172A]">Financial clarity with disciplined execution</h3>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                {page.body || fallback.body}
              </p>
              <div className="mt-6 grid gap-3">
                {values.map((value) => (
                  <div key={value} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#C99A3E]/15 text-[#C99A3E]">
                      ?
                    </span>
                    <span className="text-sm font-medium text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center rounded-full bg-[#581C87] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-slate-900"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </SectionShell>

        <SectionShell
          eyebrow="Mission & Vision"
          title="Purpose-led advisory"
          description="Our mission and vision guide how we support clients through every stage of growth."
        >
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              { title: 'Mission', desc: page.secondaryBody || fallback.secondaryBody, icon: 'M6 18V6h12v12H6Zm3-9v6h6V9H9Z' },
              { title: 'Vision', desc: 'Become the most trusted compliance and advisory partner for ambitious businesses.', icon: 'M12 4l7 7-7 9-7-9 7-7Z' }
            ].map((card) => (
              <motion.article
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group h-full rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-[#F8FAFC] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#581C87] text-white shadow-lg shadow-slate-900/10">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                    <path d={card.icon} />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#0F172A]">{card.title}</h3>
                <p className="mt-4 text-lg leading-8 text-slate-600">{card.desc}</p>
              </motion.article>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          eyebrow="Company Statistics"
          title="Measured in trust, retention, and delivery"
          description="A quick snapshot of the scale and consistency behind our work."
        >
          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {aboutStats.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="rounded-[24px] border border-slate-200 bg-white p-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <div className="text-4xl font-bold text-[#0F172A]">
                  <Counter value={item.value} />
                </div>
                <div className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-[#C99A3E]">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          eyebrow="Our Process"
          title="A clear path from first call to ongoing support"
          description="Structured, transparent, and built to reduce client effort."
        >
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              { step: '01', title: 'Consultation', desc: 'We understand the business, goals, and current compliance stack.' },
              { step: '02', title: 'Planning', desc: 'We define the right structure, timelines, and responsibilities.' },
              { step: '03', title: 'Execution', desc: 'Work is delivered with clear checkpoints and prompt updates.' },
              { step: '04', title: 'Compliance', desc: 'We complete filings and reporting with precision.' },
              { step: '05', title: 'Ongoing Support', desc: 'We stay available for follow-up, advisory, and renewals.' }
            ].map((item) => (
              <motion.article
                key={item.step}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition duration-300 hover:border-[#C99A3E]/40 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C99A3E] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(201,154,62,0.28)]">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          eyebrow="Client Testimonials"
          title="Trusted by clients who value consistency"
          description="A lightweight slider that rotates through client feedback. "
          className="bg-[#ebd1d1]"
          style={{ backgroundColor: '#ebd1d1' }}
        >
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={currentTestimonial.quote}
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.98 }}
                transition={{ duration: 0.45 }}
                className="rounded-[28px] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
              >
                <div className="mb-4 text-4xl text-[#C99A3E]">�</div>
                <p className="text-lg leading-8 text-slate-700">{currentTestimonial.quote}</p>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={currentTestimonial.photo}
                    alt={currentTestimonial.author}
                    className="h-14 w-14 rounded-full object-cover ring-4 ring-[#C99A3E]/15"
                  />
                  <div>
                    <div className="font-semibold text-[#0F172A]">{currentTestimonial.author}</div>
                    <div className="mt-1 text-sm text-[#C99A3E]">?????</div>
                  </div>
                </div>
              </motion.blockquote>
            </AnimatePresence>

            <div className="grid gap-4">
              {testimonialsList.map((item, index) => (
                <button
                  key={item.quote}
                  type="button"
                  onClick={() => setActiveTestimonial(index)}
                  className={`flex items-center gap-4 rounded-[24px] border p-4 text-left transition-all duration-300 ${
                    activeTestimonial === index
                      ? 'border-[#C99A3E] bg-purple-900 text-white'
                      : 'border-slate-200 bg-white hover:border-[#C99A3E]/40 hover:bg-[#FBFCFE]'
                  }`}
                >
                  <img src={item.photo} alt={item.author} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold">{item.author}</div>
                    <div className={`mt-1 text-xs ${activeTestimonial === index ? 'text-white/70' : 'text-slate-500'}`}>
                      {item.quote}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SectionShell>

        <section className="py-4">
          <div className="container-page max-w-7xl">
            <div className="rounded-[32px] bg-[#FCEEF4] px-8 py-16 text-[#0F172A] shadow-[0_28px_80px_rgba(15,23,42,0.12)] md:px-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                    Let us help
                  </div>
                  <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
                    Ready to Simplify Your Financial Journey?
                  </h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition duration-300 hover:-translate-y-0.5">
                    Contact Us
                  </Link>
                  <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition duration-300 hover:-translate-y-0.5">
                    Schedule Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
