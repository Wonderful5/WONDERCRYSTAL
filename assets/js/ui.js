/**
 * DAMSAM Food Wurld - UI Interactions & Components
 * 
 * Handles Modals, Drawers, Lightbox, Toasts, and interactive UI behaviors.
 */

import { RESTAURANT_CONFIG, MENU_ITEMS } from './data.js';
import { addToCart, formatNaira, updateQuantity, removeFromCart, calculateSummary, getCart, applyPromoCode, removePromoCode } from './cart.js';

/* -----------------------------------------
   TOAST NOTIFICATION COMPONENT
----------------------------------------- */
export function showToast(message, type = 'success', duration = 3200) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-slide-in`;
  
  const icon = type === 'success' 
    ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>'
    : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  const closeToast = () => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector('.toast-close').addEventListener('click', closeToast);
  setTimeout(closeToast, duration);
}

/* -----------------------------------------
   FOOD DETAIL & CUSTOMIZATION MODAL
----------------------------------------- */
export function openFoodModal(foodId) {
  const item = MENU_ITEMS.find(m => m.id === foodId);
  if (!item) return;

  const modalOverlay = document.getElementById('food-modal-overlay');
  const modalContent = document.getElementById('food-modal-content');
  if (!modalOverlay || !modalContent) return;

  let currentQty = 1;
  const selectedAddOnIds = new Set();

  function renderModal() {
    const selectedAddOns = (item.addOns || []).filter(a => selectedAddOnIds.has(a.id));
    const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = item.price + addOnsTotal;
    const lineTotal = unitPrice * currentQty;

    modalContent.innerHTML = `
      <div class="food-modal-grid">
        <div class="food-modal-media">
          <img src="${item.image}" alt="${item.name}" class="food-modal-image" loading="lazy" />
          <div class="food-modal-tag">${item.tag || item.primaryCategory}</div>
        </div>

        <div class="food-modal-body">
          <button class="modal-close-btn" id="close-food-modal" aria-label="Close modal">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div class="food-modal-header">
            <div class="food-modal-meta">
              <span class="food-badge-category">${item.primaryCategory}</span>
              <span class="food-meta-rating">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#EAB308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ${item.rating} (${item.reviewsCount} reviews)
              </span>
              <span class="food-meta-prep">⏱ ${item.prepTime || '20-25 mins'}</span>
            </div>
            <h2 class="food-modal-title">${item.name}</h2>
            <div class="food-modal-price-bar">
              <span class="food-modal-price">${formatNaira(item.price)}</span>
              ${item.calories ? `<span class="food-modal-calories">${item.calories}</span>` : ''}
            </div>
            <p class="food-modal-desc">${item.description}</p>
          </div>

          <!-- ADD-ONS SECTION -->
          ${item.addOns && item.addOns.length > 0 ? `
            <div class="food-modal-section">
              <h4 class="food-section-title">Customize Your Meal <span class="text-muted">(Optional Add-ons)</span></h4>
              <div class="food-addons-list">
                ${item.addOns.map(addon => `
                  <label class="addon-item-label ${selectedAddOnIds.has(addon.id) ? 'active' : ''}">
                    <input type="checkbox" class="addon-checkbox" data-addon-id="${addon.id}" ${selectedAddOnIds.has(addon.id) ? 'checked' : ''} />
                    <span class="addon-name">${addon.name}</span>
                    <span class="addon-price">+${formatNaira(addon.price)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- SPECIAL INSTRUCTIONS -->
          <div class="food-modal-section">
            <label for="special-instructions" class="food-section-title">Special Instructions</label>
            <textarea id="special-instructions" class="food-textarea" placeholder="E.g., extra spicy, pack sauce separately, no onions..."></textarea>
          </div>

          <!-- FOOTER: QTY & ADD TO CART -->
          <div class="food-modal-footer">
            <div class="quantity-controller">
              <button class="qty-btn" id="qty-decrease" aria-label="Decrease quantity" ${currentQty <= 1 ? 'disabled' : ''}>-</button>
              <span class="qty-display">${currentQty}</span>
              <button class="qty-btn" id="qty-increase" aria-label="Increase quantity">+</button>
            </div>

            <button class="btn btn-primary btn-modal-cart" id="submit-add-to-cart">
              <span>Add to Cart</span>
              <span class="btn-divider">•</span>
              <span class="btn-price-sum">${formatNaira(lineTotal)}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    modalContent.querySelector('#close-food-modal').addEventListener('click', closeFoodModal);
    
    // Checkbox toggles
    modalContent.querySelectorAll('.addon-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.addonId;
        if (e.target.checked) {
          selectedAddOnIds.add(id);
        } else {
          selectedAddOnIds.delete(id);
        }
        renderModal();
      });
    });

    // Quantity controls
    modalContent.querySelector('#qty-decrease').addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        renderModal();
      }
    });

    modalContent.querySelector('#qty-increase').addEventListener('click', () => {
      if (currentQty < 20) {
        currentQty++;
        renderModal();
      }
    });

    // Add to cart submission
    modalContent.querySelector('#submit-add-to-cart').addEventListener('click', () => {
      const notesEl = modalContent.querySelector('#special-instructions');
      const notes = notesEl ? notesEl.value : '';
      const chosenAddOns = (item.addOns || []).filter(a => selectedAddOnIds.has(a.id));

      addToCart(item, currentQty, chosenAddOns, notes);
      closeFoodModal();
      showToast(`Added ${item.name} (${currentQty}x) to your cart!`, 'success');
      openCartDrawer();
    });
  }

  renderModal();
  modalOverlay.classList.add('active');
  document.body.classList.add('modal-open');
}

