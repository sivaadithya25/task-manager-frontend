import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CircleDashed, ListTodo, Plus, Search, Sparkles } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage, tasksApi } from '../services/api.js';

const statuses = ['all', 'pending', 'in_progress', 'completed'];

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = statuses.includes(searchParams.get('status')) ? searchParams.get('status') : 'all';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await tasksApi.list();
      const result = response.data.data?.tasks;
      if (!Array.isArray(result)) throw new Error('The API returned an unexpected task list.');
      setTasks(result);
    } catch (requestError) {
      setError(requestError.message?.includes('unexpected task list') ? requestError.message : getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    in_progress: tasks.filter((task) => task.status === 'in_progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  }), [tasks]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesText = task.title.toLowerCase().includes(search.trim().toLowerCase());
    return matchesText && (selectedStatus === 'all' || task.status === selectedStatus);
  }), [tasks, search, selectedStatus]);

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;
    setNotice('');
    try {
      await tasksApi.remove(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setNotice('Task deleted successfully.');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  const stats = [
    { label: 'Total tasks', count: counts.total, icon: ListTodo, color: 'stat-violet' },
    { label: 'Pending', count: counts.pending, icon: CircleDashed, color: 'stat-amber' },
    { label: 'In progress', count: counts.in_progress, icon: Sparkles, color: 'stat-blue' },
    { label: 'Completed', count: counts.completed, icon: CheckCircle2, color: 'stat-green' },
  ];

  return (
    <div className="page-content">
      <div className="page-heading">
        <div><span className="eyebrow">YOUR WORKSPACE</span><h1>Good day, {user?.name?.split(' ')[0] || 'there'} <span className="wave">✦</span></h1><p>Here’s what’s happening with your tasks today.</p></div>
        <Link to="/tasks/new" className="button button-primary"><Plus size={18} /> Create task</Link>
      </div>
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      <ErrorMessage message={error} onRetry={fetchTasks} />

      <section className="stats-grid" aria-label="Task summary">
        {stats.map(({ label, count, icon: Icon, color }) => (
          <article className="stat-card" key={label}><div className={`stat-icon ${color}`}><Icon size={19} /></div><div><span>{label}</span><strong>{loading ? '—' : count}</strong></div></article>
        ))}
      </section>

      <section className="task-section">
        <div className="section-heading"><div><h2>Your tasks</h2><p>Keep track of everything on your plate.</p></div><div className="task-count">{loading ? ' ' : `${visibleTasks.length} ${visibleTasks.length === 1 ? 'task' : 'tasks'}`}</div></div>
        <div className="task-toolbar">
          <label className="search-field"><Search size={17} /><span className="sr-only">Search tasks by title</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks…" /></label>
          <label className="filter-field"><span className="sr-only">Filter tasks by status</span><select value={selectedStatus} onChange={(event) => setSearchParams(event.target.value === 'all' ? {} : { status: event.target.value })}>
            <option value="all">All statuses</option><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option>
          </select></label>
        </div>
        {loading ? <Loader label="Loading your tasks…" /> : !error && visibleTasks.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><ListTodo size={25} /></div><h3>{tasks.length === 0 ? 'Nothing on your list yet' : 'No tasks match your search'}</h3><p>{tasks.length === 0 ? 'Create your first task and start making progress.' : 'Try a different title or status filter.'}</p>{tasks.length === 0 && <Link className="button button-primary" to="/tasks/new"><Plus size={17} /> Create your first task</Link>}</div>
        ) : !error && (
          <div className="task-grid">{visibleTasks.map((task) => <TaskCard key={task.id} task={task} onDelete={deleteTask} />)}</div>
        )}
      </section>
    </div>
  );
}
