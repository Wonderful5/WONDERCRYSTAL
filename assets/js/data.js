/**
 * WONDER GRAND — LUXURY FURNITURE DATA & CATALOG
 * Osun State, Nigeria
 * Complete collection across all 6 luxury categories
 */

const WONDER_GRAND_CONFIG = {
  brandName: "Wonder Grand",
  tagline: "Haute Furniture & Architectural Living",
  location: "Osun State, Nigeria",
  address: "Wonder Grand Atelier & Showroom, Plot 18 Heritage Boulevard, GRA, Osogbo, Osun State, Nigeria",
  phoneDisplay: "+234 (0) 803 400 9000",
  whatsappNumber: "+2348034009000",
  emailConcierge: "concierge@wondergrand.com",
  emailEnquiries: "atelier@wondergrand.com",
  openingHours: "Monday – Saturday: 9:00 AM – 7:00 PM",
  sundayHours: "Sunday: Private Appointments Only",
  currencySymbol: "₦",
  whiteGloveDeliveryThreshold: 5000000,
  baseDeliveryFee: 45000
};

// 6 Core Categories
const FURNITURE_CATEGORIES = [
  { id: "all", name: "All Collections", count: 18 },
  { id: "living", name: "Living Room Furniture", count: 3 },
  { id: "bedroom", name: "Bedroom Furniture", count: 3 },
  { id: "dining", name: "Dining Room Furniture", count: 3 },
  { id: "office", name: "Office Furniture", count: 3 },
  { id: "outdoor", name: "Outdoor Furniture", count: 3 },
  { id: "accessories", name: "Luxury Interior Accessories", count: 3 }
];

