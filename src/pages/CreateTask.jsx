import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm.jsx';
import { getErrorMessage, getValidationMessages, tasksApi } from '../services/api.js';

export default function CreateTask() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function createTask(task) {
    setSaving(true);
    setError('');
    try {
      const response = await tasksApi.create(task);
      if (!response.data.data?.task) throw new Error('The API returned an unexpected task response.');
      navigate('/', { replace: true, state: { notice: 'Task created successfully.' } });
    } catch (requestError) {
      const validation = getValidationMessages(requestError);
      setError(validation.length ? validation.join(' ') : requestError.message?.includes('unexpected task response') ? requestError.message : getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return <div className="page-content narrow-page"><TaskForm onSubmit={createTask} saving={saving} error={error} submitLabel="Create task" /></div>;
}
