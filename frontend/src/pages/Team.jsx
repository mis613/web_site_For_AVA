import Seo from '../components/Seo';
import TeamMembers from './team/TeamMembers';
import Reveal from '../components/Reveal';

export default function Team() {
  return (
    <div className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-100px] h-72 w-72 rounded-full bg-primary-700/10 blur-3xl" />
        <div className="absolute right-[-100px] top-24 h-80 w-80 rounded-full bg-[#a78bfa]/10 blur-3xl" />
        <div className="absolute left-6 top-6 grid h-24 w-24 grid-cols-4 gap-1 opacity-40">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-[#d9d4e6]" />
          ))}
        </div>
        <div className="absolute right-6 top-6 grid h-24 w-24 grid-cols-4 gap-1 opacity-40">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-[#d9d4e6]" />
          ))}
        </div>
      </div>
      <div className="container-page">
        <Seo title="Team" description="Dynamic team members loaded from API." />

        <Reveal>
          <section className="mx-auto max-w-4xl py-20 text-center">
            <div className="inline-flex rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">
              Our Experts
            </div>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Meet Our Professional Team
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
              Our experienced professionals combine expertise, integrity and innovation to deliver trusted
              financial, taxation and compliance solutions.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-purple-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-gold hover:text-white"
              >
                Get Consultation
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center rounded-full bg-purple-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-gold hover:text-white"
              >
                View Services
              </a>
            </div>
          </section>
        </Reveal>

        <div className="mt-12">
          <TeamMembers />
        </div>
      </div>
    </div>
  );
}
