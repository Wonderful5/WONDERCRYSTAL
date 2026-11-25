/**
 * DAMSAM Food Wurld - Main Application Controller
 * Handles Navigation, Modals, Category Filters, Cart Drawer, Checkout, Tracker, and Gallery
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initCartDrawer();
  initFoodModal();
  initToast();
  initSyncCartBadges();

  // Route-specific initializations
  const page = document.body.dataset.page || "home";

  if (page === "home") {
    initHomeFeatured();
    initHomeCategories();
    initHomeReviews();
  } else if (page === "menu") {
    initMenuPage();
  } else if (page === "checkout") {
    initCheckoutPage();
  } else if (page === "track-order") {
    initTrackerPage();
  } else if (page === "reservations") {
    initReservationsPage();
  } else if (page === "gallery") {
    initGalleryPage();
  } else if (page === "offers") {
    initOffersPage();
  } else if (page === "contact") {
    initContactPage();
  }

  // Subscribe to store updates for reactive cart badge and drawer
  if (window.damsamStore) {
    window.damsamStore.subscribe(() => {
      initSyncCartBadges();
      renderCartDrawerItems();
    });
  }
});

/* ==========================================================================
   GLOBAL HEADER & NAVIGATION
   ========================================================================== */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}

function initMobileNav() {
  const hamburger = document.querySelector(".hamburger-btn");
  const mobileNav = document.querySelector(".mobile-nav-panel");
  const overlay = document.querySelector(".mobile-nav-overlay");
  const closeBtn = document.querySelector(".close-mobile-nav");

  if (!hamburger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    mobileNav.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", openNav);
  if (closeBtn) closeBtn.addEventListener("click", closeNav);
  if (overlay) overlay.addEventListener("click", closeNav);
}

/* ==========================================================================
   CART BADGES & DRAWER
   ========================================================================== */
function initSyncCartBadges() {
  if (!window.damsamStore) return;
  const count = window.damsamStore.getItemCount();
  const badges = document.querySelectorAll(".cart-badge");
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? "flex" : "none";
  });
}

function initCartDrawer() {
  const triggers = document.querySelectorAll(".cart-btn-trigger, .trigger-cart-drawer");
  const drawer = document.querySelector(".cart-drawer");
  const overlay = document.querySelector(".cart-drawer-overlay");
  const closeBtn = document.querySelector(".close-drawer-btn");
  const continueBtn = document.querySelector(".continue-shopping-btn");

  if (!drawer) return;

  function openDrawer(e) {
    if (e) e.preventDefault();
    renderCartDrawerItems();
    drawer.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  triggers.forEach(t => t.addEventListener("click", openDrawer));
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);
  if (continueBtn) continueBtn.addEventListener("click", closeDrawer);

  // Coupon application in drawer
  const applyCouponBtn = document.getElementById("drawer-apply-coupon");
  const couponInput = document.getElementById("drawer-coupon-input");
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", () => {
      const res = window.damsamStore.applyCoupon(couponInput.value);
      showToast(res.message, res.success ? "success" : "info");
      renderCartDrawerItems();
    });
  }
}

function renderCartDrawerItems() {
  const container = document.getElementById("cart-drawer-items-list");
  const footer = document.querySelector(".cart-drawer-footer");
  if (!container || !window.damsamStore) return;

  const cart = window.damsamStore.cart;
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <i class="fa-solid fa-bag-shopping"></i>
        <h4>Your plate is empty</h4>
        <p>Explore our kitchen favorites and add your favorite dishes to start your order.</p>
        <a href="menu.html" class="btn btn-primary btn-sm">Explore Menu</a>
      </div>
    `;
    if (footer) footer.style.display = "none";
    return;
  }

  if (footer) footer.style.display = "block";

  container.innerHTML = cart.map(item => {
    const addOnText = (item.selectedAddOns && item.selectedAddOns.length > 0)
      ? item.selectedAddOns.map(a => `+ ${a.name}`).join(", ")
      : "";

    return `
      <div class="cart-item-row" data-id="${item.cartItemId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          ${addOnText ? `<div class="cart-item-addons">${addOnText}</div>` : ""}
          ${item.specialInstructions ? `<div class="cart-item-addons"><em>Note: ${item.specialInstructions}</em></div>` : ""}
          <div class="cart-item-price">${window.damsamStore.formatMoney(item.unitPrice)} each</div>
          <div class="cart-qty-row">
            <button class="qty-btn dec-qty" onclick="handleDrawerQty('${item.cartItemId}', ${item.quantity - 1})">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn inc-qty" onclick="handleDrawerQty('${item.cartItemId}', ${item.quantity + 1})">+</button>
            <span style="margin-left:auto; font-weight:800; font-size:0.95rem; color:var(--primary-red);">
              ${window.damsamStore.formatMoney(item.itemTotal)}
            </span>
          </div>
        </div>
        <button class="cart-remove-btn" title="Remove item" onclick="handleRemoveCartItem('${item.cartItemId}')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  }).join("");

  // Update summary numbers
  const subtotalEl = document.getElementById("drawer-subtotal");
  const deliveryEl = document.getElementById("drawer-delivery");
  const discountRow = document.getElementById("drawer-discount-row");
  const discountEl = document.getElementById("drawer-discount");
  const totalEl = document.getElementById("drawer-total");

  const subtotal = window.damsamStore.getSubtotal();
  const delivery = window.damsamStore.getDeliveryFee("delivery");
  const discount = window.damsamStore.getDiscount();
  const total = window.damsamStore.getTotal("delivery");

  if (subtotalEl) subtotalEl.textContent = window.damsamStore.formatMoney(subtotal);
  if (deliveryEl) {
    deliveryEl.textContent = delivery === 0 ? "FREE" : window.damsamStore.formatMoney(delivery);
  }
  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.style.display = "flex";
      discountEl.textContent = `-${window.damsamStore.formatMoney(discount)}`;
    } else {
      discountRow.style.display = "none";
    }
  }
  if (totalEl) totalEl.textContent = window.damsamStore.formatMoney(total);
}

