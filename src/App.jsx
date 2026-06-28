import React, { useState, useEffect } from 'react';
import { RefreshCw, Database } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterSection from './components/FilterSection';
import PostCard from './components/PostCard';
import PostDetailModal from './components/PostDetailModal';
import PostFormModal from './components/PostFormModal';
import LoginModal from './components/LoginModal';
import { postService } from './supabaseClient';
import { supabase } from '../lib/supabaseClient';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  
  const [theme, setTheme] = useState('light');
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('mentors_space_is_admin') === 'true';
  });

  // 모달 상태 정의
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // 포스트 패치
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Supabase Auth 상태 감지 및 관리자 상태(isAdmin) 동기화
  useEffect(() => {
    if (!supabase) return;

    const syncAuthState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAdmin(!!session?.user);
      } catch (err) {
        console.error('인증 상태 동기화 실패:', err);
      }
    };

    syncAuthState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session?.user);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // 테마 초기 설정
  useEffect(() => {
    const savedTheme = localStorage.getItem('mentors_space_theme') || 'light';
    setTheme(savedTheme);
    document.body.className = `${savedTheme}-mode`;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('mentors_space_theme', nextTheme);
    document.body.className = `${nextTheme}-mode`;
  };

  // 모의 로그인/로그아웃 핸들러
  const handleLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('mentors_space_is_admin', 'true');
    alert('관리자로 로그인되었습니다. (글 작성 및 삭제 기능 활성화)');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('mentors_space_is_admin');
    alert('로그아웃 되었습니다.');
  };

  // 새 글 발행
  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postService.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      setIsNewPostModalOpen(false);
      alert('새 이야기가 따뜻하게 기록되었습니다.');
    } catch (err) {
      console.error(err);
      alert('기록 도중 에러가 발생했습니다.');
    }
  };

  // 글 삭제
  const handleDeletePost = async (id) => {
    try {
      const success = await postService.deletePost(id);
      if (success) {
        setPosts(prev => prev.filter(p => p.id !== id));
        if (selectedPost && selectedPost.id === id) {
          setSelectedPost(null);
        }
        alert('이야기가 추억 속으로 삭제되었습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('삭제 도중 에러가 발생했습니다.');
    }
  };

  // 필터 일괄 초기화
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedTag(null);
  };

  // 다중 필터 로직 처리
  const filteredPosts = posts.filter(post => {
    // 1. 카테고리 필터
    if (activeCategory !== 'all' && post.category !== activeCategory) {
      return false;
    }

    // 2. 태그 필터
    if (selectedTag && (!post.tags || !post.tags.includes(selectedTag))) {
      return false;
    }

    // 3. 검색어 필터 (제목, 본문, 태그 탐색)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = post.title?.toLowerCase().includes(query);
      const contentMatch = post.content?.toLowerCase().includes(query);
      const tagMatch = post.tags?.some(t => t.toLowerCase().includes(query));
      
      if (!titleMatch && !contentMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="app-container">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        isAdmin={isAdmin}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        onNewPostClick={() => setIsNewPostModalOpen(true)}
      />

      <main className="content-wrapper">
        <Hero />

        <FilterSection
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />

        {/* 포스트 영역 헤더 */}
        <section className="posts-grid-section">
          <div className="posts-grid-header">
            <h3 className="grid-title">
              {activeCategory === 'all' ? '모든 포스트' : activeCategory}
            </h3>
            <span className="count-badge">
              총 {filteredPosts.length}개
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--text-tertiary)' }}>
              <RefreshCw style={{ animation: 'spin 2s linear infinite', marginBottom: '12px' }} />
              <p style={{ fontSize: '0.95rem' }}>이야기를 펼쳐내고 있습니다...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="posts-grid">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAdmin={isAdmin}
                  onClick={setSelectedPost}
                  onDeleteClick={handleDeletePost}
                  onTagClick={setSelectedTag}
                />
              ))}
            </div>
          ) : (
            <div className="no-results-view">
              <div className="no-results-icon">📂</div>
              <h4>이야기가 비어 있습니다</h4>
              <p>선택하신 필터나 검색 조건에 맞는 글이 보이지 않네요.</p>
              <button className="reset-btn" onClick={handleResetFilters}>
                필터 초기화
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-brand-info">
            <a href="#" className="footer-logo" onClick={(e) => e.preventDefault()}>
              <span>멘토의 <span>공간</span></span>
            </a>
            <p className="footer-tagline">
              성장을 꿈꾸는 이들을 위한 따스한 삶의 지혜와 독서의 기록 보관소입니다.
            </p>
            
            {/* DB 커넥션 상태 표시기 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '12px' }}>
              <Database size={13} />
              <span>
                데이터 소스: {postService.isUsingSupabase ? (
                  <span style={{ color: '#8D6E63', fontWeight: 700 }}>Supabase 클라우드 연동 완료</span>
                ) : (
                  <span>브라우저 LocalStorage 로컬 스토리지 (데모 작동 중)</span>
                )}
              </span>
            </div>
          </div>

          <div className="footer-subscribe">
            <h5>뉴스레터 신청</h5>
            <p>격주로 전해드리는 멘토의 지혜와 책방 칼럼을 메일로 만나보세요.</p>
            <form className="subscribe-form" onSubmit={(e) => { e.preventDefault(); alert('신청이 성공적으로 완료되었습니다. (데모)'); e.target.reset(); }}>
              <input type="email" placeholder="이메일 주소를 입력하세요" required aria-label="이메일 주소" />
              <button type="submit" className="subscribe-btn">
                구독
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 멘토의 공간. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>개인정보처리방침</a>
            <a href="#" onClick={(e) => e.preventDefault()}>이용약관</a>
          </div>
        </div>
      </footer>

      {/* 모달 렌더링 영역 */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      {isNewPostModalOpen && (
        <PostFormModal
          onSubmit={handleCreatePost}
          onClose={() => setIsNewPostModalOpen(false)}
        />
      )}
    </div>
  );
}
