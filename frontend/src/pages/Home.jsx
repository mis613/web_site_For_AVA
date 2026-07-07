import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { api } from '../services/api';
import { stats } from '../data/site';
import statsBg from '../assets/images/pexels-pixabay-265087.jpg';

const services = [
  { title: 'Taxation', desc: 'Expert tax planning, return filing, and regulatory compliance to minimize risks while maximizing efficiency.' },
  { title:  'Tax Audit',desc: 'Accurate and independent tax audit services that ensure statutory compliance and strengthen financial transparency.' },
  { title: 'GST Compliance', desc: 'Complete GST solutions including registration, return filing, reconciliation, compliance management, and professional advisory.' },
  { title: 'Accounting', desc: 'Reliable bookkeeping, financial reporting, payroll support, and accounting services that keep your business financially organized.' },
  { title: 'Business Advisory', desc: 'Strategic financial and business consulting to support sustainable growth, operational efficiency, and long-term success.ss' }
];

const chooseUs = [
  { title: 'Experienced Professionals', text: 'Benefit from the expertise of qualified Chartered Accountants and financial professionals committed to delivering practical, accurate, and business-focused solutions.', icon: '👨‍💼' },
  { title: 'Timely Service Delivery', text: 'We value your time by ensuring prompt execution of assignments without compromising on quality, accuracy, or compliance.', icon: '⚡' },
  { title: 'Reliable Compliance Support', text: 'Stay ahead of statutory obligations with accurate filings, proactive compliance management, and up-to-date regulatory guidance.', icon: '✅' },
  { title: 'Complete Confidentiality', text: 'Your financial information is safeguarded with the highest standards of confidentiality, professionalism, and data security.', icon: '🔒' }
];

const serviceGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const serviceCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut' }
  },
  hover: {
    x: [0, 6, 0, -6, 0],
    y: [0, -3, 0, 3, 0],
    rotate: [0, 1.5, 0, -1.5, 0],
    scale: 1.02,
    transition: {
      duration: 5,
      ease: 'easeInOut',
      repeat: Infinity
    }
  },
  rest: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeInOut' }
  }
};

