import AdminLayout from './components/AdminLayout';
import { useFetch } from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CrudForm from '../components/CrudForm';
import { adminApi } from '../services/adminApi';

const quickLinks = [
  { label: 'Manage Services', to: '/admin/services', description: 'Update offerings and service copy.' },
  { label: 'Team Profiles', to: '/admin/team', description: 'Edit partners and team members.' },
  { label: 'Blogs', to: '/admin/blogs', description: 'Publish insights and announcements.' },
  { label: 'Inquiries', to: '/admin/inquiries', description: 'Review incoming client messages.' },
  { label: 'Achievements', to: '/admin/achievements', description: 'Manage milestones and accolades.' },
  { label: 'Careers Page', to: '/admin/careers', description: 'Edit jobs, internships, and reviews.' },
  { label: 'Gallery Page', to: '/admin/gallery', description: 'Upload and arrange media items.' },
  { label: 'Privacy Page', to: '/admin/privacy-policy', description: 'Edit privacy policy and SEO details.' },
  { label: 'Contact Page', to: '/admin/contact-us', description: 'Manage office, email, and phone blocks.' }
];

export default function Dashboard() {
  const services = useFetch('/services', []);
  const team = useFetch('/team', []);
  const blogs = useFetch('/blogs', []);
  const inquiries = useFetch('/contact', []);
  const [homeVideo, setHomeVideo] = useState({ videoUrl: '', publicId: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    adminApi.getHomeVideo()
      .then((data) => setHomeVideo({ videoUrl: data.videoUrl || '', publicId: data.publicId || '' }))
      .catch(() => setHomeVideo({ videoUrl: '', publicId: '' }));
  }, []);

  const saveVideo = async (form) => {
    setStatus('');
    const result = await adminApi.saveHomeVideo(form);
    console.log('[home-video] frontend save response:', result);
    if (result?.data) {
      setHomeVideo({
        videoUrl: result.data.videoUrl || result.data.secureUrl || '',
        publicId: result.data.publicId || ''
      });
    }
    setStatus('Home video saved successfully.');
  };

  const metrics = [
    { label: 'Services', value: services.data?.data?.length ?? 0, note: 'Active service cards' },
    { label: 'Team', value: team.data?.data?.length ?? 0, note: 'Profiles in directory' },
    { label: 'Blogs', value: blogs.data?.data?.length ?? 0, note: 'Published articles' },
    { label: 'Inquiries', value: inquiries.data?.data?.length ?? 0, note: 'Customer messages' }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-white/60 bg-white p-5 shadow-[0_8px_30px_rgba(17,24,39,0.05)] transition hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-sm font-medium text-muted">{metric.label}</p>
            <div className="mt-2 text-4xl font-semibold tracking-tight text-ink">{metric.value}</div>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#7c3aed]">{metric.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
          <div className="border-b border-border/60 px-6 py-5">
            <h2 className="text-xl font-semibold text-ink">Quick Actions</h2>
            <p className="mt-1 text-sm text-muted">Jump to the most common admin tasks.</p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-2xl border border-border/70 bg-[#faf7ff] p-4 transition hover:-translate-y-1 hover:border-[#c4b5fd] hover:bg-white hover:shadow-lg"
              >
                <div className="text-sm font-semibold text-[#4c1d95]">{item.label}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/60 bg-[#1f1633] p-6 text-white shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Status</p>
            <h2 className="mt-2 text-2xl font-semibold">Home Hero Video</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Keep the homepage background fresh by updating the hero video URL here.
            </p>
            {status && <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white">{status}</p>}
          </div>
          <div className="rounded-3xl border border-white/60 bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.05)]">
            <CrudForm
              fields={[{
                name: 'videoUrl',
                label: 'Video',
                full: true,
                upload: true,
                accept: 'video/*',
                resourceType: 'video',
                onUploaded: async (url, result) => {
                  const publicId = result?.publicId || result?.public_id || '';
                  const secureUrl = result?.secureUrl || result?.secure_url || url;
                  console.log('[home-video] frontend upload callback:', {
                    url,
                    publicId,
                    secureUrl
                  });

                  setHomeVideo({
                    videoUrl: secureUrl,
                    publicId
                  });

                  try {
                    const saveResult = await adminApi.saveHomeVideo({
                      videoUrl: secureUrl,
                      publicId
                    });
                    console.log('[home-video] frontend auto-save response:', saveResult);
                    if (saveResult?.data) {
                      setHomeVideo({
                        videoUrl: saveResult.data.videoUrl || saveResult.data.secureUrl || secureUrl,
                        publicId: saveResult.data.publicId || publicId
                      });
                    }
                    setStatus('Home video uploaded and saved successfully.');
                  } catch (error) {
                    console.error('[home-video] frontend auto-save failed:', error);
                    setStatus('Upload completed, but saving the homepage video failed.');
                  }
                }
              }]}
              initialValues={homeVideo}
              onSubmit={saveVideo}
              submitLabel="Save"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
