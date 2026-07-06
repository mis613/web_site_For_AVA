export default function TeamCard({ member }) {
  return (
    <article className="card">
      <img src={member.photo} alt={member.name} className="h-64 w-full rounded-xl object-cover" />
      <h3 className="mt-4 text-xl font-semibold text-ink">{member.name}</h3>
      <p className="text-sm font-medium text-primary-700">{member.designation}</p>
      <p className="mt-2 text-sm text-muted">{member.expertise}</p>
      <p className="mt-3 text-sm leading-6 text-muted">{member.bio}</p>
    </article>
  );
}
