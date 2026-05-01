import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to TaskFlow 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent flex-col justify-between p-16">
        <div>
          <span className="font-display font-semibold text-white text-2xl">TaskFlow</span>
        </div>
        <div>
          <h2 className="font-display text-5xl text-white leading-tight mb-6">
            Join thousands<br />building better<br />habits.
          </h2>
          <p className="text-white/70 font-body text-lg">Free forever. No credit card needed.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          {['Task tracking', 'Priority labels', 'Due dates', 'Quick filters'].map((f) => (
            <span key={f} className="text-xs font-mono text-white/80 border border-white/20 px-3 py-1.5 rounded-lg text-center">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-10">
            <h1 className="font-display text-4xl text-ink mb-2">Create account</h1>
            <p className="text-muted font-body">Already have one?{' '}
              <Link to="/login" className="text-ink font-medium underline underline-offset-4">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-ink mb-2">Full name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

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
                  placeholder="Min. 6 characters"
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
                <>Create account <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
