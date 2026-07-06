import { useMemo, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { adminApi } from '../services/adminApi';

const defaultBlocks = [
  { key: 'office', title: 'Our Office', icon: 'office', values: ['Dummy Office Address'] },
  { key: 'email', title: 'Email address', icon: 'email', values: ['info@example.com', 'hello@example.com'] },
  { key: 'hours', title: 'Working Hours', icon: 'hours', values: ['Mon-Sat', '10 am - 7 pm'] },
  { key: 'phone', title: 'Phone Number', icon: 'phone', values: ['Contact no : 0000000000', 'Whatsapp : 0000000000'] }
];

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeBlocks(rawBlocks) {
  const blocks = Array.isArray(rawBlocks) ? rawBlocks : [];
  return defaultBlocks.map((block, index) => {
    const source = blocks[index] || {};
    const values = Array.isArray(source.lines) ? source.lines : Array.isArray(source.values) ? source.values : [];
    return { ...block, values: values.length ? values : block.values };
  });
}

export default function ContactPageAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/contact-page', []);
  const page = (() => {
    const record = data?.data;
    if (record && !Array.isArray(record)) return record;
    if (Array.isArray(record)) {
      return record.find((item) => item.slug === 'contact') || {
        slug: 'contact',
        eyebrow: 'Contact Us',
        title: 'Contact Page',
        subtitle: '',
        body: '',
        secondaryBody: '',
        jsonData: JSON.stringify(defaultBlocks.map((block) => ({ title: block.title, icon: block.icon, lines: block.values }))),
        published: true
      };
    }
    return {
      slug: 'contact',
      eyebrow: 'Contact Us',
      title: 'Contact Page',
      subtitle: '',
      body: '',
      secondaryBody: '',
      jsonData: JSON.stringify(defaultBlocks.map((block) => ({ title: block.title, icon: block.icon, lines: block.values }))),
      published: true
    };
  })();

  const blocks = useMemo(() => normalizeBlocks(parseJson(page.jsonData, defaultBlocks)), [page.jsonData]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const refresh = async () => setData(await adminApi.getContactPage());

  const savePage = async (nextBlocks) => {
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        ...page,
        slug: 'contact',
        published: true,
        jsonData: JSON.stringify(
          nextBlocks.map((block) => ({
            title: block.title,
            icon: block.icon,
            lines: block.values
          }))
        )
      };
      await adminApi.saveContactPage(payload);
      await refresh();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateValue = async (blockIndex, valueIndex, value) => {
    const nextBlocks = blocks.map((block, index) => {
      if (index !== blockIndex) return block;
      const nextValues = [...block.values];
      nextValues[valueIndex] = value;
      return { ...block, values: nextValues };
    });
    await savePage(nextBlocks);
  };

  return (
    <AdminLayout title="Contact Page">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="rounded-3xl border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Contact Blocks</h2>
            <p className="mt-1 text-sm text-muted">The layout is fixed. Update only the values shown on the Contact page.</p>
          </div>
        </div>
        {saving && <p className="mt-4 text-sm text-muted">Saving changes...</p>}
        {saveError && <ErrorState message={saveError} />}
        <div className="mt-4 grid gap-4">
          {blocks.map((block, blockIndex) => (
            <div key={block.key} className="rounded-2xl border border-border p-4">
              <div>
                <h3 className="text-base font-semibold text-ink">{block.title}</h3>
                <p className="mt-1 text-sm text-muted">Icon: {block.icon}</p>
              </div>
              <div className="mt-4 grid gap-3">
                {block.values.map((value, valueIndex) => (
                  <div key={`${block.key}-${valueIndex}`}>
                    <label className="label">{block.title} value {valueIndex + 1}</label>
                    <input
                      className="input"
                      value={value}
                      onChange={(e) => updateValue(blockIndex, valueIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
