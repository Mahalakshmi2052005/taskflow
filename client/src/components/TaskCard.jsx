import { format } from 'date-fns';
import { Calendar, Tag, Pencil, Trash2 } from 'lucide-react';

const priorityColors = {
  low: 'bg-green-50 text-green-600',
  medium: 'bg-amber-50 text-amber-600',
  high: 'bg-red-50 text-red-600'
};

const statusColors = {
  'todo': 'bg-surface text-muted',
  'in-progress': 'bg-blue-50 text-blue-600',
  'done': 'bg-emerald-50 text-emerald-600'
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`card p-4 group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${task.status === 'done' ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Status toggle circle */}
          <button
            onClick={() => {
              const next = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
              onStatusChange(task._id, next[task.status]);
            }}
            className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all
              ${task.status === 'done' ? 'bg-emerald-500 border-emerald-500' :
                task.status === 'in-progress' ? 'border-blue-400 bg-blue-100' :
                'border-border hover:border-ink'}`}
          />
          <div className="flex-1 min-w-0">
            <p className={`font-body font-medium text-ink leading-snug ${task.status === 'done' ? 'line-through text-muted' : ''}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-muted mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(task)} className="p-1.5 text-muted hover:text-ink hover:bg-surface rounded-lg transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(task._id)} className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className={`badge ${priorityColors[task.priority]}`}>{task.priority}</span>
        <span className={`badge ${statusColors[task.status]}`}>{task.status}</span>

        {task.dueDate && (
          <span className={`flex items-center gap-1 text-xs font-mono ${isOverdue ? 'text-red-500' : 'text-muted'}`}>
            <Calendar size={11} />
            {format(new Date(task.dueDate), 'MMM d')}
            {isOverdue && ' · overdue'}
          </span>
        )}

        {task.tags?.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {task.tags.slice(0, 3).map(tag => (
              <span key={tag} className="flex items-center gap-0.5 text-xs font-mono text-muted bg-surface px-2 py-0.5 rounded-md">
                <Tag size={9} />{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
