import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

export default function LoginModal({ onLogin, onClose }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
      onClose();
    } else {
      alert('비밀번호가 올바르지 않습니다. (힌트: admin123)');
    }
  };

  return (
    <div className="dialog-modal-overlay">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="dialog-container">
        
        <div className="dialog-header">
          <h3 className="dialog-title">
            <Lock size={20} className="logo-icon" />
            관리자 인증
          </h3>
          <button className="dialog-close-btn" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-group">
              <label htmlFor="admin-password">관리자 비밀번호</label>
              <input
                type="password"
                id="admin-password"
                className="form-control"
                placeholder="비밀번호를 입력하세요 (힌트: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '-8px' }}>
              * 글 등록 및 삭제 기능을 테스트하려면 관리자 계정으로 로그인해 주세요.
            </p>
          </div>

          <div className="dialog-footer">
            <button type="button" className="btn-outline" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-primary">
              로그인
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
