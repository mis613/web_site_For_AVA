import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminTable from '../components/AdminTable';
import CrudForm from '../components/CrudForm';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { adminApi } from '../services/adminApi';
import UploadField from './components/UploadField';

const pagePresets = [
  { label: 'Information', slug: 'information' },
  { label: 'Careers', slug: 'careers' },
  { label: 'Gallery', slug: 'gallery' },
  { label: 'Privacy Policy', slug: 'privacy-policy' },
  { label: 'Contact Us', slug: 'contact' }
];

const initialValues = {
  slug: '',
  eyebrow: '',
  title: '',
  subtitle: '',
  body: '',
  secondaryBody: '',
  jsonData: '[]',
  published: true
};

const pageFields = [
  { name: 'slug', label: 'Slug' },
  { name: 'eyebrow', label: 'Eyebrow' },
  { name: 'title', label: 'Title' },
  { name: 'subtitle', label: 'Subtitle', type: 'textarea', full: true },
  { name: 'body', label: 'Body', type: 'textarea', full: true },
  { name: 'secondaryBody', label: 'Secondary Body', type: 'textarea', full: true },
  { name: 'jsonData', label: 'JSON Data', type: 'textarea', full: true },
  { name: 'published', label: 'Published (true/false)' }
];

const emptyCareerJob = { title: '', location: '', type: '', description: '', status: 'Open' };
const emptyInternship = { title: '', duration: '', stipend: '', description: '', status: 'Open' };
const emptyReview = { name: '', role: '', rating: '5', review: '' };
const emptyGalleryItem = { type: 'image', src: '', title: '', caption: '' };
const contactBlockDefaults = [
  { key: 'office', title: 'Our Office', icon: 'office', values: ['Dummy Office Address'] },
  { key: 'email', title: 'Email address', icon: 'email', values: ['info@example.com', 'hello@example.com'] },
  { key: 'hours', title: 'Working Hours', icon: 'hours', values: ['Mon-Sat', '10 am - 7 pm'] },
  { key: 'phone', title: 'Phone Number', icon: 'phone', values: ['Contact no : 0000000000', 'Whatsapp : 0000000000'] }
];

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function formatBlocks(blocks) {
  return JSON.stringify(blocks);
}

function toLines(value) {
  if (Array.isArray(value)) return value.join('\n');
  return value || '';
}

