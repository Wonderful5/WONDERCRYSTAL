/**
 * DAMSAM Food Wurld - Client Router & Page Views
 * 
 * Handles zero-reload navigation, deep linking, and rendering all application views.
 */

import { RESTAURANT_CONFIG, CATEGORIES, MENU_ITEMS, SPECIAL_OFFERS, WHY_CHOOSE_US, GALLERY_ITEMS, INITIAL_REVIEWS } from './data.js';
import { addToCart, formatNaira, calculateSummary, getCart, clearCart, updateQuantity, removeFromCart, applyPromoCode, removePromoCode } from './cart.js';
import { openFoodModal, openLightbox, openReviewModal, showToast } from './ui.js';

// Reactive local state for reviews so user submissions persist during session
let activeReviews = [...INITIAL_REVIEWS];

export function getActiveReviews() {
  return activeReviews;
}

export function addReview(newRev) {
  activeReviews.unshift(newRev);
}

// Global active route
let currentRoute = '#/';

export function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}

function handleRouteChange() {
  const hash = window.location.hash || '#/';
  currentRoute = hash.split('?')[0]; // strip query params for matching
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');

  // Scroll to top on route change
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active navigation state
  updateActiveNavLinks(currentRoute);

  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  switch (currentRoute) {
    case '#/':
    case '#/home':
    case '':
      renderHomePage(appRoot);
      break;
    case '#/menu':
      renderMenuPage(appRoot, params.get('category') || 'ALL', params.get('q') || '');
      break;
    case '#/about':
      renderAboutPage(appRoot);
      break;
    case '#/gallery':
      renderGalleryPage(appRoot);
      break;
    case '#/offers':
      renderOffersPage(appRoot);
      break;
    case '#/reservations':
      renderReservationsPage(appRoot);
      break;
    case '#/contact':
      renderContactPage(appRoot);
      break;
    case '#/cart':
      renderCartPage(appRoot);
      break;
    case '#/checkout':
      renderCheckoutPage(appRoot);
      break;
    case '#/order-confirmation':
      renderConfirmationPage(appRoot, params.get('orderId'));
      break;
    case '#/track-order':
      renderTrackOrderPage(appRoot, params.get('orderId'));
      break;
    case '#/privacy':
      renderPrivacyPage(appRoot);
      break;
    case '#/terms':
      renderTermsPage(appRoot);
      break;
    default:
      renderNotFoundPage(appRoot);
      break;
  }
}

