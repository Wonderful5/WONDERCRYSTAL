/**
 * DAMSAM Food Wurld - Master Data Source
 * Authentic, reliable configuration, menu catalogue, offers, reviews, and gallery items.
 */

const DAMSAM_CONFIG = {
  name: "DAMSAM Food Wurld",
  shortName: "DAMSAM",
  tagline: "Good Food. Great Moments.",
  subTagline: "FRESH • FLAVORFUL • MADE FOR YOU",
  country: "Nigeria",
  city: "Lagos",
  address: "Plot 14, Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  phone: "+234 803 456 7890",
  altPhone: "+234 901 234 5678",
  whatsapp: "+2348034567890",
  whatsappDisplay: "+234 803 456 7890",
  email: "orders@damsamfoodwurld.com",
  inquiriesEmail: "hello@damsamfoodwurld.com",
  currency: "₦",
  currencyCode: "NGN",
  openingHours: {
    weekdays: "Monday – Thursday: 8:00 AM – 10:00 PM",
    weekend: "Friday – Saturday: 8:00 AM – 11:30 PM",
    sunday: "Sunday: 9:00 AM – 10:30 PM",
    kitchenCloses: "Kitchen orders close 45 mins before closing"
  },
  delivery: {
    baseFee: 1500,
    freeDeliveryThreshold: 25000,
    estimatedMinutes: "35 – 50 mins",
    areas: ["Lekki Phase 1", "Ikoyi", "Victoria Island", "Oniru", "Ajah", "Marina"]
  },
  bankDetails: {
    bankName: "Zenith Bank",
    accountName: "DAMSAM Food Wurld Ltd",
    accountNumber: "1019842750",
    swiftCode: "ZEIBNGLA"
  },
  socialLinks: {
    instagram: "https://instagram.com/damsamfoodwurld",
    facebook: "https://facebook.com/damsamfoodwurld",
    tiktok: "https://tiktok.com/@damsamfoodwurld",
    twitter: "https://twitter.com/damsamfoodwurld"
  }
};

const CATEGORIES = [
  { id: "all", label: "ALL", icon: "fa-border-all" },
  { id: "nigerian", label: "NIGERIAN", icon: "fa-bowl-food" },
  { id: "african", label: "AFRICAN", icon: "fa-earth-africa" },
  { id: "continental", label: "CONTINENTAL", icon: "fa-utensils" },
  { id: "rice-pasta", label: "RICE & PASTA", icon: "fa-bowl-rice" },
  { id: "chicken", label: "CHICKEN", icon: "fa-drumstick-bite" },
  { id: "beef", label: "BEEF", icon: "fa-burger" },
  { id: "seafood", label: "SEAFOOD", icon: "fa-fish" },
  { id: "soups", label: "SOUPS", icon: "fa-mug-hot" },
  { id: "snacks", label: "SNACKS", icon: "fa-cookie-bite" },
  { id: "drinks", label: "DRINKS", icon: "fa-glass-water" },
  { id: "desserts", label: "DESSERTS", icon: "fa-ice-cream" }
];

