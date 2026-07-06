import { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import CrudForm from '../components/CrudForm';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { adminApi } from '../services/adminApi';

const pageFields = [
  { name: 'eyebrow', label: 'Eyebrow' },
  { name: 'title', label: 'Title' },
  { name: 'subtitle', label: 'Subtitle', type: 'textarea', full: true },
  { name: 'body', label: 'Body', type: 'textarea', full: true },
  { name: 'secondaryBody', label: 'Secondary Body', type: 'textarea', full: true },
  { name: 'published', label: 'Published (true/false)' }
];

const emptyJob = { title: '', location: '', type: '', description: '', status: 'Open' };
const emptyInternship = { title: '', duration: '', stipend: '', description: '', status: 'Open' };
const emptyReview = { name: '', role: '', rating: '5', review: '' };

function parseJson(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export default function CareersAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/careers', []);
  const [editingMeta, setEditingMeta] = useState(false);
  const page = (() => {
    const record = data?.data;
    if (record && !Array.isArray(record)) return record;
    if (Array.isArray(record)) return record.find((item) => item.slug === 'careers') || { slug: 'careers', eyebrow: 'Careers', title: '', subtitle: '', body: '', secondaryBody: '', jsonData: '[]', published: true };
    return { slug: 'careers', eyebrow: 'Careers', title: '', subtitle: '', body: '', secondaryBody: '', jsonData: '[]', published: true };
  })();
  const parsed = parseJson(page.jsonData, { jobs: [], internships: [], reviews: [] });

  const refresh = async () => setData(await adminApi.getCareersPage());
  const savePage = async (next) => {
    const payload = { ...page, ...next, slug: 'careers', published: String(next.published ?? page.published).toLowerCase() === 'true' };
    await adminApi.saveCareersPage(payload);
    await refresh();
  };
  const saveJson = async (next) => savePage({ jsonData: JSON.stringify(next) });

  const updateItem = (section, index, nextItem) => {
    const next = { ...parsed, [section]: (parsed[section] || []).map((item, idx) => (idx === index ? nextItem : item)) };
    saveJson(next);
  };
  const addItem = (section, item) => saveJson({ ...parsed, [section]: [...(parsed[section] || []), item] });
  const deleteItem = (section, index) => saveJson({ ...parsed, [section]: (parsed[section] || []).filter((_, idx) => idx !== index) });

  return (
    <AdminLayout title="Careers Page">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="grid gap-6">
        <div className="rounded-3xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">Page Content</h2>
            <button type="button" className="rounded-full border border-border px-4 py-2 text-sm font-semibold" onClick={() => setEditingMeta((v) => !v)}>
              {editingMeta ? 'Hide' : 'Edit'}
            </button>
          </div>
          {editingMeta && <CrudForm fields={pageFields} initialValues={page} onSubmit={savePage} submitLabel="Save Careers Page" />}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Jobs</h3>
              <button type="button" className="rounded-full bg-[#1f1633] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#30224f]" onClick={() => addItem('jobs', { ...emptyJob })}>Add Job</button>
            </div>
            <div className="mt-4 grid gap-3">
              {(parsed.jobs || []).map((job, index) => (
                <div key={`${job.title || 'job'}-${index}`} className="rounded-2xl border border-border p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="input" value={job.title || ''} onChange={(e) => updateItem('jobs', index, { ...job, title: e.target.value })} placeholder="Job title" />
                    <input className="input" value={job.location || ''} onChange={(e) => updateItem('jobs', index, { ...job, location: e.target.value })} placeholder="Location" />
                    <input className="input" value={job.type || ''} onChange={(e) => updateItem('jobs', index, { ...job, type: e.target.value })} placeholder="Type" />
                    <input className="input" value={job.status || 'Open'} onChange={(e) => updateItem('jobs', index, { ...job, status: e.target.value })} placeholder="Status" />
                    <textarea className="input md:col-span-2 min-h-24" value={job.description || ''} onChange={(e) => updateItem('jobs', index, { ...job, description: e.target.value })} placeholder="Description" />
                  </div>
                  <button type="button" className="mt-3 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700" onClick={() => deleteItem('jobs', index)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Internships</h3>
              <button type="button" className="rounded-full bg-[#1f1633] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#30224f]" onClick={() => addItem('internships', { ...emptyInternship })}>Add Internship</button>
            </div>
            <div className="mt-4 grid gap-3">
              {(parsed.internships || []).map((item, index) => (
                <div key={`${item.title || 'internship'}-${index}`} className="rounded-2xl border border-border p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="input" value={item.title || ''} onChange={(e) => updateItem('internships', index, { ...item, title: e.target.value })} placeholder="Internship title" />
                    <input className="input" value={item.duration || ''} onChange={(e) => updateItem('internships', index, { ...item, duration: e.target.value })} placeholder="Duration" />
                    <input className="input" value={item.stipend || ''} onChange={(e) => updateItem('internships', index, { ...item, stipend: e.target.value })} placeholder="Stipend" />
                    <input className="input" value={item.status || 'Open'} onChange={(e) => updateItem('internships', index, { ...item, status: e.target.value })} placeholder="Status" />
                    <textarea className="input md:col-span-2 min-h-24" value={item.description || ''} onChange={(e) => updateItem('internships', index, { ...item, description: e.target.value })} placeholder="Description" />
                  </div>
                  <button type="button" className="mt-3 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700" onClick={() => deleteItem('internships', index)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">Intern Reviews</h3>
            <button type="button" className="rounded-full bg-[#1f1633] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#30224f]" onClick={() => addItem('reviews', { ...emptyReview })}>Add Review</button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(parsed.reviews || []).map((item, index) => (
              <div key={`${item.name || 'review'}-${index}`} className="rounded-2xl border border-border p-4">
                <div className="grid gap-3">
                  <input className="input" value={item.name || ''} onChange={(e) => updateItem('reviews', index, { ...item, name: e.target.value })} placeholder="Name" />
                  <input className="input" value={item.role || ''} onChange={(e) => updateItem('reviews', index, { ...item, role: e.target.value })} placeholder="Role" />
                  <input className="input" value={item.rating || '5'} onChange={(e) => updateItem('reviews', index, { ...item, rating: e.target.value })} placeholder="Rating" />
                  <textarea className="input min-h-24" value={item.review || ''} onChange={(e) => updateItem('reviews', index, { ...item, review: e.target.value })} placeholder="Review" />
                </div>
                <button type="button" className="mt-3 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700" onClick={() => deleteItem('reviews', index)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