export function closeFoodModal() {
  const modalOverlay = document.getElementById('food-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
  document.body.classList.remove('modal-open');
}

/* -----------------------------------------
   CART DRAWER SLIDE PANEL
----------------------------------------- */
export function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    renderCartDrawerContent();
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('drawer-open');
  }
}

export function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }
}

export function renderCartDrawerContent() {
  const container = document.getElementById('cart-drawer-items');
  const footerContainer = document.getElementById('cart-drawer-footer');
  if (!container || !footerContainer) return;

  const items = getCart();
  const summary = calculateSummary('DELIVERY');

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h3 class="empty-state-title">Your cart is empty</h3>
        <p class="empty-state-text">Explore our delicious menu and treat yourself to mouth-watering Nigerian and African specialties.</p>
        <button class="btn btn-primary" id="drawer-explore-menu">Explore Menu</button>
      </div>
    `;

    footerContainer.innerHTML = '';
    
    container.querySelector('#drawer-explore-menu')?.addEventListener('click', () => {
      closeCartDrawer();
      window.location.hash = '#/menu';
    });
    return;
  }

  // Render items
  container.innerHTML = `
    <div class="cart-items-list">
      ${items.map(item => `
        <div class="cart-item-card" data-cart-id="${item.cartItemId}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-details">
            <div class="cart-item-title-row">
              <h4 class="cart-item-name">${item.name}</h4>
              <button class="cart-item-remove-btn" data-cart-id="${item.cartItemId}" title="Remove item" aria-label="Remove item">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>

            ${item.selectedAddOns && item.selectedAddOns.length > 0 ? `
              <div class="cart-item-addons">
                ${item.selectedAddOns.map(a => `<span class="cart-addon-pill">+ ${a.name}</span>`).join('')}
              </div>
            ` : ''}

            ${item.specialNotes ? `
              <p class="cart-item-note">Note: "${item.specialNotes}"</p>
            ` : ''}

            <div class="cart-item-bottom-row">
              <span class="cart-item-price">${formatNaira(item.unitPrice * item.quantity)}</span>
              <div class="cart-qty-ctrl">
                <button class="cart-qty-btn decrease-qty" data-cart-id="${item.cartItemId}" aria-label="Decrease quantity">-</button>
                <span class="cart-qty-num">${item.quantity}</span>
                <button class="cart-qty-btn increase-qty" data-cart-id="${item.cartItemId}" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Render footer
  footerContainer.innerHTML = `
    <div class="drawer-summary-box">
      <!-- Promo Box -->
      <div class="drawer-promo-box">
        ${summary.promo ? `
          <div class="applied-promo">
            <span>Coupon <strong>${summary.promo.code}</strong> (${summary.promo.label})</span>
            <button class="btn-remove-promo" id="remove-promo-btn" title="Remove promo">&times;</button>
          </div>
        ` : `
          <div class="promo-input-row">
            <input type="text" id="drawer-promo-input" placeholder="Promo code (e.g. WELCOME10)" class="promo-input" />
            <button class="btn btn-secondary btn-sm" id="drawer-apply-promo">Apply</button>
          </div>
        `}
      </div>

      <div class="summary-line">
        <span class="summary-label">Subtotal</span>
        <span class="summary-value">${formatNaira(summary.subtotal)}</span>
      </div>

      ${summary.discount > 0 ? `
        <div class="summary-line discount-line">
          <span class="summary-label">Discount</span>
          <span class="summary-value">-${formatNaira(summary.discount)}</span>
        </div>
      ` : ''}

      <div class="summary-line">
        <span class="summary-label">Estimated Delivery</span>
        <span class="summary-value">${summary.isFreeDelivery ? '<span class="text-success font-semibold">FREE</span>' : formatNaira(summary.deliveryFee)}</span>
      </div>

      <div class="summary-line total-line">
        <span class="summary-label">Grand Total</span>
        <span class="summary-value highlight-red">${formatNaira(summary.grandTotal)}</span>
      </div>

      <div class="drawer-action-buttons">
        <button class="btn btn-primary btn-block btn-lg" id="drawer-checkout-btn">
          <span>Proceed to Checkout</span>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <button class="btn btn-outline btn-block" id="drawer-continue-shopping">Continue Shopping</button>
      </div>
    </div>
  `;

  // Attach event handlers
  container.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cartId;
      const itm = items.find(i => i.cartItemId === id);
      if (itm) updateQuantity(id, itm.quantity - 1);
    });
  });

  container.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cartId;
      const itm = items.find(i => i.cartItemId === id);
      if (itm) updateQuantity(id, itm.quantity + 1);
    });
  });

  container.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cartId;
      removeFromCart(id);
      showToast('Item removed from cart', 'info');
    });
  });

  footerContainer.querySelector('#drawer-checkout-btn')?.addEventListener('click', () => {
    closeCartDrawer();
    window.location.hash = '#/checkout';
  });

  footerContainer.querySelector('#drawer-continue-shopping')?.addEventListener('click', () => {
    closeCartDrawer();
  });

  footerContainer.querySelector('#drawer-apply-promo')?.addEventListener('click', () => {
    const input = footerContainer.querySelector('#drawer-promo-input');
    if (!input) return;
    const res = applyPromoCode(input.value);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  });

  footerContainer.querySelector('#remove-promo-btn')?.addEventListener('click', () => {
    removePromoCode();
    showToast('Promo code removed', 'info');
  });
}

/* -----------------------------------------
   IMAGE LIGHTBOX MODAL
----------------------------------------- */
let currentLightboxIndex = 0;
let currentLightboxImages = [];

export function openLightbox(images, startIndex = 0) {
  currentLightboxImages = images;
  currentLightboxIndex = startIndex;

  let overlay = document.getElementById('lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-container">
        <button class="lightbox-close-btn" id="lightbox-close" aria-label="Close image viewer">&times;</button>
        <button class="lightbox-nav-btn prev" id="lightbox-prev" aria-label="Previous image">&#10094;</button>
        <div class="lightbox-media-wrapper">
          <img src="" alt="" class="lightbox-image" id="lightbox-img" />
          <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
        <button class="lightbox-nav-btn next" id="lightbox-next" aria-label="Next image">&#10095;</button>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#lightbox-close').addEventListener('click', closeLightbox);
    overlay.querySelector('#lightbox-prev').addEventListener('click', prevLightbox);
    overlay.querySelector('#lightbox-next').addEventListener('click', nextLightbox);
    
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });
  }

  updateLightboxContent();
  overlay.classList.add('active');
  document.body.classList.add('modal-open');
}

function updateLightboxContent() {
  const imgEl = document.getElementById('lightbox-img');
  const capEl = document.getElementById('lightbox-caption');
  if (!imgEl || !capEl || currentLightboxImages.length === 0) return;

  const current = currentLightboxImages[currentLightboxIndex];
  imgEl.src = current.image;
  imgEl.alt = current.title || 'Food & Dining Gallery';
  capEl.innerHTML = `
    <strong>${current.title || ''}</strong>
    <p>${current.caption || ''}</p>
    <span class="lightbox-counter">${currentLightboxIndex + 1} / ${currentLightboxImages.length}</span>
  `;
}

export function closeLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.classList.remove('modal-open');
}

export function nextLightbox() {
  if (currentLightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
  updateLightboxContent();
}

export function prevLightbox() {
  if (currentLightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightboxContent();
}

/* -----------------------------------------
   LEAVE A REVIEW MODAL
----------------------------------------- */
export function openReviewModal(onSubmitSuccess) {
  let modal = document.getElementById('review-modal-overlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'review-modal-overlay';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card review-modal-card">
        <button class="modal-close-btn" id="close-review-modal" aria-label="Close modal">&times;</button>
        <div class="modal-header">
          <span class="badge-accent">FEEDBACK</span>
          <h3 class="modal-title">Leave a Customer Review</h3>
          <p class="modal-subtitle">Share your dining or delivery experience at DAMSAM Food Wurld.</p>
        </div>

        <form id="review-form" class="review-form">
          <div class="form-group">
            <label class="form-label">Your Rating</label>
            <div class="star-rating-select" id="star-rating-select">
              ${[1, 2, 3, 4, 5].map(star => `
                <button type="button" class="star-rating-btn active" data-rating="${star}" aria-label="${star} stars">★</button>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label for="review-name" class="form-label">Your Name</label>
            <input type="text" id="review-name" class="form-input" placeholder="E.g. Chioma O." required />
          </div>

          <div class="form-group">
            <label for="review-comment" class="form-label">Your Review</label>
            <textarea id="review-comment" class="form-textarea" rows="4" placeholder="Tell us what you enjoyed most about our food and service..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-block">Submit Review</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#close-review-modal').addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });

    let selectedRating = 5;
    const starBtns = modal.querySelectorAll('.star-rating-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        selectedRating = parseInt(btn.dataset.rating, 10);
        starBtns.forEach(b => {
          const r = parseInt(b.dataset.rating, 10);
          b.classList.toggle('active', r <= selectedRating);
        });
      });
    });

    modal.querySelector('#review-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modal.querySelector('#review-name').value.trim();
      const comment = modal.querySelector('#review-comment').value.trim();
      if (!name || !comment) return;

      const newReview = {
        id: `rev-${Date.now()}`,
        name,
        rating: selectedRating,
        date: "Just now",
        comment,
        verified: true
      };

      if (onSubmitSuccess) onSubmitSuccess(newReview);

      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
      showToast("Thank you! Your review has been submitted.", "success");
      modal.querySelector('#review-form').reset();
    });
  }

  modal.classList.add('active');
  document.body.classList.add('modal-open');
}
