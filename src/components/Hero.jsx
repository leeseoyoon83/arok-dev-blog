import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-card">
        <div className="hero-background-glow"></div>
        <div className="hero-profile-area">
          <div className="profile-avatar-wrapper">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Kim" alt="Mentor Avatar" className="profile-avatar" />
            <span className="avatar-badge">Mentor</span>
          </div>
          <div className="profile-info">
            <span className="profile-role">성장을 돕는 페이스메이커</span>
            <h1 className="profile-name">Mentor 이서윤</h1>
            <p className="profile-description">
              "한 번에 백 걸음을 걷는 것보다, 매일 한 걸음씩 나아가는 성장을 신뢰합니다."<br />
              이곳은 삶의 지혜를 나누고, 서재 속 문장들을 함께 읽어가며, 하루의 성장을 고스란히 기록해 나가는 공간입니다.
            </p>
            <div className="profile-tags">
              <span className="tag-badge">#멘토의지혜</span>
              <span className="tag-badge">#멘토의책방</span>
              <span className="tag-badge">#성장일기</span>
              <span className="tag-badge">#자기계발</span>
            </div>
            
            <div className="profile-socials">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin />
              </a>
              <a href="mailto:mentor@example.com" aria-label="Email">
                <Mail />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
