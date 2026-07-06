import { useMemo, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import CrudForm from '../components/CrudForm';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { adminApi } from '../services/adminApi';

const fallback = {
  slug: 'about',
  eyebrow: 'About Us',
  title: 'Company profile',
  subtitle: 'Company profile, mission, vision, timeline, and leadership.',
  body: 'We are a modern Chartered Accountant firm focused on dependable compliance, proactive financial advice, and long-term client partnerships.',
  secondaryBody: 'Mission: deliver accurate and practical financial solutions. Vision: become the most trusted advisory partner for growing businesses.',
  jsonData: JSON.stringify({
    values: ['Integrity', 'Professionalism', 'Innovation', 'Client Success'],
    timeline: [
      { year: '2010', title: 'Firm Established', desc: 'Started with a core focus on compliance and tax advisory.' },
      { year: '2015', title: 'Expanded Services', desc: 'Added audit, bookkeeping, and startup consulting.' },
      { year: '2020', title: 'Digital Transformation', desc: 'Introduced cloud workflows and remote advisory systems.' },
      { year: '2025', title: 'Multi-sector Growth', desc: 'Serving clients across startup, retail, and industrial sectors.' }
    ],
    leadershipText: 'Add leadership profiles here, including partner photo, designation, and short bio.'
  }),
  published: true
};

const pageFields = [
  { name: 'eyebrow', label: 'Eyebrow' },
  { name: 'title', label: 'Title' },
  { name: 'subtitle', label: 'Subtitle', type: 'textarea', full: true },
  { name: 'body', label: 'Body', type: 'textarea', full: true },
  { name: 'secondaryBody', label: 'Secondary Body', type: 'textarea', full: true },
  { name: 'jsonData', label: 'JSON Data', type: 'textarea', full: true },
  { name: 'published', label: 'Published (true/false)' }
];

export default function AboutPageAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/about', []);
  const page = useMemo(() => {
    const record = data?.data;
    if (record && !Array.isArray(record)) return record;
    if (Array.isArray(record)) return record.find((item) => item.slug === 'about') || fallback;
    return fallback;
  }, [data]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const refresh = async () => setData(await adminApi.getAboutPage());

  const savePage = async (form) => {
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        ...page,
        ...form,
        slug: 'about',
        published: String(form.published ?? page.published).toLowerCase() === 'true'
      };
      await adminApi.saveAboutPage(payload);
      await refresh();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="About Page">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">About Page Management</h2>
              <p className="mt-1 text-sm text-muted">Edit the public About page copy and JSON content.</p>
            </div>
            <div className="rounded-full bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {saving ? 'Saving...' : 'Ready'}
            </div>
          </div>

          {saveError && <ErrorState message={saveError} />}

          <div className="mt-6">
            <CrudForm fields={pageFields} initialValues={page} onSubmit={savePage} submitLabel="Save About Page" />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
          <h2 className="text-xl font-semibold text-ink">Notes</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Keep the `jsonData` field valid JSON. It is used by the public About page for values, timeline, and leadership text.
          </p>
          <div className="mt-5 rounded-3xl border border-border bg-background p-5 text-sm text-muted">
            <p className="font-semibold text-ink">Current slug</p>
            <p className="mt-1">about</p>
            <p className="mt-4 font-semibold text-ink">Fields</p>
            <p className="mt-1">eyebrow, title, subtitle, body, secondaryBody, jsonData, published</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