const MENU_ITEMS = [
  {
    id: "ds-01",
    name: "Jollof Rice & Grilled Chicken",
    category: "rice-pasta",
    mainCategory: "nigerian",
    description: "Signature smoky Nigerian party jollof rice simmered in rich tomato-bell pepper reduction, served with succulent spiced quarter grilled chicken and golden fried sweet plantains (dodo).",
    price: 8500,
    image: "assets/images/jollof-chicken.jpg",
    rating: 4.9,
    reviewsCount: 142,
    prepTime: "25-30 min",
    calories: "780 kcal",
    spicyLevel: 2,
    isFeatured: true,
    isChefSpecial: true,
    isPopular: true,
    available: true,
    tags: ["Best Seller", "Signature", "Smoky Party Style"],
    ingredients: ["Long grain parboiled rice", "Fresh tomatoes & rodo", "Grilled chicken", "Fried sweet plantain", "Herbal spices"],
    addOns: [
      { id: "extra-chicken", name: "Extra Quarter Grilled Chicken", price: 3200 },
      { id: "fried-plantain", name: "Extra Fried Plantain (Dodo)", price: 1200 },
      { id: "coleslaw", name: "Creamy Vegetable Coleslaw", price: 1000 },
      { id: "chapman-can", name: "Chilled House Chapman (500ml)", price: 1800 }
    ]
  },
  {
    id: "ds-02",
    name: "Special Fried Rice & Chicken",
    category: "rice-pasta",
    mainCategory: "nigerian",
    description: "Aromatic basmati fried rice infused with liver cubes, sweet corn, carrots, runner beans and spring onions, accompanied by seasoned crispy golden fried chicken drumsticks.",
    price: 8500,
    image: "assets/images/fried-rice.jpg",
    rating: 4.8,
    reviewsCount: 98,
    prepTime: "25-30 min",
    calories: "740 kcal",
    spicyLevel: 1,
    isFeatured: true,
    isChefSpecial: false,
    isPopular: true,
    available: true,
    tags: ["Party Classic", "Rich Veggies"],
    ingredients: ["Basmati rice", "Diced beef liver", "Carrots & sweet corn", "Seasoned fried chicken", "Vegetable stock"],
    addOns: [
      { id: "extra-chicken", name: "Extra Fried Chicken", price: 3200 },
      { id: "fried-plantain", name: "Fried Plantain", price: 1200 },
      { id: "moi-moi", name: "Gourmet Steamed Moi-Moi", price: 1500 }
    ]
  },
  {
    id: "ds-03",
    name: "Spicy Peppered Beef Chops",
    category: "beef",
    mainCategory: "nigerian",
    description: "Tender chunks of slow-braised prime beef tossed in a fiery, sweet-and-spicy habanero and caramelized bell pepper sauce, garnished with fresh onion rings.",
    price: 9000,
    image: "assets/images/peppered-beef.jpg",
    rating: 4.9,
    reviewsCount: 112,
    prepTime: "20 min",
    calories: "620 kcal",
    spicyLevel: 3,
    isFeatured: true,
    isChefSpecial: true,
    isPopular: true,
    available: true,
    tags: ["Spicy Favorite", "Tender Cuts"],
    ingredients: ["Prime beef cuts", "Red Scotch bonnets", "Sweet red bell peppers", "Caramelized onions", "Native spices"],
    addOns: [
      { id: "extra-pepper-sauce", name: "Extra Spicy Pepper Glaze", price: 800 },
      { id: "fried-yam", name: "Crispy Fried Yam Fries", price: 1800 },
      { id: "chilled-drink", name: "Chilled Malta or Soft Drink", price: 1000 }
    ]
  },
  {
    id: "ds-04",
    name: "Grilled Croaker Fish & Crispy Chips",
    category: "seafood",
    mainCategory: "continental",
    description: "Whole fresh Atlantic croaker fish seasoned with our secret African herb rub, char-grilled to flaky perfection, served with golden potato chips, tartare dip, and spicy chili sauce.",
    price: 13500,
    image: "assets/images/grilled-fish.jpg",
    rating: 5.0,
    reviewsCount: 86,
    prepTime: "30-35 min",
    calories: "810 kcal",
    spicyLevel: 2,
    isFeatured: true,
    isChefSpecial: true,
    isPopular: true,
    available: true,
    tags: ["Chef's Signature", "Fresh Seafood"],
    ingredients: ["Fresh whole croaker", "DAMSAM garlic-herb marinade", "Hand-cut potato chips", "House dip & chili dip"],
    addOns: [
      { id: "extra-chips", name: "Extra Hand-Cut Chips", price: 1500 },
      { id: "grilled-plantain", name: "Roasted Boli (Plantain)", price: 1400 },
      { id: "extra-sauce", name: "Extra Garlic Mayo & Pepper Sauce", price: 900 }
    ]
  },
  {
    id: "ds-05",
    name: "Creamy Garlic Seafood Pasta",
    category: "rice-pasta",
    mainCategory: "continental",
    description: "Al dente fettuccine pasta smothered in a velvety parmesan and garlic cream sauce, tossed with jumbo tiger prawns, calamari rings and finished with fresh parsley and grated pecorino.",
    price: 12500,
    image: "assets/images/creamy-pasta.jpg",
    rating: 4.8,
    reviewsCount: 74,
    prepTime: "25 min",
    calories: "890 kcal",
    spicyLevel: 1,
    isFeatured: true,
    isChefSpecial: false,
    isPopular: true,
    available: true,
    tags: ["Continental Gourmet", "Rich & Creamy"],
    ingredients: ["Fettuccine pasta", "Fresh cream & aged parmesan", "Tiger prawns", "Calamari rings", "Roasted garlic"],
    addOns: [
      { id: "extra-prawns", name: "Extra Grilled Tiger Prawns (4 pcs)", price: 4500 },
      { id: "garlic-bread", name: "Crispy Garlic Baguette (3 slices)", price: 1800 },
      { id: "parmesan-extra", name: "Extra Shaved Aged Parmesan", price: 1200 }
    ]
  },
  {
    id: "ds-06",
    name: "DAMSAM Crispy BBQ Chicken Wings",
    category: "chicken",
    mainCategory: "snacks",
    description: "Eight pieces of jumbo chicken wings double-fried for maximum crunch, generously glazed in our house smoky sweet chili-BBQ sauce, served with carrot-celery sticks and blue cheese dip.",
    price: 7500,
    image: "assets/images/chicken-wings.jpg",
    rating: 4.9,
    reviewsCount: 129,
    prepTime: "20 min",
    calories: "650 kcal",
    spicyLevel: 2,
    isFeatured: true,
    isChefSpecial: false,
    isPopular: true,
    available: true,
    tags: ["Customer Favorite", "Crispy & Saucy"],
    ingredients: ["Crispy chicken wings", "Smoky honey BBQ glaze", "Sesame seeds", "Blue cheese dip"],
    addOns: [
      { id: "french-fries", name: "Crispy French Fries", price: 1500 },
      { id: "extra-wings", name: "4 Additional Wings", price: 3200 },
      { id: "dip-combo", name: "Trio Dip Sauce (Ranch, Spicy, BBQ)", price: 1000 }
    ]
  },
  {
    id: "ds-07",
    name: "Traditional Egusi Soup & Pounded Yam",
    category: "soups",
    mainCategory: "nigerian",
    description: "Rich melon seed soup prepared with bitterleaf or pumpkin leaves, fortified with smoked catfish, stockfish, tender beef tripe (shaki) and cow leg, served with silky smooth pounded yam.",
    price: 9500,
    image: "assets/images/egusi-soup.jpg",
    rating: 5.0,
    reviewsCount: 160,
    prepTime: "25 min",
    calories: "920 kcal",
    spicyLevel: 2,
    isFeatured: true,
    isChefSpecial: true,
    isPopular: true,
    available: true,
    tags: ["Authentic Nigerian", "Swallow Classic"],
    ingredients: ["Hand-ground egusi melon", "Smoked catfish & stockfish", "Assorted meat cuts", "Palm oil & ugwu leaves", "Pounded yam swallow"],
    addOns: [
      { id: "extra-pounded-yam", name: "Extra Wrap of Pounded Yam", price: 1500 },
      { id: "extra-goat-meat", name: "Extra Portion of Fried Goat Meat", price: 3500 },
      { id: "extra-stockfish", name: "Extra Stockfish Head Piece", price: 2500 }
    ]
  },
  {
    id: "ds-08",
    name: "Catfish & Goat Meat Pepper Soup",
    category: "soups",
    mainCategory: "african",
    description: "Steaming aromatic broth prepared with traditional uda, uziza and calabash nutmeg spices, loaded with tender chunks of seasoned goat meat and fresh catfish cutlet.",
    price: 8000,
    image: "assets/images/pepper-soup.jpg",
    rating: 4.8,
    reviewsCount: 88,
    prepTime: "20 min",
    calories: "450 kcal",
    spicyLevel: 3,
    isFeatured: false,
    isChefSpecial: false,
    isPopular: true,
    available: true,
    tags: ["Warming Broth", "Authentic Spices"],
    ingredients: ["Goat meat & fresh catfish", "Uziza seeds & leaves", "Uda pods", "Aromatic native spices", "Hot pepper broth"],
    addOns: [
      { id: "boiled-plantain", name: "Boiled Half-Ripe Plantain", price: 1500 },
      { id: "boiled-yam", name: "Boiled White Yam Cubes", price: 1400 },
      { id: "extra-goat", name: "Extra Goat Meat Portions", price: 3200 }
    ]
  },
  {
    id: "ds-09",
    name: "Grand Seafood Okra Platter",
    category: "soups",
    mainCategory: "seafood",
    description: "Finely diced crunchy okra soup cooked in aromatic seafood broth with giant tiger prawns, blue swimming crab, calamari, fresh snails and dried fish, accompanied by choice of swallow.",
    price: 16000,
    image: "assets/images/seafood-okra.jpg",
    rating: 5.0,
    reviewsCount: 95,
    prepTime: "30 min",
    calories: "850 kcal",
    spicyLevel: 2,
    isFeatured: true,
    isChefSpecial: true,
    isPopular: true,
    available: true,
    tags: ["Luxury Seafood", "Rich & Fresh"],
    ingredients: ["Crunchy diced okra", "Whole blue crab", "Jumbo tiger prawns", "Sea snails & calamari", "Choice of swallow"],
    addOns: [
      { id: "extra-swallow", name: "Extra Pounded Yam or Eba", price: 1500 },
      { id: "extra-crab", name: "Extra Whole Blue Crab", price: 4000 },
      { id: "extra-snails", name: "Jumbo Fried Snails (2 pcs)", price: 4500 }
    ]
  },
  {
    id: "ds-10",
    name: "Classic Nigerian Meat Pie (2 pcs)",
    category: "snacks",
    mainCategory: "snacks",
    description: "Golden flaky pastry crust baked to crisp perfection, filled with richly seasoned minced beef, soft potato cubes and sweet carrots in a savory thick gravy.",
    price: 3500,
    image: "assets/images/meat-pie.jpg",
    rating: 4.7,
    reviewsCount: 62,
    prepTime: "10 min",
    calories: "510 kcal",
    spicyLevel: 1,
    isFeatured: false,
    isChefSpecial: false,
    isPopular: false,
    available: true,
    tags: ["Freshly Baked", "Golden Flaky"],
    ingredients: ["Flaky butter pastry", "Minced prime beef", "Diced potatoes & carrots", "Nutmeg & herb seasoning"],
    addOns: [
      { id: "extra-pie", name: "Add 1 Additional Meat Pie", price: 1600 },
      { id: "drink-chilled", name: "Chilled Soft Drink / Water", price: 800 }
    ]
  },
  {
    id: "ds-11",
    name: "DAMSAM Deluxe Chicken & Beef Shawarma",
    category: "snacks",
    mainCategory: "continental",
    description: "Warm flatbread loaded with shredded char-grilled chicken breast, tender beef strips, double cocktail sausages, crunchy cabbage slaw and our legendary creamy spicy garlic sauce.",
    price: 4500,
    image: "assets/images/shawarma.jpg",
    rating: 4.9,
    reviewsCount: 180,
    prepTime: "15 min",
    calories: "690 kcal",
    spicyLevel: 2,
    isFeatured: false,
    isChefSpecial: false,
    isPopular: true,
    available: true,
    tags: ["Loaded Wrap", "Double Sausage"],
    ingredients: ["Toasted pita bread", "Grilled chicken & beef strips", "Double sausage links", "Signature garlic cream dressing"],
    addOns: [
      { id: "extra-cheese", name: "Melted Mozzarella & Cheddar", price: 1000 },
      { id: "extra-sausage", name: "Extra Sausage Link", price: 800 },
      { id: "extra-spicy", name: "Extra Suya Pepper Kick", price: 300 }
    ]
  },
  {
    id: "ds-12",
    name: "Signature Nigerian Chapman",
    category: "drinks",
    mainCategory: "drinks",
    description: "The quintessential Nigerian mocktail: vibrant blend of Fanta, Sprite, Angostura bitters, grenadine, garnished with fresh cucumber ribbons, orange wheels, and garden mint over ice.",
    price: 2500,
    image: "assets/images/chapman.jpg",
    rating: 4.9,
    reviewsCount: 130,
    prepTime: "5 min",
    calories: "180 kcal",
    spicyLevel: 0,
    isFeatured: false,
    isChefSpecial: false,
    isPopular: true,
    available: true,
    tags: ["House Special Drink", "Refreshing"],
    ingredients: ["Citrus soda blend", "Pomegranate grenadine", "Aromatic bitters", "Cucumber & citrus garnish"],
    addOns: [
      { id: "pitcher-upgrade", name: "Upgrade to 1.5L Sharing Pitcher", price: 4500 }
    ]
  },
  {
    id: "ds-13",
    name: "Tropical Sunrise Fruit Smoothie",
    category: "drinks",
    mainCategory: "drinks",
    description: "100% natural cold-pressed smoothie made with ripe Nigerian mangoes, sweet pineapples, passion fruit puree, and organic ginger with a touch of wildflower honey.",
    price: 3000,
    image: "assets/images/smoothie.jpg",
    rating: 4.8,
    reviewsCount: 52,
    prepTime: "5 min",
    calories: "210 kcal",
    spicyLevel: 0,
    isFeatured: false,
    isChefSpecial: false,
    isPopular: false,
    available: true,
    tags: ["100% Natural", "No Added Sugar"],
    ingredients: ["Fresh mango", "Pineapple chunks", "Passion fruit", "Fresh ginger & honey"],
    addOns: [
      { id: "chia-seeds", name: "Add Organic Chia Seeds", price: 500 }
    ]
  },
  {
    id: "ds-14",
    name: "Molten Chocolate & Red Velvet Cake",
    category: "desserts",
    mainCategory: "desserts",
    description: "A decadent duet of warm molten dark chocolate cake with a gooey center paired with a velvety soft red velvet slice, served with rich vanilla bean cream.",
    price: 4500,
    image: "assets/images/dessert-cake.jpg",
    rating: 4.9,
    reviewsCount: 65,
    prepTime: "10 min",
    calories: "520 kcal",
    spicyLevel: 0,
    isFeatured: false,
    isChefSpecial: false,
    isPopular: true,
    available: true,
    tags: ["Decadent", "Warm Center"],
    ingredients: ["Belgian dark cocoa", "Cream cheese frosting", "Madagascar vanilla", "Fresh berries"],
    addOns: [
      { id: "ice-cream-scoop", name: "Extra Scoop Vanilla Gelato", price: 1200 }
    ]
  }
];