// Curated 18 Luxury Furniture Items
const FURNITURE_PRODUCTS = [
  /* ==========================================================================
     1. LIVING ROOM FURNITURE
     ========================================================================== */
  {
    id: "wg-liv-01",
    name: "The Monolith Roman Travertine Coffee Table",
    category: "living",
    categoryLabel: "Living Room Furniture",
    price: 1850000,
    badge: "Signature Piece",
    image: "assets/images/prod-travertine-table.jpg",
    shortDesc: "Hand-honed raw Roman travertine coffee table with sculptural monolithic plinth base and natural vein detailing.",
    description: "Carved from solid slabs of unpolished Roman travertine, the Monolith Coffee Table celebrates organic mass and architectural restraint. Each block is meticulously hand-honed by master artisans, preserving the porous, tactile character of the stone. Sealed with an invisible matte protective coat to resist patina while maintaining its ancient geological soul.",
    dimensions: "140cm W × 85cm D × 38cm H",
    materials: "100% Solid Natural Roman Travertine Stone",
    finish: "Hand-honed raw matte travertine",
    featured: true,
    inStock: true
  },
  {
    id: "wg-liv-02",
    name: "Aurelia Minimalist Modular Bouclé Sectional",
    category: "living",
    categoryLabel: "Living Room Furniture",
    price: 4950000,
    badge: "Best Seller",
    image: "assets/images/prod-boucle-sofa.jpg",
    shortDesc: "Expansive low-profile modular sofa upholstered in textural Italian wool-blend bouclé with kiln-dried hardwood frame.",
    description: "The Aurelia Sectional redefines low-profile lounging with deep proportions, subtle curved contours, and multi-density memory cushioning. Tailored in an exquisite oat-colored heavy bouclé weave imported from Biella, Italy, built over a reinforced solid FSC-certified kiln-dried hardwood frame.",
    dimensions: "320cm W × 190cm D × 72cm H (Seat Height: 40cm)",
    materials: "Kiln-Dried Walnut Frame, High-Resilience Down Blend, Italian Wool Bouclé",
    finish: "Oat Neutral Bouclé Weave",
    featured: true,
    inStock: true
  },
  {
    id: "wg-liv-03",
    name: "Vervoordt Architectural Sling Lounge Chair",
    category: "living",
    categoryLabel: "Living Room Furniture",
    price: 1450000,
    badge: "Architectural Digest Feature",
    image: "assets/images/wonder-grand-hero-1.jpg",
    shortDesc: "Sculptural scissor-frame folding lounge chair in burnished walnut and full-grain espresso saddle leather.",
    description: "Directly inspired by European brutalist minimalism, the Vervoordt Lounge Chair unites raw dark espresso bridle leather with an angled architectural silhouette. The supple leather conforms to the body with use, developing a rich, luxurious patina over decades of appreciation.",
    dimensions: "72cm W × 88cm D × 76cm H",
    materials: "Hand-waxed solid smoked walnut & Full-grain Italian bridle saddle leather",
    finish: "Espresso Brown & Smoked Walnut",
    featured: true,
    inStock: true
  },

  /* ==========================================================================
     2. BEDROOM FURNITURE
     ========================================================================== */
  {
    id: "wg-bed-01",
    name: "Elysian Bouclé & Walnut Floating Platform Bed",
    category: "bedroom",
    categoryLabel: "Bedroom Furniture",
    price: 3800000,
    badge: "Sanctuary Collection",
    image: "assets/images/prod-upholstered-bed.jpg",
    shortDesc: "Extended wingback upholstered headboard paired with a recessed floating walnut platform frame.",
    description: "The Elysian Platform Bed transforms master suites into meditative sanctuaries. Its oversized headboard features soft vertical channel cushioning wrapped in tactile cream bouclé, while the recessed dark walnut base creates the illusion of floating above the floor.",
    dimensions: "215cm W × 225cm L × 120cm Headboard H (King Size)",
    materials: "Kiln-dried African Walnut, Belgian Linen-Bouclé Upholstery, Heavy Brass Brackets",
    finish: "Cream White & Deep Walnut",
    featured: true,
    inStock: true
  },
  {
    id: "wg-bed-02",
    name: "Kyoto Cantilevered Walnut Nightstand",
    category: "bedroom",
    categoryLabel: "Bedroom Furniture",
    price: 850000,
    badge: "Bespoke",
    image: "assets/images/prod-walnut-nightstand.jpg",
    shortDesc: "Minimalist dual-tier floating nightstand with soft-close mitered drawer and bronze hardware.",
    description: "Constructed with precision dovetail joinery, the Kyoto Bedside Nightstand showcases continuous waterfall grain running seamlessly across the top and side panels. Features integrated felt-lined interior drawers and concealed wire management.",
    dimensions: "60cm W × 45cm D × 48cm H",
    materials: "Solid American Walnut, Bronzed Iron Accents, Suede Drawer Lining",
    finish: "Hand-rubbed natural walnut oil",
    featured: false,
    inStock: true
  },
  {
    id: "wg-bed-03",
    name: "Ghent Natural Wool & Linen End-of-Bed Bench",
    category: "bedroom",
    categoryLabel: "Bedroom Furniture",
    price: 920000,
    badge: "New Arrival",
    image: "assets/images/prod-linen-bench.jpg",
    shortDesc: "Sculptural pillow-top ottoman bench with solid travertine pillar legs and textured sand wool upholstery.",
    description: "A harmonious balance between heavyweight architectural travertine and tactile softness. The Ghent Bench provides luxurious seating at the foot of the bed or in spacious entry vestibules.",
    dimensions: "150cm W × 50cm D × 45cm H",
    materials: "Travertine Cylinder Legs, High-Density Foam, Textured Sand Linen-Wool Blend",
    finish: "Sand Beige & Warm Travertine",
    featured: false,
    inStock: true
  },

  /* ==========================================================================
     3. DINING ROOM FURNITURE
     ========================================================================== */
  {
    id: "wg-din-01",
    name: "The Castille Solid Smoked Oak Dining Table",
    category: "dining",
    categoryLabel: "Dining Room Furniture",
    price: 4200000,
    badge: "Masterpiece",
    image: "assets/images/prod-oak-dining-table.jpg",
    shortDesc: "Monumental 10-seater dining table with sculptural double pedestal base and hand-scraped dark oak plank top.",
    description: "Designed for grand gatherings and intimate dinners alike, the Castille Dining Table is milled from select centuries-old oak trees. The twin fluted pedestals anchor an expansive 280cm table top treated with natural botanical oils to resist stains while celebrating timber grain.",
    dimensions: "280cm L × 110cm W × 76cm H",
    materials: "FSC-Certified Solid European White Oak, Deep Smoked Finish",
    finish: "Dark Espresso Smoked Oak",
    featured: true,
    inStock: true
  },
  {
    id: "wg-din-02",
    name: "Verona Cantilever Dining Chairs (Set of 2)",
    category: "dining",
    categoryLabel: "Dining Room Furniture",
    price: 1100000,
    badge: "Set of 2",
    image: "assets/images/prod-dining-chairs.jpg",
    shortDesc: "Curved tubular bronze frame dining chairs dressed in glove-soft warm taupe Italian leather.",
    description: "Lightness meets enduring strength. The Verona Chair features an ergonomic cantilevered stance in antique bronzed steel, paired with hand-stitched glove leather seat cushions that provide all-evening dining comfort.",
    dimensions: "54cm W × 58cm D × 82cm H (Seat: 47cm)",
    materials: "Solid Bronzed Steel Frame, Semi-Aniline Italian Leather, Molded Ergonomic Shell",
    finish: "Antique Bronze & Warm Taupe Leather",
    featured: true,
    inStock: true
  },
  {
    id: "wg-din-03",
    name: "Sorento Fluted Marble & Walnut Credenza",
    category: "dining",
    categoryLabel: "Dining Room Furniture",
    price: 3600000,
    badge: "Showroom Feature",
    image: "assets/images/prod-marble-credenza.jpg",
    shortDesc: "Four-door architectural buffet credenza with bookmatched Nero Marquina marble top and fluted tambour fronts.",
    description: "The Sorento Credenza offers sophisticated storage for luxury dinnerware, vintage spirits, and linens. Concealed touch-latch mechanisms maintain unbroken, minimalist facade lines.",
    dimensions: "200cm W × 50cm D × 78cm H",
    materials: "Solid Walnut Tambour Doors, Nero Marquina Italian Marble Top, Brushed Brass Base",
    finish: "Walnut Brown & Polished Nero Marble",
    featured: false,
    inStock: true
  },

  /* ==========================================================================
     4. OFFICE FURNITURE
     ========================================================================== */
  {
    id: "wg-off-01",
    name: "The Bauhaus Executive Walnut Floating Desk",
    category: "office",
    categoryLabel: "Office Furniture",
    price: 3100000,
    badge: "Executive Edition",
    image: "assets/images/prod-executive-desk.jpg",
    shortDesc: "Cantilevered executive study desk with integrated leather workpad, wire conduits, and hidden security drawers.",
    description: "Meticulously proportioned for the discerning leader. The Bauhaus Desk pairs rich warm walnut timber with an embedded espresso leather desk blotter and soft-closing file drawers.",
    dimensions: "200cm W × 90cm D × 75cm H",
    materials: "Select American Walnut Solids & Veneers, Full-Grain Leather Inset, Brass Joinery",
    finish: "Matte Walnut & Espresso Saddle Leather",
    featured: true,
    inStock: true
  },
  {
    id: "wg-off-02",
    name: "Florence Ergonomic Saddle Leather Executive Chair",
    category: "office",
    categoryLabel: "Office Furniture",
    price: 1650000,
    badge: "Ergonomic Luxury",
    image: "assets/images/prod-saddle-chair.jpg",
    shortDesc: "Pneumatic height-adjustable high-back task chair wrapped in supple buttery cognac leather.",
    description: "Engineered for prolonged focus without sacrificing aesthetic integrity. Featuring multi-position synchronous tilt, pneumatic smooth lift, and aluminum castors suited for timber flooring.",
    dimensions: "68cm W × 70cm D × 115-125cm H",
    materials: "Italian Top-Grain Leather, Cast Aluminum Base, High-Density Ergonomic Core",
    finish: "Cognac Brown & Burnished Charcoal Base",
    featured: false,
    inStock: true
  },
  {
    id: "wg-off-03",
    name: "Vanguard Monolithic Architectural Bookcase",
    category: "office",
    categoryLabel: "Office Furniture",
    price: 2750000,
    badge: "Custom Milled",
    image: "assets/images/about-materials.jpg",
    shortDesc: "Open-plan asymmetric display shelving unit in blackened steel and smoked walnut dividers.",
    description: "An elegant stage for curated art objects, volumes, and pottery. The asymmetric bays create a captivating rhythmic composition against minimalist walls.",
    dimensions: "160cm W × 40cm D × 210cm H",
    materials: "Darkened Structural Steel Uprights, Solid Walnut Shelves, Travertine Bookends",
    finish: "Soft Black Steel & Walnut Brown",
    featured: false,
    inStock: true
  },

  /* ==========================================================================
     5. OUTDOOR FURNITURE
     ========================================================================== */
  {
    id: "wg-out-01",
    name: "Solarium Grade-A Teak Double Daybed",
    category: "outdoor",
    categoryLabel: "Outdoor Furniture",
    price: 3400000,
    badge: "All-Weather Resort",
    image: "assets/images/prod-teak-daybed.jpg",
    shortDesc: "Extra-wide outdoor lounger crafted from sustainably harvested Indonesian plantation teak with QuickDry foam cushions.",
    description: "Engineered to withstand tropical sun and rain gracefully. The Grade-A plantation teak contains natural protective oils that resist weathering, turning over years into a stunning silver-grey patina.",
    dimensions: "180cm W × 200cm L × 40cm H",
    materials: "Grade-A Solid Teak, Marine-grade Stainless Steel, Sunbrella Performance Canvas",
    finish: "Natural Teak & Sand Beige Canvas",
    featured: true,
    inStock: true
  },
  {
    id: "wg-out-02",
    name: "Terracotta Minimalist Outdoor Dining Suite",
    category: "outdoor",
    categoryLabel: "Outdoor Furniture",
    price: 2900000,
    badge: "Alfresco Dining",
    image: "assets/images/hero-slide-4.jpg",
    shortDesc: "Powder-coated aluminum outdoor dining table with slatted teak top and six weatherproof rope-woven chairs.",
    description: "Transform terraces and pool decks into sophisticated outdoor dining pavilions. Durable weather-resistant materials designed for effortless alfresco entertaining.",
    dimensions: "Table: 220cm L × 100cm W × 75cm H",
    materials: "Marine Powder-Coated Aluminum, Teak Top, Weatherproof Olefin Rope",
    finish: "Espresso Bronze & Natural Sand Rope",
    featured: false,
    inStock: true
  },
  {
    id: "wg-out-03",
    name: "Monolithic Basalt Stone Outdoor Fire Table",
    category: "outdoor",
    categoryLabel: "Outdoor Furniture",
    price: 1950000,
    badge: "Evening Ambiance",
    image: "assets/images/prod-travertine-table.jpg",
    shortDesc: "Hand-cast architectural concrete fire plinth with lava rocks and concealed electronic ignition system.",
    description: "The dramatic focal point of any luxury terrace. Provides gentle radiant heat and mesmerizing ambient flame for nocturnal garden living.",
    dimensions: "120cm Diameter × 40cm H",
    materials: "Glass-Fiber Reinforced Architectural Concrete, Stainless Steel Burner, Lava Rocks",
    finish: "Charcoal Basalt Finish",
    featured: false,
    inStock: true
  },

  /* ==========================================================================
     6. LUXURY INTERIOR ACCESSORIES
     ========================================================================== */
  {
    id: "wg-acc-01",
    name: "Alabaster & Bronze Sculptural Table Lamp",
    category: "accessories",
    categoryLabel: "Luxury Interior Accessories",
    price: 450000,
    badge: "Artisanal Lighting",
    image: "assets/images/prod-alabaster-lamp.jpg",
    shortDesc: "Solid carved Spanish alabaster cylinder table lamp with solid brushed bronze hardware and linen shade.",
    description: "When illuminated, the natural veining of translucent Spanish alabaster casts a warm, ethereal golden glow across bedside tables and consoles.",
    dimensions: "35cm Diameter × 58cm H",
    materials: "Solid Natural Alabaster Stone, Hand-finished Bronze, Belgian Linen Shade",
    finish: "Warm Translucent Stone & Brushed Bronze",
    featured: true,
    inStock: true
  },
  {
    id: "wg-acc-02",
    name: "Artisan Ceramic Vessel No. 04 (Sculptural Vase)",
    category: "accessories",
    categoryLabel: "Luxury Interior Accessories",
    price: 280000,
    badge: "Atelier Piece",
    image: "assets/images/prod-ceramic-vase.jpg",
    shortDesc: "Hand-thrown stoneware vessel with raw textured sand slip glaze and organic asymmetrical silhouette.",
    description: "Crafted by master ceramic artists in limited studio batches. Designed as a standalone architectural statement or paired with dry botanical branches.",
    dimensions: "28cm Diameter × 42cm H",
    materials: "High-fired Stoneware Clay, Raw Mineral Sand Slip Glaze",
    finish: "Matte Warm Taupe & Sand Texture",
    featured: true,
    inStock: true
  },
  {
    id: "wg-acc-03",
    name: "Atlas Hand-Knotted Organic Wool & Silk Rug",
    category: "accessories",
    categoryLabel: "Luxury Interior Accessories",
    price: 1750000,
    badge: "Heritage Weave",
    image: "assets/images/prod-wool-rug.jpg",
    shortDesc: "High-pile luxury area rug hand-knotted from un-dyed New Zealand virgin wool and raw silk yarns.",
    description: "Woven by generational artisans taking over four months to knot by hand. The subtle high-low pile creates tactile warmth and acoustic serenity in minimalist spaces.",
    dimensions: "300cm × 400cm (Custom Sizes Available)",
    materials: "80% Pure New Zealand Wool, 20% Raw Mulberry Silk",
    finish: "Warm Cream White & Oat Taupe",
    featured: true,
    inStock: true
  }
];

// Helper to format Nigerian Naira
function formatNaira(amount) {
  return "₦" + amount.toLocaleString('en-NG');
}