function updateActiveNavLinks(hash) {
  const links = document.querySelectorAll('.nav-link, .mobile-nav-link');
  links.forEach(l => {
    const href = l.getAttribute('href');
    if (href === hash || (hash === '#/' && href === '#/home')) {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });
}

/* =========================================================================
   1. HOMEPAGE VIEW
========================================================================= */
function renderHomePage(container) {
  const featuredDishes = MENU_ITEMS.filter(item => item.featured).slice(0, 6);
  const weekendSpecial = SPECIAL_OFFERS[0];

  container.innerHTML = `
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-badge animate-fade-in">
            <span class="badge-dot"></span>
            ${RESTAURANT_CONFIG.heroBadge}
          </div>
          <h1 class="hero-title animate-fade-in">
            GOOD FOOD.<br />
            <span class="text-accent">GREAT MOMENTS.</span>
          </h1>
          <p class="hero-lead animate-fade-in">
            ${RESTAURANT_CONFIG.heroSubtitle}
          </p>
          <div class="hero-cta-group animate-fade-in">
            <a href="#/menu" class="btn btn-primary btn-lg">
              <span>ORDER NOW</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            <a href="#/reservations" class="btn btn-secondary btn-lg">
              <span>RESERVE A TABLE</span>
            </a>
          </div>
          <div class="hero-highlights">
            <div class="highlight-item">
              <span class="highlight-icon">⏱</span>
              <span><strong>${RESTAURANT_CONFIG.estimatedDeliveryTime}</strong> Fast Delivery</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">🥘</span>
              <span><strong>100%</strong> Fresh Daily Dishes</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">⭐</span>
              <span><strong>4.9 / 5</strong> Quality Rating</span>
            </div>
          </div>
        </div>

        <div class="hero-media animate-fade-in">
          <div class="hero-image-wrapper">
            <img src="assets/images/hero-food.jpg" alt="DAMSAM Food Feast" class="hero-main-img" />
            <div class="hero-floating-card top-card">
              <div class="fc-icon">🔥</div>
              <div class="fc-text">
                <span class="fc-label">Smoky Party Jollof</span>
                <span class="fc-sub">Chef's Signature Recipe</span>
              </div>
            </div>
            <div class="hero-floating-card bottom-card">
              <div class="fc-icon">🍗</div>
              <div class="fc-text">
                <span class="fc-label">Fresh & Flavorful</span>
                <span class="fc-sub">Nigerian & Continental</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK ACTION BAR -->
    <section class="quick-action-bar-section">
      <div class="container">
        <div class="quick-action-bar">
          <a href="#/menu" class="action-bar-item">
            <div class="action-icon-circle red-tint">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            <div class="action-info">
              <span class="action-title">ORDER ONLINE</span>
              <span class="action-subtitle">Browse & customize meals</span>
            </div>
          </a>

          <a href="#/reservations" class="action-bar-item">
            <div class="action-icon-circle red-tint">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div class="action-info">
              <span class="action-title">RESERVE TABLE</span>
              <span class="action-subtitle">Book for dates & groups</span>
            </div>
          </a>

          <a href="#/track-order" class="action-bar-item">
            <div class="action-icon-circle red-tint">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div class="action-info">
              <span class="action-title">FAST DELIVERY</span>
              <span class="action-subtitle">Track your meal live</span>
            </div>
          </a>

          <a href="#/contact" class="action-bar-item">
            <div class="action-icon-circle red-tint">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div class="action-info">
              <span class="action-title">GET DIRECTIONS</span>
              <span class="action-subtitle">Visit our restaurant</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- FEATURED MENU SECTION -->
    <section class="section section-featured">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag">TASTE THE BEST</span>
          <h2 class="section-title">FAVORITES FROM OUR KITCHEN</h2>
          <div class="section-divider-ribbon"></div>
          <p class="section-subtitle">Popular dishes made to satisfy every craving.</p>
        </div>

        <!-- CATEGORY PILLS BAR -->
        <div class="category-pills-wrapper">
          <div class="category-pills-scroller" id="home-category-scroller">
            ${CATEGORIES.slice(0, 8).map((cat, idx) => `
              <a href="#/menu?category=${encodeURIComponent(cat.id)}" class="category-pill ${idx === 0 ? 'active' : ''}">
                ${cat.label}
              </a>
            `).join('')}
            <a href="#/menu" class="category-pill view-all-pill">More Categories →</a>
          </div>
        </div>

        <!-- FOOD CARDS GRID -->
        <div class="food-cards-grid">
          ${featuredDishes.map(dish => renderFoodCard(dish)).join('')}
        </div>

        <div class="text-center mt-5">
          <a href="#/menu" class="btn btn-outline-primary btn-lg">
            <span>VIEW FULL MENU</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- SPECIAL OFFER SECTION -->
    <section class="section section-offer bg-cream">
      <div class="container">
        <div class="offer-card-banner">
          <div class="offer-banner-accent"></div>
          <div class="offer-grid">
            <div class="offer-media">
              <img src="${weekendSpecial.image}" alt="${weekendSpecial.title}" class="offer-img" />
              <div class="offer-badge-ribbon">${weekendSpecial.badge}</div>
            </div>
            <div class="offer-content">
              <span class="offer-validity-tag">⏰ ${weekendSpecial.validity}</span>
              <h2 class="offer-heading">${weekendSpecial.title}</h2>
              <p class="offer-desc">${weekendSpecial.description}</p>
              
              <div class="offer-pricing-row">
                <span class="offer-price-old">${formatNaira(weekendSpecial.regularPrice)}</span>
                <span class="offer-price-current">${formatNaira(weekendSpecial.discountPrice)}</span>
                <span class="offer-save-pill">SAVE ${formatNaira(weekendSpecial.regularPrice - weekendSpecial.discountPrice)}</span>
              </div>

              <div class="offer-actions">
                <button class="btn btn-primary btn-lg" id="btn-claim-special-offer" data-item-id="${weekendSpecial.targetItemId}">
                  <span>ORDER DEAL NOW</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <a href="#/offers" class="btn btn-outline">Explore All Offers</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section class="section section-about">
      <div class="container about-grid">
        <div class="about-media">
          <div class="about-image-composition">
            <img src="assets/images/restaurant-interior.jpg" alt="DAMSAM Dining Ambience" class="about-img-main" />
            <div class="about-stat-overlay">
              <span class="stat-number">100%</span>
              <span class="stat-text">Fresh Local Ingredients & Passion</span>
            </div>
          </div>
        </div>

        <div class="about-content">
          <span class="section-tag">OUR RESTAURANT</span>
          <h2 class="section-title">MORE THAN JUST A MEAL</h2>
          <div class="section-divider-ribbon left"></div>
          <p class="about-paragraph">
            At DAMSAM Food Wurld, we bring together delicious flavors, quality ingredients and a welcoming dining experience. From local favorites to continental dishes, our menu is created for every kind of craving.
          </p>
          <p class="about-paragraph">
            Whether you are joining us for a family gathering, ordering lunch to your office, or dining in our cozy restaurant, our focus is always on fresh preparation, generous portions, and authentic Nigerian hospitality.
          </p>
          <div class="about-actions">
            <a href="#/about" class="btn btn-primary">OUR STORY</a>
            <a href="#/menu" class="btn btn-outline">EXPLORE MENU</a>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="section section-why-us bg-cream">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag">WHY DAMSAM</span>
          <h2 class="section-title">CRAFTED FOR YOUR SATISFACTION</h2>
          <div class="section-divider-ribbon"></div>
          <p class="section-subtitle">What sets our dining and delivery experience apart.</p>
        </div>

        <div class="features-grid">
          ${WHY_CHOOSE_US.map(feat => `
            <div class="feature-card">
              <div class="feature-icon-box">
                ${getFeatureSvg(feat.icon)}
              </div>
              <h3 class="feature-title">${feat.title}</h3>
              <p class="feature-desc">${feat.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CUSTOMER REVIEWS SECTION -->
    <section class="section section-reviews">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag">REAL EXPERIENCES</span>
          <h2 class="section-title">WHAT OUR GUESTS SAY</h2>
          <div class="section-divider-ribbon"></div>
          <p class="section-subtitle">Genuine feedback from diners and food lovers.</p>
        </div>

        <div class="reviews-grid" id="reviews-container">
          ${activeReviews.map(r => renderReviewCard(r)).join('')}
        </div>

        <div class="text-center mt-5">
          <button class="btn btn-outline" id="btn-open-review-modal">
            <span>✍️ Leave a Review</span>
          </button>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION BANNER -->
    <section class="cta-banner-section">
      <div class="container">
        <div class="cta-banner-box">
          <div class="cta-content">
            <h2 class="cta-heading">Craving Delicious Food Right Now?</h2>
            <p class="cta-sub">Order your favorite Nigerian, African and Continental dishes delivered straight to your door or ready for pickup.</p>
          </div>
          <div class="cta-buttons">
            <a href="#/menu" class="btn btn-primary btn-lg">Order Online Now</a>
            <a href="#/reservations" class="btn btn-white btn-lg">Book a Table</a>
          </div>
        </div>
      </div>
    </section>
  `;

  // Attach dynamic event listeners for cards and buttons
  attachFoodCardListeners(container);

  // Claim Special Offer
  container.querySelector('#btn-claim-special-offer')?.addEventListener('click', (e) => {
    const itemId = e.currentTarget.dataset.itemId;
    openFoodModal(itemId);
  });

  // Leave a review button
  container.querySelector('#btn-open-review-modal')?.addEventListener('click', () => {
    openReviewModal((newRev) => {
      addReview(newRev);
      const revContainer = container.querySelector('#reviews-container');
      if (revContainer) {
        revContainer.innerHTML = activeReviews.map(r => renderReviewCard(r)).join('');
      }
    });
  });
}

/* =========================================================================
   2. FULL MENU PAGE VIEW
========================================================================= */
function renderMenuPage(container, initialCategory = 'ALL', searchQuery = '') {
  let selectedCategory = initialCategory;
  let activeSearch = searchQuery;
  let activeSort = 'featured';

  function filterAndSortItems() {
    let filtered = MENU_ITEMS.filter(item => {
      // Category match
      let catMatch = true;
      if (selectedCategory !== 'ALL') {
        catMatch = Array.isArray(item.category) 
          ? item.category.includes(selectedCategory)
          : item.category === selectedCategory;
      }

      // Search match
      let searchMatch = true;
      if (activeSearch.trim()) {
        const q = activeSearch.toLowerCase().trim();
        searchMatch = item.name.toLowerCase().includes(q) || 
                      item.description.toLowerCase().includes(q) ||
                      (item.primaryCategory && item.primaryCategory.toLowerCase().includes(q));
      }

      return catMatch && searchMatch;
    });

    // Sorting
    if (activeSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }

  function renderGrid() {
    const items = filterAndSortItems();
    const gridContainer = container.querySelector('#menu-items-grid');
    const countEl = container.querySelector('#menu-results-count');

    if (countEl) {
      countEl.textContent = `Showing ${items.length} ${items.length === 1 ? 'dish' : 'dishes'}`;
    }

    if (!gridContainer) return;

    if (items.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-menu-state">
          <div class="empty-state-icon">🍽️</div>
          <h3 class="empty-state-title">No dishes found</h3>
          <p class="empty-state-text">We couldn't find anything matching "<strong>${activeSearch}</strong>". Try clearing your search or switching categories.</p>
          <button class="btn btn-primary" id="btn-reset-filters">Reset Filters</button>
        </div>
      `;

      gridContainer.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
        selectedCategory = 'ALL';
        activeSearch = '';
        const searchInput = container.querySelector('#menu-search-input');
        if (searchInput) searchInput.value = '';
        updateCategoryPillsUI();
        renderGrid();
      });
      return;
    }

    gridContainer.innerHTML = items.map(dish => renderFoodCard(dish)).join('');
    attachFoodCardListeners(gridContainer);
  }

  function updateCategoryPillsUI() {
    container.querySelectorAll('.menu-category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === selectedCategory);
    });
  }

  container.innerHTML = `
    <!-- MENU PAGE HEADER -->
    <div class="page-hero-header">
      <div class="container text-center">
        <span class="section-tag">EXPLORE OUR FLAVORS</span>
        <h1 class="page-title">OUR MENU</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">Explore our selection of delicious meals, drinks and treats.</p>
      </div>
    </div>

    <section class="section menu-section">
      <div class="container">
        <!-- SEARCH & CONTROLS TOOLBAR -->
        <div class="menu-toolbar">
          <div class="search-field-box">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="menu-search-input" class="search-input" placeholder="What are you craving? (e.g. Jollof, Chicken, Fish, Pasta...)" value="${activeSearch}" />
            ${activeSearch ? '<button class="clear-search-btn" id="btn-clear-search">&times;</button>' : ''}
          </div>

          <div class="menu-sort-box">
            <label for="menu-sort-select" class="sort-label">Sort By:</label>
            <select id="menu-sort-select" class="sort-select">
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <!-- CATEGORIES HORIZONTAL NAVIGATION -->
        <div class="menu-category-nav-wrapper">
          <div class="menu-category-nav">
            ${CATEGORIES.map(cat => `
              <button class="menu-category-btn ${cat.id === selectedCategory ? 'active' : ''}" data-category="${cat.id}">
                ${cat.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="menu-status-bar">
          <span id="menu-results-count" class="results-count-text">Loading dishes...</span>
          <span class="menu-help-note">💡 Click any item to customize portions and add-ons</span>
        </div>

        <!-- ITEMS GRID -->
        <div class="food-cards-grid" id="menu-items-grid"></div>
      </div>
    </section>
  `;

  // Search input handler with debouncing
  const searchInput = container.querySelector('#menu-search-input');
  searchInput?.addEventListener('input', (e) => {
    activeSearch = e.target.value;
    renderGrid();
  });

  // Category buttons
  container.querySelectorAll('.menu-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.dataset.category;
      updateCategoryPillsUI();
      renderGrid();
    });
  });

  // Sort dropdown
  const sortSelect = container.querySelector('#menu-sort-select');
  sortSelect?.addEventListener('change', (e) => {
    activeSort = e.target.value;
    renderGrid();
  });

  // Initial render
  renderGrid();
}

/* =========================================================================
   3. ABOUT PAGE VIEW
========================================================================= */
function renderAboutPage(container) {
  container.innerHTML = `
    <div class="page-hero-header">
      <div class="container text-center">
        <span class="section-tag">WHO WE ARE</span>
        <h1 class="page-title">ABOUT DAMSAM FOOD WURLD</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">A modern celebration of flavor, freshness, and authentic African hospitality.</p>
      </div>
    </div>

    <!-- OUR STORY -->
    <section class="section section-story">
      <div class="container story-grid">
        <div class="story-media">
          <img src="assets/images/hero-food.jpg" alt="DAMSAM Dining Feast" class="rounded-image shadow-lg" />
        </div>
        <div class="story-text">
          <span class="badge-accent">OUR STORY</span>
          <h2 class="section-title">GOOD FOOD, GREAT MOMENTS</h2>
          <div class="section-divider-ribbon left"></div>
          <p class="paragraph-lead">
            At DAMSAM Food Wurld, we believe that great dining is about more than just food — it is an experience that brings friends, families and colleagues together.
          </p>
          <p class="paragraph-body">
            Founded in Nigeria with a passion for rich culinary traditions, DAMSAM Food Wurld offers a curated variety of authentic Nigerian staples, vibrant African specialties, and beloved continental favorites. From our signature smoky party jollof rice cooked in rich tomato-pepper broth to succulent grilled meats, comforting local soups, and continental pastas, every plate is crafted with genuine care.
          </p>
          <div class="story-features">
            <div class="story-feat-item">
              <span class="check-icon">✓</span>
              <span>Locally sourced fresh ingredients daily</span>
            </div>
            <div class="story-feat-item">
              <span class="check-icon">✓</span>
              <span>Hygienic, modern, state-of-the-art kitchen</span>
            </div>
            <div class="story-feat-item">
              <span class="check-icon">✓</span>
              <span>Fast online ordering and reliable delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- OUR FOOD & PHILOSOPHY -->
    <section class="section bg-cream">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag">OUR VALUES</span>
          <h2 class="section-title">OUR FOOD PHILOSOPHY</h2>
          <div class="section-divider-ribbon"></div>
          <p class="section-subtitle">The four pillars that guide our kitchen every single day.</p>
        </div>

        <div class="philosophy-grid">
          <div class="philosophy-card">
            <div class="philosophy-num">01</div>
            <h3 class="philosophy-title">Authentic Flavors</h3>
            <p class="philosophy-desc">We respect time-honored African cooking methods, from woodsmoke aromas in our jollof to aromatic herbs and yaji spices.</p>
          </div>

          <div class="philosophy-card">
            <div class="philosophy-num">02</div>
            <h3 class="philosophy-title">Uncompromised Freshness</h3>
            <p class="philosophy-desc">Our meats, poultry, seafood, vegetables, and condiments are hand-selected daily to ensure maximum flavor and nutrition.</p>
          </div>

          <div class="philosophy-card">
            <div class="philosophy-num">03</div>
            <h3 class="philosophy-title">Approachable Excellence</h3>
            <p class="philosophy-desc">We offer premium restaurant quality with hearty, satisfying portions at fair, transparent prices for all food lovers.</p>
          </div>

          <div class="philosophy-card">
            <div class="philosophy-num">04</div>
            <h3 class="philosophy-title">Warm Nigerian Hospitality</h3>
            <p class="philosophy-desc">From our dine-in service to our delivery packaging, every customer is greeted like family with warmth and respect.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- WHAT WE OFFER -->
    <section class="section section-kitchen">
      <div class="container kitchen-grid">
        <div class="kitchen-text">
          <span class="badge-accent">DINE WITH US</span>
          <h2 class="section-title">WHAT WE OFFER</h2>
          <div class="section-divider-ribbon left"></div>
          <div class="offer-list">
            <div class="offer-point">
              <h4>🍽️ Dine-in Experience</h4>
              <p>Relax in our stylish, air-conditioned dining room designed for cozy dates, family dinners, and celebratory events.</p>
            </div>
            <div class="offer-point">
              <h4>🛵 Speedy Doorstep Delivery</h4>
              <p>Order online through our platform and enjoy hot, freshly prepared meals delivered across town in sturdy, insulated packaging.</p>
            </div>
            <div class="offer-point">
              <h4>📦 Takeout & Office Catering</h4>
              <p>Quick pickup options and large-order meal bundles tailored for corporate meetings, celebrations, and home gatherings.</p>
            </div>
          </div>
          <div class="mt-4">
            <a href="#/menu" class="btn btn-primary">Browse Full Menu</a>
            <a href="#/reservations" class="btn btn-secondary ml-3">Reserve a Table</a>
          </div>
        </div>

        <div class="kitchen-media">
          <img src="assets/images/chef-cooking.jpg" alt="Chefs at work" class="rounded-image shadow-lg" />
        </div>
      </div>
    </section>
  `;
}

/* =========================================================================
   4. GALLERY PAGE VIEW (With Lightbox)
========================================================================= */
function renderGalleryPage(container) {
  let activeFilter = 'ALL';

  function getFilteredImages() {
    if (activeFilter === 'ALL') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(img => img.category === activeFilter);
  }

  function renderGalleryGrid() {
    const images = getFilteredImages();
    const grid = container.querySelector('#gallery-grid');
    if (!grid) return;

    grid.innerHTML = images.map((item, idx) => `
      <div class="gallery-card" data-idx="${idx}">
        <div class="gallery-image-wrapper">
          <img src="${item.image}" alt="${item.title}" class="gallery-thumb" loading="lazy" />
          <div class="gallery-overlay">
            <span class="gallery-cat-badge">${item.category}</span>
            <h3 class="gallery-title">${item.title}</h3>
            <p class="gallery-caption">${item.caption}</p>
            <span class="gallery-zoom-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              View Photo
            </span>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click for lightbox
    grid.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.dataset.idx, 10);
        openLightbox(images, index);
      });
    });
  }

  container.innerHTML = `
    <div class="page-hero-header">
      <div class="container text-center">
        <span class="section-tag">VISUAL SHOWCASE</span>
        <h1 class="page-title">OUR GALLERY</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">A glimpse of our delicious food, welcoming atmosphere, and vibrant moments.</p>
      </div>
    </div>

    <section class="section gallery-section">
      <div class="container">
        <!-- FILTER TABS -->
        <div class="gallery-tabs">
          <button class="gallery-tab active" data-filter="ALL">All Photos</button>
          <button class="gallery-tab" data-filter="FOOD">Food & Dishes</button>
          <button class="gallery-tab" data-filter="RESTAURANT">Restaurant Dining</button>
          <button class="gallery-tab" data-filter="EVENTS">Kitchen & Moments</button>
        </div>

        <!-- MASONRY GRID -->
        <div class="gallery-grid" id="gallery-grid"></div>
      </div>
    </section>
  `;

  container.querySelectorAll('.gallery-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderGalleryGrid();
    });
  });

  renderGalleryGrid();
}

