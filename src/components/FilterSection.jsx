import React from 'react';
import { LayoutGrid, BookOpen, Bookmark, PenLine, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '전체보기', icon: LayoutGrid },
  { id: '멘토의 지혜', label: '멘토의 지혜', icon: BookOpen },
  { id: '멘토의 책방', label: '멘토의 책방', icon: Bookmark },
  { id: '성장일기', label: '성장일기', icon: PenLine },
];

export default function FilterSection({
  activeCategory,
  setActiveCategory,
  selectedTag,
  setSelectedTag
}) {
  return (
    <section className="filters-section">
      <div className="filters-container">
        <h2 className="section-title">스토리 탐색</h2>
        <nav className="categories-nav" aria-label="카테고리 필터">
          {CATEGORIES.map(category => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-btn ${isActive ? 'active' : ''}`}
              >
                <Icon className="btn-icon" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </nav>

        {selectedTag && (
          <div className="active-tag-filter" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <span>태그: #{selectedTag}</span>
            <button onClick={() => setSelectedTag(null)} aria-label="태그 필터 해제">
              <X size={14} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
