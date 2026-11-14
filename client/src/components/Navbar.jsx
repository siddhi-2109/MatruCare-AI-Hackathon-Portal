import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const linkCls = ({ isActive }) =>
    `block py-2 text-sm font-medium md:py-0 ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`;

  // Links shown depend on auth state
  const links = (
    <>
      <NavLink to="/" end className={linkCls} onClick={() => setOpen(false)}>Home</NavLink>
      <NavLink to="/about" className={linkCls} onClick={() => setOpen(false)}>About</NavLink>
      <NavLink to="/contact" className={linkCls} onClick={() => setOpen(false)}>Contact</NavLink>
      {user ? (
        <>
          <NavLink to="/dashboard" className={linkCls} onClick={() => setOpen(false)}>Dashboard</NavLink>
          <button onClick={handleLogout} className="btn-outline !py-1.5">Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={linkCls} onClick={() => setOpen(false)}>Login</NavLink>
          <Link to="/signup" className="btn !py-1.5" onClick={() => setOpen(false)}>Signup</Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-extrabold text-brand-600">MatruCare <span className="text-slate-900">AI</span></Link>
        <div className="hidden items-center gap-6 md:flex">{links}</div>
        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>
      {open && <div className="flex flex-col gap-1 border-t border-slate-100 px-4 pb-4 md:hidden">{links}</div>}
    </header>
  );
}
