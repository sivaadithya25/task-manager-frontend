import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { getErrorMessage, getValidationMessages, tasksApi } from '../services/api.js';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const fetchTask = useCallback(async () => {
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const response = await tasksApi.get(id);
      const result = response.data.data?.task;
      if (!result) throw new Error('The API returned an unexpected task response.');
      setTask(result);
    } catch (requestError) {
      if (requestError.response?.status === 404) setNotFound(true);
      else setError(requestError.message?.includes('unexpected task response') ? requestError.message : getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTask(); }, [fetchTask]);

  async function updateTask(updatedTask) {
    setSaving(true);
    setError('');
    try {
      const response = await tasksApi.update(id, updatedTask);
      if (!response.data.data?.task) throw new Error('The API returned an unexpected task response.');
      navigate(`/tasks/${id}`, { replace: true, state: { notice: 'Task updated successfully.' } });
    } catch (requestError) {
      const validation = getValidationMessages(requestError);
      setError(validation.length ? validation.join(' ') : requestError.message?.includes('unexpected task response') ? requestError.message : getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page-content"><Loader label="Loading task…" /></div>;
  if (notFound) return <div className="page-content"><div className="not-found-panel"><span className="eyebrow">404 · TASK NOT FOUND</span><h1>This task isn’t here.</h1><p>It may have been deleted, or you may not have access to it.</p><Link className="button button-primary" to="/">Back to dashboard</Link></div></div>;
  if (error && !task) return <div className="page-content"><ErrorMessage message={error} onRetry={fetchTask} /></div>;

  return <div className="page-content narrow-page">{task && <TaskForm key={task.id} initialTask={task} onSubmit={updateTask} saving={saving} error={error} submitLabel="Save changes" />}</div>;
}
