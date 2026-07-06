export default function ServiceCard({ title, desc, benefits = [] }) {
  return (
    <article className="card bg-purple-900 p-6 text-white md:p-6">
      <h3 className="text-[1.25rem] font-semibold leading-tight text-white">
        {title}
      </h3>

      <p className="mt-3 text-[0.875rem] font-normal leading-[1.5] text-purple-100">
        {desc}
      </p>

      {benefits.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-2 text-[0.84rem] font-normal leading-[1.45] text-purple-100 marker:text-yellow-400">
          {benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      <button className="btn-secondary mt-4 px-5 py-2 text-[0.84rem]">
        Learn More
      </button>
    </article>
  );
}
