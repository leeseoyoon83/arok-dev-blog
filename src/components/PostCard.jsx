import React from 'react';
import { Trash2, Edit3, Lock } from 'lucide-react';

export default function PostCard({ post, isAdmin, isMembership, onClick, onDeleteClick, onEditClick, onTagClick }) {
  const { id, title, content, category, tags, createdAt } = post;

  // HTML 태그를 제거하고 순수 텍스트만 추출하여 요약본 생성
  const getExcerpt = (htmlContent) => {
    if (!htmlContent) return '';
    const cleanText = htmlContent.replace(/<\/?[^>]+(>|$)/g, " ");
    const trimmed = cleanText.trim().replace(/\s+/g, ' ');
    return trimmed.length > 110 ? trimmed.substring(0, 110) + '...' : trimmed;
  };

  // 날짜 형식 이쁘게 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleCardClick = () => {
    if (onClick) onClick(post);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // 상세 조회 모달 열기 버블링 방지
    if (window.confirm(`'${title}' 포스트를 정말 삭제하시겠습니까?`)) {
      onDeleteClick(id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // 상세 조회 모달 열기 버블링 방지
    if (onEditClick) onEditClick(post);
  };

      const isLocked = category === '멘토의 지혜' && !isMembership;

      return (
        <article className="post-card" onClick={handleCardClick}>
          {/* 관리자 로그인 시 카드 위에 둥근 수정 및 삭제 버튼 노출 */}
          {isAdmin && (
            <>
              <button 
                className="card-edit-btn" 
                onClick={handleEdit} 
                title="포스트 수정" 
                aria-label="포스트 수정"
              >
                <Edit3 size={16} />
              </button>
              <button 
                className="card-delete-btn" 
                onClick={handleDelete} 
                title="포스트 삭제" 
                aria-label="포스트 삭제"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
    
          {/* 카드 디자인용 감성 배경 커버 데코 */}
          <div className="post-cover-warm">
            <div className="post-cover-title-decoration">
              {category}
            </div>
            {isLocked && (
              <div className="card-lock-badge">
                <Lock size={12} />
                <span>멤버십</span>
              </div>
            )}
          </div>
    
          <div className="post-info">
            <div className="post-meta-row">
              <span className="post-category-tag">{category}</span>
              <span className="meta-dot">•</span>
              <span className="post-date">{formatDate(createdAt)}</span>
            </div>
    
            <h3 className="post-card-title">{title}</h3>
            
            <p className={`post-card-excerpt ${isLocked ? 'is-locked' : ''}`}>
              {isLocked 
                ? '이 글은 멤버십 전용 지혜입니다. 간단히 로그인 후 멘토의 경험과 지혜가 담긴 따뜻한 조언 전체를 만나보세요.' 
                : getExcerpt(content)}
            </p>

        {tags && tags.length > 0 && (
          <div className="post-card-tags">
            {tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="tag-badge"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTagClick) onTagClick(tag);
                }}
                style={{ cursor: 'pointer' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
