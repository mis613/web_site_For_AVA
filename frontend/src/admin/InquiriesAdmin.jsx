import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { useFetch } from '../hooks/useFetch';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { adminApi } from '../services/adminApi';

const pageSize = 6;

function Modal({ open, title, children, footer, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-2 text-ink hover:bg-background">✕</button>
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

export default function InquiriesAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/contact', []);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState([]);

  const rows = data?.data || [];

  useEffect(() => {
    setPage(1);
  }, [search, status, dateFilter]);

  const pushToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToast((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToast((prev) => prev.filter((x) => x.id !== id)), 2500);
  };

  const refresh = async () => setData(await adminApi.listInquiries());

  const filtered = rows.filter((item) => {
    const q = search.trim().toLowerCase();
    if (status !== 'All' && (item.status || 'new') !== status) return false;
    if (dateFilter) {
      const itemDate = new Date(item.createdAt).toISOString().slice(0, 10);
      if (itemDate !== dateFilter) return false;
    }
    if (!q) return true;
    return [item.name, item.email, item.phone, item.subject, item.message, item.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const markAsRead = async (item) => {
    setSaving(true);
    try {
      await adminApi.updateInquiry(item._id, { status: 'read' });
      pushToast('Marked as read');
      await refresh();
    } catch (err) {
      pushToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteInquiry(deleteTarget._id);
      pushToast('Inquiry deleted');
      setDeleteTarget(null);
      await refresh();
    } catch (err) {
      pushToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const viewItem = useMemo(() => selected, [selected]);

  return (
    <AdminLayout title="Inquiry Management">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Contact Form Submissions</h2>
            <p className="mt-1 text-sm text-muted">View and manage incoming inquiries from the website.</p>
          </div>
          <div className="rounded-full bg-background px-4 py-2 text-sm text-muted">{filtered.length} result{filtered.length === 1 ? '' : 's'}</div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, mobile, subject, message" />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>new</option>
            <option>read</option>
          </select>
          <input className="input" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-white shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-background text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Mobile</th>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Message</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((item) => (
                <tr key={item._id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                  <td className="px-4 py-3 text-ink">{item.email}</td>
                  <td className="px-4 py-3 text-ink">{item.phone || '-'}</td>
                  <td className="px-4 py-3 text-ink">{item.subject || '-'}</td>
                  <td className="px-4 py-3 text-ink">{item.message.slice(0, 60)}{item.message.length > 60 ? '...' : ''}</td>
                  <td className="px-4 py-3 text-ink">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'read' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {item.status || 'new'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-full bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700" onClick={() => setSelected(item)}>
                        View
                      </button>
                      <button type="button" className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700" onClick={() => markAsRead(item)} disabled={saving || item.status === 'read'}>
                        Mark as Read
                      </button>
                      <button type="button" className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700" onClick={() => setDeleteTarget(item)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-muted" colSpan="8">No inquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Page {currentPage} of {totalPages}</p>
        <div className="flex gap-2">
          <button type="button" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50" onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={currentPage === 1}>Previous</button>
          <button type="button" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50" onClick={() => setPage((v) => Math.min(totalPages, v + 1))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      <Modal
        open={Boolean(viewItem)}
        title="Inquiry Details"
        onClose={() => setSelected(null)}
        footer={
          <>
            <button type="button" onClick={() => setSelected(null)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink">Close</button>
            {viewItem?.status !== 'read' && (
              <button type="button" onClick={() => { markAsRead(viewItem); setSelected(null); }} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Mark as Read</button>
            )}
          </>
        }
      >
        {viewItem && (
          <div className="grid gap-3 text-sm text-ink">
            <p><span className="font-semibold">Name:</span> {viewItem.name}</p>
            <p><span className="font-semibold">Email:</span> {viewItem.email}</p>
            <p><span className="font-semibold">Mobile:</span> {viewItem.phone || '-'}</p>
            <p><span className="font-semibold">Subject:</span> {viewItem.subject || '-'}</p>
            <p><span className="font-semibold">Date:</span> {new Date(viewItem.createdAt).toLocaleString()}</p>
            <div>
              <p className="font-semibold">Message:</p>
              <p className="mt-2 whitespace-pre-wrap text-muted">{viewItem.message}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete Inquiry"
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
        <p className="text-sm text-muted">Delete inquiry from {deleteTarget?.name || 'this sender'}?</p>
      </Modal>

      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {toast.map((item) => (
          <Toast key={item.id} item={item} onClose={() => setToast((prev) => prev.filter((x) => x.id !== item.id))} />
        ))}
      </div>
    </AdminLayout>
  );
}
