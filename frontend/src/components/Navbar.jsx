import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../data/site';
import logo from '../assets/images/logo.png';

function Logo() {
  return (
    <span className="flex items-center gap-3">
      <img src={logo} alt="Avibha Consultants Private Limited logo" className="h-14 w-14 rounded-2xl shadow-sm object-contain"/>
      <span className="hidden leading-tight sm:block">
        <span className="block text-[0.95rem] font-semibold tracking-wide text-ink md:text-[1.02rem]">
          Avibha Consultants Private Limited
        </span>
        <span className="block text-[0.72rem] uppercase tracking-[0.22em] text-muted">
          Chartered Accountants
        </span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActiveRoute = (to) => {
    if (to === '/') return pathname === '/';
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const linkClass = (to) =>
    `box-border inline-flex h-5 items-center rounded-full px-3 text-[0.90rem] font-normal leading-none transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
      isActiveRoute(to)
        ? ''
        : 'text-ink hover:bg-background hover:text-primary-700'
    }`;

  const mobileLinkClass = (to) =>
    `box-border flex h-11 items-center rounded-xl px-4 text-sm font-normal leading-none transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
      isActiveRoute(to)
        ? ''
        : 'text-ink hover:bg-background hover:text-primary-700'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 backdrop-blur ${
        scrolled
          ? 'border-transparent bg-transparent'
          : 'border-border bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between md:h-18">
        <Link to="/" aria-label="Avibha Consultants Private Limited home">
          <Logo />
        </Link>

        <nav className="hidden gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={linkClass(item.to)}
              style={
                isActiveRoute(item.to)
                  ? { backgroundColor: '#581C87', color: '#FFFFFF' }
                  : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="btn-primary hidden sm:inline-flex px-4 py-2 text-sm"
            href="https://wa.me/919811279063"
            target="_blank"
            rel="noreferrer"
          >
            Get In Touch
          </a>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink transition hover:bg-background md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </div>

      <div className={`${open ? 'block' : 'hidden'} border-t border-border bg-white md:hidden`}>
        <div className="container-page flex flex-col gap-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={mobileLinkClass(item.to)}
              style={
                isActiveRoute(item.to)
                  ? { backgroundColor: '#7E6BA5', color: '#FFFFFF' }
                  : undefined
              }
            >
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
          <a
            className="btn-primary mt-2 w-full px-4 py-2 text-sm sm:hidden"
            href="https://wa.me/919811279063"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Get In Touch
          </a>
        </div>
      </div>
    </header>
  );
}
