import { useEffect, useState } from 'react';
import UploadField from '../admin/components/UploadField';

export default function CrudForm({ fields, initialValues, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState(initialValues);
  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form
      className="card grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
            <label className="label">{field.label}</label>
            {field.upload ? (
              <UploadField
                label={field.label}
                value={form[field.name] || ''}
                onChange={(value) => updateField(field.name, value)}
                accept={field.accept || (field.resourceType === 'video' ? 'video/*' : 'image/*')}
                resourceType={field.resourceType || (field.accept?.includes('video') ? 'video' : 'image')}
                helperText={field.helperText || 'Click to choose a file or drag and drop it here.'}
              />
            ) : field.type === 'textarea' ? (
              <textarea className="input min-h-32" value={form[field.name] || ''} onChange={(e) => updateField(field.name, e.target.value)} />
            ) : (
              <input className="input" value={form[field.name] || ''} onChange={(e) => updateField(field.name, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      <button className="w-fit rounded-full bg-[#334155] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e293b]">{submitLabel}</button>
    </form>
  );
}
