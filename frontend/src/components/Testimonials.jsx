export default function Testimonials({ items }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <blockquote key={item.author} className="card bg-purple-900">
          <p className="text-base leading-7 text-ink text-white">"{item.quote}"</p>
          <footer className="mt-4 text-sm font-medium text-primary-700 text-white">{item.author}</footer>
        </blockquote>
      ))}
    </div>
  );
}