window.handleDrawerQty = function(cartItemId, newQty) {
  if (window.damsamStore) {
    window.damsamStore.updateQuantity(cartItemId, newQty);
  }
};

window.handleRemoveCartItem = function(cartItemId) {
  if (window.damsamStore) {
    window.damsamStore.removeItem(cartItemId);
    showToast("Item removed from plate", "info");
  }
};

/* ==========================================================================
   FOOD DETAIL MODAL
   ========================================================================== */
let activeModalItem = null;
let modalQuantity = 1;

function initFoodModal() {
  const overlay = document.querySelector(".food-modal-overlay");
  const closeBtn = document.querySelector(".modal-close-btn");
  if (!overlay) return;

  function closeModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    activeModalItem = null;
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

function openFoodModal(itemId) {
  const item = MENU_ITEMS.find(m => m.id === itemId);
  if (!item) return;

  activeModalItem = item;
  modalQuantity = 1;

  const overlay = document.querySelector(".food-modal-overlay");
  const imgEl = document.getElementById("modal-img");
  const catEl = document.getElementById("modal-cat");
  const titleEl = document.getElementById("modal-title");
  const descEl = document.getElementById("modal-desc");
  const priceEl = document.getElementById("modal-price");
  const addOnsContainer = document.getElementById("modal-addons-list");
  const qtyEl = document.getElementById("modal-qty-val");
  const instructionsEl = document.getElementById("modal-instructions");
  const addBtn = document.getElementById("modal-add-to-cart-btn");

  if (!overlay) return;

  if (imgEl) imgEl.src = item.image;
  if (catEl) catEl.textContent = item.category.replace("-", " ").toUpperCase();
  if (titleEl) titleEl.textContent = item.name;
  if (descEl) descEl.textContent = item.description;
  if (priceEl) priceEl.textContent = window.damsamStore.formatMoney(item.price);
  if (qtyEl) qtyEl.textContent = modalQuantity;
  if (instructionsEl) instructionsEl.value = "";

  // Render add-ons
  if (addOnsContainer) {
    if (item.addOns && item.addOns.length > 0) {
      addOnsContainer.innerHTML = item.addOns.map(add => `
        <label class="addon-checkbox-label">
          <span>
            <input type="checkbox" name="food_addon" value="${add.id}" data-price="${add.price}" data-name="${add.name}">
            ${add.name}
          </span>
          <span class="addon-price-tag">+${window.damsamStore.formatMoney(add.price)}</span>
        </label>
      `).join("");

      // Recalculate price on checkbox change
      addOnsContainer.querySelectorAll("input").forEach(cb => {
        cb.addEventListener("change", updateModalTotal);
      });
    } else {
      addOnsContainer.innerHTML = `<p style="font-size:0.85rem; color:var(--charcoal-light);">No add-ons required for this dish.</p>`;
    }
  }

  function updateModalTotal() {
    let extra = 0;
    if (addOnsContainer) {
      addOnsContainer.querySelectorAll("input:checked").forEach(cb => {
        extra += Number(cb.dataset.price || 0);
      });
    }
    const unit = item.price + extra;
    const total = unit * modalQuantity;
    if (priceEl) priceEl.textContent = window.damsamStore.formatMoney(total);
  }

  // Set quantity stepper handlers
  const decBtn = document.getElementById("modal-dec-qty");
  const incBtn = document.getElementById("modal-inc-qty");
  if (decBtn && incBtn) {
    decBtn.onclick = () => {
      if (modalQuantity > 1) {
        modalQuantity--;
        if (qtyEl) qtyEl.textContent = modalQuantity;
        updateModalTotal();
      }
    };
    incBtn.onclick = () => {
      modalQuantity++;
      if (qtyEl) qtyEl.textContent = modalQuantity;
      updateModalTotal();
    };
  }

  // Add to cart click
  if (addBtn) {
    addBtn.onclick = () => {
      const selectedAddOns = [];
      if (addOnsContainer) {
        addOnsContainer.querySelectorAll("input:checked").forEach(cb => {
          selectedAddOns.push({
            id: cb.value,
            name: cb.dataset.name,
            price: Number(cb.dataset.price)
          });
        });
      }
      const note = instructionsEl ? instructionsEl.value.trim() : "";
      window.damsamStore.addItem(item, modalQuantity, selectedAddOns, note);
      showToast(`Added ${modalQuantity}x ${item.name} to plate!`, "success");

      overlay.classList.remove("active");
      document.body.style.overflow = "";

      // Open cart drawer automatically for feedback
      const drawer = document.querySelector(".cart-drawer");
      const cartOverlay = document.querySelector(".cart-drawer-overlay");
      if (drawer) {
        renderCartDrawerItems();
        drawer.classList.add("active");
        if (cartOverlay) cartOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    };
  }

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

window.openFoodModal = openFoodModal;

/* Quick Add button directly from card */
window.quickAddToCart = function(itemId) {
  const item = MENU_ITEMS.find(m => m.id === itemId);
  if (!item || !window.damsamStore) return;
  window.damsamStore.addItem(item, 1, [], "");
  showToast(`Added 1x ${item.name} to your plate!`, "success");
};

/* ==========================================================================
   HOMEPAGE CONTROLLERS
   ========================================================================== */
function initHomeFeatured() {
  const container = document.getElementById("home-featured-grid");
  if (!container) return;

  const featured = MENU_ITEMS.filter(m => m.isFeatured).slice(0, 6);
  container.innerHTML = featured.map(item => createFoodCardHTML(item)).join("");
}

function initHomeCategories() {
  const filterTrack = document.getElementById("home-category-filter");
  const container = document.getElementById("home-category-grid");
  if (!container) return;

  // Initial render: all items (up to 9)
  renderFilteredGrid("all");

  if (filterTrack) {
    filterTrack.querySelectorAll(".cat-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        filterTrack.querySelectorAll(".cat-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.category;
        renderFilteredGrid(cat);
      });
    });
  }

  function renderFilteredGrid(category) {
    let filtered = MENU_ITEMS;
    if (category !== "all") {
      filtered = MENU_ITEMS.filter(m => m.category === category || m.mainCategory === category);
    }
    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
          <p style="font-size: 1.1rem; color: var(--charcoal-muted);">No dishes in this category currently. Check our full menu!</p>
        </div>
      `;
    } else {
      container.innerHTML = filtered.slice(0, 9).map(item => createFoodCardHTML(item)).join("");
    }
  }
}

function initHomeReviews() {
  const container = document.getElementById("home-reviews-grid");
  if (!container) return;

  container.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div>
        <div class="review-stars">
          ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
        </div>
        <p class="review-text">"${r.comment}"</p>
      </div>
      <div class="review-author-row">
        <div class="review-avatar">${r.avatar}</div>
        <div class="author-info">
          <h4>${r.author}</h4>
          <p>${r.role} • <em>${r.favoriteDish}</em></p>
        </div>
      </div>
    </div>
  `).join("");
}

