import { ArrowUpRight, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function TaskCard({ task, onDelete }) {
  const createdDate = formatDate(task.created_at || task.createdAt);
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className={`status-badge status-${task.status}`}>{task.status?.replace('_', ' ')}</span>
        <div className="task-actions">
          <Link className="icon-button" to={`/tasks/${task.id}/edit`} aria-label={`Edit ${task.title}`} title="Edit task"><Pencil size={16} /></Link>
          <button className="icon-button danger-hover" type="button" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} title="Delete task"><Trash2 size={16} /></button>
        </div>
      </div>
      <Link to={`/tasks/${task.id}`} className="task-title-link">
        <h3>{task.title}</h3><ArrowUpRight size={17} aria-hidden="true" />
      </Link>
      <p className="task-description">{task.description || 'No description added.'}</p>
      <div className="task-card-footer">
        <span>{createdDate ? <><CalendarDays size={14} /> {createdDate}</> : ' '}</span>
        <Link to={`/tasks/${task.id}`} className="view-link">View details <ArrowUpRight size={14} /></Link>
      </div>
    </article>
  );
}
