import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-16">
        <div>
          <span className="font-display font-semibold text-paper text-2xl">TaskFlow</span>
        </div>
        <div>
          <h2 className="font-display text-5xl text-paper leading-tight mb-6">
            Every big thing<br />starts with a<br />small task.
          </h2>
          <p className="text-muted font-body text-lg">Organize your work. Reclaim your focus.</p>
        </div>
        <div className="flex gap-3">
          {['todo', 'in-progress', 'done'].map((s) => (
            <span key={s} className="text-xs font-mono text-muted border border-muted/30 px-3 py-1.5 rounded-lg">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-10">
            <h1 className="font-display text-4xl text-ink mb-2">Sign in</h1>
            <p className="text-muted font-body">Don't have an account?{' '}
              <Link to="/register" className="text-ink font-medium underline underline-offset-4">Register</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-ink mb-2">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-ink mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
              {loading ? (
                <div className="w-5 h-5 border-2 border-paper border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