/* Helper to render food card HTML */
function createFoodCardHTML(item) {
  const spicyIcons = item.spicyLevel > 0 
    ? `<span class="badge-tag badge-spicy"><i class="fa-solid fa-pepper-hot"></i> ${item.spicyLevel === 3 ? "Extra Spicy" : "Spicy"}</span>`
    : "";

  const specialBadge = item.isChefSpecial
    ? `<span class="badge-tag badge-red"><i class="fa-solid fa-crown"></i> Chef Special</span>`
    : "";

  return `
    <article class="food-card" data-id="${item.id}" data-category="${item.category}">
      <div class="food-card-thumb" onclick="openFoodModal('${item.id}')">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="card-top-badges">
          ${specialBadge}
          ${spicyIcons}
        </div>
        <div class="card-rating-pill">
          <i class="fa-solid fa-star"></i>
          <span>${item.rating.toFixed(1)}</span>
        </div>
      </div>
      <div class="food-card-body">
        <span class="food-card-category">${item.category.replace("-", " ")}</span>
        <h3 class="food-card-title" onclick="openFoodModal('${item.id}')">${item.name}</h3>
        <p class="food-card-desc">${item.description}</p>
        <div class="food-card-footer">
          <div class="food-card-price">${window.damsamStore.formatMoney(item.price)}</div>
          <div class="food-card-actions">
            <button class="btn-view-item" title="Customize Dish" onclick="openFoodModal('${item.id}')">
              <i class="fa-solid fa-sliders"></i>
            </button>
            <button class="btn-quick-add" onclick="quickAddToCart('${item.id}')">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   MENU PAGE CONTROLLER
   ========================================================================== */
function initMenuPage() {
  const searchInput = document.getElementById("menu-search-input");
  const filterTrack = document.getElementById("menu-category-filter");
  const sortSelect = document.getElementById("menu-sort-select");
  const grid = document.getElementById("full-menu-grid");
  const countDisplay = document.getElementById("menu-items-count");

  let currentCategory = "all";
  let currentSearch = "";
  let currentSort = "featured";

  function render() {
    if (!grid) return;

    let items = [...MENU_ITEMS];

    // Filter by Category
    if (currentCategory !== "all") {
      items = items.filter(m => m.category === currentCategory || m.mainCategory === currentCategory);
    }

    // Filter by Search Query
    if (currentSearch.trim() !== "") {
      const q = currentSearch.toLowerCase().trim();
      items = items.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sort items
    if (currentSort === "price-low") {
      items.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      items.sort((a, b) => b.price - a.price);
    } else if (currentSort === "rating") {
      items.sort((a, b) => b.rating - a.rating);
    } else {
      // featured
      items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    if (countDisplay) {
      countDisplay.textContent = `Showing ${items.length} delicious dish${items.length === 1 ? "" : "es"}`;
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 2.8rem; color: #D3CDC2; margin-bottom: 16px;"></i>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--secondary-charcoal);">No dishes found</h3>
          <p style="color: var(--charcoal-muted); margin-top: 6px;">Try adjusting your search terms or selecting a different category filter.</p>
        </div>
      `;
    } else {
      grid.innerHTML = items.map(item => createFoodCardHTML(item)).join("");
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      render();
    });
  }

  if (filterTrack) {
    filterTrack.querySelectorAll(".cat-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        filterTrack.querySelectorAll(".cat-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        render();
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      render();
    });
  }

  // Check URL params for category
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("category");
  if (catParam && filterTrack) {
    const matchingBtn = filterTrack.querySelector(`[data-category="${catParam}"]`);
    if (matchingBtn) {
      filterTrack.querySelectorAll(".cat-pill-btn").forEach(b => b.classList.remove("active"));
      matchingBtn.classList.add("active");
      currentCategory = catParam;
    }
  }

  render();
}

