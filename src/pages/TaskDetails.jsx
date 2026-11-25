import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import { formatDate } from '../components/TaskCard.jsx';
import { getErrorMessage, tasksApi } from '../services/api.js';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const fetchTask = useCallback(async () => {
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const response = await tasksApi.get(id);
      setTask(response.data.data?.task || null);
      if (!response.data.data?.task) throw new Error('The API returned an unexpected task response.');
    } catch (requestError) {
      if (requestError.response?.status === 404) setNotFound(true);
      else setError(requestError.message?.includes('unexpected task response') ? requestError.message : getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTask(); }, [fetchTask]);

  async function deleteTask() {
    if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;
    try {
      await tasksApi.remove(id);
      navigate('/', { replace: true, state: { notice: 'Task deleted successfully.' } });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  if (loading) return <div className="page-content"><Loader label="Loading task…" /></div>;
  if (notFound) return <div className="page-content"><div className="not-found-panel"><span className="eyebrow">404 · TASK NOT FOUND</span><h1>This task isn’t here.</h1><p>It may have been deleted, or you may not have access to it.</p><Link className="button button-primary" to="/"><ArrowLeft size={17} /> Back to dashboard</Link></div></div>;

  return (
    <div className="page-content">
      <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to dashboard</Link>
      {location.state?.notice && <div className="alert alert-success" role="status">{location.state.notice}</div>}
      <ErrorMessage message={error} onRetry={fetchTask} />
      {task && <article className="details-panel">
        <div className="details-top"><span className={`status-badge status-${task.status}`}>{task.status.replace('_', ' ')}</span><div className="details-actions"><Link className="button button-secondary" to={`/tasks/${id}/edit`}><Pencil size={16} /> Edit</Link><button className="button button-danger" type="button" onClick={deleteTask}><Trash2 size={16} /> Delete</button></div></div>
        <span className="eyebrow">TASK DETAILS</span><h1>{task.title}</h1>
        <p className="details-description">{task.description || 'No description added.'}</p>
        {(task.created_at || task.createdAt) && <div className="detail-meta"><CalendarDays size={16} /> Created {formatDate(task.created_at || task.createdAt)}</div>}
      </article>}
    </div>
  );
}
