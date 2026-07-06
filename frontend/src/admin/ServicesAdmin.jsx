import { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { useFetch } from '../hooks/useFetch';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import AdminTable from '../components/AdminTable';
import CrudForm from '../components/CrudForm';
import { adminApi } from '../services/adminApi';

const empty = { title: '', description: '', benefits: '' };

export default function ServicesAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/services', []);
  const [editing, setEditing] = useState(null);

  const refresh = async () => setData(await adminApi.listServices());
  const submit = async (form) => {
    const payload = {
      ...form,
      benefits: String(form.benefits || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };
    if (editing?._id) await adminApi.updateService(editing._id, payload);
    else await adminApi.createService(payload);
    setEditing(null);
    await refresh();
  };
  const remove = async (row) => {
    await adminApi.deleteService(row._id);
    await refresh();
  };

  const rows = data?.data || [];
  return (
    <AdminLayout title="Manage Services">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AdminTable columns={['title', 'description']} rows={rows} onEdit={setEditing} onDelete={remove} />
        <CrudForm
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Description', type: 'textarea', full: true },
            { name: 'benefits', label: 'Benefits (comma separated)', type: 'textarea', full: true }
          ]}
          initialValues={editing ? { ...editing, benefits: (editing.benefits || []).join(', ') } : empty}
          onSubmit={submit}
          submitLabel={editing ? 'Update Service' : 'Create Service'}
        />
      </div>
    </AdminLayout>
  );
}
