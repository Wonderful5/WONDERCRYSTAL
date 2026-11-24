/**
 * WONDER GRAND — CORE JAVASCRIPT & INTERACTIONS
 * Osun State, Nigeria
 * Handles navigation, product catalog filters, search, forms, and UI states
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initProductCatalog();
  initSearchOverlay();
  initContactForm();
  initNewsletterForm();
  initConsultationTriggers();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header-main');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger once on load
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('closeMobileNavBtn');
  const backdrop = document.getElementById('drawerBackdrop');

  if (!toggleBtn || !mobileNav) return;

  const openMenu = () => {
    mobileNav.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('drawer-open');
  };

  const closeMenu = () => {
    mobileNav.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   3. PRODUCT CATALOG RENDERING & FILTERING
   ========================================================================== */
function initProductCatalog() {
  const catalogGrid = document.getElementById('productCatalogGrid');
  if (!catalogGrid) return; // Not on home or shop page

  let currentCategory = 'all';

  // Render Category Tabs if container exists
  const tabsContainer = document.getElementById('categoryFilterTabs');
  if (tabsContainer && typeof FURNITURE_CATEGORIES !== 'undefined') {
    tabsContainer.innerHTML = FURNITURE_CATEGORIES.map(cat => `
      <button class="filter-tab-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
        ${cat.name} (${cat.count})
      </button>
    `).join('');

    tabsContainer.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderProducts(currentCategory);
      });
    });
  }

  function renderProducts(category = 'all') {
    let items = FURNITURE_PRODUCTS;
    if (category !== 'all') {
      items = items.filter(p => p.category === category);
    }

    if (items.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">No items found in this collection</h3>
          <p style="color: var(--text-muted);">Please select another category or contact our bespoke atelier.</p>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = items.map(p => {
      const isFav = window.wonderGrandShop ? window.wonderGrandShop.isInWishlist(p.id) : false;
      return `
        <div class="product-card" data-category="${p.category}">
          <div class="product-img-wrapper">
            <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
            <span class="product-badge">${p.badge}</span>
            <button class="btn-wishlist-toggle ${isFav ? 'active' : ''}" data-product-id="${p.id}" aria-label="Add to wishlist" onclick="window.wonderGrandShop.toggleWishlist('${p.id}')">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="${isFav ? 'var(--color-walnut)' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div class="product-quick-view-overlay">
              <button class="btn btn-sm btn-sand" onclick="window.wonderGrandShop.openQuickView('${p.id}')">
                Quick View
              </button>
            </div>
          </div>
          <div class="product-content">
            <span class="product-category-tag">${p.categoryLabel}</span>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-short-desc">${p.shortDesc}</p>
            <div class="product-footer">
              <span class="product-price">${formatNaira(p.price)}</span>
              <button class="btn btn-sm btn-espresso btn-add-to-cart" onclick="window.wonderGrandShop.addToCart('${p.id}', 1)">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Initial render
  renderProducts('all');
}

/* ==========================================================================
   4. SEARCH OVERLAY & LIVE SEARCH
   ========================================================================== */
function initSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('searchResultsList');
  const closeBtn = document.getElementById('closeSearchBtn');
  const openButtons = document.querySelectorAll('.open-search-btn');

  if (!overlay || !input) return;

  const openSearch = () => {
    overlay.classList.add('active');
    document.body.classList.add('modal-open');
    setTimeout(() => input.focus(), 200);
  };

  const closeSearch = () => {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    input.value = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
  };

  openButtons.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!resultsContainer) return;

    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }

    const matches = FURNITURE_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.categoryLabel.toLowerCase().includes(query) ||
      p.shortDesc.toLowerCase().includes(query) ||
      p.materials.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="color: var(--text-light-muted); padding: 1.5rem 0; font-size: 1.1rem;">
          No bespoke pieces match "${query}".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="window.wonderGrandShop.openQuickView('${p.id}'); document.getElementById('searchOverlay').classList.remove('active'); document.body.classList.remove('modal-open');">
        <img src="${p.image}" alt="${p.name}" style="width: 58px; height: 58px; object-fit: cover; border-radius: var(--radius-xs);">
        <div style="flex: 1;">
          <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-cream); margin-bottom: 2px;">${p.name}</h4>
          <span style="font-size: 0.78rem; color: var(--color-sand); text-transform: uppercase;">${p.categoryLabel}</span>
        </div>
        <div style="font-weight: 700; color: var(--accent-gold);">${formatNaira(p.price)}</div>
      </div>
    `).join('');
  });

  // Esc key closes search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeSearch();
    }
  });
}

/* ==========================================================================
   5. CONTACT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactFormMain');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = form.querySelector('[name="fullName"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const message = form.querySelector('[name="message"]');

    if (!fullName.value.trim()) {
      alert('Please enter your full name.');
      fullName.focus();
      return;
    }

    if (!email.value.trim() || !email.value.includes('@')) {
      alert('Please enter a valid email address.');
      email.focus();
      return;
    }

    if (!message.value.trim()) {
      alert('Please write your message or enquiry.');
      message.focus();
      return;
    }

    const successBox = document.getElementById('contactFormSuccess');
    if (successBox) {
      successBox.style.display = 'block';
      form.style.display = 'none';
    } else {
      alert(`Thank you, ${fullName.value}. Your enquiry has been received. Our Osun State showroom concierge will be in touch shortly.`);
      form.reset();
    }
  });
}

/* ==========================================================================
   6. NEWSLETTER SUBSCRIPTION
   ========================================================================== */
function initNewsletterForm() {
  document.querySelectorAll('.footer-newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        alert(`Thank you for subscribing to Wonder Grand Gazette. Architectural collections and private invites will be sent to ${input.value}.`);
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   7. CONSULTATION TRIGGERS
   ========================================================================== */
function initConsultationTriggers() {
  document.querySelectorAll('.trigger-consultation-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'Bespoke Furniture Commission';
      if (window.wonderGrandShop) {
        window.wonderGrandShop.openConsultationModal(service);
      }
    });
  });
}
