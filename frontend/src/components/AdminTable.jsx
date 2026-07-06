export default function AdminTable({ columns, rows, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-background text-muted">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-semibold">{col}</th>
            ))}
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-t border-border">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-ink">
                  {String(row[col] ?? row[col.toLowerCase()] ?? '')}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(row)} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">Edit</button>
                  <button onClick={() => onDelete(row)} className="rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-ink">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