export default function Home() {
  const [homeVideoUrl, setHomeVideoUrl] = useState('');
  const [homeVideoVersion, setHomeVideoVersion] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .get('/home-video', { cache: 'no-store' })
      .then((data) => {
        if (active) {
          const resolvedVideoUrl = data?.videoUrl || data?.secureUrl || '';
          setHomeVideoUrl(resolvedVideoUrl);
          setHomeVideoVersion(data?.updatedAt || data?.publicId || '');
          console.log('[home-video] frontend fetched:', {
            videoUrl: resolvedVideoUrl,
            publicId: data?.publicId || '',
            updatedAt: data?.updatedAt || ''
          });
        }
      })
      .catch(() => {
        if (active) setHomeVideoUrl('');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const updateTouchState = () => setIsTouchDevice(mediaQuery.matches);

    updateTouchState();
    mediaQuery.addEventListener?.('change', updateTouchState);
    return () => mediaQuery.removeEventListener?.('change', updateTouchState);
  }, []);

  return (
    <div className="bg-background">
      <Seo
        title="Home"
        description="Avibha Consultants Private Limited, Chartered Accountants providing Taxation, Audit, GST, Compliance and Business Advisory services across India."
      />

      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          {homeVideoUrl ? (
            <video
              className="h-full w-full object-cover"
              key={`${homeVideoUrl}-${homeVideoVersion}`}
              src={homeVideoVersion ? `${homeVideoUrl}${homeVideoUrl.includes('?') ? '&' : '?'}v=${encodeURIComponent(homeVideoVersion)}` : homeVideoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(155,139,184,0.28),transparent_38%),linear-gradient(135deg,#3f4354_0%,#7e6ba5_52%,#581c87_100%)]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,24,39,0.9)_0%,rgba(17,24,39,0.35)_100%)]" />
        </div>

        <div className="container-page relative z-10 py-20 sm:py-24 lg:py-28">
          <Reveal className="mx-auto max-w-5xl text-left">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#fac761] sm:text-base">
              Avibha Finance Consultants
            </p>
            <h1 className="mt-5 text-[52px] font-semibold leading-[1.05] sm:text-[58px] lg:text-[50px]">
            Financial Consulting That Drives Smart Business Decisions
            </h1>
            <p className="mt-6 max-w-3xl text-[1.05rem] font-normal leading-8 text-white/88 sm:text-[1.12rem]">
              Let&apos;s Get Started, For Business Solutions!
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link to="/contact" className="btn-accent px-5 py-2.5 text-sm">
                Get Consultation
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition duration-300 hover:scale-[1.03] hover:bg-white hover:text-primary-900 hover:shadow-[0_0_0_6px_rgba(255,255,255,0.08)]"
              >
                View Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#ebd1d1] py-16 sm:py-18 text-center">
        <div className="container-page max-w-[1200px]">
          <Reveal className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#c99a3e]">
              ABOUT US
            </p>
            <h2 className="mt-2 text-[36px] font-semibold tracking-tight text-[#1f2937] sm:text-[40px]">
              Avibha Consultants Private Limited
            </h2>
          </Reveal>

          <div className="grid gap-10 md:grid-cols-0.5">
            <Reveal className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-purple-900 hover:shadow-2xl">
              <p className="text-[1rem] font-normal leading-8 text-slate-700 transition-colors duration-300 group-hover:text-white">
                We are a modern Chartered Accountant firm providing comprehensive solutions in taxation, accounting, auditing, compliance, and financial consulting. Our focus is on building long-term relationships by delivering accurate advice, timely execution, and practical business solutions that add real value.
              </p>
              <h3 className="mt-6 text-[1.2rem] font-semibold text-slate-900 transition-colors duration-300 group-hover:text-white">Mission &amp; Vision</h3>
              <p className="mt-3 text-[1rem] font-normal leading-8 text-slate-700 transition-colors duration-300 group-hover:text-white">
                To deliver accurate, transparent, and practical financial solutions that empower our clients to make confident business decisions.

Vision:
To become the most trusted financial and business advisory partner by delivering excellence, innovation, and long-term value to every client.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className="text-[1.2rem] font-semibold text-gray-800">Core values</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Integrity', 'Professional Excellence', 'Innovation', 'Client Success','Commitment', 'Trust & Confidentiality'].map((value) => (
                  <span
                    key={value}
                    className="rounded-full bg-[#eef1e8] px-5 py-2.5 text-[0.95rem] font-normal text-[#5a6b4a]"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-18 text-center">
        <div className="container-page">
          <Reveal className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c99a3e]">Services</p>
            <h2 className="mt-2 text-[36px] font-semibold tracking-tight text-ink sm:text-[40px]">
              Professional Financial Solutions for Modern Businesses
            </h2>
            <p className="mt-5 max-w-3xl text-[1rem] font-normal leading-8 text-muted">
              Focused support for financial compliance, reporting, and strategic advisory.
            </p>
          </Reveal>

          <motion.div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            variants={serviceGridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {services.map((item) => (
              <motion.div
                key={item.title}
                className="group card bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                variants={serviceCardVariants}
                initial="hidden"
                whileInView="show"
                whileHover={isTouchDevice ? 'rest' : 'hover'}
                animate="rest"
                viewport={{ once: true, amount: 0.2 }}
                style={{ transformOrigin: 'center center' }}
              >
                <div className="flex h-12 w-36 items-center justify-center rounded-full bg-[#eef1e8] text-sm font-semibold text-[#5a6b4a]">
                  {item.title}
                </div>
                {'desc' in item ? <p className="mt-3 text-[1rem] font-normal leading-7 text-muted">{item.desc}</p> : null}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#ebd1d1] py-16 sm:py-18">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c99a3e]">Why Choose Us</p>
            <h2 className="mt-2 text-[36px] font-semibold tracking-tight text-ink sm:text-[40px]">
              Your Trusted Partner for Financial Excellences
            </h2>
          <p className="mt-3 mx-auto max-w-3xl text-center text-[1rem] font-normal leading-8 text-muted">
  At Avibha Consultants Private Limited, we combine industry expertise, precision, and a client-first approach to deliver reliable financial solutions that help businesses stay compliant, efficient, and growth-focused.
           </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {chooseUs.map((item) => (
              <Reveal
                key={item.title}
                className="card bg-white p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef1e8] text-lg">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-[1.15rem] font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-[1rem] font-normal leading-7 text-muted">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden py-16 sm:py-18 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(245, 240, 252, 0.18) 45%, rgba(232, 224, 248, 0.12) 100%), url(${statsBg})`,
        }}
      >
        <div className="absolute inset-0 bg-white/8"></div>
        <div className="relative z-80 flex flex-col items-center text-center">
          <Reveal className="relative mb-8 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm">
            <div className="absolute inset-0 bg-white/5"></div>
            <div className="relative z-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b8860b]">
                Status
              </p>
              <h2 className="mt-3 text-[36px] font-semibold tracking-tight text-ink sm:text-[40px]">
                Track record at a glance
              </h2>
              <p className="mt-3 max-w-6xl text-[1rem] font-medium leading-8 text-[#5f5a66]">
                A compact summary of the scale and consistency we bring to client work.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <Reveal
                key={item.label}
                className="card bg-white text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef1e8] text-xl">
                  {['👥', '⏳', '📁', '🎯'][index]}
                </div>
                <div className="mt-5 text-[44px] font-semibold leading-none text-[#4c1d95]">{item.value}</div>
                <div className="mt-3 text-base font-normal text-muted">{item.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
