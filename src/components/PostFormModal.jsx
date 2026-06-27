import React, { useState } from 'react';
import { X, PenTool } from 'lucide-react';

export default function PostFormModal({ onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('멘토의 지혜');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    // 쉼표로 분리하여 태그 배열 생성
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // 단순 개행(\n\n)을 웹 표준 문단(<p>) 태그 구조로 변환
    let processedContent = content;
    if (!content.includes('<p>') && !content.includes('<h2>')) {
      processedContent = content
        .split('\n\n')
        .map(paragraph => {
          if (!paragraph.trim()) return '';
          return `<p>${paragraph.trim().replace(/\n/g, '<br />')}</p>`;
        })
        .filter(Boolean)
        .join('');
    }

    onSubmit({
      title,
      category,
      tags,
      content: processedContent
    });
  };

  return (
    <div className="dialog-modal-overlay">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="dialog-container">
        
        <div className="dialog-header">
          <h3 className="dialog-title">
            <PenTool size={20} className="logo-icon" />
            새로운 지혜 나누기
          </h3>
          <button className="dialog-close-btn" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-group">
              <label htmlFor="post-title">제목</label>
              <input
                type="text"
                id="post-title"
                className="form-control"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="post-category">카테고리</label>
              <select
                id="post-category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="멘토의 지혜">멘토의 지혜</option>
                <option value="멘토의 책방">멘토의 책방</option>
                <option value="성장일기">성장일기</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="post-tags">태그 (쉼표로 구분)</label>
              <input
                type="text"
                id="post-tags"
                className="form-control"
                placeholder="예: 성장, 자기계발, 회고"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="post-content">내용</label>
              <textarea
                id="post-content"
                className="form-control"
                placeholder="독자들에게 전할 이야기를 작성하세요. 줄바꿈 두 번으로 문단을 나눌 수 있습니다. (HTML 태그도 지원)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <div className="dialog-footer">
            <button type="button" className="btn-outline" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-primary">
              발행하기
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