const SPECIAL_OFFERS = [
  {
    id: "offer-01",
    badge: "WEEKEND SPECIAL",
    code: "WEEKENDJOY",
    title: "The DAMSAM Feast Combo",
    subtitle: "Smoky Jollof Rice + Grilled Chicken Quarter + Golden Dodo + Chilled Chapman",
    description: "Our #1 customer favorite bundled into a celebratory weekend meal pack. Cooked fresh with authentic Nigerian firewood smokiness.",
    regularPrice: 12500,
    offerPrice: 9900,
    discountPercent: 21,
    image: "assets/images/jollof-chicken.jpg",
    validUntil: "Every Friday – Sunday",
    itemsIncluded: [
      "1x Smoky Party Jollof Rice",
      "1x Herb-Basted Grilled Chicken",
      "1x Golden Fried Plantain (Dodo)",
      "1x Signature House Chapman (500ml)"
    ]
  },
  {
    id: "offer-02",
    badge: "FAMILY PACK",
    code: "FAMILY20",
    title: "Sunday Family Banquet",
    subtitle: "Jollof Rice Platter + Fried Rice Platter + 4 Grilled Chicken Pieces + 2 Meat Pies + 2L Drinks",
    description: "Feed up to 4-5 people with our generous family feast platter designed for gatherings, after-church lunches, and family get-togethers.",
    regularPrice: 38000,
    offerPrice: 29500,
    discountPercent: 22,
    image: "assets/images/hero-food.jpg",
    validUntil: "Available Every Day",
    itemsIncluded: [
      "Large Platter Jollof Rice",
      "Large Platter Fried Rice",
      "4x Crispy Spiced Chicken Quarters",
      "2x Freshly Baked Meat Pies",
      "1x 2L Soft Beverage"
    ]
  },
  {
    id: "offer-03",
    badge: "LUNCH EXPRESS",
    code: "LUNCH10",
    title: "Corporate Lunch Box",
    subtitle: "Special Fried Rice + Crispy Chicken + Coleslaw + Bottled Water",
    description: "Speedy 30-minute delivery to offices across Lekki, Victoria Island, and Ikoyi. Packed in premium leak-proof microwaveable containers.",
    regularPrice: 9500,
    offerPrice: 7500,
    discountPercent: 21,
    image: "assets/images/fried-rice.jpg",
    validUntil: "Monday – Friday (11:30 AM – 3:30 PM)",
    itemsIncluded: [
      "1x Special Fried Rice Box",
      "1x Seasoned Fried Chicken Cut",
      "1x Fresh Vegetable Coleslaw",
      "1x Chilled Bottled Water"
    ]
  }
];

