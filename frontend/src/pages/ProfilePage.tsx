import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Save, User } from 'lucide-react';

export function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await api.put('/auth/profile', {
        full_name: fullName,
        avatar_url: avatarUrl,
      });
      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        if (token) {
          setAuth(response.data.data, token);
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F5DC] min-h-screen font-sans text-black p-4 md:p-8">
      {/* Header */}
      <div className="mb-10 text-left">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic leading-none">Profile Saya</h1>
        <p className="font-bold text-xs md:text-sm text-slate-800 uppercase italic">
          Kelola informasi akun Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        
        {/* Left Column: Form Profile */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8">
          <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] outline outline-4 outline-black outline-offset-4">
            <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
              <User size={28} /> Informasi Dasar
            </h2>

            {message && (
              <div className={`mb-6 p-4 border-4 border-black font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${message.type === 'success' ? 'bg-[#7CFF7C] text-black' : 'bg-[#B22222] text-white'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase border-2 border-black bg-[#D9D9D7] px-2 py-0.5 ml-3 -mb-2 relative z-20 w-fit">
                  Email / ID
                </label>
                <div className="w-full border-4 border-black p-4 font-black text-lg bg-gray-200 text-slate-500 outline-none cursor-not-allowed">
                  {user?.id || 'Tidak diketahui'}
                </div>
                <p className="text-[10px] font-bold mt-1 text-slate-500 uppercase italic">ID Akun tidak dapat diubah.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase border-2 border-black bg-[#D9D9D7] px-2 py-0.5 ml-3 -mb-2 relative z-20 w-fit">
                  Nama Lengkap
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-4 border-black p-4 font-black text-xl focus:bg-yellow-50 outline-none" 
                  placeholder="Nama Lengkap Anda"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase border-2 border-black bg-[#D9D9D7] px-2 py-0.5 ml-3 -mb-2 relative z-20 w-fit">
                  URL Avatar
                </label>
                <input 
                  type="url" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full border-4 border-black p-4 font-black text-xl focus:bg-yellow-50 outline-none" 
                  placeholder="https://example.com/avatar.png"
                />
              </div>

              <div className="pt-4 border-t-4 border-black border-dashed">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#7CFF7C] w-full md:w-auto border-4 border-black px-8 py-4 font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all disabled:opacity-50"
                >
                  <Save size={24} /> {isLoading ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Avatar Preview */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-[#FFFF00] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-black uppercase italic mb-6">Pratinjau Avatar</h2>
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <img 
                src={avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200';
                }}
              />
            </div>
            <p className="font-black text-sm uppercase">{fullName || 'Nama Anda'}</p>
            <p className="text-[10px] font-bold text-slate-800 uppercase italic mt-1">Premium AI Member</p>
          </div>
        </div>

      </div>
    </div>
  );
}
