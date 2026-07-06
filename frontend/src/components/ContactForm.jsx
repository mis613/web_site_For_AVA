import { useState } from 'react';
import { api } from '../services/api';

const initial = { name: '', email: '', phone: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const submit = async (e) => {
    e.preventDefault();
    const nextError = !form.name || !form.email || !form.phone || !form.message ? 'Please fill all fields.' : '';
    if (nextError) {
      setStatus({ loading: false, error: nextError, success: '' });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });
    try {
      await api.post('/contact', form);
      setForm(initial);
      setStatus({ loading: false, error: '', success: 'Your inquiry has been submitted.' });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <form onSubmit={submit} className="card grid gap-3 p-6">
      <div className="grid gap-3 md:grid-cols-2">
        <div><label className="label">Name</label><input className="input py-2.5 text-sm" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="label">Email</label><input className="input py-2.5 text-sm" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Phone</label><input className="input py-2.5 text-sm" placeholder="Your phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      </div>
      <div><label className="label">Message</label><textarea className="input min-h-28 py-2.5 text-sm" placeholder="Write your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      <button
        type="submit"
        className="inline-flex min-w-[180px] justify-center rounded-lg bg-purple-900 px-8 py-3 text-base font-semibold text-white transition duration-300 hover:bg-[#c99a3e] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={status.loading}
      >
        {status.loading ? 'Sending...' : 'Send Message'}
      </button>
      {status.error && <p className="text-sm text-gold-600">{status.error}</p>}
      {status.success && <p className="text-sm text-sage-600">{status.success}</p>}
    </form>
  );
}