const REVIEWS = [
  {
    id: "rev-01",
    author: "Dr. Babatunde Alabi",
    role: "Verified Diner & Food Critic",
    rating: 5,
    date: "November 14, 2026",
    comment: "The smoky party jollof rice at DAMSAM Food Wurld is easily one of the best in Lagos! The grilled chicken was juicy, deeply flavorful, and not dry at all. Ordering online was smooth, and my delivery arrived in under 40 minutes warm and neatly packed.",
    avatar: "BA",
    favoriteDish: "Jollof Rice & Grilled Chicken"
  },
  {
    id: "rev-02",
    author: "Ngozi Okafor",
    role: "Regular Customer",
    rating: 5,
    date: "November 18, 2026",
    comment: "The seafood okra platter was exceptional — packed with real jumbo prawns, crab, and rich stock. The atmosphere in the dining room is modern, serene, and clean. This has become my family's go-to spot for weekend dining.",
    avatar: "NO",
    favoriteDish: "Grand Seafood Okra Platter"
  },
  {
    id: "rev-03",
    author: "Tariq Adeleke",
    role: "Office Lunch Coordinator",
    rating: 5,
    date: "November 20, 2026",
    comment: "We regularly order lunch boxes for our team at Admiralty Way. Portions are generous, presentation is top-notch, and the peppered beef has just the right spicy kick without being overwhelming.",
    avatar: "TA",
    favoriteDish: "Spicy Peppered Beef & Fried Rice"
  },
  {
    id: "rev-04",
    author: "Amina Yusuf",
    role: "Lekki Resident",
    rating: 5,
    date: "November 22, 2026",
    comment: "Made a table reservation online for my anniversary dinner. The table was prepared beautifully with candles, the staff was extremely courteous, and the grilled croaker fish was sublime. 10/10 experience!",
    avatar: "AY",
    favoriteDish: "Grilled Croaker Fish & Chips"
  }
];

