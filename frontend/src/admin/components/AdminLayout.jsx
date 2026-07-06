import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const items = [
  ['Dashboard', '/admin'],
  ['Services', '/admin/services'],
  ['Team', '/admin/team'],
  ['Blogs', '/admin/blogs'],
  ['Achievements', '/admin/achievements'],
  ['Inquiries', '/admin/inquiries'],
  ['About Us', '/admin/about-us'],
  ['Careers', '/admin/careers'],
  ['Gallery', '/admin/gallery'],
  ['Privacy Policy', '/admin/privacy-policy'],
  ['Contact Us', '/admin/contact-us']
];
function Logo() {
  return (
    <span className="flex items-center gap-3">
      <img src={logo} alt="Avibha Consultants Private Limited logo" className="h-10 w-10 rounded-2xl shadow-sm" />
      <span className="leading-tight">
        <span className="block text-sm font-bold text-ink">Avibha Consultants Private Limited</span>
        <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-muted">Admin</span>
      </span>
    </span>
  );
}

export default function AdminLayout({ title, children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden w-64 border-r border-border bg-white p-6 lg:block">
          <Link to="/" aria-label="Avibha Consultants Private Limited admin home">
            <Logo />
          </Link>
          <nav className="mt-8 grid gap-2">
            {items.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0B1F4D] text-white font-semibold'
                      : 'text-ink hover:bg-[#E8EEF9] hover:text-[#0B1F4D]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-[#C99A3E] transition-all duration-300 ${
                        isActive ? 'h-[calc(100%-12px)] opacity-100' : 'opacity-0 group-hover:h-[calc(100%-12px)] group-hover:opacity-30'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="flex h-full w-full items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-current'
                        }`}
                        aria-hidden="true"
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                      </span>
                      <span>{label}</span>
                    </span>
                  </>
                )}
              </NavLink>
            ))}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/admin/login');
              }}
              className="mt-4 rounded-[10px] px-4 py-3 text-left text-sm font-medium text-primary-700 transition-all duration-300 hover:bg-[#E8EEF9] hover:text-[#0B1F4D]"
            >
              Logout
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-6 lg:p-10">
          <h1
            className={`inline-block rounded-xl bg-[#0B1F4D] px-6 py-4 text-3xl font-semibold text-white ${
              title === 'Dashboard' ? '' : ''
            }`}
          >
            {title}
          </h1>
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
