import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { useFetch } from '../hooks/useFetch';

export default function Achievements() {
  const { data, loading, error } = useFetch('/achievements', []);
  const achievements = data?.data || [];

  return (
    <div className="bg-background py-16">
      <div className="container-page">
        <Seo
          title="Achievements"
          description="Key milestones and achievements of Avibha Consultants Private Limited."
        />
        <Reveal>
          <SectionHeading eyebrow="Achievements" title="Recognized milestones and client impact" />
        </Reveal>

        {loading && <p className="text-muted">Loading achievements...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((item) => (
              <Reveal key={item._id} className="card border border-border/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
                  {item.year}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted">{item.description}</p>
              </Reveal>
            ))}
            {achievements.length === 0 && (
              <p className="text-muted">No achievements added yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
