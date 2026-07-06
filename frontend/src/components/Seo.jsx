import { useEffect } from 'react';

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  const selector = `meta[${attr}="${name}"]`;
  let meta = document.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

export default function Seo({ title, description, canonicalUrl, openGraph = {}, twitter = {}, robots, structuredData }) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta('description', description);
    setMeta('robots', robots);
    setMeta('og:title', openGraph.title || title, 'property');
    setMeta('og:description', openGraph.description || description, 'property');
    setMeta('og:type', openGraph.type || 'website', 'property');
    setMeta('og:url', openGraph.url || canonicalUrl, 'property');
    setMeta('og:image', openGraph.image, 'property');
    setMeta('twitter:card', twitter.card || 'summary_large_image');
    setMeta('twitter:title', twitter.title || title);
    setMeta('twitter:description', twitter.description || description);
    setMeta('twitter:image', twitter.image || openGraph.image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    let ld = document.getElementById('structured-data');
    if (structuredData) {
      if (!ld) {
        ld = document.createElement('script');
        ld.id = 'structured-data';
        ld.type = 'application/ld+json';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(structuredData);
    } else if (ld) {
      ld.remove();
    }
  }, [title, description, canonicalUrl, openGraph, twitter, robots, structuredData]);

  return null;
}
