import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const priorities = ['low', 'medium', 'high'];
const statuses = ['todo', 'in-progress', 'done'];

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags?.join(', ') || ''
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...form,
        dueDate: form.dueDate || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      });
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };
  const statusColors = { 'todo': 'bg-surface text-muted', 'in-progress': 'bg-blue-50 text-blue-600', 'done': 'bg-green-50 text-green-600' };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="card w-full max-w-lg p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">{task ? 'Edit task' : 'New task'}</h2>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-1 hover:bg-surface rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className="input-field font-display text-lg"
              placeholder="Task title..."
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div>
            <textarea
              className="input-field resize-none"
              placeholder="Description (optional)"
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Status */}
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-2">Status</label>
              <div className="flex flex-col gap-1.5">
                {statuses.map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => setForm({ ...form, status: s })}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      form.status === s ? statusColors[s] + ' ring-1 ring-current' : 'hover:bg-surface text-muted'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-2">Priority</label>
              <div className="flex flex-col gap-1.5">
                {priorities.map(p => (
                  <button
                    key={p} type="button"
                    onClick={() => setForm({ ...form, priority: p })}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      form.priority === p ? priorityColors[p] + ' ring-1 ring-current' : 'hover:bg-surface text-muted'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-2">Due date</label>
            <input
              type="date"
              className="input-field"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              className="input-field"
              placeholder="design, frontend, urgent"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <div className="w-4 h-4 border-2 border-paper border-t-transparent rounded-full animate-spin mx-auto" />
              ) : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