export default function SitePagesAdmin({ initialPanel = 'information' }) {
  const { data, loading, error, setData } = useFetch('/site-pages', []);
  const [editing, setEditing] = useState(null);
  const [panel, setPanel] = useState(initialPanel);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setPanel(initialPanel);
    setEditing(null);
    setSelectedItem(null);
  }, [initialPanel]);

  const rows = data?.data || [];
  const visiblePresets = pagePresets.filter((page) => page.slug !== 'information');

  const refresh = async () => setData(await adminApi.listSitePages());

  const currentRow = useMemo(() => rows.find((row) => row.slug === panel), [rows, panel]);
  const currentForm = currentRow || { ...initialValues, slug: panel, eyebrow: pagePresets.find((p) => p.slug === panel)?.label || panel, title: pagePresets.find((p) => p.slug === panel)?.label || panel };
  const currentJson = safeParse(
    currentRow?.jsonData,
    panel === 'careers' ? { jobs: [], internships: [], reviews: [] } : panel === 'gallery' ? { gallery: [] } : panel === 'contact' ? [] : []
  );
  const informationCards = [
    { label: 'Team Member', slug: 'team', description: 'Manage team members and profile images.', href: '/admin/team' },
    { label: 'Careers', slug: 'careers', description: 'Manage jobs, internships, and reviews.' },
    { label: 'Gallery', slug: 'gallery', description: 'Upload and arrange gallery media.' },
    { label: 'Privacy Policy', slug: 'privacy-policy', description: 'Edit privacy content and SEO.' },
    { label: 'Contact Us', slug: 'contact', description: 'Update contact blocks and details.' }
  ];

  const handleSubmit = async (form) => {
    const payload = {
      ...form,
      published: String(form.published).toLowerCase() === 'true',
      jsonData: form.jsonData || '[]'
    };

    if (editing?._id) {
      await adminApi.updateSitePage(editing._id, payload);
    } else {
      await adminApi.createSitePage(payload);
    }
    setEditing(null);
    await refresh();
  };

  const handleDelete = async (row) => {
    await adminApi.deleteSitePage(row._id);
    if (editing?._id === row._id) {
      setEditing(null);
    }
    await refresh();
  };

  const saveCurrentPage = async (payload) => {
    if (!currentRow?._id) {
      await adminApi.createSitePage({
        ...currentForm,
        ...payload,
        published: true
      });
    } else {
      await adminApi.updateSitePage(currentRow._id, {
        ...currentRow,
        ...payload
      });
    }
    await refresh();
  };

  const saveCareerData = async (next) => {
    await saveCurrentPage({ jsonData: JSON.stringify(next) });
  };

  const saveGalleryData = async (next) => {
    await saveCurrentPage({ jsonData: JSON.stringify(next) });
  };

  const saveContactData = async (next) => {
    await saveCurrentPage({ jsonData: JSON.stringify(next) });
  };

  const updateCareerItem = (section, index, nextItem) => {
    const base = currentJson || { jobs: [], internships: [], reviews: [] };
    const next = { ...base };
    next[section] = next[section].map((item, idx) => (idx === index ? nextItem : item));
    saveCareerData(next);
  };

  const deleteCareerItem = (section, index) => {
    const base = currentJson || { jobs: [], internships: [], reviews: [] };
    const next = { ...base };
    next[section] = next[section].filter((_, idx) => idx !== index);
    saveCareerData(next);
  };

  const addCareerItem = (section, item) => {
    const base = currentJson || { jobs: [], internships: [], reviews: [] };
    const next = { ...base };
    next[section] = [...(next[section] || []), item];
    saveCareerData(next);
  };

  const updateGalleryItem = (index, nextItem) => {
    const next = { gallery: (currentJson.gallery || []).map((item, idx) => (idx === index ? nextItem : item)) };
    saveGalleryData(next);
  };

  const deleteGalleryItem = (index) => {
    const next = { gallery: (currentJson.gallery || []).filter((_, idx) => idx !== index) };
    saveGalleryData(next);
  };

  const addGalleryItem = (item) => {
    const next = { gallery: [...(currentJson.gallery || []), item] };
    saveGalleryData(next);
  };

  const updateContactBlock = (index, nextBlock) => {
    const next = (currentJson || []).map((block, idx) => (idx === index ? nextBlock : block));
    saveContactData(next);
  };

  const deleteContactBlock = (index) => {
    const next = (currentJson || []).filter((_, idx) => idx !== index);
    saveContactData(next);
  };

  const addContactBlock = (block) => {
    const next = [...(currentJson || []), block];
    saveContactData(next);
  };

  const renderSectionEditor = () => {
    if (panel === 'careers') {
      const jobs = currentJson.jobs || [];
      const internships = currentJson.internships || [];
      const reviews = currentJson.reviews || [];
      return (
        <div className="grid gap-6">
          <div className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-ink">Jobs</h2>
              <button type="button" className="rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]" onClick={() => addCareerItem('jobs', { ...emptyCareerJob })}>
                Add Job
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {jobs.map((job, index) => (
                <div key={`${job.title || 'job'}-${index}`} className="rounded-2xl border border-border p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="input" value={job.title || ''} onChange={(e) => updateCareerItem('jobs', index, { ...job, title: e.target.value })} placeholder="Job title" />
                    <input className="input" value={job.location || ''} onChange={(e) => updateCareerItem('jobs', index, { ...job, location: e.target.value })} placeholder="Location" />
                    <input className="input" value={job.type || ''} onChange={(e) => updateCareerItem('jobs', index, { ...job, type: e.target.value })} placeholder="Type" />
                    <input className="input" value={job.status || 'Open'} onChange={(e) => updateCareerItem('jobs', index, { ...job, status: e.target.value })} placeholder="Status" />
                    <textarea className="input md:col-span-2 min-h-24" value={job.description || ''} onChange={(e) => updateCareerItem('jobs', index, { ...job, description: e.target.value })} placeholder="Description" />
                  </div>
                  <button type="button" className="mt-3 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700" onClick={() => deleteCareerItem('jobs', index)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-ink">Internships</h2>
              <button type="button" className="rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]" onClick={() => addCareerItem('internships', { ...emptyInternship })}>
                Add Internship
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {internships.map((item, index) => (
                <div key={`${item.title || 'internship'}-${index}`} className="rounded-2xl border border-border p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="input" value={item.title || ''} onChange={(e) => updateCareerItem('internships', index, { ...item, title: e.target.value })} placeholder="Internship title" />
                    <input className="input" value={item.duration || ''} onChange={(e) => updateCareerItem('internships', index, { ...item, duration: e.target.value })} placeholder="Duration" />
                    <input className="input" value={item.stipend || ''} onChange={(e) => updateCareerItem('internships', index, { ...item, stipend: e.target.value })} placeholder="Stipend" />
                    <input className="input" value={item.status || 'Open'} onChange={(e) => updateCareerItem('internships', index, { ...item, status: e.target.value })} placeholder="Status" />
                    <textarea className="input md:col-span-2 min-h-24" value={item.description || ''} onChange={(e) => updateCareerItem('internships', index, { ...item, description: e.target.value })} placeholder="Description" />
                  </div>
                  <button type="button" className="mt-3 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700" onClick={() => deleteCareerItem('internships', index)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">Intern Reviews</h2>
            <div className="mt-4 grid gap-3">
              {reviews.map((item, index) => (
                <div key={`${item.name || 'review'}-${index}`} className="rounded-2xl border border-border p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="input" value={item.name || ''} onChange={(e) => updateCareerItem('reviews', index, { ...item, name: e.target.value })} placeholder="Name" />
                    <input className="input" value={item.role || ''} onChange={(e) => updateCareerItem('reviews', index, { ...item, role: e.target.value })} placeholder="Role" />
                    <input className="input" value={item.rating || '5'} onChange={(e) => updateCareerItem('reviews', index, { ...item, rating: e.target.value })} placeholder="Rating" />
                    <textarea className="input md:col-span-2 min-h-24" value={item.review || ''} onChange={(e) => updateCareerItem('reviews', index, { ...item, review: e.target.value })} placeholder="Review" />
                  </div>
                  <button type="button" className="mt-3 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700" onClick={() => deleteCareerItem('reviews', index)}>Delete</button>
                </div>
              ))}
            </div>
            <button type="button" className="mt-4 rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]" onClick={() => addCareerItem('reviews', { ...emptyReview })}>Add Review</button>
          </div>
        </div>
      );
    }

    if (panel === 'gallery') {
      const items = currentJson.gallery || [];
      return (
        <div className="rounded-3xl border border-border bg-white p-6">
          <h2 className="text-xl font-semibold text-ink">Gallery Items</h2>
          <div className="mt-4 grid gap-4">
            {items.map((item, index) => (
              <div key={`${item.title || item.caption || 'gallery'}-${index}`} className="rounded-2xl border border-border p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <select className="input" value={item.type || 'image'} onChange={(e) => updateGalleryItem(index, { ...item, type: e.target.value })}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <input className="input" value={item.title || ''} onChange={(e) => updateGalleryItem(index, { ...item, title: e.target.value })} placeholder="Title" />
                  <input className="input md:col-span-2" value={item.caption || ''} onChange={(e) => updateGalleryItem(index, { ...item, caption: e.target.value })} placeholder="Caption" />
                  <div className="md:col-span-2">
                    <UploadField
                      label="Media"
                      value={item.src || ''}
                      onChange={(src) => updateGalleryItem(index, { ...item, src })}
                      accept={item.type === 'video' ? 'video/*' : 'image/*'}
                      resourceType={item.type === 'video' ? 'video' : 'image'}
                      helperText="Click to choose media or drag and drop it here."
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700" onClick={() => deleteGalleryItem(index)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="mt-4 rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]" onClick={() => addGalleryItem({ ...emptyGalleryItem })}>Add Media</button>
        </div>
      );
    }

    if (panel === 'contact') {
      const blocks = contactBlockDefaults.map((block, index) => {
        const source = Array.isArray(currentJson) ? currentJson[index] || {} : {};
        const values = Array.isArray(source.lines) ? source.lines : Array.isArray(source.values) ? source.values : block.values;
        return { ...block, values };
      });
      return (
        <div className="rounded-3xl border border-border bg-white p-6">
          <h2 className="text-xl font-semibold text-ink">Contact Blocks</h2>
          <div className="mt-4 grid gap-4">
            {blocks.map((block, index) => (
              <div key={block.key} className="rounded-2xl border border-border p-4">
                <div>
                  <h3 className="text-base font-semibold text-ink">{block.title}</h3>
                  <p className="mt-1 text-sm text-muted">Icon: {block.icon}</p>
                </div>
                <div className="mt-3 grid gap-3">
                  {block.values.map((value, valueIndex) => (
                    <div key={`${block.key}-${valueIndex}`}>
                      <label className="label">{block.title} value {valueIndex + 1}</label>
                      <input
                        className="input"
                        value={value}
                        onChange={(e) => {
                          const next = blocks.map((item, idx) => {
                            if (idx !== index) return item;
                            const nextValues = [...item.values];
                            nextValues[valueIndex] = e.target.value;
                            return { ...item, values: nextValues };
                          });
                          saveContactData(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (panel === 'information') {
      return (
        <div className="rounded-3xl border border-border bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">Information</h2>
              <p className="mt-1 text-sm text-muted">Quick access to the main site content sections.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {informationCards.map((card) => (
              <div key={card.slug} className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold text-ink">{card.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
                <div className="mt-4">
                  {card.href ? (
                    <Link
                      to={card.href}
                      className="inline-flex rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]"
                    >
                      Open
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPanel(card.slug)}
                      className="rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]"
                    >
                      Open
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AdminLayout title="Site Pages">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {visiblePresets.map((page) => {
          const row = rows.find((item) => item.slug === page.slug);
          return (
            <div key={page.slug} className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">{page.slug}</p>
                  <h2 className="mt-2 text-lg font-semibold text-ink">{page.label}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {row ? 'Saved' : 'New'}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{row?.subtitle || 'Create or edit the live page content from here.'}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPanel(page.slug);
                    setEditing(row || { ...initialValues, slug: page.slug, eyebrow: page.label, title: page.label });
                  }}
                  className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  {row ? 'Edit' : 'Create'}
                </button>
                <Link
                  to={`/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary-300 hover:bg-primary-50"
                >
                  Open
                </Link>
                {row && (
                  <button
                    type="button"
                    onClick={() => handleDelete(row)}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_520px]">
        <div className="space-y-6">
          <AdminTable columns={['slug', 'title', 'subtitle', 'published']} rows={rows} onEdit={setEditing} onDelete={handleDelete} />
          <CrudForm
            fields={pageFields}
            initialValues={editing || currentForm}
            onSubmit={handleSubmit}
            submitLabel={editing ? 'Update Page' : 'Create Page'}
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-white p-5">
            <h2 className="text-xl font-semibold text-ink">Manage Content</h2>
            <p className="mt-2 text-sm text-muted">Edit structured content for the selected page. Changes save directly to MongoDB.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {pagePresets.map((page) => (
                <button
                  key={page.slug}
                  type="button"
                  onClick={() => setPanel(page.slug)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${panel === page.slug ? 'bg-[#1f1633] text-white' : 'border border-border bg-white text-ink'}`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>
          {renderSectionEditor()}
        </div>
      </div>
    </AdminLayout>
  );
}
