# WONDER GRAND — Haute Furniture & Architectural Living
**Location: Osun State, Nigeria**

An international luxury furniture and interior lifestyle website for **WONDER GRAND**. Inspired by authentic European brutalist minimalism and warm architectural earth tones, the website delivers a refined digital showroom experience with a signature **Slider Revolution-inspired cinematic hero slider**, full 4-page responsive navigation, and complete e-commerce & bespoke commission capabilities.

---

## 🏛️ Brand Palette & Visual Identity

Extracted from the architectural reference image:
- **Espresso Brown:** `#38271E` (Primary headers, dark luxury surfaces, footer)
- **Walnut Brown:** `#765B46` (Accent badges, interactive buttons, borders)
- **Warm Taupe:** `#B49A7C` (Category subtitles, subtle borders)
- **Sand Beige:** `#E4D5BD` (Secondary section backgrounds, hover highlights)
- **Cream White:** `#F5EFE5` (Primary page background, light text on dark surfaces)
- **Soft Black:** `#211E1B` (Deep charcoal contrast, toast notifications)

### Typography:
- **Headings & Editorial Titles:** `Playfair Display` & `Cormorant Garamond` (High-contrast serif)
- **Wordmark & Monograms:** `Cinzel` (Classical Roman proportions)
- **Body & Navigation:** `Plus Jakarta Sans` (Clean geometric sans-serif with wide letter-spacing)

---

## 🌟 The 4 Distinct Pages

1. **Home (`index.html`):**
   - **Cinematic Slider Revolution Hero Slider:** 
     - 4 full-screen curated slides featuring the authentic reference image and high-resolution architectural interiors.
     - Ken Burns slow zoom and pan on background imagery.
     - Layered parallax text reveal (eyebrow, split headline, description, luxury CTA buttons).
     - Live progress countdown timer bar (8s cadence).
     - Custom navigation arrows with magnetic hover ripples.
     - Numeric slide indicators (`01`, `02`, `03`, `04`) with animated active rules.
     - Corner architectural specification badge.
     - Autoplay play/pause control, mobile touch swipe gestures, and keyboard arrow controls.
   - **Brand Statement Strip:** Architectural quote celebrating monolithic stone, leathers, and timber.
   - **Curated Collections Showcase:** Live interactive filtering across all 6 furniture categories with Quick View, Wishlist toggle, and Add to Cart.
   - **Craftsmanship & Materials Spotlight:** Solid African & European hardwoods, aniline saddle leathers, Roman travertine stone.
   - **Osun State Showroom & White-Glove Spotlight:** Dedicated section highlighting the atelier in GRA, Osogbo.
   - **Patron Acclaim:** Testimonials from prominent Nigerian architects, collectors, and homeowners.

2. **About Us (`about.html`):**
   - Editorial page banner with interior photography.
   - Brand Story & Who We Are (Heritage and origins in Osun State).
   - Mission, Vision & Core Values cards.
   - The Wonder Grand Design Manifesto ("Form Follows Serenity", "Uncompromising Joinery", "Organic Finishing").
   - Tactile Materials Atlas (Walnut, Aniline Leather, Travertine, Bouclé).

3. **Our Services (`services.html`):**
   - 6 Image-led service divisions:
     1. *Luxury Furniture Sales*
     2. *Custom Furniture Design*
     3. *Interior Design & Styling*
     4. *Furniture Consultation*
     5. *White-Glove Delivery & Assembly* (Across Osun State and nationwide)
     6. *Luxury Interior Accessories*
   - Bespoke Commission Journey Protocol (Spatial Discovery, Material Curation, Handcrafting, Placement).
   - Interactive Consultation & Commission enquiry modal integration.

4. **Contact Us (`contact.html`):**
   - Direct showroom contact info (Address: *Plot 18 Heritage Boulevard, GRA, Osogbo, Osun State, Nigeria*).
   - Infoline (+234 803 400 9000) and Email (`concierge@wondergrand.com`).
   - Validated Atelier Enquiry Form with client name, email, phone, subject, and message fields.
   - Interactive Google Maps location of Osogbo, Osun State.
   - Direct WhatsApp Concierge button.

---

## 🛒 Interactive E-Commerce & Atelier Features

- **Cart Drawer (`assets/js/cart.js`):** Slide-out drawer with quantity increment/decrement, item removal, live subtotal, and complimentary white-glove threshold calculation.
- **Wishlist Drawer:** Dedicated wishlist drawer persisting saved items via `localStorage`.
- **Quick View Modal:** Full product specifications, dimensions, finish notes, materials, stock status, and add-to-cart controls.
- **Private Client Checkout Modal:** Customer shipping form with Osun State delivery routes (Osogbo, Ile-Ife, Ilesa, Ede) and nationwide white-glove options.
- **Order Confirmation Modal:** Generates an order reference code (e.g. `WG-109244`) with instant summary feedback.
- **Live Search Overlay (`assets/js/main.js`):** Instant search indexing products by name, category, materials, and description.
- **Bespoke Consultation Modal:** Form to request on-site residence styling or showroom consultations.
- **Floating WhatsApp Concierge:** Direct one-click chat with the showroom team.

---

## 🚀 Running the Project Locally

To run the local development server:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Or open any `.html` file (`index.html`, `about.html`, `services.html`, `contact.html`) directly in any modern web browser.
