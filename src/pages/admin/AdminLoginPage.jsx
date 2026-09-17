import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const correctSecret = import.meta.env.VITE_ADMIN_SECRET_KEY || 'amr2026';

    if (passphrase === correctSecret) {
      sessionStorage.setItem('isAdminAuth', 'true');
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4">
          <Lock className="w-5 h-5" />
        </div>
        
        <h1 className="text-lg font-bold text-slate-900 text-center mb-1">
          تسجيل دخول الإدارة
        </h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          أدخل كلمة المرور للمتابعة
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                setError(false);
              }}
              placeholder="كلمة المرور..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:border-slate-500 text-center tracking-wider"
              required
            />
            {error && (
              <p className="text-[11px] text-rose-600 mt-1.5 text-center font-medium">
                كلمة المرور غير صحيحة
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>دخول</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}