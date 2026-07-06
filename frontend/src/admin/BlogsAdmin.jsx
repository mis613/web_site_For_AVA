import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { useFetch } from '../hooks/useFetch';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import RichTextEditor from '../components/RichTextEditor';
import { adminApi } from '../services/adminApi';

const empty = {
  title: '',
  slug: '',
  author: 'Editorial Team',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  tags: '',
  seoTitle: '',
  seoDescription: '',
  publishDate: '',
  status: 'Published',
  published: 'true'
};

function normalizeDraft(source = empty) {
  return {
    ...empty,
    ...source,
    tags: Array.isArray(source.tags) ? source.tags.join(', ') : source.tags || '',
    publishDate: source.publishDate ? String(source.publishDate).slice(0, 10) : '',
    published: String(source.published ?? true),
    author: String(source.author || 'Editorial Team')
  };
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
}

function getReadingTime(draft) {
  const words = String(draft?.content || draft?.excerpt || '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 16V4" />
      <path d="m8 8 4-4 4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function StatCard({ label, value, note }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</div>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}

export default function BlogsAdmin() {
  const { data, loading, error, setData } = useFetch('/admin/blogs', []);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(empty);
  const [search, setSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const rows = data?.data || [];

  useEffect(() => {
    if (editing) {
      setDraft(normalizeDraft(editing));
      return;
    }
    if (rows.length) {
      setDraft(normalizeDraft(rows[0]));
      return;
    }
    setDraft(empty);
  }, [editing, rows]);

  const refresh = async () => setData(await adminApi.listBlogs());

  const submit = async () => {
    const payload = {
      ...draft,
      featuredImage: draft.featuredImage || '',
      author: String(draft.author || 'Editorial Team').trim() || 'Editorial Team',
      tags: String(draft.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      published: String(draft.published).toLowerCase() === 'true',
      publishDate: draft.publishDate || new Date().toISOString(),
      status: draft.status || 'Published'
    };

    setStatusMessage('');
    if (editing?._id) {
      await adminApi.updateBlog(editing._id, payload);
      setStatusMessage('Blog updated successfully.');
    } else {
      await adminApi.createBlog(payload);
      setStatusMessage('Blog created successfully.');
    }
    setEditing(null);
    setDraft(empty);
    await refresh();
  };

  const remove = async (row) => {
    await adminApi.deleteBlog(row._id);
    if (editing?._id === row._id) {
      setEditing(null);
      setDraft(empty);
    }
    await refresh();
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.title, row.slug, row.category, row.excerpt]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const selected = editing || rows[0] || null;

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setStatusMessage('Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage('Image must be 5 MB or smaller.');
      return;
    }

    adminApi.uploadFile({ file, resourceType: 'image' })
      .then((result) => {
        const url = result?.data?.url || result?.data?.secureUrl || '';
        setDraft((prev) => ({ ...prev, featuredImage: url }));
        setStatusMessage('');
      })
      .catch((err) => {
        setStatusMessage(err.message);
      });
  };

  const removeImage = () => {
    setDraft((prev) => ({ ...prev, featuredImage: '' }));
  };

  return (
    <AdminLayout title="Blog Writer">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Posts" value={rows.length} note="Published and draft articles" />
          <StatCard label="Ready to Publish" value={rows.filter((row) => String(row.status || '').toLowerCase() === 'draft').length} note="Posts in draft status" />
          <StatCard label="With Images" value={rows.filter((row) => row.featuredImage).length} note="Posts with cover images" />
          <StatCard label="Selected" value={selected ? 1 : 0} note="Current post in editor" />
        </div>

        {statusMessage ? (
          <div className="rounded-2xl border border-[#d1fae5] bg-[#ecfdf5] px-4 py-3 text-sm font-medium text-[#065f46]">
            {statusMessage}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-6">
            <div className="rounded-3xl border border-white/60 bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-ink">Blog Library</h2>
                  <p className="mt-1 text-sm text-muted">Select a post to edit or create a new one.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setDraft(empty);
                  }}
                  className="rounded-full bg-[#1f1633] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2b2048]"
                >
                  New Post
                </button>
              </div>

              <div className="mt-4">
                <input
                  className="input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, slug, category, excerpt..."
                />
              </div>

              <div className="mt-4 grid gap-3">
                {filteredRows.map((row) => (
                  <button
                    key={row._id}
                    type="button"
                    onClick={() => setEditing(row)}
                    className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition ${
                      editing?._id === row._id
                        ? 'border-[#c99a3e] bg-[#fbf8ef] shadow-[0_8px_20px_rgba(201,154,62,0.12)]'
                        : 'border-border hover:border-[#c99a3e]/50 hover:bg-[#faf7ff]'
                    }`}
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-background">
                      {row.featuredImage ? (
                        <img src={row.featuredImage} alt={row.title} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-ink">{row.title}</p>
                        <span className="rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                          {row.status || 'Published'}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted">{row.slug}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{row.excerpt}</p>
                    </div>
                  </button>
                ))}
                {!filteredRows.length ? (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
                    No posts match your search.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
              <h2 className="text-xl font-semibold text-ink">Selected Post Preview</h2>
              <p className="mt-1 text-sm text-muted">A quick visual check before saving.</p>
              <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-background">
                {draft.featuredImage ? (
                  <img src={draft.featuredImage} alt={draft.title || 'Blog preview'} className="h-64 w-full object-cover" />
                ) : (
                  <div className="flex h-64 items-center justify-center text-sm text-muted">No image selected</div>
                )}
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted">
                    <span>{draft.category || 'Uncategorized'}</span>
                    <span>{getReadingTime(draft)}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-ink">{draft.title || 'Untitled post'}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{draft.excerpt || 'The excerpt appears here.'}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-primary-700">{draft.author || 'Editorial Team'}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted">{formatDate(draft.publishDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-ink">{editing ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
                <p className="mt-1 text-sm text-muted">Simple, focused writer layout with all the essentials.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setDraft(empty);
                }}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:bg-background"
              >
                Clear
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Title</label>
                  <input className="input" value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Slug</label>
                  <input className="input" value={draft.slug} onChange={(e) => setDraft((prev) => ({ ...prev, slug: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Category</label>
                  <input className="input" value={draft.category} onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Author</label>
                  <input className="input" value={draft.author} onChange={(e) => setDraft((prev) => ({ ...prev, author: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Publish Date</label>
                  <input className="input" type="date" value={draft.publishDate} onChange={(e) => setDraft((prev) => ({ ...prev, publishDate: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="label">Featured Image</label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => document.getElementById('blog-image-upload')?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      document.getElementById('blog-image-upload')?.click();
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragActive(false);
                    handleFiles(event.dataTransfer.files);
                  }}
                  className={`group rounded-2xl border-2 border-dashed p-5 transition duration-300 ${
                    dragActive
                      ? 'border-[#7c5a12] bg-[#faf7ef]'
                      : 'border-border bg-background hover:border-[#9b8bb8] hover:bg-white'
                  }`}
                >
                  {draft.featuredImage ? (
                    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={draft.featuredImage}
                          alt={draft.title || 'Featured preview'}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-muted">{draft.featuredImage.slice(0, 60)}{draft.featuredImage.length > 60 ? '...' : ''}</p>
                          <p className="mt-1 text-xs text-muted">JPG, PNG, WebP • Max 5 MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeImage();
                          }}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-background"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <div className="rounded-2xl bg-white p-3 shadow-sm">
                        <UploadIcon />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">+ Upload Image</p>
                        <p className="mt-1 text-sm text-muted">Drag &amp; drop an image here or click to browse</p>
                        <p className="mt-3 text-xs text-muted">Supports JPG, PNG, WebP • Maximum size: 5 MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    id="blog-image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => handleFiles(event.target.files)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Excerpt</label>
                <textarea className="input min-h-28" value={draft.excerpt} onChange={(e) => setDraft((prev) => ({ ...prev, excerpt: e.target.value }))} />
              </div>

              <div>
                <label className="label">Content</label>
                <RichTextEditor
                  value={draft.content}
                  onChange={(value) => setDraft((prev) => ({ ...prev, content: value }))}
                  placeholder="Write the blog content here..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">SEO Title</label>
                  <input className="input" value={draft.seoTitle} onChange={(e) => setDraft((prev) => ({ ...prev, seoTitle: e.target.value }))} />
                </div>
                <div>
                  <label className="label">SEO Description</label>
                  <input className="input" value={draft.seoDescription} onChange={(e) => setDraft((prev) => ({ ...prev, seoDescription: e.target.value }))} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Tags</label>
                  <input className="input" value={draft.tags} onChange={(e) => setDraft((prev) => ({ ...prev, tags: e.target.value }))} placeholder="tag1, tag2, tag3" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={draft.status} onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="label">Published</label>
                  <select className="input" value={draft.published} onChange={(e) => setDraft((prev) => ({ ...prev, published: e.target.value }))}>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={submit}
                className="rounded-full bg-[#1f1633] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2b2048]"
              >
                {editing ? 'Update Blog' : 'Publish Blog'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (selected) {
                    setEditing(selected);
                    setDraft(normalizeDraft(selected));
                  }
                }}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-background"
              >
                Load First Post
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
              Tip: select a post from the library on the left, edit the fields, and hit Publish Blog.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