/* =========================================================================
   5. SPECIAL OFFERS PAGE VIEW
========================================================================= */
function renderOffersPage(container) {
  container.innerHTML = `
    <div class="page-hero-header">
      <div class="container text-center">
        <span class="section-tag">EXCLUSIVE DEALS</span>
        <h1 class="page-title">SPECIAL OFFERS & COMBOS</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">Enjoy our signature meals at special discounted promotional prices.</p>
      </div>
    </div>

    <section class="section offers-section">
      <div class="container">
        <div class="offers-grid">
          ${SPECIAL_OFFERS.map(offer => `
            <div class="offer-card">
              <div class="offer-card-media">
                <img src="${offer.image}" alt="${offer.title}" class="offer-card-img" />
                <span class="offer-pill-badge">${offer.badge}</span>
              </div>
              <div class="offer-card-body">
                <span class="offer-validity">⏰ ${offer.validity}</span>
                <h3 class="offer-card-title">${offer.title}</h3>
                <p class="offer-card-desc">${offer.description}</p>
                <div class="offer-price-block">
                  <span class="old-price">${formatNaira(offer.regularPrice)}</span>
                  <span class="new-price">${formatNaira(offer.discountPrice)}</span>
                </div>
                <button class="btn btn-primary btn-block btn-claim-deal" data-item-id="${offer.targetItemId}">
                  <span>ORDER DEAL NOW</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  container.querySelectorAll('.btn-claim-deal').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.itemId;
      openFoodModal(itemId);
    });
  });
}

