import { CheckCircle2, CircleDashed, LayoutDashboard, ListTodo, Plus } from 'lucide-react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';

export default function Sidebar({ open = false, onNavigate }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const selectedStatus = searchParams.get('status');
  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, status: null },
    { to: '/?status=pending', label: 'Pending', icon: CircleDashed, status: 'pending' },
    { to: '/?status=in_progress', label: 'In progress', icon: ListTodo, status: 'in_progress' },
    { to: '/?status=completed', label: 'Completed', icon: CheckCircle2, status: 'completed' },
  ];

  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onNavigate} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon, status }) => (
            <NavLink key={label} to={to} onClick={onNavigate} className={`nav-link ${location.pathname === '/' && selectedStatus === status ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <NavLink to="/tasks/new" className="new-task-link" onClick={onNavigate}>
          <span className="new-task-icon"><Plus size={17} /></span> New task
        </NavLink>
        <div className="sidebar-note">
          <div className="note-icon"><CheckCircle2 size={18} /></div>
          <strong>Make progress, daily.</strong>
          <span>Small steps add up to big things.</span>
        </div>
        <div className="sidebar-footer">TASKFLOW <span>·</span> YOUR PERSONAL SPACE</div>
      </aside>
    </>
  );
}
