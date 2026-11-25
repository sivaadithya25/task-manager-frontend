import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" type="button" onClick={onMenuClick} aria-label="Open navigation">
        <Menu size={21} />
      </button>
      <a className="brand topbar-brand" href="/" aria-label="Taskflow home">
        <span className="brand-mark">T</span><span>taskflow</span>
      </a>
      <div className="topbar-user">
        <span className="avatar" aria-hidden="true">{user?.name?.slice(0, 1)?.toUpperCase() || 'U'}</span>
        <span className="user-name">{user?.name || 'My account'}</span>
        <button
          type="button"
          className="icon-button logout-button"
          aria-label={menuOpen ? 'Close account menu' : 'Open account menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} /> : <LogOut size={18} />}
        </button>
        {menuOpen && (
          <div className="account-menu">
            <button type="button" onClick={logout}><LogOut size={16} /> Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}