/* ==========================================================================
   CHECKOUT PAGE CONTROLLER (Prompt Section 16 & 42)
   ========================================================================== */
function initCheckoutPage() {
  const steps = [1, 2, 3, 4];
  let currentStep = 1;
  let orderType = "delivery";
  let paymentMethod = "card";

  const nextBtn = document.getElementById("checkout-next-btn");
  const prevBtn = document.getElementById("checkout-prev-btn");
  const placeOrderBtn = document.getElementById("place-order-final-btn");

  const orderTypeRadios = document.querySelectorAll("input[name='order_type']");
  const paymentRadios = document.querySelectorAll("input[name='payment_method']");
  const deliveryAddressSection = document.getElementById("delivery-address-group");
  const bankDetailsBox = document.getElementById("bank-transfer-details-box");

  // Radio listener for Delivery vs Pickup
  orderTypeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      orderType = e.target.value;
      document.querySelectorAll(".radio-pill").forEach(p => p.classList.remove("selected"));
      e.target.closest(".radio-pill").classList.add("selected");

      if (deliveryAddressSection) {
        deliveryAddressSection.style.display = orderType === "pickup" ? "none" : "block";
      }
      renderCheckoutSummary(orderType);
    });
  });

  // Radio listener for Payment Method
  paymentRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      paymentMethod = e.target.value;
      if (bankDetailsBox) {
        bankDetailsBox.style.display = paymentMethod === "bank_transfer" ? "block" : "none";
      }
    });
  });

  function showStep(step) {
    currentStep = step;
    document.querySelectorAll(".checkout-step-pane").forEach(pane => {
      pane.style.display = "none";
    });

    const activePane = document.getElementById(`step-pane-${step}`);
    if (activePane) activePane.style.display = "block";

    // Update step indicator
    document.querySelectorAll(".step-node").forEach(node => {
      const nodeStep = Number(node.dataset.step);
      node.classList.remove("active", "completed");
      if (nodeStep === step) node.classList.add("active");
      else if (nodeStep < step) node.classList.add("completed");
    });

    // Control buttons visibility
    if (prevBtn) prevBtn.style.display = step > 1 ? "inline-flex" : "none";
    if (nextBtn) nextBtn.style.display = step < 4 ? "inline-flex" : "none";
    if (placeOrderBtn) placeOrderBtn.style.display = step === 4 ? "inline-flex" : "none";

    if (step === 4) {
      renderReviewStep();
    }
  }

  function validateStep(step) {
    if (step === 1) {
      const name = document.getElementById("cust-name")?.value.trim();
      const phone = document.getElementById("cust-phone")?.value.trim();
      const email = document.getElementById("cust-email")?.value.trim();

      if (!name || !phone || !email) {
        showToast("Please fill in your name, phone number, and email.", "info");
        return false;
      }
      return true;
    }

    if (step === 2 && orderType === "delivery") {
      const address = document.getElementById("delivery-address")?.value.trim();
      const city = document.getElementById("delivery-city")?.value.trim();
      if (!address || !city) {
        showToast("Please provide your delivery street address and area.", "info");
        return false;
      }
      return true;
    }

    return true;
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        showStep(currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }

  function renderCheckoutSummary(type) {
    if (!window.damsamStore) return;
    const subtotal = window.damsamStore.getSubtotal();
    const delivery = window.damsamStore.getDeliveryFee(type);
    const discount = window.damsamStore.getDiscount();
    const total = window.damsamStore.getTotal(type);

    const subEl = document.getElementById("co-subtotal");
    const delEl = document.getElementById("co-delivery");
    const disEl = document.getElementById("co-discount");
    const totEl = document.getElementById("co-total");

    if (subEl) subEl.textContent = window.damsamStore.formatMoney(subtotal);
    if (delEl) delEl.textContent = delivery === 0 ? "FREE" : window.damsamStore.formatMoney(delivery);
    if (disEl) disEl.textContent = discount > 0 ? `-${window.damsamStore.formatMoney(discount)}` : "₦0";
    if (totEl) totEl.textContent = window.damsamStore.formatMoney(total);
  }

  function renderReviewStep() {
    const reviewBox = document.getElementById("checkout-review-content");
    if (!reviewBox || !window.damsamStore) return;

    const name = document.getElementById("cust-name")?.value || "";
    const phone = document.getElementById("cust-phone")?.value || "";
    const email = document.getElementById("cust-email")?.value || "";
    const address = document.getElementById("delivery-address")?.value || "";
    const city = document.getElementById("delivery-city")?.value || "";
    const instructions = document.getElementById("delivery-instructions")?.value || "";

    const itemsHTML = window.damsamStore.cart.map(item => `
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--border-light); font-size: 0.9rem;">
        <div>
          <strong>${item.quantity}x</strong> ${item.name}
          ${item.selectedAddOns.length ? `<div style="font-size:0.75rem; color:var(--charcoal-light);">${item.selectedAddOns.map(a => a.name).join(", ")}</div>` : ""}
        </div>
        <strong>${window.damsamStore.formatMoney(item.itemTotal)}</strong>
      </div>
    `).join("");

    reviewBox.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; font-weight: 800; color: var(--secondary-charcoal); margin-bottom: 8px;">Order Type</h4>
        <p style="font-size: 0.9rem; color: var(--charcoal-muted);"><strong>${orderType.toUpperCase()}</strong></p>
        ${orderType === "delivery" ? `<p style="font-size:0.9rem; color:var(--charcoal-muted);">${address}, ${city} ${instructions ? `(Note: ${instructions})` : ""}</p>` : `<p style="font-size:0.9rem; color:var(--charcoal-muted);">Pickup from: Plot 14, Admiralty Way, Lekki Phase 1, Lagos</p>`}
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; font-weight: 800; color: var(--secondary-charcoal); margin-bottom: 8px;">Customer Information</h4>
        <p style="font-size: 0.9rem; color: var(--charcoal-muted);">${name} • ${phone} • ${email}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; font-weight: 800; color: var(--secondary-charcoal); margin-bottom: 8px;">Payment Selection</h4>
        <p style="font-size: 0.9rem; color: var(--primary-red); font-weight: 700;">${paymentMethod.replace("_", " ").toUpperCase()}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; font-weight: 800; color: var(--secondary-charcoal); margin-bottom: 8px;">Order Items</h4>
        ${itemsHTML}
      </div>
    `;
  }

  // Handle final order submission
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      if (window.damsamStore.cart.length === 0) {
        showToast("Your plate is empty. Add food items first!", "info");
        return;
      }

      const name = document.getElementById("cust-name")?.value || "";
      const phone = document.getElementById("cust-phone")?.value || "";
      const email = document.getElementById("cust-email")?.value || "";
      const address = document.getElementById("delivery-address")?.value || "";
      const city = document.getElementById("delivery-city")?.value || "";
      const instructions = document.getElementById("delivery-instructions")?.value || "";

      const order = window.damsamStore.createOrder({
        customer: { name, phone, email },
        orderType,
        deliveryDetails: { address, city, instructions },
        paymentMethod
      });

      showToast("Order placed successfully! Redirecting to tracker...", "success");
      setTimeout(() => {
        window.location.href = `track-order.html?id=${order.orderNumber}`;
      }, 1200);
    });
  }

  renderCheckoutSummary(orderType);
  showStep(1);
}

/* ==========================================================================
   ORDER TRACKER (Prompt Section 17 & 18)
   ========================================================================== */
function initTrackerPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let orderId = urlParams.get("id");

  const searchInput = document.getElementById("track-search-input");
  const trackBtn = document.getElementById("track-search-btn");

  if (trackBtn && searchInput) {
    trackBtn.addEventListener("click", () => {
      const q = searchInput.value.trim();
      if (q) {
        window.location.href = `track-order.html?id=${encodeURIComponent(q)}`;
      }
    });
  }

  let order = null;
  if (orderId && window.damsamStore) {
    order = window.damsamStore.getOrder(orderId);
  } else if (window.damsamStore) {
    order = window.damsamStore.getLatestOrder();
  }

  renderTrackerView(order);
}

function renderTrackerView(order) {
  const container = document.getElementById("tracker-content-area");
  if (!container) return;

  if (!order) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: #FFFFFF; border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); border: 1px solid var(--border-light);">
        <i class="fa-solid fa-receipt" style="font-size: 3rem; color: #D3CDC2; margin-bottom: 16px;"></i>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--secondary-charcoal); margin-bottom: 8px;">No Order Found</h3>
        <p style="color: var(--charcoal-muted); max-width: 480px; margin: 0 auto 24px;">Please enter a valid DAMSAM Order Number (e.g. DSW-101928) or place a new order from our menu.</p>
        <a href="menu.html" class="btn btn-primary">Browse Delicious Dishes</a>
      </div>
    `;
    return;
  }

  const isDelivery = order.orderType === "delivery";
  const steps = isDelivery
    ? [
        { label: "ORDER RECEIVED", desc: "Your order has been recorded in our kitchen system." },
        { label: "CONFIRMED", desc: "The executive chef has reviewed and verified your order." },
        { label: "PREPARING", desc: "Fresh ingredients are sizzling on the grill and pots." },
        { label: "READY", desc: "Your order is packaged in premium heat-insulated containers." },
        { label: "OUT FOR DELIVERY", desc: "Our rider is on the way to your doorstep." },
        { label: "DELIVERED", desc: "Enjoy your fresh, delicious meal!" }
      ]
    : [
        { label: "ORDER RECEIVED", desc: "Your pickup order has been registered in the system." },
        { label: "CONFIRMED", desc: "The executive chef has confirmed your meal ticket." },
        { label: "PREPARING", desc: "Your dishes are being cooked fresh to order." },
        { label: "READY FOR PICKUP", desc: "Your warm meal is ready at the pickup counter." }
      ];

  const currentStepIndex = order.statusStep || 2;

  const stepsHTML = steps.map((s, idx) => {
    let stateClass = "";
    if (idx + 1 < currentStepIndex) stateClass = "done";
    else if (idx + 1 === currentStepIndex) stateClass = "current";

    return `
      <div class="track-step ${stateClass}">
        <div class="track-step-icon">
          <i class="fa-solid ${idx + 1 < currentStepIndex ? "fa-check" : "fa-utensils"}"></i>
        </div>
        <div class="track-step-content">
          <h4>${s.label}</h4>
          <p>${s.desc}</p>
        </div>
      </div>
    `;
  }).join("");

  const itemsListHTML = order.items.map(it => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border-light); font-size:0.9rem;">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${it.image}" alt="${it.name}" style="width:48px; height:48px; border-radius:var(--radius-sm); object-fit:cover;">
        <div>
          <strong>${it.quantity}x</strong> ${it.name}
          ${it.selectedAddOns && it.selectedAddOns.length ? `<div style="font-size:0.75rem; color:var(--charcoal-light);">${it.selectedAddOns.map(a => a.name).join(", ")}</div>` : ""}
        </div>
      </div>
      <strong>${window.damsamStore.formatMoney(it.itemTotal)}</strong>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="tracker-status-box">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; padding-bottom:20px; border-bottom:1px solid var(--border-light);">
        <div>
          <span style="font-size:0.78rem; font-weight:800; color:var(--primary-red); text-transform:uppercase; letter-spacing:0.08em;">Order Status</span>
          <h2 style="font-size:1.85rem; font-weight:800; color:var(--secondary-charcoal); margin-top:2px;">${order.orderNumber}</h2>
          <p style="font-size:0.875rem; color:var(--charcoal-muted); margin-top:4px;">Placed on: ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
        <div style="text-align:right;">
          <span class="badge-tag badge-red" style="font-size:0.85rem; padding:6px 14px;">
            ${steps[currentStepIndex - 1]?.label || "PROCESSING"}
          </span>
          <p style="font-size:0.8125rem; color:var(--charcoal-muted); margin-top:6px;">Estimated time: <strong>35 – 45 mins</strong></p>
        </div>
      </div>

      <div class="tracker-timeline">
        ${stepsHTML}
      </div>

      <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:20px; justify-content:center;">
        <button class="btn btn-outline btn-sm" onclick="advanceOrderStatus('${order.orderNumber}', ${currentStepIndex}, ${steps.length})">
          <i class="fa-solid fa-forward-step"></i> Simulate Next Step
        </button>
        <button class="btn btn-light btn-sm" onclick="window.print()">
          <i class="fa-solid fa-print"></i> Print Receipt
        </button>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr; gap:24px;">
      <div style="background:#FFFFFF; padding:28px; border-radius:var(--radius-xl); box-shadow:var(--shadow-sm); border:1px solid var(--border-light);">
        <h3 style="font-size:1.2rem; font-weight:800; color:var(--secondary-charcoal); margin-bottom:16px;">Order Summary</h3>
        ${itemsListHTML}
        <div style="padding-top:16px; margin-top:8px;">
          <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:var(--charcoal-muted); margin-bottom:6px;">
            <span>Subtotal:</span>
            <span>${window.damsamStore.formatMoney(order.subtotal)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:var(--charcoal-muted); margin-bottom:6px;">
            <span>Delivery Fee:</span>
            <span>${order.deliveryFee === 0 ? "FREE" : window.damsamStore.formatMoney(order.deliveryFee)}</span>
          </div>
          ${order.discount > 0 ? `
          <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:var(--success-green); margin-bottom:6px;">
            <span>Discount:</span>
            <span>-${window.damsamStore.formatMoney(order.discount)}</span>
          </div>` : ""}
          <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:800; color:var(--secondary-charcoal); padding-top:10px; border-top:1px solid var(--border-light); margin-top:10px;">
            <span>Total:</span>
            <span style="color:var(--primary-red);">${window.damsamStore.formatMoney(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.advanceOrderStatus = function(orderNumber, currentStep, maxSteps) {
  if (currentStep >= maxSteps) {
    showToast("This order has reached its final completed status!", "info");
    return;
  }
  const nextStep = currentStep + 1;
  const existing = localStorage.getItem("damsam_orders_v1");
  if (existing) {
    const list = JSON.parse(existing);
    const order = list.find(o => o.orderNumber === orderNumber);
    if (order) {
      order.statusStep = nextStep;
      localStorage.setItem("damsam_orders_v1", JSON.stringify(list));
      showToast("Order status advanced!", "success");
      renderTrackerView(order);
    }
  }
};

/* ==========================================================================
   TABLE RESERVATION PAGE (Prompt Section 19)
   ========================================================================== */
function initReservationsPage() {
  const form = document.getElementById("reservation-form");
  const modal = document.getElementById("reservation-confirmation-modal");
  const closeBtn = document.getElementById("close-res-modal-btn");

  if (!form) return;

  // Set minimum date to today
  const dateInput = document.getElementById("res-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const guests = document.getElementById("res-guests")?.value;
    const date = document.getElementById("res-date")?.value;
    const time = document.getElementById("res-time")?.value;
    const seating = document.getElementById("res-seating")?.value;
    const name = document.getElementById("res-name")?.value.trim();
    const phone = document.getElementById("res-phone")?.value.trim();
    const email = document.getElementById("res-email")?.value.trim();
    const specialRequest = document.getElementById("res-notes")?.value.trim();

    if (!guests || !date || !time || !name || !phone) {
      showToast("Please provide all required reservation details.", "info");
      return;
    }

    const resObj = window.damsamStore.createReservation({
      guests, date, time, seating, name, phone, email, specialRequest
    });

    const refEl = document.getElementById("confirmed-res-id");
    const detailsEl = document.getElementById("confirmed-res-details");
    if (refEl) refEl.textContent = resObj.reservationId;
    if (detailsEl) {
      detailsEl.innerHTML = `
        <strong>${guests} Guests</strong> on <strong>${date}</strong> at <strong>${time}</strong><br>
        Seating: <em>${seating}</em> • Reserved for: <em>${name} (${phone})</em>
      `;
    }

    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    showToast("Reservation request received successfully!", "success");
    form.reset();
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }
}

/* ==========================================================================
   GALLERY PAGE (Prompt Section 21)
   ========================================================================== */
let activeLightboxIndex = 0;

function initGalleryPage() {
  const grid = document.getElementById("gallery-masonry-grid");
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const lightbox = document.getElementById("gallery-lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-active-img");
  const lightboxCaption = document.getElementById("lightbox-active-caption");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  if (!grid) return;

  let currentCategory = "all";
  let activeList = [...GALLERY_ITEMS];

  function renderGrid() {
    activeList = currentCategory === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter(g => g.category === currentCategory);

    grid.innerHTML = activeList.map((g, idx) => `
      <div class="gallery-card" onclick="openLightbox(${idx})">
        <img src="${g.image}" alt="${g.title}" loading="lazy">
        <div class="gallery-card-overlay">
          <h4 style="font-size:1.1rem; font-weight:800;">${g.title}</h4>
          <p style="font-size:0.8125rem; opacity:0.9; margin-top:4px;">${g.caption}</p>
        </div>
      </div>
    `).join("");
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderGrid();
    });
  });

  window.openLightbox = function(index) {
    if (!lightbox) return;
    activeLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  function updateLightbox() {
    const item = activeList[activeLightboxIndex];
    if (!item) return;
    if (lightboxImg) lightboxImg.src = item.image;
    if (lightboxCaption) lightboxCaption.innerHTML = `<strong>${item.title}</strong> — ${item.caption}`;
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      activeLightboxIndex = (activeLightboxIndex - 1 + activeList.length) % activeList.length;
      updateLightbox();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      activeLightboxIndex = (activeLightboxIndex + 1) % activeList.length;
      updateLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      activeLightboxIndex = (activeLightboxIndex - 1 + activeList.length) % activeList.length;
      updateLightbox();
    }
    if (e.key === "ArrowRight") {
      activeLightboxIndex = (activeLightboxIndex + 1) % activeList.length;
      updateLightbox();
    }
  });

  renderGrid();
}

