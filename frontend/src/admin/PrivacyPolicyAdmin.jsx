import { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import RichTextEditor from '../components/RichTextEditor';
import Seo from '../components/Seo';
import { useFetch } from '../hooks/useFetch';
import { adminApi } from '../services/adminApi';

const fallback = {
  slug: 'privacy-policy',
  eyebrow: 'Privacy Policy',
  title: 'Privacy Policy',
  subtitle: 'How we handle your information',
  body: '<p>We use contact details only for professional communication and service delivery.</p>',
  seoTitle: 'Privacy Policy',
  seoDescription: 'Privacy policy for client and website visitors.',
  published: true
};

function buildPayload(page, draft) {
  return {
    ...page,
    slug: 'privacy-policy',
    eyebrow: 'Privacy Policy',
    title: draft.title || 'Privacy Policy',
    subtitle: draft.subtitle || 'How we handle your information',
    body: draft.body || '',
    seoTitle: draft.seoTitle || '',
    seoDescription: draft.seoDescription || '',
    published: true
  };
}

export default function PrivacyPolicyAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/privacy-policy', []);
  const page = useMemo(() => {
    const record = data?.data;
    if (record && !Array.isArray(record)) return record;
    if (Array.isArray(record)) return record.find((item) => item.slug === 'privacy-policy') || fallback;
    return fallback;
  }, [data]);
  const [draft, setDraft] = useState({
    title: fallback.title,
    subtitle: fallback.subtitle,
    body: fallback.body,
    seoTitle: fallback.seoTitle,
    seoDescription: fallback.seoDescription
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [lastSaved, setLastSaved] = useState('');
  const hydratedRef = useRef(false);
  const skipAutosaveRef = useRef(true);
  const autosaveRef = useRef(null);

  useEffect(() => {
    setDraft({
      title: page.title || fallback.title,
      subtitle: page.subtitle || fallback.subtitle,
      body: page.body || fallback.body,
      seoTitle: page.seoTitle || '',
      seoDescription: page.seoDescription || ''
    });
    hydratedRef.current = true;
    skipAutosaveRef.current = true;
  }, [page]);

  const persist = async (nextDraft) => {
    setSaving(true);
    setSaveError('');
    try {
      const payload = buildPayload(page, nextDraft);
      await adminApi.savePrivacyPolicyPage(payload);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setData(await adminApi.getPrivacyPolicyPage());
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      persist(draft);
    }, 1200);
    return () => clearTimeout(autosaveRef.current);
  }, [draft]);

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout title="Privacy Page">
      <Seo title="Privacy Page Admin" description="Manage privacy policy content and SEO fields." />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-ink">Privacy Policy Management</h2>
              <p className="mt-1 text-sm text-muted">Single record editor with autosave, preview, and SEO fields.</p>
            </div>
            <div className="rounded-full bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved}` : 'Auto save on'}
            </div>
          </div>

          {saveError && <ErrorState message={saveError} />}

          <div className="mt-6 grid gap-5">
            <div>
              <label className="label">Rich Text Editor</label>
              <RichTextEditor value={draft.body} onChange={(value) => updateDraft('body', value)} placeholder="Write privacy policy content..." />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">SEO Title</label>
                <input className="input" value={draft.seoTitle} onChange={(e) => updateDraft('seoTitle', e.target.value)} placeholder="Privacy Policy | Avibha Consultants" />
              </div>
              <div>
                <label className="label">SEO Description</label>
                <input className="input" value={draft.seoDescription} onChange={(e) => updateDraft('seoDescription', e.target.value)} placeholder="Privacy policy for visitors and clients." />
              </div>
            </div>

            <div>
              <label className="label">Page Subtitle</label>
              <input className="input" value={draft.subtitle} onChange={(e) => updateDraft('subtitle', e.target.value)} placeholder="How we handle your information" />
            </div>

            <button
              type="button"
              onClick={() => persist(draft)}
              className="w-fit rounded-full bg-[#334155] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e293b]"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Now'}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
          <h2 className="text-xl font-semibold text-ink">Preview</h2>
          <p className="mt-1 text-sm text-muted">This is how the privacy page content will appear to visitors.</p>
          <div className="mt-5 rounded-3xl border border-border bg-background p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">{draft.subtitle || fallback.subtitle}</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">{draft.title || fallback.title}</h3>
            <div
              className="prose prose-slate mt-5 max-w-none prose-headings:text-ink prose-p:text-muted prose-li:text-muted"
              dangerouslySetInnerHTML={{ __html: draft.body || fallback.body }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
