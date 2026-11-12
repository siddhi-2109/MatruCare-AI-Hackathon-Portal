import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-white">MatruCare AI</h3>
          <p className="mt-2 text-sm text-brand-100/80">Building AI for maternal healthcare, one hackathon at a time.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Quick links</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Get in touch</h4>
          <a href="mailto:matrucareai@gmail.com" className="mt-2 block text-sm hover:underline">matrucareai@gmail.com</a>
          <div className="mt-3 flex gap-4 text-sm">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-100/70">
        &copy; {new Date().getFullYear()} MatruCare AI. All rights reserved.
      </div>
    </footer>
  );
}