/* =========================================================================
   6. TABLE RESERVATION PAGE VIEW
========================================================================= */
function renderReservationsPage(container) {
  container.innerHTML = `
    <div class="page-hero-header">
      <div class="container text-center">
        <span class="section-tag">DINE WITH US</span>
        <h1 class="page-title">RESERVE YOUR TABLE</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">Book your table ahead for romantic dinners, family gatherings, or business meetings.</p>
      </div>
    </div>

    <section class="section reservation-section">
      <div class="container reservation-grid">
        <!-- LEFT: VISUAL AMBIENCE -->
        <div class="reservation-media">
          <div class="reservation-image-card">
            <img src="assets/images/restaurant-interior.jpg" alt="Restaurant Interior" class="res-img" />
            <div class="res-card-overlay">
              <h3>DAMSAM Dining Experience</h3>
              <p>Comfortable seating, ambient lighting, and dedicated host service for your special moments.</p>
              <div class="res-highlights">
                <span>✓ Private VIP Booths</span>
                <span>✓ Group Seating</span>
                <span>✓ Dedicated Hospitality</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: RESERVATION FORM -->
        <div class="reservation-form-container">
          <div class="form-header-box">
            <span class="badge-accent">BOOKING REQUEST</span>
            <h2 class="form-main-heading">Book A Table</h2>
            <p class="text-muted">Fill out the details below and our team will contact you to confirm your reservation.</p>
          </div>

          <form id="table-reservation-form" class="reservation-form">
            <div class="form-row two-col">
              <div class="form-group">
                <label for="res-guests" class="form-label">Number of Guests *</label>
                <select id="res-guests" class="form-select" required>
                  <option value="1">1 Person (Solo Dining)</option>
                  <option value="2" selected>2 Persons (Date / Couple)</option>
                  <option value="3">3 Persons</option>
                  <option value="4">4 Persons (Family / Friends)</option>
                  <option value="5">5 Persons</option>
                  <option value="6">6 Persons</option>
                  <option value="8+">8+ Persons (Group / Party)</option>
                </select>
              </div>

              <div class="form-group">
                <label for="res-seating" class="form-label">Seating Preference</label>
                <select id="res-seating" class="form-select">
                  <option value="Main Dining Hall">Main Dining Hall</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Terrace / Outdoor">Terrace / Outdoor</option>
                  <option value="Quiet Corner">Quiet Corner</option>
                </select>
              </div>
            </div>

            <div class="form-row two-col">
              <div class="form-group">
                <label for="res-date" class="form-label">Date *</label>
                <input type="date" id="res-date" class="form-input" required />
              </div>

              <div class="form-group">
                <label for="res-time" class="form-label">Preferred Time *</label>
                <select id="res-time" class="form-select" required>
                  <option value="12:00 PM">12:00 PM (Lunch)</option>
                  <option value="01:00 PM">01:00 PM (Lunch)</option>
                  <option value="02:00 PM">02:00 PM (Lunch)</option>
                  <option value="05:00 PM">05:00 PM (Early Dinner)</option>
                  <option value="06:30 PM">06:30 PM (Dinner)</option>
                  <option value="07:30 PM" selected>07:30 PM (Dinner)</option>
                  <option value="08:30 PM">08:30 PM (Late Dinner)</option>
                </select>
              </div>
            </div>

            <div class="form-row two-col">
              <div class="form-group">
                <label for="res-name" class="form-label">Full Name *</label>
                <input type="text" id="res-name" class="form-input" placeholder="E.g., Babatunde Adeleke" required />
              </div>

              <div class="form-group">
                <label for="res-phone" class="form-label">Phone Number *</label>
                <input type="tel" id="res-phone" class="form-input" placeholder="+234 XXX XXX XXXX" required />
              </div>
            </div>

            <div class="form-group">
              <label for="res-email" class="form-label">Email Address *</label>
              <input type="email" id="res-email" class="form-input" placeholder="your.name@example.com" required />
            </div>

            <div class="form-group">
              <label for="res-notes" class="form-label">Special Requests / Occasion (Optional)</label>
              <textarea id="res-notes" class="form-textarea" rows="3" placeholder="Birthday celebration, anniversary, high chair needed, dietary preference..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-submit-res">
              <span>CONFIRM RESERVATION</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </form>

          <!-- SUCCESS STATE (Initially Hidden) -->
          <div id="reservation-success-box" class="res-success-box" style="display: none;">
            <div class="success-icon-badge">✓</div>
            <h3 class="success-title">RESERVATION REQUEST RECEIVED</h3>
            <p class="success-desc" id="res-success-message">
              Thank you! We have received your booking request. Our reservations team will review table availability and contact you shortly to confirm.
            </p>
            <div class="res-details-summary" id="res-summary-output"></div>
            <div class="mt-4">
              <a href="#/menu" class="btn btn-primary">Browse Our Menu</a>
              <button class="btn btn-outline ml-2" id="btn-book-another">Book Another</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Set min date to today
  const dateInput = container.querySelector('#res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Handle submission
  const form = container.querySelector('#table-reservation-form');
  const successBox = container.querySelector('#reservation-success-box');
  const summaryOutput = container.querySelector('#res-summary-output');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const guests = container.querySelector('#res-guests').value;
    const seating = container.querySelector('#res-seating').value;
    const date = container.querySelector('#res-date').value;
    const time = container.querySelector('#res-time').value;
    const name = container.querySelector('#res-name').value;
    const phone = container.querySelector('#res-phone').value;
    const email = container.querySelector('#res-email').value;
    const notes = container.querySelector('#res-notes').value;

    const refNum = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

    summaryOutput.innerHTML = `
      <div class="summary-receipt">
        <div class="receipt-row"><span>Booking Ref:</span><strong>${refNum}</strong></div>
        <div class="receipt-row"><span>Guest Name:</span><strong>${name}</strong></div>
        <div class="receipt-row"><span>Party Size:</span><strong>${guests} Person(s)</strong></div>
        <div class="receipt-row"><span>Date & Time:</span><strong>${date} at ${time}</strong></div>
        <div class="receipt-row"><span>Seating:</span><strong>${seating}</strong></div>
        <div class="receipt-row"><span>Contact:</span><strong>${phone}</strong></div>
      </div>
    `;

    form.style.display = 'none';
    successBox.style.display = 'block';
    showToast(`Reservation request #${refNum} submitted!`, 'success');
  });

  container.querySelector('#btn-book-another')?.addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    successBox.style.display = 'none';
  });
}

