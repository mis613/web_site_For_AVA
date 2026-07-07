import { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { useFetch } from '../hooks/useFetch';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { adminApi } from '../services/adminApi';
import UploadField from './components/UploadField';

const pageSize = 6;
const emptyForm = {
  title: '',
  description: '',
  image: '',
  imagePublicId: '',
  year: '',
  displayOrder: 0,
  status: 'Active'
};

function Modal({ open, title, children, footer, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-2 text-ink hover:bg-background">Close</button>
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
      <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-black/5">Close</button>
    </div>
  );
}

function ConfirmModal({ open, loading, onConfirm, onCancel, item }) {
  return (
    <Modal
      open={open}
      title="Delete Achievement"
      onClose={onCancel}
      footer={
        <>
          <button type="button" onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </>
      }
    >
      <p className="text-sm text-muted">Delete {item?.title || 'this achievement'}? This cannot be undone.</p>
    </Modal>
  );
}

export default function AchievementsAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/achievements', []);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [toast, setToast] = useState([]);

  const rows = data?.data || [];

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const pushToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToast((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToast((prev) => prev.filter((x) => x.id !== id)), 2500);
  };

  const refresh = async () => setData(await adminApi.listAchievements());

  const filtered = rows.filter((row) => {
    const q = search.trim().toLowerCase();
    if (status !== 'All' && row.status !== status) return false;
    if (!q) return true;
    return [row.title, row.description, row.year, row.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setUploadError('');
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title || '',
      description: row.description || '',
      image: row.image || '',
      imagePublicId: row.imagePublicId || '',
      year: row.year || '',
      displayOrder: row.displayOrder ?? 0,
      status: row.status || 'Active'
    });
    setFormError('');
    setUploadError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setUploadError('');
  };

  const validate = () => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.description.trim()) return 'Description is required';
    if (!String(form.year).trim()) return 'Year is required';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const message = validate();
    if (message) {
      setFormError(message);
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        imagePublicId: form.imagePublicId || '',
        year: Number(form.year),
        displayOrder: Number(form.displayOrder || 0)
      };
      if (editing?._id) await adminApi.updateAchievement(editing._id, payload);
      else await adminApi.createAchievement(payload);
      pushToast(editing?._id ? 'Achievement updated' : 'Achievement created');
      closeForm();
      await refresh();
    } catch (err) {
      setFormError(err.message);
      pushToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteAchievement(deleteTarget._id);
      pushToast('Achievement deleted');
      setDeleteTarget(null);
      await refresh();
    } catch (err) {
      pushToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Manage Achievements">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Achievements</h2>
            <p className="mt-1 text-sm text-muted">Manage awards, milestones, and recognition entries.</p>
          </div>
          <button type="button" onClick={openCreate} className="rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]">
            Add Achievement
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, year, description, status" />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-white shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-background text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row._id} className="border-t border-border">
                  <td className="px-4 py-3">
                    {row.image ? <img src={row.image} alt={row.title} className="h-14 w-14 rounded-2xl object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-xs text-muted">No Image</div>}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{row.title}</td>
                  <td className="px-4 py-3 text-ink">{row.description}</td>
                  <td className="px-4 py-3 text-ink">{row.year}</td>
                  <td className="px-4 py-3 text-ink">{row.displayOrder ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Inactive' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {row.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(row)} className="rounded-full bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700">Edit</button>
                      <button type="button" onClick={() => setDeleteTarget(row)} className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-muted" colSpan="7">No achievements found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Page {currentPage} of {totalPages}</p>
        <div className="flex gap-2">
          <button type="button" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>Previous</button>
          <button type="button" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      <Modal
        open={formOpen}
        title={editing ? 'Edit Achievement' : 'Add Achievement'}
        onClose={closeForm}
        footer={null}
      >
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Title *</label>
              <input className="input" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Year *</label>
              <input className="input" type="number" value={form.year} onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))} />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input className="input" type="number" value={form.displayOrder} onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: e.target.value }))} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea className="input min-h-28" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          </div>
          <UploadField
          label="Achievement Image"
          value={form.image}
          onChange={(image) => setForm((prev) => ({ ...prev, image }))}
          accept="image/*"
          resourceType="image"
          helperText="Click to choose an image or drag and drop one here."
          onUploaded={(url, result) => setForm((prev) => ({
            ...prev,
            image: url,
            imagePublicId: result?.publicId || result?.public_id || ''
          }))}
        />
          {uploadError && <ErrorState message={uploadError} />}
          {formError && <ErrorState message={formError} />}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeForm} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink">Cancel</button>
            <button type="submit" className="rounded-full bg-[#334155] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e293b]" disabled={saving}>{saving ? 'Saving...' : 'Save Achievement'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        item={deleteTarget}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {toast.map((item) => (
          <Toast key={item.id} item={item} onClose={() => setToast((prev) => prev.filter((x) => x.id !== item.id))} />
        ))}
      </div>

    </AdminLayout>
  );
}


