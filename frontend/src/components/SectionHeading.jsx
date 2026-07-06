export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-10">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">{eyebrow}</p>}
      <h2 className="section-title mt-2">{title}</h2>
      {description && <p className="section-subtitle">{description}</p>}
    </div>
  );
}
