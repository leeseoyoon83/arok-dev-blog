import React, { useState } from 'react';
import { X, Search, Plus, Edit3, Trash2, LayoutDashboard, BookOpen, BookMarked, History } from 'lucide-react';

export default function CMSDashboardModal({ 
  posts, 
  onClose, 
  onEditClick, 
  onDeleteClick, 
  onNewPostClick 
}) {
  const [cmsSearchQuery, setCmsSearchQuery] = useState('');
  const [cmsCategoryFilter, setCmsCategoryFilter] = useState('all');

  // 통계 계산
  const totalPosts = posts.length;
  const wisdomCount = posts.filter(p => p.category === '멘토의 지혜').length;
  const bookstoreCount = posts.filter(p => p.category === '멘토의 책방').length;
  const diaryCount = posts.filter(p => p.category === '성장일기').length;

  // 테이블 행 필터링
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(cmsSearchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(cmsSearchQuery.toLowerCase());
      
    const matchesCategory = 
      cmsCategoryFilter === 'all' || post.category === cmsCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // 날짜 변환 헬퍼
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleEdit = (post) => {
    onEditClick(post);
    onClose(); // 대시보드를 닫고 수정 모달이 보이도록 설정
  };

  const handleDelete = (post) => {
    if (window.confirm(`'${post.title}' 포스트를 정말 삭제하시겠습니까?`)) {
      onDeleteClick(post.id);
    }
  };

  return (
    <div className="dialog-modal-overlay">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="dialog-container cms-dashboard-container">
        
        {/* 대시보드 헤더 */}
        <div className="dialog-header">
          <h3 className="dialog-title">
            <LayoutDashboard size={20} className="logo-icon" />
            콘텐츠 관리 시스템 (CMS)
          </h3>
          <button className="dialog-close-btn" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <div className="dialog-body cms-dashboard-body">
          
          {/* 1. 요약 통계 카드 */}
          <div className="cms-stats-grid">
            <div className="cms-stat-card total">
              <div className="stat-icon-wrapper">
                <LayoutDashboard size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">전체 포스트</span>
                <span className="stat-value">{totalPosts}개</span>
              </div>
            </div>

            <div className="cms-stat-card wisdom">
              <div className="stat-icon-wrapper">
                <BookOpen size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">멘토의 지혜</span>
                <span className="stat-value">{wisdomCount}개</span>
              </div>
            </div>

            <div className="cms-stat-card bookstore">
              <div className="stat-icon-wrapper">
                <BookMarked size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">멘토의 책방</span>
                <span className="stat-value">{bookstoreCount}개</span>
              </div>
            </div>

            <div className="cms-stat-card diary">
              <div className="stat-icon-wrapper">
                <History size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">성장일기</span>
                <span className="stat-value">{diaryCount}개</span>
              </div>
            </div>
          </div>

          {/* 2. 검색 및 필터 컨트롤 바 */}
          <div className="cms-controls-row">
            <div className="cms-filters">
              <div className="cms-search-box">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="포스트 제목 또는 내용 검색..." 
                  value={cmsSearchQuery}
                  onChange={(e) => setCmsSearchQuery(e.target.value)}
                />
                {cmsSearchQuery && (
                  <button className="clear-btn" onClick={() => setCmsSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <select 
                value={cmsCategoryFilter} 
                onChange={(e) => setCmsCategoryFilter(e.target.value)}
                className="cms-select-filter"
              >
                <option value="all">모든 카테고리</option>
                <option value="멘토의 지혜">멘토의 지혜</option>
                <option value="멘토의 책방">멘토의 책방</option>
                <option value="성장일기">성장일기</option>
              </select>
            </div>

            <button onClick={onNewPostClick} className="btn-primary cms-add-btn">
              <Plus size={16} />
              새 글 작성
            </button>
          </div>

          {/* 3. 포스트 데이터 테이블 */}
          <div className="cms-table-container">
            {filteredPosts.length > 0 ? (
              <table className="cms-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th>제목</th>
                    <th style={{ width: '150px' }}>카테고리</th>
                    <th style={{ width: '150px' }}>작성일</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map(post => (
                    <tr key={post.id}>
                      <td className="post-id">#{post.id}</td>
                      <td className="post-title" title={post.title}>
                        {post.title}
                      </td>
                      <td>
                        <span className={`cms-category-badge ${
                          post.category === '멘토의 지혜' ? 'wisdom' :
                          post.category === '멘토의 책방' ? 'bookstore' : 'diary'
                        }`}>
                          {post.category}
                        </span>
                      </td>
                      <td className="post-date">{formatDate(post.createdAt)}</td>
                      <td>
                        <div className="cms-actions-cell">
                          <button 
                            className="cms-action-btn edit" 
                            onClick={() => handleEdit(post)}
                            title="포스트 수정"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            className="cms-action-btn delete" 
                            onClick={() => handleDelete(post)}
                            title="포스트 삭제"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="cms-empty-state">
                <div className="empty-icon">📂</div>
                <h5>조건에 일치하는 포스트가 없습니다.</h5>
                <p>검색어나 카테고리 필터를 변경해 보세요.</p>
              </div>
            )}
          </div>

        </div>

        <div className="dialog-footer cms-dashboard-footer">
          <button type="button" className="btn-outline" onClick={onClose}>
            닫기
          </button>
        </div>

      </div>
    </div>
  );
}
