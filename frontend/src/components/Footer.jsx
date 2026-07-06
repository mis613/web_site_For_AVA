import { Link } from 'react-router-dom';

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <path d="M14 9h2V6h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13v-2c0-.6.4-1 1-1Z" />
    )
  },
  {
  label: 'Instagram',
  href: 'https://www.instagram.com/caava.in?utm_source=qr',
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="5" y="5" width="14" height="14" rx="4" ry="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
},
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <path d="M6 9h3v10H6V9Zm1.5-4A1.5 1.5 0 1 0 7.5 8 1.5 1.5 0 0 0 7.5 5ZM11 9h2.9v1.4c.4-.8 1.5-1.7 3.1-1.7 3 0 3.5 2 3.5 4.7V19h-3v-4.2c0-1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.4V19h-3V9Z" />
    )
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <path d="M21 8.2c0-1-.8-1.8-1.8-2-1.8-.2-3.7-.3-5.2-.3s-3.4.1-5.2.3C7.8 6.4 7 7.2 7 8.2 6.8 9.6 6.7 11 6.7 12s.1 2.4.3 3.8c0 1 .8 1.8 1.8 2 1.8.2 3.7.3 5.2.3s3.4-.1 5.2-.3c1-.2 1.8-1 1.8-2 .2-1.4.3-2.8.3-3.8s-.1-2.4-.3-3.8ZM11 15.2v-6l5 3-5 3Z" />
    )
  }
];

const overviewLinks = [
  ['Home', '/'],
  ['Services', '/services'],
  ['About', '/about'],
  ['Blog', '/blog'],
  ['Achievements', '/achievements']
];

const informationLinks = [
  ['Team', '/team'],
  ['Careers', '/careers'],
  ['Gallery', '/gallery'],
  ['Privacy Policy', '/privacy-policy'],
  ['Contact Us', '/contact']
];

function SocialButton({ label, href, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3a3230] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#4a403c]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-purple-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-[50px] lg:px-[85px]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3
              className="text-[32px] font-bold leading-tight text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Avibha Consultants Private Limited
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#f5f5f4]">
              Let&apos;s Get Started, For Business Solutions !
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <SocialButton key={item.label} label={item.label} href={item.href}>
                  {item.icon}
                </SocialButton>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Overview
            </h4>
            <div className="mt-6 flex flex-col gap-4 text-sm text-[#f5f5f4]">
              {overviewLinks.map(([label, to]) => (
                <Link key={label} to={to} className="transition duration-300 hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Information
            </h4>
            <div className="mt-6 flex flex-col gap-4 text-sm text-[#f5f5f4]">
              {informationLinks.map(([label, to]) => (
                <Link key={label} to={to} className="transition duration-300 hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Office
            </h4>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[#f5f5f4]">
              208, Usha Kiran Building Road, near Alakshit Cinema, Commercial Complex, Gopal Nagar, Azadpur, Delhi
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="tel:09811279063"
                className="flex items-center gap-3 rounded-2xl bg-[#3a3230] px-4 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#4a403c]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#d89a3a]" aria-hidden="true">
                  <path d="M6.6 10.8c1.5 3 3.6 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10 21 3 14 3 5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2Z" />
                </svg>
                <span>09811279063</span>
              </a>

              <a
                href="info@caava.com"
                className="flex items-center gap-3 rounded-2xl bg-[#3a3230] px-4 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#4a403c]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#d89a3a]" aria-hidden="true">
                  <path d="M4 6h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2Zm0 2v.3l8 5.2 8-5.2V8H4Zm16 8V10l-7.4 4.8c-.3.2-.6.2-.8 0L4 10v6h16Z" />
                </svg>
                <span>info@caava.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-5 text-sm text-[#f5f5f4] md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              Copyright © 2026 | <span className="font-bold text-white">Avibha Consultants Private Limited</span>
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-3">
              <div className="flex items-center gap-2">
                <Link to="/privacy-policy" className="transition duration-300 hover:text-white">
                  Terms &amp; Conditions
                </Link>
                <span>|</span>
                <Link to="/privacy-policy" className="transition duration-300 hover:text-white">
                  Privacy Policy
                </Link>
              </div>
              <button
                type="button"
                aria-label="Scroll to top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3a3230] text-white transition duration-300 hover:bg-[#4a403c]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 5l7 7-1.4 1.4L13 8.8V19h-2V8.8L6.4 13.4 5 12l7-7Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
