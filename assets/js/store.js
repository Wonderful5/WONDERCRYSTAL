/**
 * DAMSAM Food Wurld - Central Application Store
 * Manages Cart state, localStorage persistence, orders, and reservations.
 */

class DamsamStore {
  constructor() {
    this.cartKey = "damsam_cart_v1";
    this.ordersKey = "damsam_orders_v1";
    this.reservationsKey = "damsam_reservations_v1";
    this.appliedCouponKey = "damsam_coupon_v1";
    
    this.cart = this.loadCart();
    this.coupon = this.loadCoupon();
    this.listeners = [];
  }

  // Event dispatching for reactive UI updates
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => {
      try { fn(this); } catch (e) { console.error("Store listener error:", e); }
    });
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
      console.warn("Could not save cart to localStorage", e);
    }
    this.notify();
  }

  loadCoupon() {
    try {
      const data = localStorage.getItem(this.appliedCouponKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveCoupon(coupon) {
    this.coupon = coupon;
    try {
      if (coupon) {
        localStorage.setItem(this.appliedCouponKey, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(this.appliedCouponKey);
      }
    } catch (e) {}
    this.notify();
  }

  // Add item with optional add-ons and special instruction
  addItem(item, quantity = 1, selectedAddOns = [], specialInstructions = "") {
    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + (a.price || 0), 0);
    const unitPrice = item.price + addOnsTotal;

    // Generate unique composite key based on item ID and selected add-on IDs
    const addOnKey = selectedAddOns.map(a => a.id).sort().join(",");
    const cartItemId = `${item.id}_${addOnKey}_${specialInstructions.trim().toLowerCase()}`;

    const existingIndex = this.cart.findIndex(c => c.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      this.cart[existingIndex].itemTotal = this.cart[existingIndex].quantity * this.cart[existingIndex].unitPrice;
    } else {
      this.cart.push({
        cartItemId,
        id: item.id,
        name: item.name,
        price: item.price,
        unitPrice,
        image: item.image,
        category: item.category,
        quantity,
        selectedAddOns,
        specialInstructions,
        itemTotal: quantity * unitPrice
      });
    }

    this.saveCart();
  }

  updateQuantity(cartItemId, newQty) {
    const idx = this.cart.findIndex(c => c.cartItemId === cartItemId);
    if (idx > -1) {
      if (newQty <= 0) {
        this.removeItem(cartItemId);
      } else {
        this.cart[idx].quantity = newQty;
        this.cart[idx].itemTotal = newQty * this.cart[idx].unitPrice;
        this.saveCart();
      }
    }
  }

  removeItem(cartItemId) {
    this.cart = this.cart.filter(c => c.cartItemId !== cartItemId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCoupon(null);
    this.saveCart();
  }

  getItemCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + item.itemTotal, 0);
  }

  getDeliveryFee(orderType = "delivery") {
    if (orderType === "pickup") return 0;
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= DAMSAM_CONFIG.delivery.freeDeliveryThreshold) return 0;
    return DAMSAM_CONFIG.delivery.baseFee;
  }

  getDiscount() {
    if (!this.coupon) return 0;
    const subtotal = this.getSubtotal();
    if (this.coupon.type === "percentage") {
      return Math.round((subtotal * this.coupon.value) / 100);
    } else if (this.coupon.type === "fixed") {
      return Math.min(this.coupon.value, subtotal);
    }
    return 0;
  }

  getTotal(orderType = "delivery") {
    const sub = this.getSubtotal();
    if (sub === 0) return 0;
    const delivery = this.getDeliveryFee(orderType);
    const discount = this.getDiscount();
    return Math.max(0, sub + delivery - discount);
  }

  applyCoupon(code) {
    const cleaned = (code || "").trim().toUpperCase();
    if (cleaned === "DAMSAM10" || cleaned === "LUNCH10") {
      const coupon = { code: cleaned, type: "percentage", value: 10, label: "10% Welcome Discount" };
      this.saveCoupon(coupon);
      return { success: true, message: "10% discount applied successfully!" };
    }
    if (cleaned === "FAMILY20") {
      const coupon = { code: cleaned, type: "percentage", value: 20, label: "20% Family Pack Discount" };
      this.saveCoupon(coupon);
      return { success: true, message: "20% discount applied successfully!" };
    }
    if (cleaned === "WEEKENDJOY") {
      const coupon = { code: cleaned, type: "fixed", value: 2600, label: "₦2,600 Weekend Combo Savings" };
      this.saveCoupon(coupon);
      return { success: true, message: "₦2,600 weekend voucher applied!" };
    }
    return { success: false, message: "Invalid coupon code. Try 'DAMSAM10' or 'WEEKENDJOY'" };
  }

  removeCoupon() {
    this.saveCoupon(null);
  }

  formatMoney(amount) {
    return `${DAMSAM_CONFIG.currency}${Number(amount || 0).toLocaleString("en-NG")}`;
  }

  // Save placed orders
  createOrder(orderDetails) {
    const orderNumber = "DSW-" + Math.floor(100000 + Math.random() * 900000);
    const order = {
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "ORDER RECEIVED",
      statusStep: 1,
      ...orderDetails,
      items: [...this.cart],
      subtotal: this.getSubtotal(),
      deliveryFee: this.getDeliveryFee(orderDetails.orderType),
      discount: this.getDiscount(),
      total: this.getTotal(orderDetails.orderType)
    };

    let orders = [];
    try {
      const existing = localStorage.getItem(this.ordersKey);
      orders = existing ? JSON.parse(existing) : [];
    } catch (e) {}

    orders.unshift(order);
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
    this.clearCart();
    return order;
  }

  getOrder(orderNumber) {
    try {
      const existing = localStorage.getItem(this.ordersKey);
      const orders = existing ? JSON.parse(existing) : [];
      return orders.find(o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()) || null;
    } catch (e) {
      return null;
    }
  }

  getLatestOrder() {
    try {
      const existing = localStorage.getItem(this.ordersKey);
      const orders = existing ? JSON.parse(existing) : [];
      return orders.length > 0 ? orders[0] : null;
    } catch (e) {
      return null;
    }
  }

  // Table reservation
  createReservation(reservationData) {
    const reservationId = "RES-" + Math.floor(10000 + Math.random() * 90000);
    const reservation = {
      reservationId,
      createdAt: new Date().toISOString(),
      status: "REQUEST RECEIVED",
      ...reservationData
    };

    let list = [];
    try {
      const existing = localStorage.getItem(this.reservationsKey);
      list = existing ? JSON.parse(existing) : [];
    } catch (e) {}

    list.unshift(reservation);
    localStorage.setItem(this.reservationsKey, JSON.stringify(list));
    return reservation;
  }
}

// Global singleton instance
window.damsamStore = new DamsamStore();
