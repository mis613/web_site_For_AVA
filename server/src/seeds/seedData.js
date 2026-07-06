export const teamSeed = [
  {
    name: 'Rachit Agarwal',
    designation: 'Managing Partner',
    expertise: 'Taxation, audit, and strategic advisory',
    bio: 'Advises businesses on growth, compliance, and finance systems.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
  }
];

export const serviceSeed = [
  { title: 'Accounting & Bookkeeping', description: 'Monthly accounting, bookkeeping, and reconciliations.', benefits: ['Accurate records', 'Timely MIS'], featured: true }
];

export const blogSeed = [
  { title: 'GST compliance checklist', slug: 'gst-compliance-checklist', excerpt: 'Key deadlines and filing controls.', content: 'Detailed article content here.', published: true }
];

export const mediaSeed = [
  {
    type: 'home_video',
    videoUrl: 'https://res.cloudinary.com/dlh0o3f8e/video/upload/v1782378044/14675479_3840_2160_24fps_l1bezf.mp4'
  }
];

export const sitePageSeed = [
  {
    slug: 'about',
    eyebrow: 'About Us',
    title: 'Company profile',
    subtitle: 'Company profile, mission, vision, timeline, and leadership.',
    body: 'We are a modern Chartered Accountant firm focused on dependable compliance, proactive financial advice, and long-term client partnerships.',
    secondaryBody: 'Mission: deliver accurate and practical financial solutions. Vision: become the most trusted advisory partner for growing businesses.',
    jsonData: JSON.stringify({
      values: ['Integrity', 'Professionalism', 'Innovation', 'Client Success'],
      timeline: [
        { year: '2010', title: 'Firm Established', desc: 'Started with a core focus on compliance and tax advisory.' },
        { year: '2015', title: 'Expanded Services', desc: 'Added audit, bookkeeping, and startup consulting.' },
        { year: '2020', title: 'Digital Transformation', desc: 'Introduced cloud workflows and remote advisory systems.' },
        { year: '2025', title: 'Multi-sector Growth', desc: 'Serving clients across startup, retail, and industrial sectors.' }
      ],
      leadershipText: 'Add leadership profiles here, including partner photo, designation, and short bio.'
    }),
    published: true
  },
  {
    slug: 'careers',
    eyebrow: 'Careers',
    title: 'Build your career with us',
    subtitle: 'Join a team focused on finance, tax, audit, compliance, and advisory excellence.',
    body: 'We welcome qualified professionals and fresh talent interested in finance, tax, audit, and compliance.',
    secondaryBody: 'Please share your resume through the contact form for future opportunities.',
    jsonData: '[]',
    published: true
  },
  {
    slug: 'gallery',
    eyebrow: 'Gallery',
    title: 'Snapshots from our journey',
    subtitle: 'Photos and highlights from our firm and professional events.',
    body: 'The gallery section can be connected to the media API when image management is required.',
    secondaryBody: '',
    jsonData: '[]',
    published: true
  },
  {
    slug: 'privacy-policy',
    eyebrow: 'Privacy Policy',
    title: 'How we handle your information',
    subtitle: 'Privacy policy for client and website visitors.',
    body: 'We use contact details only for professional communication and service delivery.',
    secondaryBody: 'Any future policy text can be expanded here without changing the route structure.',
    jsonData: '[]',
    published: true
  },
  {
    slug: 'contact',
    eyebrow: 'Contact Us',
    title: 'Get in touch',
    subtitle: 'Contact form, office information, Google maps, and social media links.',
    body: 'We respond to inquiries promptly and keep communication professional and confidential.',
    secondaryBody: '',
    jsonData: JSON.stringify([
      { title: 'Our Office', icon: 'office', lines: ['Dummy Office Address'] },
      { title: 'Email address', icon: 'email', lines: ['info@example.com', 'hello@example.com'] },
      { title: 'Working Hours', icon: 'hours', lines: ['Mon-Sat', '10 am - 7 pm'] },
      { title: 'Phone Number', icon: 'phone', lines: ['Contact no : 0000000000', 'Whatsapp : 0000000000'] }
    ]),
    published: true
  }
];
