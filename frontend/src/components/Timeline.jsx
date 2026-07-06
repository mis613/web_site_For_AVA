export default function Timeline({ items }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <div key={item.year} className="card flex gap-4">
          <div className="text-xl font-bold text-gold-400">{item.year}</div>
          <div>
            <h3 className="font-semibold text-ink">{item.title}</h3>
            <p className="text-sm text-muted">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
