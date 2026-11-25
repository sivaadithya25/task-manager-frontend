import { useState } from 'react';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage.jsx';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskForm({ initialTask, onSubmit, saving, error, submitLabel }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState(initialTask?.status || 'pending');
  const [validationError, setValidationError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setValidationError('Please enter a task title.');
      return;
    }
    if (cleanTitle.length > 200) {
      setValidationError('Title must be 200 characters or fewer.');
      return;
    }
    if (!STATUSES.some((option) => option.value === status)) {
      setValidationError('Choose a valid task status.');
      return;
    }
    setValidationError('');
    await onSubmit({ title: cleanTitle, description: description.trim(), status });
  }

  return (
    <>
      <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to tasks</Link>
      <section className="form-panel">
        <header className="form-panel-heading">
          <span className="eyebrow">TASK DETAILS</span>
          <h1>{submitLabel === 'Create task' ? 'Create a task' : 'Edit task'}</h1>
          <p>Give your task a clear name and keep the details handy.</p>
        </header>
        <ErrorMessage message={error || validationError} />
        <form className="task-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="task-title">Title <span className="required">*</span></label>
          <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required autoFocus placeholder="What needs to get done?" aria-describedby="title-count" />
          <div id="title-count" className="field-hint">{title.length}/200 characters</div>

          <label htmlFor="task-description">Description <span className="optional">(optional)</span></label>
          <textarea id="task-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} placeholder="Add any useful context or notes…" />

          <label htmlFor="task-status">Status</label>
          <div className="select-wrap">
            <select id="task-status" value={status} onChange={(event) => setStatus(event.target.value)}>
              {STATUSES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <ChevronDown size={17} aria-hidden="true" />
          </div>
          <div className="form-actions">
            <Link to="/" className="button button-secondary">Cancel</Link>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? <><span className="button-spinner" /> Saving…</> : <><Check size={17} /> {submitLabel}</>}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