/* ==========================================================================
   OFFERS PAGE (Prompt Section 20)
   ========================================================================== */
function initOffersPage() {
  const container = document.getElementById("offers-list-grid");
  if (!container) return;

  container.innerHTML = SPECIAL_OFFERS.map(offer => `
    <div class="offer-banner-card" style="margin-bottom: 36px;">
      <div class="offer-grid">
        <div class="offer-content-side">
          <span class="offer-pill"><i class="fa-solid fa-fire"></i> ${offer.badge}</span>
          <h2 class="offer-title">${offer.title}</h2>
          <div class="offer-subtitle">${offer.subtitle}</div>
          <p class="offer-desc">${offer.description}</p>
          
          <ul class="offer-included-list">
            ${offer.itemsIncluded.map(item => `<li><i class="fa-solid fa-circle-check"></i> ${item}</li>`).join("")}
          </ul>

          <div class="offer-pricing-bar">
            <span class="offer-new-price">${window.damsamStore.formatMoney(offer.offerPrice)}</span>
            <span class="offer-old-price">${window.damsamStore.formatMoney(offer.regularPrice)}</span>
            <span class="offer-savings-tag">SAVE ${offer.discountPercent}%</span>
          </div>

          <div style="display: flex; gap: 14px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="claimOfferCombo('${offer.id}')">
              <i class="fa-solid fa-bag-shopping"></i> Order Combo
            </button>
            <button class="btn btn-outline" onclick="copyCouponCode('${offer.code}')">
              <i class="fa-solid fa-tag"></i> Copy Code: ${offer.code}
            </button>
          </div>
        </div>
        <div class="offer-image-side">
          <img src="${offer.image}" alt="${offer.title}">
        </div>
      </div>
    </div>
  `).join("");

  window.claimOfferCombo = function(offerId) {
    const offer = SPECIAL_OFFERS.find(o => o.id === offerId);
    if (!offer || !window.damsamStore) return;

    window.damsamStore.addItem({
      id: offer.id,
      name: offer.title,
      price: offer.offerPrice,
      image: offer.image,
      category: "combos"
    }, 1, [], `Combo Promo: ${offer.subtitle}`);

    showToast(`Added ${offer.title} combo to plate!`, "success");
    
    // Open cart drawer
    const drawer = document.querySelector(".cart-drawer");
    const cartOverlay = document.querySelector(".cart-drawer-overlay");
    if (drawer) {
      renderCartDrawerItems();
      drawer.classList.add("active");
      if (cartOverlay) cartOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  window.copyCouponCode = function(code) {
    navigator.clipboard?.writeText(code).then(() => {
      showToast(`Coupon code ${code} copied to clipboard!`, "success");
    }).catch(() => {
      showToast(`Use coupon code: ${code}`, "info");
    });
  };
}

/* ==========================================================================
   CONTACT PAGE (Prompt Section 23)
   ========================================================================== */
function initContactPage() {
  const form = document.getElementById("contact-message-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("msg-name")?.value.trim();
    const email = document.getElementById("msg-email")?.value.trim();
    const phone = document.getElementById("msg-phone")?.value.trim();
    const message = document.getElementById("msg-text")?.value.trim();

    if (!name || !email || !message) {
      showToast("Please provide your name, email, and message.", "info");
      return;
    }

    showToast(`Thank you ${name}! Your message has been sent to our dining desk.`, "success");
    form.reset();
  });
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function initToast() {
  if (!document.querySelector(".toast-container")) {
    const container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
}

function showToast(message, type = "info") {
  const container = document.querySelector(".toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconClass = type === "success" 
    ? "fa-circle-check" 
    : type === "warning" ? "fa-triangle-exclamation" : "fa-bell";

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideToastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

window.showToast = showToast;
