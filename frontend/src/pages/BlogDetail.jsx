import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useFetch } from '../hooks/useFetch';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { sanitizeRichHtml } from '../utils/sanitizeHtml';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(`/blogs/${slug}`, [slug]);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  if (loading) return <div className="bg-background py-16"><div className="container-page"><LoadingState /></div></div>;
  if (error) return <div className="bg-background py-16"><div className="container-page"><ErrorState message={error} /></div></div>;
  const post = data?.data;

  return (
    <div className="bg-background py-16">
      <div className="container-page">
      <Seo
        title={post?.title || 'Blog'}
        description={post?.excerpt || ''}
        canonicalUrl={origin ? `${origin}/blog/${slug}` : undefined}
        openGraph={{
          title: post?.title || 'Blog',
          description: post?.excerpt || '',
          url: origin ? `${origin}/blog/${slug}` : undefined,
          image: post?.featuredImage || post?.coverImage || ''
        }}
        twitter={{
          title: post?.title || 'Blog',
          description: post?.excerpt || '',
          image: post?.featuredImage || post?.coverImage || ''
        }}
        structuredData={post ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage || post.coverImage || undefined,
          datePublished: post.publishDate,
          author: { '@type': 'Person', name: post.author || 'Editorial Team' }
        } : null}
      />
      <article className="card">
        {(post?.featuredImage || post?.coverImage) && (
          <img
            src={post.featuredImage || post.coverImage}
            alt={post?.title || 'Blog cover'}
            className="mb-6 h-80 w-full rounded-2xl object-cover"
            loading="lazy"
          />
        )}
        <h1 className="text-3xl font-semibold text-ink">{post?.title}</h1>
        <div
          className="prose prose-slate mt-4 max-w-none prose-headings:text-ink prose-p:text-muted prose-li:text-muted"
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(post?.content || '') }}
        />
      </article>
      </div>
    </div>
  );
}
