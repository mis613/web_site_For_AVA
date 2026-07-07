import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { useFetch } from '../hooks/useFetch';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { adminApi } from '../services/adminApi';
import UploadField from './components/UploadField';

const pageSize = 6;
const emptyForm = {
  name: '',
  designation: '',
  qualification: '',
  experience: '',
  photo: '',
  photoPublicId: '',
  displayOrder: 0,
  status: 'Active'
};

const iconPaths = {
  edit: <path d="M4 20h16M14.5 5.5l4 4L9 19H5v-4l9.5-9.5Z" />,
  trash: <path d="M5 7h14M10 11v6m4-6v6M9 7V4h6v3m-8 0 .7 12.2A2 2 0 0 0 10.7 21h2.6a2 2 0 0 0 2-1.8L16 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />
};

function Toast({ item, onClose }) {
  return (
    <div className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${item.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
      <div className="flex-1 text-sm font-medium">{item.message}</div>
      <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-black/5">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d={iconPaths.close.props.d} />
        </svg>
      </button>
    </div>
  );
}

function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-background">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d={iconPaths.close.props.d} />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">{footer}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ open, title, description, onCancel, onConfirm, loading }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </>
      }
    >
      <p className="text-sm leading-6 text-muted">{description}</p>
    </Modal>
  );
}

function TeamForm({ value, onChange, onSubmit, onCancel, saving, uploadError }) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Name *</label>
          <input className="input" value={value.name} onChange={(e) => onChange({ name: e.target.value })} />
        </div>
        <div>
          <label className="label">Designation *</label>
          <input className="input" value={value.designation} onChange={(e) => onChange({ designation: e.target.value })} />
        </div>
        <div>
          <label className="label">Qualification</label>
          <input className="input" value={value.qualification} onChange={(e) => onChange({ qualification: e.target.value })} />
        </div>
        <div>
          <label className="label">Experience</label>
          <input className="input" value={value.experience} onChange={(e) => onChange({ experience: e.target.value })} />
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
        label="Profile Image *"
        value={value.photo}
        onChange={(photo) => onChange({ photo })}
        accept="image/*"
        resourceType="image"
        helperText="Click to choose a profile image or drag and drop one here."
        onUploaded={(url, result) => onChange({
          photo: url,
          photoPublicId: result?.publicId || result?.public_id || ''
        })}
      />
      {uploadError && <p className="text-sm text-rose-700">{uploadError}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink">
          Cancel
        </button>
        <button type="submit" className="rounded-full bg-[#334155] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e293b]" disabled={saving}>
          {saving ? 'Saving...' : 'Save Member'}
        </button>
      </div>
    </form>
  );
}

export default function TeamAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/team', []);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState([]);
  const [formError, setFormError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const rows = data?.data || [];

  useEffect(() => {
    setPage(1);
  }, [search]);

  const pushToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToast((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToast((prev) => prev.filter((item) => item.id !== id));
    }, 2500);
  };

  const refresh = async () => setData(await adminApi.listTeam());

  const filtered = rows.filter((row) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [row.name, row.designation, row.qualification, row.experience, row.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeCount = rows.filter((row) => (row.status || 'Active') === 'Active').length;
  const inactiveCount = rows.filter((row) => row.status === 'Inactive').length;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setUploadError('');
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || '',
      designation: row.designation || '',
      qualification: row.qualification || '',
      experience: row.experience || '',
      photo: row.photo || '',
      photoPublicId: row.photoPublicId || '',
      displayOrder: row.displayOrder ?? 0,
      status: row.status || 'Active'
    });
    setUploadError('');
    setFormError('');
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
    if (!form.name.trim()) return 'Name is required';
    if (!form.designation.trim()) return 'Designation is required';
    if (!form.photo.trim()) return 'Profile image is required';
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
        photoPublicId: form.photoPublicId || '',
        displayOrder: Number(form.displayOrder || 0)
      };
      if (editing?._id) await adminApi.updateTeam(editing._id, payload);
      else await adminApi.createTeam(payload);
      pushToast(editing?._id ? 'Team member updated' : 'Team member created');
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
      await adminApi.deleteTeam(deleteTarget._id);
      pushToast('Team member deleted');
      setDeleteTarget(null);
      await refresh();
    } catch (err) {
      pushToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Manage Team">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Team Members</h2>
            <p className="mt-1 text-sm text-muted">Search, add, edit, and remove team profiles.</p>
          </div>
          <button type="button" onClick={openCreate} className="rounded-full bg-[#160f26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#24193a]">
            Add Member
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Total</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{rows.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Active</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Inactive</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{inactiveCount}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, designation, qualification, experience, status"
          />
          <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-white shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-background text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Qualification</th>
                <th className="px-4 py-3 font-semibold">Experience</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row._id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <img src={row.photo} alt={row.name} className="h-14 w-14 rounded-2xl object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{row.name}</td>
                  <td className="px-4 py-3 text-ink">{row.designation}</td>
                  <td className="px-4 py-3 text-ink">{row.qualification || '-'}</td>
                  <td className="px-4 py-3 text-ink">{row.experience || '-'}</td>
                  <td className="px-4 py-3 text-ink">{row.displayOrder ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Inactive' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {row.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(row)} className="rounded-full bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700">
                        Edit
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(row)} className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-muted" colSpan="8">
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        open={formOpen}
        title={editing ? 'Edit Team Member' : 'Add Team Member'}
        onClose={closeForm}
        footer={null}
      >
        <TeamForm
          value={form}
          onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
          onSubmit={submit}
          onCancel={closeForm}
          saving={saving}
          uploadError={uploadError}
        />
        {formError && <ErrorState message={formError} />}
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Team Member"
        description={`Delete ${deleteTarget?.name || 'this team member'}? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {toast.map((item) => (
          <Toast key={item.id} item={item} onClose={() => setToast((prev) => prev.filter((x) => x.id !== item.id))} />
        ))}
      </div>
    </AdminLayout>
  );
}
