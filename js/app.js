/**
 * Mentor's Space - Application Logic
 * 멘토의 공간 - 애플리케이션 프론트엔드 로직
 */

document.addEventListener("DOMContentLoaded", () => {
  // Global State
  let currentCategory = "all";
  let searchQuery = "";
  let activePosts = [...window.blogPosts]; // From posts.js

  // DOM Elements
  const themeToggleBtn = document.getElementById("theme-toggle");
  const searchInput = document.getElementById("search-input");
  const searchClearBtn = document.getElementById("search-clear-btn");
  const searchBox = document.querySelector(".search-box");
  const categoryBtns = document.querySelectorAll(".category-btn");
  const featuredContainer = document.getElementById("featured-post-container");
  const postsGrid = document.getElementById("posts-grid");
  const postsCountBadge = document.getElementById("posts-count-badge");
  const noResultsView = document.getElementById("no-results");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");
  
  // Modal Elements
  const modal = document.getElementById("article-reader-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalShareBtn = document.getElementById("modal-share-btn");
  const modalScrollIndicator = document.getElementById("global-scroll-indicator");
  const modalArticleContainer = document.querySelector(".modal-article");
  
  const modalCategory = document.getElementById("article-modal-category");
  const modalDate = document.getElementById("article-modal-date");
  const modalReadtime = document.getElementById("article-modal-readtime");
  const modalTitle = document.getElementById("article-modal-title");
  const modalAvatar = document.getElementById("article-modal-avatar");
  const modalAuthorName = document.getElementById("article-modal-author-name");
  const modalAuthorRole = document.getElementById("article-modal-author-role");
  const modalCover = document.getElementById("article-modal-cover");
  const modalBody = document.getElementById("article-modal-body");
  const modalTags = document.getElementById("article-modal-tags");
  const shareToast = document.getElementById("share-toast");

  /* ==========================================
     1. THEME MANAGEMENT (다크/라이트 모드)
     ========================================== */
  const initTheme = () => {
    const savedTheme = localStorage.getItem("mentor-blog-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
    // Refresh icons
    lucide.createIcons();
  };

  const toggleTheme = () => {
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("mentor-blog-theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("mentor-blog-theme", "light");
    }
  };

  themeToggleBtn.addEventListener("click", toggleTheme);

  /* ==========================================
     2. RENDER POSTS (포스트 렌더링)
     ========================================== */
  const renderPosts = () => {
    // Filter posts by category and search query
    const filtered = window.blogPosts.filter(post => {
      const matchesCategory = currentCategory === "all" || post.category === currentCategory;
      
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = !normalizedQuery || 
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.content.toLowerCase().includes(normalizedQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
        
      return matchesCategory && matchesSearch;
    });

    postsCountBadge.textContent = `전체 ${filtered.length}개`;

    // Handle empty state
    if (filtered.length === 0) {
      featuredContainer.classList.add("hidden");
      postsGrid.classList.add("hidden");
      noResultsView.classList.remove("hidden");
      return;
    } else {
      noResultsView.classList.add("hidden");
      postsGrid.classList.remove("hidden");
    }

    // Set Featured Post (Newest post in search, or first matching element)
    // We treat the first item as the featured post if we are showing 'all' and no search query.
    // If there is a search or specific category, we can still highlight the first one or just put all in grid.
    let displayGridPosts = [...filtered];
    
    if (currentCategory === "all" && !searchQuery) {
      featuredContainer.classList.remove("hidden");
      const featured = filtered[0];
      displayGridPosts = filtered.slice(1);
      
      featuredContainer.innerHTML = `
        <div class="featured-card" data-post-id="${featured.id}">
          <div class="featured-cover" style="background: ${featured.coverGradient}">
            <div class="cover-overlay-gradient"></div>
            <span class="featured-cover-badge">
              <i data-lucide="sparkles"></i>
              <span>추천 스토리</span>
            </span>
            <span class="cover-title-decoration">${featured.category}</span>
          </div>
          <div class="featured-info">
            <div class="post-meta-row">
              <span class="post-category-tag">${featured.category}</span>
              <span class="meta-dot">•</span>
              <span>${featured.publishedAt}</span>
              <span class="meta-dot">•</span>
              <span>${featured.readTime} 읽기</span>
            </div>
            <h3 class="featured-title">${featured.title}</h3>
            <p class="featured-excerpt">${featured.excerpt}</p>
            <div class="featured-footer">
              <div class="post-author">
                <img src="${featured.author.avatar}" alt="${featured.author.name}" class="post-author-avatar">
                <span class="post-author-name">${featured.author.name}</span>
              </div>
              <span class="read-more-arrow">
                <span>자세히 보기</span>
                <i data-lucide="arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      `;
      
      // Feature click event
      featuredContainer.querySelector(".featured-card").addEventListener("click", () => {
        openArticleModal(featured);
      });
    } else {
      featuredContainer.classList.add("hidden");
    }

    // Render Grid Posts
    postsGrid.innerHTML = displayGridPosts.map(post => `
      <article class="post-card" data-post-id="${post.id}">
        <div class="post-cover" style="background: ${post.coverGradient}">
          <div class="cover-overlay-gradient"></div>
          <span class="card-title-decoration">${post.category}</span>
        </div>
        <div class="post-info">
          <div class="post-meta-row">
            <span class="post-category-tag">${post.category}</span>
            <span class="meta-dot">•</span>
            <span>${post.publishedAt}</span>
          </div>
          <h4 class="post-card-title">${post.title}</h4>
          <p class="post-card-excerpt">${post.excerpt}</p>
          <div class="post-card-footer">
            <div class="post-author">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="post-author-avatar">
              <span class="post-author-name">${post.author.name}</span>
            </div>
            <span class="read-arrow">
              <i data-lucide="arrow-right"></i>
            </span>
          </div>
        </div>
      </article>
    `).join("");

    // Set click handlers for grid cards
    postsGrid.querySelectorAll(".post-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = parseInt(card.getAttribute("data-post-id"), 10);
        const post = window.blogPosts.find(p => p.id === id);
        if (post) openArticleModal(post);
      });
    });

    // Load icons
    lucide.createIcons();
  };

  /* ==========================================
     3. ARTICLE DETAIL MODAL (상세 보기 모달)
     ========================================== */
  const openArticleModal = (post) => {
    // Set content
    modalCategory.textContent = post.category;
    modalDate.textContent = post.publishedAt;
    modalReadtime.textContent = `${post.readTime} 읽기`;
    modalTitle.textContent = post.title;
    modalAvatar.src = post.author.avatar;
    modalAuthorName.textContent = post.author.name;
    modalAuthorRole.textContent = post.author.role;
    modalCover.style.background = post.coverGradient;
    modalBody.innerHTML = post.content;
    
    // Set tags
    modalTags.innerHTML = post.tags.map(tag => `
      <span class="tag-pill">#${tag}</span>
    `).join("");

    // Show modal & body scroll block
    modal.classList.remove("hidden");
    // Trigger transition
    setTimeout(() => {
      modal.classList.add("active");
    }, 10);
    document.body.style.overflow = "hidden";
    
    // Reset scroll & progress indicator
    modalArticleContainer.scrollTop = 0;
    modalScrollIndicator.style.width = "0%";

    // Set share functionality
    modalShareBtn.onclick = () => {
      // Mock copy URL
      const shareUrl = window.location.href + `?post=${post.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        // Show Toast
        shareToast.classList.remove("hidden");
        setTimeout(() => {
          shareToast.classList.add("hidden");
        }, 2500);
      });
    };

    lucide.createIcons();
  };

  const closeArticleModal = () => {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.classList.add("hidden");
      modalScrollIndicator.style.width = "0%";
    }, 400); // match transition duration
    document.body.style.overflow = "";
  };

  // Modal event listeners
  modalCloseBtn.addEventListener("click", closeArticleModal);
  
  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("modal-backdrop")) {
      closeArticleModal();
    }
  });

  // Esc key closure
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeArticleModal();
    }
  });

  // Track scroll inside article container
  modalArticleContainer.addEventListener("scroll", () => {
    const scrollHeight = modalArticleContainer.scrollHeight - modalArticleContainer.clientHeight;
    if (scrollHeight > 0) {
      const scrollPercentage = (modalArticleContainer.scrollTop / scrollHeight) * 100;
      modalScrollIndicator.style.width = `${scrollPercentage}%`;
    } else {
      modalScrollIndicator.style.width = "0%";
    }
  });

  /* ==========================================
     4. FILTERS & SEARCH (카테고리 및 검색 제어)
     ========================================== */
  // Category clicks
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      renderPosts();
    });
  });

  // Search input typing
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    if (searchQuery) {
      searchBox.classList.add("has-text");
    } else {
      searchBox.classList.remove("has-text");
    }
    renderPosts();
  });

  // Clear search query
  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    searchBox.classList.remove("has-text");
    renderPosts();
    searchInput.focus();
  });

  // Reset filter placeholder button
  resetFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    searchBox.classList.remove("has-text");
    currentCategory = "all";
    categoryBtns.forEach(b => b.classList.remove("active"));
    categoryBtns[0].classList.add("active");
    renderPosts();
  });

  // URL Query parameter navigation (if direct linking requested)
  const handleUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    if (postId) {
      const post = window.blogPosts.find(p => p.id === parseInt(postId, 10));
      if (post) {
        openArticleModal(post);
      }
    }
  };

  /* ==========================================
     5. INITIALIZATION
     ========================================== */
  initTheme();
  renderPosts();
  handleUrlParams();
});
