/**
 * WONDER GRAND — SHOPPING CART, WISHLIST & CHECKOUT ENGINE
 * Handles cart state, quantities, wishlist persistence, drawer panels, and checkout simulation
 */

class WonderGrandShop {
  constructor() {
    this.cartKey = 'wonder_grand_cart';
    this.wishlistKey = 'wonder_grand_wishlist';

    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();

    this.initElements();
    this.bindEvents();
    this.renderAll();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(this.cartKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem(this.wishlistKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.wishlistKey, JSON.stringify(this.wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }

  initElements() {
    // Badges
    this.cartCountBadges = document.querySelectorAll('.cart-count-badge');
    this.wishlistCountBadges = document.querySelectorAll('.wishlist-count-badge');

    // Drawers
    this.cartDrawer = document.getElementById('cartDrawer');
    this.wishlistDrawer = document.getElementById('wishlistDrawer');
    this.drawerBackdrop = document.getElementById('drawerBackdrop');

    // Containers inside Drawers
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartSubtotalEl = document.getElementById('cartSubtotalAmount');
    this.cartTotalEl = document.getElementById('cartTotalAmount');
    this.cartDeliveryEl = document.getElementById('cartDeliveryFee');
    this.cartEmptyState = document.getElementById('cartEmptyState');
    this.cartFooter = document.getElementById('cartDrawerFooter');

    this.wishlistItemsList = document.getElementById('wishlistItemsList');
    this.wishlistEmptyState = document.getElementById('wishlistEmptyState');

    // Modals
    this.quickViewModal = document.getElementById('quickViewModal');
    this.checkoutModal = document.getElementById('checkoutModal');
    this.orderSuccessModal = document.getElementById('orderSuccessModal');
    this.enquiryModal = document.getElementById('enquiryModal');
  }

  bindEvents() {
    // Open Cart Drawer
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer('cart');
      });
    });

