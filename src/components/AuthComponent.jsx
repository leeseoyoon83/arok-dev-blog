import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('세션 정보 가져오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('구글 로그인 에러:', err.message);
      alert('구글 로그인 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('로그아웃 에러:', err.message);
      alert('로그아웃 중 오류가 발생했습니다: ' + err.message);
    }
  };

  if (loading) {
    return <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>로딩 중...</span>;
  }

  return (
    <div className="auth-component">
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user.user_metadata?.avatar_url && (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="프로필" 
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
            />
          )}
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {user.user_metadata?.full_name || user.email}님
          </span>
          <button 
            onClick={handleLogout} 
            className="btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
          >
            <LogOut size={14} />
            로그아웃
          </button>
        </div>
      ) : (
        <button 
          onClick={handleGoogleLogin} 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
        >
          <LogIn size={14} />
          구글 로그인
        </button>
      )}
    </div>
  );
}
