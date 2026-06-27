import React, { useRef, useState, useEffect } from 'react';
import { X, ArrowLeft, Heart, Calendar } from 'lucide-react';

export default function PostDetailModal({ post, onClose }) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const articleContainerRef = useRef(null);

  // 모달 내 스크롤 이벤트를 감지하여 상단 진행바 비율 계산
  useEffect(() => {
    const handleScroll = () => {
      const element = articleContainerRef.current;
      if (!element) return;
      
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable <= 0) {
        setScrollPercent(100);
        return;
      }
      
      const percentage = (scrollTop / totalScrollable) * 100;
      setScrollPercent(percentage);
    };

    const element = articleContainerRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      // 초기 렌더링 시 스크롤 위치 초기화
      element.scrollTop = 0;
      setScrollPercent(0);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [post]);

  if (!post) return null;

  const { title, content, category, tags, createdAt } = post;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-container">
        
        {/* 본문 독서 진행 스크롤 프로그레스 바 */}
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollPercent}%` }}
        ></div>

        {/* Modal Navigation/Header */}
        <div className="modal-header">
          <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
            <ArrowLeft size={18} />
            <span>글 목록으로 돌아가기</span>
          </button>
          
          <button className="dialog-close-btn" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        {/* Modal Article Body */}
        <article className="modal-article" ref={articleContainerRef}>
          {/* Article Header */}
          <header className="article-header">
            <div className="article-meta">
              <span className="article-category-badge">{category}</span>
              <span className="article-date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} />
                {formatDate(createdAt)}
              </span>
            </div>
            <h1 className="article-title">{title}</h1>
            
            {/* Author Info Card */}
            <div className="author-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
              <img 
                src="https://api.dicebear.com/7.x/bottts/svg?seed=Kim" 
                alt="Mentor Avatar" 
                className="author-avatar" 
                style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }} 
              />
              <div className="author-info" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="author-name" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mentor 이서윤</span>
                <span className="author-role" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>성장을 돕는 페이스메이커</span>
              </div>
            </div>
            
            {/* Decorative cover header banner */}
            <div className="article-cover-banner"></div>
          </header>

          {/* Article Contents */}
          <section 
            className="article-body-content"
            dangerouslySetInnerHTML={{ __html: content }}
          ></section>

          {/* Footer inside Article */}
          <footer className="article-footer">
            {tags && tags.length > 0 && (
              <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag-badge" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-primary)', padding: '4px 10px', borderRadius: '8px' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Mentor Message / Brand Signature */}
            <div className="mentor-signature-box">
              <div className="signature-icon-wrapper">
                <Heart className="signature-icon" />
              </div>
              <div className="signature-text">
                <h5>독자에게 전하는 멘토의 한 마디</h5>
                <p>성장이라는 길고 묵묵한 길을 걷는 당신의 곁에 든든한 동반자로 함께하고 싶습니다. 글을 읽고 더 나누고 싶은 이야기가 있다면 언제든 멘토를 찾아 주시길 바랍니다.</p>
              </div>
            </div>
          </footer>
        </article>
        
      </div>
    </div>
  );
}