    // Open Wishlist Drawer
    document.querySelectorAll('.open-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer('wishlist');
      });
    });

    // Close buttons on drawers
    document.querySelectorAll('.close-drawer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeDrawers();
      });
    });

    // Backdrop click
    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', () => {
        this.closeDrawers();
        this.closeModals();
      });
    }

    // Close modal buttons
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModals();
      });
    });

    // Proceed to checkout button in cart drawer
    const checkoutBtn = document.getElementById('proceedToCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.cart.length === 0) {
          this.showToast('Your cart is empty. Explore our furniture collection first.');
          return;
        }
        this.closeDrawers();
        this.openCheckoutModal();
      });
    }

    // Checkout Form Submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processCheckout(new FormData(checkoutForm));
      });
    }

    // Custom Commission / Consultation Form Submission
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
      consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processConsultation(new FormData(consultationForm));
      });
    }
  }

  /* ==========================================================================
     DRAWER & MODAL MANAGEMENT
     ========================================================================== */
  openDrawer(type) {
    if (this.drawerBackdrop) this.drawerBackdrop.classList.add('active');
    document.body.classList.add('drawer-open');

    if (type === 'cart' && this.cartDrawer) {
      if (this.wishlistDrawer) this.wishlistDrawer.classList.remove('active');
      this.cartDrawer.classList.add('active');
      this.renderCart();
    } else if (type === 'wishlist' && this.wishlistDrawer) {
      if (this.cartDrawer) this.cartDrawer.classList.remove('active');
      this.wishlistDrawer.classList.add('active');
      this.renderWishlist();
    }
  }

  closeDrawers() {
    if (this.cartDrawer) this.cartDrawer.classList.remove('active');
    if (this.wishlistDrawer) this.wishlistDrawer.classList.remove('active');
    if (this.drawerBackdrop) this.drawerBackdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }

  closeModals() {
    if (this.quickViewModal) this.quickViewModal.classList.remove('active');
    if (this.checkoutModal) this.checkoutModal.classList.remove('active');
    if (this.orderSuccessModal) this.orderSuccessModal.classList.remove('active');
    if (this.enquiryModal) this.enquiryModal.classList.remove('active');
    if (this.drawerBackdrop) this.drawerBackdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  /* ==========================================================================
     CART OPERATIONS
     ========================================================================== */
  addToCart(productId, quantity = 1, options = {}) {
    const product = FURNITURE_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        category: product.categoryLabel,
        price: product.price,
        image: product.image,
        dimensions: product.dimensions,
        quantity: quantity
      });
    }

    this.saveCart();
    this.renderAll();
    this.showToast(`"${product.name}" added to cart`);
    this.openDrawer('cart');
  }

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(productId, false);
    } else {
      this.saveCart();
      this.renderAll();
    }
  }

  removeFromCart(productId, showNotification = true) {
    const item = this.cart.find(i => i.id === productId);
    this.cart = this.cart.filter(i => i.id !== productId);
    this.saveCart();
    this.renderAll();
    if (showNotification && item) {
      this.showToast(`"${item.name}" removed from cart`);
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.renderAll();
  }

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getDeliveryFee() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= WONDER_GRAND_CONFIG.whiteGloveDeliveryThreshold) {
      return 0; // Free white-glove delivery
    }
    return WONDER_GRAND_CONFIG.baseDeliveryFee;
  }

  getCartTotal() {
    return this.getCartSubtotal() + this.getDeliveryFee();
  }

  /* ==========================================================================
     WISHLIST OPERATIONS
     ========================================================================== */
  toggleWishlist(productId) {
    const product = FURNITURE_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const idx = this.wishlist.findIndex(item => item.id === productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      this.showToast(`"${product.name}" removed from wishlist`);
    } else {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        category: product.categoryLabel,
        price: product.price,
        image: product.image,
        dimensions: product.dimensions
      });
      this.showToast(`"${product.name}" added to wishlist`);
    }

    this.saveWishlist();
    this.renderAll();
    this.updateWishlistButtons();
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }

  moveWishlistToCart(productId) {
    this.addToCart(productId, 1);
    this.toggleWishlist(productId);
  }

  /* ==========================================================================
     RENDERING METHODS
     ========================================================================== */
  renderAll() {
    this.updateBadges();
    this.renderCart();
    this.renderWishlist();
    this.updateWishlistButtons();
  }

  updateBadges() {
    const cartCount = this.cart.reduce((sum, i) => sum + i.quantity, 0);
    this.cartCountBadges.forEach(badge => {
      badge.textContent = cartCount;
      badge.style.display = cartCount > 0 ? 'inline-flex' : 'none';
    });

    const wishlistCount = this.wishlist.length;
    this.wishlistCountBadges.forEach(badge => {
      badge.textContent = wishlistCount;
      badge.style.display = wishlistCount > 0 ? 'inline-flex' : 'none';
    });
  }

  renderCart() {
    if (!this.cartItemsList) return;

    if (this.cart.length === 0) {
      if (this.cartEmptyState) this.cartEmptyState.style.display = 'block';
      this.cartItemsList.innerHTML = '';
      if (this.cartFooter) this.cartFooter.style.display = 'none';
      return;
    }

    if (this.cartEmptyState) this.cartEmptyState.style.display = 'none';
    if (this.cartFooter) this.cartFooter.style.display = 'block';

    let html = '';
    this.cart.forEach(item => {
      html += `
        <div class="cart-item-row" data-id="${item.id}">
          <div class="cart-item-img-wrapper">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          </div>
          <div class="cart-item-info">
            <span class="cart-item-category">${item.category}</span>
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">${formatNaira(item.price)}</div>
            
            <div class="cart-item-bottom">
              <div class="qty-control">
                <button class="qty-btn minus" onclick="window.wonderGrandShop.updateQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn plus" onclick="window.wonderGrandShop.updateQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <button class="cart-item-remove-btn" onclick="window.wonderGrandShop.removeFromCart('${item.id}')" aria-label="Remove item">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    });

    this.cartItemsList.innerHTML = html;

    const subtotal = this.getCartSubtotal();
    const delivery = this.getDeliveryFee();
    const total = this.getCartTotal();

    if (this.cartSubtotalEl) this.cartSubtotalEl.textContent = formatNaira(subtotal);
    if (this.cartDeliveryEl) {
      this.cartDeliveryEl.textContent = delivery === 0 ? "Complimentary White-Glove" : formatNaira(delivery);
    }
    if (this.cartTotalEl) this.cartTotalEl.textContent = formatNaira(total);
  }

  renderWishlist() {
    if (!this.wishlistItemsList) return;

    if (this.wishlist.length === 0) {
      if (this.wishlistEmptyState) this.wishlistEmptyState.style.display = 'block';
      this.wishlistItemsList.innerHTML = '';
      return;
    }

    if (this.wishlistEmptyState) this.wishlistEmptyState.style.display = 'none';

    let html = '';
    this.wishlist.forEach(item => {
      html += `
        <div class="wishlist-item-row">
          <div class="wishlist-item-img-wrapper">
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-img">
          </div>
          <div class="wishlist-item-info">
            <span class="cart-item-category">${item.category}</span>
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">${formatNaira(item.price)}</div>
            
            <div class="wishlist-item-actions">
              <button class="btn btn-sm btn-walnut" onclick="window.wonderGrandShop.moveWishlistToCart('${item.id}')">
                Move to Cart
              </button>
              <button class="cart-item-remove-btn" onclick="window.wonderGrandShop.toggleWishlist('${item.id}')">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    });

    this.wishlistItemsList.innerHTML = html;
  }

  updateWishlistButtons() {
    document.querySelectorAll('.btn-wishlist-toggle').forEach(btn => {
      const pid = btn.getAttribute('data-product-id');
      if (pid) {
        const inWishlist = this.isInWishlist(pid);
        btn.classList.toggle('active', inWishlist);
        btn.setAttribute('aria-label', inWishlist ? 'Remove from wishlist' : 'Add to wishlist');
        const iconSvg = btn.querySelector('svg');
        if (iconSvg) {
          iconSvg.setAttribute('fill', inWishlist ? 'var(--color-walnut)' : 'none');
        }
      }
    });
  }

  /* ==========================================================================
     QUICK VIEW MODAL
     ========================================================================== */
  openQuickView(productId) {
    const product = FURNITURE_PRODUCTS.find(p => p.id === productId);
    if (!product || !this.quickViewModal) return;

    const modalBody = this.quickViewModal.querySelector('.modal-content-inner');
    if (!modalBody) return;

    const isFav = this.isInWishlist(product.id);

    modalBody.innerHTML = `
      <div class="quick-view-grid">
        <div class="quick-view-image-box">
          <img src="${product.image}" alt="${product.name}" class="quick-view-img">
          <span class="product-badge">${product.badge}</span>
        </div>
        <div class="quick-view-details">
          <span class="product-category-tag">${product.categoryLabel}</span>
          <h2 class="quick-view-title">${product.name}</h2>
          <div class="quick-view-price">${formatNaira(product.price)}</div>
          
          <p class="quick-view-desc">${product.description}</p>
          
          <div class="quick-view-specs">
            <div class="spec-row">
              <span class="spec-label">Dimensions:</span>
              <span class="spec-value">${product.dimensions}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Materials:</span>
              <span class="spec-value">${product.materials}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Finish:</span>
              <span class="spec-value">${product.finish}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Availability:</span>
              <span class="spec-value stock-highlight">In Stock • White-Glove Handcrafted</span>
            </div>
          </div>

          <div class="quick-view-actions">
            <div class="qty-selector-wrapper">
              <button class="qty-btn" id="qvQtyMinus" aria-label="Decrease quantity">−</button>
              <input type="number" id="qvQtyInput" value="1" min="1" max="10" readonly>
              <button class="qty-btn" id="qvQtyPlus" aria-label="Increase quantity">+</button>
            </div>
            <button class="btn btn-espresso flex-1" id="qvAddToCartBtn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Add to Collection Cart
            </button>
            <button class="btn-wishlist-toggle ${isFav ? 'active' : ''}" id="qvWishlistBtn" data-product-id="${product.id}" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="${isFav ? 'var(--color-walnut)' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <div class="quick-view-service-notes">
            <div class="service-note-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>White-glove delivery & in-room installation across Osun State and nationwide.</span>
            </div>
            <div class="service-note-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>10-year architectural warranty on solid hardwoods & structural joinery.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook quantity controls
    const qtyInput = modalBody.querySelector('#qvQtyInput');
    const minusBtn = modalBody.querySelector('#qvQtyMinus');
    const plusBtn = modalBody.querySelector('#qvQtyPlus');
    const addBtn = modalBody.querySelector('#qvAddToCartBtn');
    const wishBtn = modalBody.querySelector('#qvWishlistBtn');

    minusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });

    plusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < 10) qtyInput.value = val + 1;
    });

    addBtn.addEventListener('click', () => {
      const q = parseInt(qtyInput.value) || 1;
      this.addToCart(product.id, q);
      this.closeModals();
    });

    wishBtn.addEventListener('click', () => {
      this.toggleWishlist(product.id);
      const nowFav = this.isInWishlist(product.id);
      wishBtn.classList.toggle('active', nowFav);
      const icon = wishBtn.querySelector('svg');
      if (icon) icon.setAttribute('fill', nowFav ? 'var(--color-walnut)' : 'none');
    });

    if (this.drawerBackdrop) this.drawerBackdrop.classList.add('active');
    this.quickViewModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  /* ==========================================================================
     CHECKOUT SIMULATION
     ========================================================================== */
  openCheckoutModal() {
    if (!this.checkoutModal) return;

    // Render Order Summary in checkout modal
    const summaryList = document.getElementById('checkoutSummaryItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const deliveryEl = document.getElementById('checkoutDelivery');
    const totalEl = document.getElementById('checkoutTotal');

    if (summaryList) {
      let html = '';
      this.cart.forEach(item => {
        html += `
          <div class="checkout-summary-row">
            <div class="checkout-item-title-qty">
              <strong>${item.name}</strong> × ${item.quantity}
            </div>
            <div class="checkout-item-price">${formatNaira(item.price * item.quantity)}</div>
          </div>
        `;
      });
      summaryList.innerHTML = html;
    }

    const subtotal = this.getCartSubtotal();
    const delivery = this.getDeliveryFee();
    const total = this.getCartTotal();

    if (subtotalEl) subtotalEl.textContent = formatNaira(subtotal);
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? "Complimentary" : formatNaira(delivery);
    if (totalEl) totalEl.textContent = formatNaira(total);

    if (this.drawerBackdrop) this.drawerBackdrop.classList.add('active');
    this.checkoutModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  processCheckout(formData) {
    const fullName = formData.get('fullName') || 'Esteemed Client';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const deliveryCity = formData.get('city') || 'Osun State';
    const totalStr = formatNaira(this.getCartTotal());

    const orderRef = "WG-" + Math.floor(100000 + Math.random() * 900000);

    // Populate Success Modal
    const successTitle = document.getElementById('orderSuccessName');
    const successRef = document.getElementById('orderSuccessRef');
    const successTotal = document.getElementById('orderSuccessTotal');
    const successCity = document.getElementById('orderSuccessCity');

    if (successTitle) successTitle.textContent = fullName;
    if (successRef) successRef.textContent = orderRef;
    if (successTotal) successTotal.textContent = totalStr;
    if (successCity) successCity.textContent = deliveryCity;

    // Clear cart
    this.clearCart();

    // Close checkout and open success
    if (this.checkoutModal) this.checkoutModal.classList.remove('active');
    if (this.orderSuccessModal) {
      this.orderSuccessModal.classList.add('active');
    }
  }

  processConsultation(formData) {
    const name = formData.get('name') || 'Valued Client';
    const serviceType = formData.get('serviceType') || 'Bespoke Furniture Commission';
    
    this.closeModals();
    this.showToast(`Thank you, ${name}. Your consultation request for "${serviceType}" has been received. Our concierge will contact you within 24 hours.`);
  }

  openConsultationModal(prefillService = '') {
    if (!this.enquiryModal) return;
    const select = this.enquiryModal.querySelector('select[name="serviceType"]');
    if (select && prefillService) {
      select.value = prefillService;
    }
    if (this.drawerBackdrop) this.drawerBackdrop.classList.add('active');
    this.enquiryModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */
  showToast(message) {
    let container = document.getElementById('toastNotificationContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastNotificationContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="toast-text">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 400);
    }, 3800);
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.wonderGrandShop = new WonderGrandShop();
});