const GALLERY_ITEMS = [
  { id: "g-01", category: "food", title: "Signature Party Jollof & Chicken", image: "assets/images/jollof-chicken.jpg", caption: "Our crowd-favorite smoky party jollof rice served with grilled chicken and plantain." },
  { id: "g-02", category: "restaurant", title: "Warm Contemporary Dining Hall", image: "assets/images/restaurant-interior.jpg", caption: "Designed for comfort, romantic dinners, and family celebrations." },
  { id: "g-03", category: "food", title: "Char-Grilled Atlantic Croaker", image: "assets/images/grilled-fish.jpg", caption: "Fresh ocean catch marinated with African native herbs and lemon." },
  { id: "g-04", category: "events", title: "Intimate Table Setup & Candlelight", image: "assets/images/reservation-bg.jpg", caption: "Reserved table ready for an evening dining experience." },
  { id: "g-05", category: "food", title: "Creamy Garlic Seafood Pasta", image: "assets/images/creamy-pasta.jpg", caption: "Velvety alfredo sauce with jumbo tiger prawns and parmesan." },
  { id: "g-06", category: "restaurant", title: "The Master Kitchen & Chefs", image: "assets/images/about-kitchen.jpg", caption: "Where our culinary brigade crafts every meal from scratch daily." },
  { id: "g-07", category: "food", title: "Spicy Peppered Beef Chops", image: "assets/images/peppered-beef.jpg", caption: "Slow-braised beef tossed in habanero bell pepper glaze." },
  { id: "g-08", category: "events", title: "Celebrations & Dining Moments", image: "assets/images/gallery-event.jpg", caption: "Friends and families enjoying good food and great moments together." },
  { id: "g-09", category: "food", title: "Artisan Plating & Culinary Detail", image: "assets/images/gallery-plating.jpg", caption: "Every dish is prepared with culinary passion and modern aesthetics." }
];