/* =========================================================================
   7. CONTACT PAGE VIEW
========================================================================= */
function renderContactPage(container) {
  container.innerHTML = `
    <div class="page-hero-header">
      <div class="container text-center">
        <span class="section-tag">GET IN TOUCH</span>
        <h1 class="page-title">CONTACT US</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">We would love to hear from you. Inquiries, catering, or dining reservations.</p>
      </div>
    </div>

    <section class="section contact-section">
      <div class="container">
        <!-- CONTACT INFO CARDS -->
        <div class="contact-cards-grid">
          <div class="contact-card">
            <div class="contact-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h3 class="contact-card-title">Phone</h3>
            <p class="contact-card-detail">${RESTAURANT_CONFIG.phone}</p>
            <span class="contact-card-note">Customer service line</span>
          </div>

          <div class="contact-card">
            <div class="contact-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <h3 class="contact-card-title">WhatsApp</h3>
            <p class="contact-card-detail">${RESTAURANT_CONFIG.whatsapp}</p>
            <span class="contact-card-note">Fast orders & inquiries</span>
          </div>

          <div class="contact-card">
            <div class="contact-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h3 class="contact-card-title">Email</h3>
            <p class="contact-card-detail">${RESTAURANT_CONFIG.email}</p>
            <span class="contact-card-note">General & corporate catering</span>
          </div>

          <div class="contact-card">
            <div class="contact-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 class="contact-card-title">Opening Hours</h3>
            <p class="contact-card-detail">${RESTAURANT_CONFIG.openingHours}</p>
            <span class="contact-card-note">Open 7 Days a week</span>
          </div>
        </div>

        <!-- FORM & MAP ROW -->
        <div class="contact-main-grid mt-5">
          <!-- FORM -->
          <div class="contact-form-box">
            <h2 class="form-title">Send Us A Message</h2>
            <p class="form-subtitle">Have questions or feedback? Leave us a message below.</p>
            
            <form id="contact-form" class="contact-form">
              <div class="form-row two-col">
                <div class="form-group">
                  <label for="contact-name" class="form-label">Full Name *</label>
                  <input type="text" id="contact-name" class="form-input" placeholder="Your name" required />
                </div>
                <div class="form-group">
                  <label for="contact-email" class="form-label">Email Address *</label>
                  <input type="email" id="contact-email" class="form-input" placeholder="your.email@example.com" required />
                </div>
              </div>

              <div class="form-row two-col">
                <div class="form-group">
                  <label for="contact-phone" class="form-label">Phone Number</label>
                  <input type="tel" id="contact-phone" class="form-input" placeholder="+234 XXX XXX XXXX" />
                </div>
                <div class="form-group">
                  <label for="contact-subject" class="form-label">Subject</label>
                  <select id="contact-subject" class="form-select">
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Food Order Status">Food Order Status</option>
                    <option value="Table Reservation">Table Reservation</option>
                    <option value="Event Catering">Event / Party Catering</option>
                    <option value="Feedback / Compliment">Feedback / Compliment</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="contact-msg" class="form-label">Your Message *</label>
                <textarea id="contact-msg" class="form-textarea" rows="4" placeholder="How can we assist you today?" required></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-submit-contact">
                <span>SEND MESSAGE</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>

            <div id="contact-success" class="contact-success-state" style="display:none;">
              <div class="success-icon-badge">✓</div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out to DAMSAM Food Wurld. Our support team will get back to you promptly.</p>
            </div>
          </div>

          <!-- MAP / LOCATION SECTION -->
          <div class="contact-map-box">
            <h2 class="form-title">Our Restaurant Location</h2>
            <p class="form-subtitle">${RESTAURANT_CONFIG.address}</p>

            <div class="map-placeholder-container">
              <div class="map-visual">
                <div class="map-radar-pulse"></div>
                <div class="map-pin">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="#C52227" stroke="#fff" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#fff"></circle></svg>
                </div>
                <div class="map-popup">
                  <strong>${RESTAURANT_CONFIG.restaurantName}</strong>
                  <span>${RESTAURANT_CONFIG.address}</span>
                  <span class="map-open-badge">● Open Now (${RESTAURANT_CONFIG.openingHours})</span>
                </div>
              </div>
            </div>

            <div class="map-action-row mt-3">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-block">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                <span>GET DIRECTIONS ON GOOGLE MAPS</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Contact form submission
  const contactForm = container.querySelector('#contact-form');
  const successBox = container.querySelector('#contact-success');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.style.display = 'none';
    successBox.style.display = 'block';
    showToast("Message sent! We'll reply soon.", "success");
  });
}

/* =========================================================================
   8. DEDICATED CART PAGE VIEW
========================================================================= */
function renderCartPage(container) {
  function renderContent() {
    const items = getCart();
    const summary = calculateSummary('DELIVERY');

    if (items.length === 0) {
      container.innerHTML = `
        <div class="container py-5 text-center">
          <div class="empty-state large-empty-state">
            <div class="empty-state-icon">🛍️</div>
            <h1 class="empty-state-title">Your Cart is Currently Empty</h1>
            <p class="empty-state-text">You haven't added any delicious dishes to your order yet.</p>
            <div class="mt-4">
              <a href="#/menu" class="btn btn-primary btn-lg">EXPLORE OUR MENU</a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="page-hero-header">
        <div class="container text-center">
          <span class="section-tag">YOUR ORDER</span>
          <h1 class="page-title">SHOPPING CART</h1>
          <div class="section-divider-ribbon"></div>
          <p class="page-subtitle">Review your selected meals, add-ons and proceed to checkout.</p>
        </div>
      </div>

      <section class="section cart-page-section">
        <div class="container cart-page-grid">
          <!-- ITEMS LIST -->
          <div class="cart-page-items-col">
            <div class="cart-items-header-bar">
              <span class="cart-count-label">Items (${summary.itemCount})</span>
              <button class="btn-text-danger" id="btn-clear-cart">Clear All Items</button>
            </div>

            <div class="cart-page-list">
              ${items.map(item => `
                <div class="cart-page-item-card" data-cart-id="${item.cartItemId}">
                  <img src="${item.image}" alt="${item.name}" class="cart-page-img" />
                  <div class="cart-page-details">
                    <div class="cart-page-row-top">
                      <h3 class="cart-page-name">${item.name}</h3>
                      <button class="cart-remove-icon-btn remove-btn" data-cart-id="${item.cartItemId}" title="Remove item" aria-label="Remove item">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>

                    ${item.selectedAddOns && item.selectedAddOns.length > 0 ? `
                      <div class="cart-addon-list">
                        ${item.selectedAddOns.map(a => `<span class="cart-addon-tag">+ ${a.name} (${formatNaira(a.price)})</span>`).join('')}
                      </div>
                    ` : ''}

                    ${item.specialNotes ? `
                      <div class="cart-page-note">Note: "${item.specialNotes}"</div>
                    ` : ''}

                    <div class="cart-page-row-bottom">
                      <div class="cart-qty-ctrl">
                        <button class="cart-qty-btn dec-qty" data-cart-id="${item.cartItemId}">-</button>
                        <span class="cart-qty-num">${item.quantity}</span>
                        <button class="cart-qty-btn inc-qty" data-cart-id="${item.cartItemId}">+</button>
                      </div>

                      <div class="cart-page-price">
                        ${formatNaira(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="cart-actions-row">
              <a href="#/menu" class="btn btn-outline">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                <span>CONTINUE SHOPPING</span>
              </a>
            </div>
          </div>

          <!-- SUMMARY & CHECKOUT BOX -->
          <div class="cart-page-summary-col">
            <div class="order-summary-card">
              <h3 class="summary-card-title">Order Summary</h3>

              <!-- Promo Section -->
              <div class="summary-promo-wrap">
                ${summary.promo ? `
                  <div class="applied-promo-tag">
                    <span>Applied: <strong>${summary.promo.code}</strong> (${summary.promo.label})</span>
                    <button class="btn-clear-promo" id="btn-remove-promo">&times;</button>
                  </div>
                ` : `
                  <div class="promo-form-group">
                    <input type="text" id="cart-promo-input" class="promo-input" placeholder="Promo code (e.g. WELCOME10)" />
                    <button class="btn btn-secondary btn-sm" id="btn-apply-promo">Apply</button>
                  </div>
                `}
              </div>

              <div class="summary-breakdown">
                <div class="summary-line">
                  <span>Subtotal</span>
                  <span>${formatNaira(summary.subtotal)}</span>
                </div>
                ${summary.discount > 0 ? `
                  <div class="summary-line discount-line">
                    <span>Discount</span>
                    <span>-${formatNaira(summary.discount)}</span>
                  </div>
                ` : ''}
                <div class="summary-line">
                  <span>Estimated Delivery</span>
                  <span>${summary.isFreeDelivery ? '<span class="text-success font-semibold">FREE</span>' : formatNaira(summary.deliveryFee)}</span>
                </div>
                ${summary.isFreeDelivery ? `
                  <div class="free-delivery-notice">🎉 You unlocked FREE delivery (Orders above ${formatNaira(RESTAURANT_CONFIG.minOrderForFreeDelivery)})</div>
                ` : ''}
                <hr class="summary-hr" />
                <div class="summary-line total-line">
                  <span>Total Amount</span>
                  <span class="total-price">${formatNaira(summary.grandTotal)}</span>
                </div>
              </div>

              <div class="summary-actions">
                <a href="#/checkout" class="btn btn-primary btn-block btn-lg">
                  <span>PROCEED TO CHECKOUT</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
              </div>

              <div class="secure-checkout-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>Safe & Secure Nigerian Payment Options</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Event attachments
    container.querySelectorAll('.dec-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cartId;
        const itm = items.find(i => i.cartItemId === id);
        if (itm) {
          updateQuantity(id, itm.quantity - 1);
          renderContent();
        }
      });
    });

    container.querySelectorAll('.inc-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cartId;
        const itm = items.find(i => i.cartItemId === id);
        if (itm) {
          updateQuantity(id, itm.quantity + 1);
          renderContent();
        }
      });
    });

    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cartId;
        removeFromCart(id);
        showToast('Item removed from cart', 'info');
        renderContent();
      });
    });

    container.querySelector('#btn-clear-cart')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to empty your cart?')) {
        clearCart();
        renderContent();
      }
    });

    container.querySelector('#btn-apply-promo')?.addEventListener('click', () => {
      const code = container.querySelector('#cart-promo-input')?.value;
      const res = applyPromoCode(code);
      if (res.success) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
      renderContent();
    });

    container.querySelector('#btn-remove-promo')?.addEventListener('click', () => {
      removePromoCode();
      showToast('Promo code removed', 'info');
      renderContent();
    });
  }

  renderContent();
}

/* =========================================================================
   9. CHECKOUT PAGE VIEW (Multi-Step Experience)
========================================================================= */
function renderCheckoutPage(container) {
  const items = getCart();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="container py-5 text-center">
        <div class="empty-state large-empty-state">
          <div class="empty-state-icon">🛒</div>
          <h1 class="empty-state-title">Your Cart is Empty</h1>
          <p class="empty-state-text">Please add food items to your cart before proceeding to checkout.</p>
          <div class="mt-4">
            <a href="#/menu" class="btn btn-primary btn-lg">RETURN TO MENU</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  let orderMethod = 'DELIVERY'; // or 'PICKUP'
  let paymentMethod = 'CARD'; // CARD, BANK_TRANSFER, CASH_ON_DELIVERY, ONLINE_OTHER

  function renderCheckout() {
    const summary = calculateSummary(orderMethod);

    container.innerHTML = `
      <div class="page-hero-header">
        <div class="container text-center">
          <span class="section-tag">FINAL STEP</span>
          <h1 class="page-title">CHECKOUT</h1>
          <div class="section-divider-ribbon"></div>
          <p class="page-subtitle">Complete your details to place your fresh meal order.</p>
        </div>
      </div>

      <section class="section checkout-section">
        <div class="container checkout-grid">
          <!-- MAIN FORM -->
          <div class="checkout-form-col">
            <form id="checkout-main-form" class="checkout-steps-form">
              <!-- STEP 1: CUSTOMER INFO -->
              <div class="checkout-step-card">
                <div class="step-badge-header">
                  <span class="step-num">1</span>
                  <h3 class="step-title">Customer Information</h3>
                </div>

                <div class="form-row two-col">
                  <div class="form-group">
                    <label for="cust-name" class="form-label">Full Name *</label>
                    <input type="text" id="cust-name" class="form-input" placeholder="E.g., Oluwaseun Adeleke" required />
                  </div>
                  <div class="form-group">
                    <label for="cust-phone" class="form-label">Phone Number *</label>
                    <input type="tel" id="cust-phone" class="form-input" placeholder="+234 XXX XXX XXXX" required />
                  </div>
                </div>

                <div class="form-group">
                  <label for="cust-email" class="form-label">Email Address *</label>
                  <input type="email" id="cust-email" class="form-input" placeholder="your.email@example.com" required />
                  <span class="form-help-text">Order receipt and live tracking updates will be sent here.</span>
                </div>
              </div>

              <!-- STEP 2: ORDER METHOD -->
              <div class="checkout-step-card">
                <div class="step-badge-header">
                  <span class="step-num">2</span>
                  <h3 class="step-title">Order Method</h3>
                </div>

                <div class="method-selector-tabs">
                  <button type="button" class="method-tab ${orderMethod === 'DELIVERY' ? 'active' : ''}" data-method="DELIVERY">
                    <span class="method-icon">🛵</span>
                    <span class="method-text"><strong>Home / Office Delivery</strong> (Fast & Insulated)</span>
                  </button>
                  <button type="button" class="method-tab ${orderMethod === 'PICKUP' ? 'active' : ''}" data-method="PICKUP">
                    <span class="method-icon">🏬</span>
                    <span class="method-text"><strong>Restaurant Pickup</strong> (Ready in ${RESTAURANT_CONFIG.estimatedPickupTime})</span>
                  </button>
                </div>

                ${orderMethod === 'DELIVERY' ? `
                  <div class="delivery-fields animate-fade-in">
                    <div class="form-row two-col">
                      <div class="form-group">
                        <label for="deliv-city" class="form-label">City / Area *</label>
                        <input type="text" id="deliv-city" class="form-input" placeholder="E.g., Ikeja, Lekki, Victoria Island, Abuja Central" required />
                      </div>
                      <div class="form-group">
                        <label for="deliv-address" class="form-label">Street Address *</label>
                        <input type="text" id="deliv-address" class="form-input" placeholder="House/Flat number, Street name" required />
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="deliv-notes" class="form-label">Delivery Instructions (Optional)</label>
                      <input type="text" id="deliv-notes" class="form-input" placeholder="Nearest landmark, gate code, call when outside..." />
                    </div>
                  </div>
                ` : `
                  <div class="pickup-info-box animate-fade-in">
                    <div class="pickup-address-line">
                      <strong>Pickup Location:</strong> ${RESTAURANT_CONFIG.restaurantName} Hub, ${RESTAURANT_CONFIG.address}
                    </div>
                    <div class="pickup-hours-line">
                      <strong>Kitchen Hours:</strong> ${RESTAURANT_CONFIG.openingHours}
                    </div>
                    <p class="pickup-note">Please present your Order Reference upon arrival at our counter.</p>
                  </div>
                `}
              </div>

              <!-- STEP 3: PAYMENT METHOD -->
              <div class="checkout-step-card">
                <div class="step-badge-header">
                  <span class="step-num">3</span>
                  <h3 class="step-title">Payment Method</h3>
                </div>

                <div class="payment-options-list">
                  <!-- CARD -->
                  <label class="payment-option-card ${paymentMethod === 'CARD' ? 'active' : ''}">
                    <input type="radio" name="pay-method" value="CARD" ${paymentMethod === 'CARD' ? 'checked' : ''} />
                    <div class="pay-option-content">
                      <div class="pay-title-row">
                        <strong>Debit / Credit Card (Paystack / Interswitch)</strong>
                        <span class="card-logos">💳 Visa, Mastercard, Verve</span>
                      </div>
                      <span class="pay-sub">Instant secure payment with 3D Secure verification</span>
                    </div>
                  </label>

                  <!-- BANK TRANSFER -->
                  <label class="payment-option-card ${paymentMethod === 'BANK_TRANSFER' ? 'active' : ''}">
                    <input type="radio" name="pay-method" value="BANK_TRANSFER" ${paymentMethod === 'BANK_TRANSFER' ? 'checked' : ''} />
                    <div class="pay-option-content">
                      <div class="pay-title-row">
                        <strong>Direct Bank Transfer</strong>
                        <span class="badge-tag">Fast Confirmation</span>
                      </div>
                      <span class="pay-sub">Transfer to our official Nigerian restaurant bank account</span>
                    </div>
                  </label>

                  <!-- CASH ON DELIVERY -->
                  <label class="payment-option-card ${paymentMethod === 'CASH_ON_DELIVERY' ? 'active' : ''}">
                    <input type="radio" name="pay-method" value="CASH_ON_DELIVERY" ${paymentMethod === 'CASH_ON_DELIVERY' ? 'checked' : ''} />
                    <div class="pay-option-content">
                      <div class="pay-title-row">
                        <strong>Cash / POS on Delivery</strong>
                      </div>
                      <span class="pay-sub">Pay cash or tap with POS when your rider arrives</span>
                    </div>
                  </label>

                  <!-- OTHER ONLINE -->
                  <label class="payment-option-card ${paymentMethod === 'ONLINE_OTHER' ? 'active' : ''}">
                    <input type="radio" name="pay-method" value="ONLINE_OTHER" ${paymentMethod === 'ONLINE_OTHER' ? 'checked' : ''} />
                    <div class="pay-option-content">
                      <div class="pay-title-row">
                        <strong>Other Available Online Payment</strong>
                      </div>
                      <span class="pay-sub">USSD, Bank QR code or Mobile Wallets</span>
                    </div>
                  </label>
                </div>

                <!-- DYNAMIC PAYMENT DETAILS PANEL -->
                ${paymentMethod === 'BANK_TRANSFER' ? `
                  <div class="bank-transfer-details-box animate-fade-in">
                    <h4 class="bank-title">Bank Transfer Instructions:</h4>
                    <div class="bank-info-line"><span>Bank:</span> <strong>${RESTAURANT_CONFIG.bankDetails.bankName}</strong></div>
                    <div class="bank-info-line"><span>Account Number:</span> <strong>${RESTAURANT_CONFIG.bankDetails.accountNumber}</strong></div>
                    <div class="bank-info-line"><span>Account Name:</span> <strong>${RESTAURANT_CONFIG.bankDetails.accountName}</strong></div>
                    <p class="bank-note">Please use your Phone Number as your transfer narration.</p>
                  </div>
                ` : ''}

                ${paymentMethod === 'CARD' ? `
                  <div class="card-details-box animate-fade-in">
                    <div class="form-group">
                      <label class="form-label">Card Number</label>
                      <input type="text" class="form-input" placeholder="5399 •••• •••• ••••" maxlength="19" value="5399 2381 4829 1048" />
                    </div>
                    <div class="form-row two-col">
                      <div class="form-group">
                        <label class="form-label">Expiry Date</label>
                        <input type="text" class="form-input" placeholder="MM/YY" maxlength="5" value="12/28" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">CVV</label>
                        <input type="password" class="form-input" placeholder="•••" maxlength="3" value="382" />
                      </div>
                    </div>
                    <span class="secure-note">🔒 256-Bit SSL Encrypted Mock Gateway Simulation</span>
                  </div>
                ` : ''}
              </div>

              <!-- PLACE ORDER BUTTON -->
              <div class="checkout-submit-card">
                <button type="submit" class="btn btn-primary btn-block btn-xl" id="btn-place-order">
                  <span>PLACE ORDER (${formatNaira(summary.grandTotal)})</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <p class="order-terms-hint">By placing your order, you agree to DAMSAM Food Wurld's Terms & Conditions.</p>
              </div>
            </form>
          </div>

          <!-- SIDEBAR: ORDER REVIEW -->
          <div class="checkout-review-col">
            <div class="order-review-card">
              <h3 class="review-title">Order Review (${summary.itemCount})</h3>

              <div class="review-items-list">
                ${items.map(item => `
                  <div class="review-item">
                    <img src="${item.image}" alt="${item.name}" class="review-thumb" />
                    <div class="review-meta">
                      <div class="review-name-row">
                        <span class="review-name">${item.name}</span>
                        <span class="review-qty">×${item.quantity}</span>
                      </div>
                      ${item.selectedAddOns && item.selectedAddOns.length > 0 ? `
                        <div class="review-addons">
                          ${item.selectedAddOns.map(a => `+ ${a.name}`).join(', ')}
                        </div>
                      ` : ''}
                      <span class="review-price">${formatNaira(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>

              <hr class="summary-hr" />

              <div class="summary-breakdown">
                <div class="summary-line">
                  <span>Subtotal</span>
                  <span>${formatNaira(summary.subtotal)}</span>
                </div>
                ${summary.discount > 0 ? `
                  <div class="summary-line discount-line">
                    <span>Discount (${summary.promo?.code})</span>
                    <span>-${formatNaira(summary.discount)}</span>
                  </div>
                ` : ''}
                <div class="summary-line">
                  <span>${orderMethod === 'DELIVERY' ? 'Delivery Fee' : 'Store Pickup'}</span>
                  <span>${summary.isFreeDelivery || orderMethod === 'PICKUP' ? '<span class="text-success font-semibold">FREE</span>' : formatNaira(summary.deliveryFee)}</span>
                </div>
                <hr class="summary-hr" />
                <div class="summary-line total-line">
                  <span>Total</span>
                  <span class="total-price">${formatNaira(summary.grandTotal)}</span>
                </div>
              </div>

              <div class="estimated-time-box">
                <span class="time-icon">⏱</span>
                <span>Estimated Time: <strong>${orderMethod === 'DELIVERY' ? RESTAURANT_CONFIG.estimatedDeliveryTime : RESTAURANT_CONFIG.estimatedPickupTime}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Method tab toggle
    container.querySelectorAll('.method-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        orderMethod = tab.dataset.method;
        renderCheckout();
      });
    });

    // Payment radios
    container.querySelectorAll('input[name="pay-method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        paymentMethod = e.target.value;
        renderCheckout();
      });
    });

    // Form submit
    const form = container.querySelector('#checkout-main-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = container.querySelector('#cust-name').value.trim();
      const phone = container.querySelector('#cust-phone').value.trim();
      const email = container.querySelector('#cust-email').value.trim();

      const city = orderMethod === 'DELIVERY' ? container.querySelector('#deliv-city')?.value.trim() : 'Pickup Counter';
      const address = orderMethod === 'DELIVERY' ? container.querySelector('#deliv-address')?.value.trim() : RESTAURANT_CONFIG.address;
      const notes = orderMethod === 'DELIVERY' ? container.querySelector('#deliv-notes')?.value.trim() : '';

      // Generate order record
      const orderId = `DFW-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderRecord = {
        orderId,
        date: new Date().toISOString(),
        customer: { name, phone, email },
        orderMethod,
        deliveryInfo: { city, address, notes },
        paymentMethod,
        items: [...items],
        summary,
        status: 'ORDER_RECEIVED',
        statusSteps: [
          { status: 'ORDER_RECEIVED', label: 'Order Received', time: 'Just now', done: true },
          { status: 'CONFIRMED', label: 'Order Confirmed', time: 'Pending', done: false },
          { status: 'PREPARING', label: 'Preparing in Kitchen', time: 'Pending', done: false },
          { status: 'READY', label: orderMethod === 'DELIVERY' ? 'Ready for Dispatch' : 'Ready for Pickup', time: 'Pending', done: false },
          { status: 'OUT_FOR_DELIVERY', label: orderMethod === 'DELIVERY' ? 'Out for Delivery' : 'Completed', time: 'Pending', done: false },
          { status: 'DELIVERED', label: orderMethod === 'DELIVERY' ? 'Delivered' : 'Picked Up', time: 'Pending', done: false }
        ]
      };

      // Save order in localStorage
      try {
        localStorage.setItem(`order_${orderId}`, JSON.stringify(orderRecord));
        localStorage.setItem('latest_order_id', orderId);
      } catch (err) {
        console.error(err);
      }

      // Clear shopping cart
      clearCart();

      // Show toast and navigate
      showToast('Order placed successfully!', 'success');
      window.location.hash = `#/order-confirmation?orderId=${orderId}`;
    });
  }

  renderCheckout();
}

/* =========================================================================
   10. ORDER CONFIRMATION VIEW
========================================================================= */
function renderConfirmationPage(container, orderId) {
  const activeOrderId = orderId || localStorage.getItem('latest_order_id') || 'DFW-84920';
  let orderData = null;

  try {
    const raw = localStorage.getItem(`order_${activeOrderId}`);
    if (raw) orderData = JSON.parse(raw);
  } catch (e) {}

  if (!orderData) {
    // Default fallback order representation
    orderData = {
      orderId: activeOrderId,
      customer: { name: "Valued Food Lover", phone: "+234 [Customer Phone]", email: "customer@example.com" },
      orderMethod: "DELIVERY",
      deliveryInfo: { address: "Delivery Address", city: "Nigeria", notes: "Leave at door" },
      paymentMethod: "CARD",
      items: [
        { name: "Jollof Rice & Grilled Chicken", quantity: 1, unitPrice: 8500, selectedAddOns: [] }
      ],
      summary: { grandTotal: 10000, subtotal: 8500, deliveryFee: 1500, discount: 0 }
    };
  }

  container.innerHTML = `
    <div class="page-hero-header">
      <div class="container text-center">
        <span class="badge-success">PAYMENT & ORDER SUCCESSFUL</span>
        <h1 class="page-title">ORDER RECEIVED!</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">Thank you for ordering from DAMSAM Food Wurld.</p>
      </div>
    </div>

    <section class="section confirmation-section">
      <div class="container confirmation-wrapper">
        <div class="confirmation-card">
          <div class="confirm-icon-badge">✓</div>
          <h2 class="confirm-head">We Have Received Your Order!</h2>
          <p class="confirm-sub">Our kitchen has received your ticket and is preparing your meal with care.</p>

          <div class="order-ref-pill">
            <span>ORDER NUMBER:</span>
            <strong>#${orderData.orderId}</strong>
          </div>

          <div class="confirm-details-box">
            <div class="confirm-row">
              <span>Customer:</span>
              <strong>${orderData.customer.name} (${orderData.customer.phone})</strong>
            </div>
            <div class="confirm-row">
              <span>Method:</span>
              <strong>${orderData.orderMethod === 'DELIVERY' ? 'Doorstep Delivery' : 'Restaurant Pickup'}</strong>
            </div>
            ${orderData.orderMethod === 'DELIVERY' ? `
              <div class="confirm-row">
                <span>Delivery Address:</span>
                <strong>${orderData.deliveryInfo.address}, ${orderData.deliveryInfo.city}</strong>
              </div>
            ` : ''}
            <div class="confirm-row">
              <span>Payment Mode:</span>
              <strong>${orderData.paymentMethod.replace('_', ' ')}</strong>
            </div>
            <div class="confirm-row">
              <span>Estimated Time:</span>
              <strong>${orderData.orderMethod === 'DELIVERY' ? RESTAURANT_CONFIG.estimatedDeliveryTime : RESTAURANT_CONFIG.estimatedPickupTime}</strong>
            </div>
          </div>

          <!-- SUMMARY RECEIPT -->
          <div class="confirm-items-summary">
            <h4 class="items-head">Order Items</h4>
            ${orderData.items.map(i => `
              <div class="confirm-item-line">
                <span>${i.name} × ${i.quantity}</span>
                <span>${formatNaira(i.unitPrice * i.quantity)}</span>
              </div>
            `).join('')}
            <div class="confirm-item-line total-line">
              <strong>Grand Total</strong>
              <strong class="highlight-red">${formatNaira(orderData.summary.grandTotal)}</strong>
            </div>
          </div>

          <div class="confirm-action-buttons">
            <a href="#/track-order?orderId=${orderData.orderId}" class="btn btn-primary btn-lg">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              <span>TRACK ORDER STATUS</span>
            </a>
            <a href="#/menu" class="btn btn-outline btn-lg">BACK TO MENU</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* =========================================================================
   11. ORDER TRACKING VIEW (Interactive State Machine)
========================================================================= */
function renderTrackOrderPage(container, orderId) {
  const activeOrderId = orderId || localStorage.getItem('latest_order_id') || 'DFW-98421';

  // Stages definition
  const stages = [
    { key: 'RECEIVED', label: 'Order Received', desc: 'We received your order and ticket has been queued.', icon: '📝' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Order confirmed by restaurant management.', icon: '👍' },
    { key: 'PREPARING', label: 'Preparing in Kitchen', desc: 'Chefs are grilling, seasoning and packing your meal fresh.', icon: '🍳' },
    { key: 'READY', label: 'Ready for Dispatch', desc: 'Meal is packed in tamper-proof thermal containers.', icon: '📦' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Rider is on the way to your location.', icon: '🛵' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Meal successfully handed over. Enjoy your food!', icon: '🎉' }
  ];

  let currentStageIndex = 2; // Default to 'Preparing in Kitchen' for realistic view

  function renderTracker() {
    container.innerHTML = `
      <div class="page-hero-header">
        <div class="container text-center">
          <span class="section-tag">LIVE UPDATES</span>
          <h1 class="page-title">ORDER TRACKING</h1>
          <div class="section-divider-ribbon"></div>
          <p class="page-subtitle">Track the preparation and delivery progress of your meal.</p>
        </div>
      </div>

      <section class="section track-order-section">
        <div class="container track-order-container">
          <div class="track-header-card">
            <div class="track-info-left">
              <span class="track-label">Tracking Order</span>
              <h2 class="track-order-id">#${activeOrderId}</h2>
            </div>
            <div class="track-info-right">
              <span class="badge-status-live">● LIVE TRACKING</span>
              <span class="track-eta">Estimated Arrival: <strong>${RESTAURANT_CONFIG.estimatedDeliveryTime}</strong></span>
            </div>
          </div>

          <!-- PROGRESS TIMELINE -->
          <div class="tracking-timeline-card">
            <div class="timeline-steps-wrapper">
              ${stages.map((stg, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isPending = idx > currentStageIndex;

                let stateClass = 'pending';
                if (isCurrent) stateClass = 'current animate-pulse-glow';
                if (isPassed) stateClass = 'completed';

                return `
                  <div class="timeline-step-item ${stateClass}">
                    <div class="step-indicator">
                      ${isPassed ? '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : `<span>${stg.icon}</span>`}
                    </div>
                    <div class="step-content">
                      <h4 class="step-label">${stg.label}</h4>
                      <p class="step-desc">${stg.desc}</p>
                      ${isCurrent ? '<span class="status-badge-current">In Progress</span>' : ''}
                      ${isPassed ? '<span class="status-badge-done">Completed</span>' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- INTERACTIVE SIMULATION CONTROLS FOR TESTING -->
            <div class="simulation-controls-box">
              <span class="sim-title">⚡ Interactive Demo: Test Order Progress</span>
              <div class="sim-btn-row">
                ${stages.map((stg, idx) => `
                  <button class="btn btn-sm ${idx === currentStageIndex ? 'btn-primary' : 'btn-outline'} btn-test-stage" data-idx="${idx}">
                    ${idx + 1}. ${stg.label}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- DISPATCH RIDER CARD -->
          <div class="rider-card">
            <div class="rider-avatar">🛵</div>
            <div class="rider-info">
              <span class="rider-role">Assigned Delivery Rider</span>
              <h4 class="rider-name">Musa I. (DAMSAM Express Dispatch)</h4>
              <p class="rider-sub">Equipped with insulated thermal carrier to keep your meal piping hot.</p>
            </div>
            <div class="rider-actions">
              <a href="tel:${RESTAURANT_CONFIG.phoneRaw}" class="btn btn-outline btn-sm">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Call Help Desk</span>
              </a>
            </div>
          </div>

          <div class="text-center mt-4">
            <a href="#/menu" class="btn btn-secondary">Order More Food</a>
          </div>
        </div>
      </section>
    `;

    // Attach simulation clicks
    container.querySelectorAll('.btn-test-stage').forEach(btn => {
      btn.addEventListener('click', () => {
        currentStageIndex = parseInt(btn.dataset.idx, 10);
        renderTracker();
      });
    });
  }

  renderTracker();
}

/* =========================================================================
   12. PRIVACY POLICY VIEW
========================================================================= */
function renderPrivacyPage(container) {
  container.innerHTML = `
    <div class="page-hero-header">
      <div class="container text-center">
        <h1 class="page-title">PRIVACY POLICY</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">How DAMSAM Food Wurld protects and handles your personal information.</p>
      </div>
    </div>

    <section class="section">
      <div class="container static-content-box">
        <h3>1. Information We Collect</h3>
        <p>When you place an order, make a table reservation, or send an inquiry through DAMSAM Food Wurld, we collect necessary contact information including your full name, phone number, delivery address, and email address.</p>

        <h3>2. How We Use Your Information</h3>
        <p>We use your information strictly for order fulfillment, dispatch communication, reservation confirmations, customer service, and providing transaction receipts.</p>

        <h3>3. Payment Security</h3>
        <p>Payment information is processed through secure, industry-standard encrypted payment gateways. DAMSAM Food Wurld never stores your card CVV numbers or banking passwords on frontend servers.</p>

        <h3>4. Contact Us</h3>
        <p>If you have any questions about this privacy statement, please contact us at <a href="mailto:${RESTAURANT_CONFIG.email}">${RESTAURANT_CONFIG.email}</a>.</p>
      </div>
    </section>
  `;
}

/* =========================================================================
   13. TERMS & CONDITIONS VIEW
========================================================================= */
function renderTermsPage(container) {
  container.innerHTML = `
    <div class="page-hero-header">
      <div class="container text-center">
        <h1 class="page-title">TERMS & CONDITIONS</h1>
        <div class="section-divider-ribbon"></div>
        <p class="page-subtitle">Guidelines for dining, online ordering and reservations at DAMSAM Food Wurld.</p>
      </div>
    </div>

    <section class="section">
      <div class="container static-content-box">
        <h3>1. Food Orders & Availability</h3>
        <p>All dishes displayed on our menu are prepared fresh. While we strive to ensure all menu items and add-ons are available at all times, specific ingredients may occasionally run out due to high demand. In such rare cases, our team will contact you immediately.</p>

        <h3>2. Delivery & Dispatch Times</h3>
        <p>Delivery estimates (${RESTAURANT_CONFIG.estimatedDeliveryTime}) are realistic approximations subject to traffic conditions and distance from our kitchen hub.</p>

        <h3>3. Table Reservations</h3>
        <p>Reservations submitted online are pending requests until confirmed via phone or WhatsApp by our dining team. We hold reserved tables for up to 20 minutes past the scheduled booking time.</p>

        <h3>4. Cancellation & Refunds</h3>
        <p>Because our meals are prepared fresh to order, cancellations should be communicated within 5 minutes of placing your order.</p>
      </div>
    </section>
  `;
}

/* =========================================================================
   14. 404 NOT FOUND VIEW
========================================================================= */
function renderNotFoundPage(container) {
  container.innerHTML = `
    <div class="container py-5 text-center">
      <div class="empty-state large-empty-state">
        <h1 class="not-found-code">404</h1>
        <h2 class="empty-state-title">Page Not Found</h2>
        <p class="empty-state-text">The page you were looking for doesn't exist or has moved.</p>
        <div class="mt-4">
          <a href="#/" class="btn btn-primary btn-lg">RETURN TO HOMEPAGE</a>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================================
   SHARED RENDER HELPERS
========================================================================= */
function renderFoodCard(dish) {
  return `
    <div class="food-card" data-food-id="${dish.id}">
      <div class="food-card-media" data-open-modal="${dish.id}">
        <img src="${dish.image}" alt="${dish.name}" class="food-card-img" loading="lazy" />
        <span class="food-card-tag">${dish.tag || dish.primaryCategory}</span>
        <div class="food-card-overlay-btn">
          <span>Quick View & Customize</span>
        </div>
      </div>

      <div class="food-card-body">
        <div class="food-card-header">
          <div class="food-card-meta">
            <span class="food-cat-pill">${dish.primaryCategory}</span>
            <span class="food-star-rating">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#EAB308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ${dish.rating}
            </span>
          </div>
          <h3 class="food-card-title" data-open-modal="${dish.id}">${dish.name}</h3>
        </div>

        <p class="food-card-desc">${dish.description}</p>

        <div class="food-card-footer">
          <div class="food-card-price">${formatNaira(dish.price)}</div>
          <div class="food-card-actions">
            <button class="btn btn-sm btn-outline btn-customize" data-open-modal="${dish.id}" title="Customize meal">
              Customize
            </button>
            <button class="btn btn-sm btn-primary btn-quick-add" data-quick-add="${dish.id}" title="Quick Add to Cart">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderReviewCard(rev) {
  const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
  return `
    <div class="review-card">
      <div class="review-stars">${stars}</div>
      <p class="review-text">"${rev.comment}"</p>
      <div class="review-author-row">
        <div class="review-avatar">${rev.name.charAt(0)}</div>
        <div class="review-author-info">
          <h4 class="author-name">${rev.name}</h4>
          <span class="review-date">${rev.date} ${rev.verified ? '• <span class="text-success">Verified Diner</span>' : ''}</span>
        </div>
      </div>
    </div>
  `;
}

function attachFoodCardListeners(container) {
  // Modal opening
  container.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const foodId = el.dataset.openModal || el.closest('[data-food-id]')?.dataset.foodId;
      if (foodId) openFoodModal(foodId);
    });
  });

  // Quick add to cart
  container.querySelectorAll('[data-quick-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const foodId = btn.dataset.quickAdd;
      const dish = MENU_ITEMS.find(m => m.id === foodId);
      if (dish) {
        addToCart(dish, 1, [], '');
        showToast(`Added ${dish.name} to cart!`, 'success');
      }
    });
  });
}

function getFeatureSvg(icon) {
  switch (icon) {
    case 'sparkles':
      return `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/></svg>`;
    case 'layers':
      return `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
    case 'shopping-bag':
      return `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`;
    case 'smile':
    default:
      return `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`;
  }
}
