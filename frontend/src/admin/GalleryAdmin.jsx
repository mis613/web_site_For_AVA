import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { adminApi } from '../services/adminApi';
import UploadField from './components/UploadField';

const pageSize = 6;
const emptyForm = {
  image: '',
  title: '',
  category: '',
  displayOrder: 0,
  status: 'Active'
};

const iconPaths = {
  close: <path d="M6 6l12 12M18 6 6 18" />
};

function Modal({ open, title, children, footer, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-ink hover:bg-background">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d={iconPaths.close.props.d} />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ item, onClose }) {
  return (
    <div className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${item.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
      <div className="flex-1 text-sm font-medium">{item.message}</div>
      <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-black/5">✕</button>
    </div>
  );
}

function GalleryForm({ value, onChange, onSubmit, onCancel, saving, uploadError, onMultiUpload }) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Title</label>
          <input className="input" value={value.title} onChange={(e) => onChange({ title: e.target.value })} />
        </div>
        <div>
          <label className="label">Category</label>
          <input className="input" value={value.category} onChange={(e) => onChange({ category: e.target.value })} />
        </div>
        <div>
          <label className="label">Display Order</label>
          <input className="input" type="number" value={value.displayOrder} onChange={(e) => onChange({ displayOrder: e.target.value })} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={value.status} onChange={(e) => onChange({ status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <UploadField
        label="Upload Images"
        value={value.image}
        onChange={(image) => onChange({ image })}
        multiple
        accept="image/*"
        resourceType="image"
        helperText="Drop files here or click to upload."
        onFilesUploaded={onMultiUpload}
      />
      {uploadError && <ErrorState message={uploadError} />}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink">
          Cancel
        </button>
        <button type="submit" className="rounded-full bg-[#334155] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e293b]" disabled={saving}>
          {saving ? 'Saving...' : 'Save Media'}
        </button>
      </div>
    </form>
  );
}

export default function GalleryAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/gallery', []);
  const page = (() => {
    const record = data?.data;
    if (record && !Array.isArray(record)) return record;
    if (Array.isArray(record)) {
      return record.find((item) => item.slug === 'gallery') || {
        slug: 'gallery',
        eyebrow: 'Gallery',
        title: 'Snapshots from our journey',
        subtitle: '',
        body: '',
        jsonData: '[]',
        published: true
      };
    }
    return {
      slug: 'gallery',
      eyebrow: 'Gallery',
      title: 'Snapshots from our journey',
      subtitle: '',
      body: '',
      jsonData: '[]',
      published: true
    };
  })();

  const items = useMemo(() => {
    try {
      const parsed = page.jsonData ? JSON.parse(page.jsonData) : {};
      return Array.isArray(parsed) ? parsed : parsed.gallery || [];
    } catch {
      return [];
    }
  }, [page.jsonData]);

  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState([]);
  const [formError, setFormError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const refresh = async () => setData(await adminApi.getGalleryPage());
  const pushToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToast((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToast((prev) => prev.filter((x) => x.id !== id)), 2500);
  };

  useEffect(() => {
    setPageIndex(1);
  }, [search]);

  const savePage = async (nextItems) => {
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...page, slug: 'gallery', published: true, jsonData: JSON.stringify(nextItems) };
      await adminApi.saveGalleryPage(payload);
      await refresh();
    } catch (err) {
      setFormError(err.message);
      pushToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditingIndex(null);
    setForm(emptyForm);
    setUploadError('');
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (item, index) => {
    setEditingIndex(index);
    setForm({
      image: item.image || '',
      title: item.title || '',
      category: item.category || '',
      displayOrder: item.displayOrder ?? 0,
      status: item.status || 'Active'
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingIndex(null);
    setForm(emptyForm);
    setFormError('');
    setUploadError('');
  };

  const validate = () => {
    if (!form.image.trim()) return 'Image is required';
    if (!form.title.trim()) return 'Title is required';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const message = validate();
    if (message) {
      setFormError(message);
      return;
    }
    const nextItem = {
      image: form.image,
      title: form.title.trim(),
      category: form.category.trim(),
      displayOrder: Number(form.displayOrder || 0),
      status: form.status === 'Inactive' ? 'Inactive' : 'Active'
    };
    const nextItems = [...items];
    if (editingIndex === null) nextItems.push(nextItem);
    else nextItems[editingIndex] = nextItem;
    await savePage(nextItems);
    pushToast(editingIndex === null ? 'Gallery item created' : 'Gallery item updated');
    closeForm();
  };

  const handleDelete = async () => {
    if (deleteTarget == null) return;
    setDeleting(true);
    try {
      const nextItems = items.filter((_, idx) => idx !== deleteTarget);
      await savePage(nextItems);
      pushToast('Gallery item deleted');
      setDeleteTarget(null);
    } catch (err) {
      pushToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleMultiUpload = async (results) => {
    const uploads = Array.isArray(results) ? results : [];
    if (!uploads.length) return;
    const nextItems = [
      ...items,
      ...uploads
        .map((result, index) => result?.data?.url || result?.data?.secureUrl || '')
        .filter(Boolean)
        .map((image, index) => ({
          image,
          title: `Image ${items.length + index + 1}`,
          category: 'General',
          displayOrder: items.length + index + 1,
          status: 'Active'
        }))
    ];
    await savePage(nextItems);
    pushToast('Images uploaded');
  };

  const filtered = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return [item.title, item.category, item.status].filter(Boolean).some((value) => String(value).toLowerCase().includes(q));
    });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(pageIndex, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AdminLayout title="Gallery Management">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Gallery Grid</h2>
            <p className="mt-1 text-sm text-muted">Manage multiple images with titles, categories, and ordering.</p>
          </div>
          <button type="button" onClick={openCreate} className="rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]">
            Add Media
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, category, status" />
          <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">{filtered.length} result{filtered.length === 1 ? '' : 's'}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map(({ item, index }, displayIndex) => {
          return (
            <article key={`${item.title || item.image}-${index}-${displayIndex}`} className="overflow-hidden rounded-3xl border border-border bg-white shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
              <div className="relative">
                <img src={item.image} alt={item.title || 'Gallery item'} className="h-56 w-full object-cover" />
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Inactive' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {item.status || 'Active'}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="text-sm text-muted">{item.category || '-'}</p>
                  </div>
                  <div className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted">#{item.displayOrder ?? 0}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => openEdit(item, index)} className="rounded-full bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700">
                    Edit
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(index)} className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Page {currentPage} of {totalPages}</p>
        <div className="flex gap-2">
          <button type="button" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50" onClick={() => setPageIndex((v) => Math.max(1, v - 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <button type="button" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50" onClick={() => setPageIndex((v) => Math.min(totalPages, v + 1))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      <Modal
        open={formOpen}
        title={editingIndex === null ? 'Add Media' : 'Edit Media'}
        onClose={closeForm}
      >
          <GalleryForm
            value={form}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            onSubmit={submit}
            onCancel={closeForm}
            saving={saving}
            uploadError={uploadError}
            onMultiUpload={handleMultiUpload}
          />
        {formError && <ErrorState message={formError} />}
      </Modal>

      <Modal
        open={deleteTarget !== null}
        title="Delete Gallery Item"
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink">Cancel</button>
            <button type="button" onClick={handleDelete} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white" disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-muted">Delete this gallery item?</p>
      </Modal>

      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {/* toast notifications */}
        {toast.map((item) => (
          <Toast key={item.id} item={item} onClose={() => setToast((prev) => prev.filter((x) => x.id !== item.id))} />
        ))}
      </div>
    </AdminLayout>
  );
}
