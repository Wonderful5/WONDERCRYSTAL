/**
 * DAMSAM Food Wurld - Main Application Entrypoint
 * 
 * Sets up global event handlers, cart subscriptions, navigation, and router.
 */

import { RESTAURANT_CONFIG } from './data.js';
import { subscribeToCart, getItemCount } from './cart.js';
import { initRouter } from './router.js';
import { openCartDrawer, closeCartDrawer, closeFoodModal, closeLightbox, renderCartDrawerContent } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Application
  setupNavigation();
  setupCartSubscriber();
  setupGlobalModalHandlers();
  setupWhatsAppWidget();
  initRouter();
});

/* -----------------------------------------
   STICKY NAVBAR & MOBILE MENU
----------------------------------------- */
function setupNavigation() {
  const navbar = document.getElementById('main-navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const closeMobileNavBtn = document.getElementById('close-mobile-nav');

  // Sticky scroll styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile drawer open
  hamburgerBtn?.addEventListener('click', () => {
    mobileNavDrawer?.classList.add('active');
    mobileNavOverlay?.classList.add('active');
    document.body.classList.add('drawer-open');
  });

  // Mobile drawer close
  const closeMobileMenu = () => {
    mobileNavDrawer?.classList.remove('active');
    mobileNavOverlay?.classList.remove('active');
    document.body.classList.remove('drawer-open');
  };

  closeMobileNavBtn?.addEventListener('click', closeMobileMenu);
  mobileNavOverlay?.addEventListener('click', closeMobileMenu);

  // Close mobile nav when clicking any mobile nav link
  document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

/* -----------------------------------------
   CART STATE SUBSCRIBER
----------------------------------------- */
function setupCartSubscriber() {
  const desktopCartBadge = document.getElementById('cart-badge-desktop');
  const mobileCartBadge = document.getElementById('cart-badge-mobile');
  const cartTriggerBtns = document.querySelectorAll('.cart-drawer-trigger');
  const closeDrawerBtn = document.getElementById('close-cart-drawer');
  const drawerOverlay = document.getElementById('cart-drawer-overlay');

  subscribeToCart((cart) => {
    const totalCount = getItemCount();
    
    // Update badge numbers
    if (desktopCartBadge) {
      desktopCartBadge.textContent = totalCount;
      desktopCartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }
    if (mobileCartBadge) {
      mobileCartBadge.textContent = totalCount;
      mobileCartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    // If drawer is currently active, re-render its content
    const drawer = document.getElementById('cart-drawer');
    if (drawer && drawer.classList.contains('active')) {
      renderCartDrawerContent();
    }
  });

  // Open cart drawer triggers
  cartTriggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  // Close cart drawer
  closeDrawerBtn?.addEventListener('click', closeCartDrawer);
  drawerOverlay?.addEventListener('click', closeCartDrawer);
}

/* -----------------------------------------
   GLOBAL MODALS & KEYBOARD LISTENERS
----------------------------------------- */
function setupGlobalModalHandlers() {
  // ESC key closes modals, drawers, lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFoodModal();
      closeCartDrawer();
      closeLightbox();
      const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
      const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
      mobileNavDrawer?.classList.remove('active');
      mobileNavOverlay?.classList.remove('active');
      document.body.classList.remove('modal-open', 'drawer-open');
    }
  });

  // Food modal overlay click
  const foodOverlay = document.getElementById('food-modal-overlay');
  foodOverlay?.addEventListener('click', (e) => {
    if (e.target === foodOverlay) {
      closeFoodModal();
    }
  });
}

/* -----------------------------------------
   FLOATING WHATSAPP BUTTON
----------------------------------------- */
function setupWhatsAppWidget() {
  const whatsappWidget = document.getElementById('floating-whatsapp');
  if (!whatsappWidget) return;

  const defaultMsg = encodeURIComponent("Hello DAMSAM Food Wurld! I would like to place an order / make an inquiry.");
  whatsappWidget.href = `https://wa.me/${RESTAURANT_CONFIG.whatsappRaw.replace(/[^0-9]/g, '')}?text=${defaultMsg}`;
}
