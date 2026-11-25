import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return <main className="standalone-not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>We can’t find that page.</h1><p>The link may be incorrect or the page may have moved.</p><Link to="/" className="button button-primary"><ArrowLeft size={17} /> Go to dashboard</Link></main>;
}
