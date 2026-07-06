export default function Stats({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card text-center bg-purple-900">
          <div className="text-3xl font-bold text-primary-600">{item.value}</div>
          <div className="mt-1 text-sm text-muted text-white">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
