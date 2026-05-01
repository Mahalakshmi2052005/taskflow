import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Search, LogOut, CheckSquare, Clock, ListTodo, LayoutGrid } from 'lucide-react';

const FILTERS = ['all', 'todo', 'in-progress', 'done'];
const PRIORITIES = ['all', 'low', 'medium', 'high'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (search) params.search = search;
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, search]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/tasks/stats');
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchStats(); }, [tasks.length]);

  const handleSave = async (formData) => {
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, formData);
        setTasks(prev => prev.map(t => t._id === editTask._id ? data : t));
        toast.success('Task updated');
      } else {
        const { data } = await api.post('/tasks', formData);
        setTasks(prev => [data, ...prev]);
        toast.success('Task created');
      }
      setShowModal(false);
      setEditTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, { status });
      setTasks(prev => prev.map(t => t._id === id ? data : t));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditTask(null);
  };

  const statCards = [
    { label: 'Total', value: stats.total, icon: LayoutGrid, color: 'bg-ink text-paper' },
    { label: 'To Do', value: stats.todo, icon: ListTodo, color: 'bg-surface text-ink' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'bg-blue-50 text-blue-600' },
    { label: 'Done', value: stats.done, icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-paper">
      {/* Navbar */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display font-semibold text-xl text-ink">TaskFlow</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">
              Hi, <span className="font-medium text-ink">{user?.name?.split(' ')[0]}</span>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`card p-4 ${color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono opacity-70">{label}</span>
                <Icon size={14} className="opacity-60" />
              </div>
              <p className="font-display text-3xl">{value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`text-xs font-mono px-3 py-2 rounded-xl transition-all ${
                  statusFilter === f ? 'bg-ink text-paper' : 'bg-white border border-border text-muted hover:text-ink'
                }`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="input-field w-auto text-sm cursor-pointer"
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p === 'all' ? 'All priorities' : p}</option>
            ))}
          </select>
        </div>

        {/* Tasks */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ListTodo size={28} className="text-muted" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">No tasks yet</h3>
            <p className="text-muted text-sm mb-6">Create your first task to get started</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Add a task
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 stagger">
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-ink text-paper w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center hover:bg-accent transition-all duration-200 active:scale-95 hover:shadow-xl hover:-translate-y-0.5"
      >
        <Plus size={24} />
      </button>

      {/* Modal */}
      {showModal && (
        <TaskModal task={editTask} onSave={handleSave} onClose={handleCloseModal} />
      )}
    </div>
  );
}
