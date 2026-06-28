import React from 'react';
import { BookOpen, Search, Sun, Moon, LogIn, LogOut, PenTool, X, LayoutDashboard } from 'lucide-react';
import AuthComponent from './AuthComponent';

export default function Header({
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  isAdmin,
  onLoginClick,
  onLogoutClick,
  onNewPostClick,
  onCMSClick
}) {
  return (
    <header className="main-header">
      <div className="header-container">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <BookOpen className="logo-icon" />
          <span>멘토의 <span>공간</span></span>
        </a>
        
        <div className="header-right">
          {/* Search bar */}
          <div className="search-box">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="키워드나 태그 검색..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')} aria-label="검색어 지우기">
                <X className="clear-icon" />
              </button>
            )}
          </div>
          
          {/* Dark Mode Toggle */}
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="테마 전환">
            {theme === 'light' ? (
              <Moon className="theme-icon moon-icon" />
            ) : (
              <Sun className="theme-icon sun-icon" />
            )}
          </button>

          {/* Admin area / Writing tools */}
          {isAdmin && (
            <>
              <span className="admin-badge">
                <PenTool size={14} />
                관리자
              </span>
              <button onClick={onCMSClick} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.85rem' }}>
                <LayoutDashboard size={14} />
                CMS 대시보드
              </button>
              <button onClick={onNewPostClick} className="btn-primary">
                글 작성
              </button>
            </>
          )}

          {/* Supabase Google Auth Component */}
          <AuthComponent />
        </div>
      </div>
    </header>
  );
}
