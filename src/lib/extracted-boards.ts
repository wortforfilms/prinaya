import type { CapabilityStatus } from "./status";

export type ExtractedDesignOption = {
  id: string;
  label: string;
  status: CapabilityStatus;
  style: string;
  dimensions?: string;
  features: string[];
  palette: string[];
  route: string;
};

export type ExtractedTechnicalPanel = {
  label: string;
  status: CapabilityStatus;
  extractedItems: string[];
};

export type ExtractedBoard = {
  id: string;
  title: string;
  image: string;
  dimensions: string;
  status: CapabilityStatus;
  sourceTheme: "sci-fi" | "vedic" | "traditional" | "unique" | "all-pages" | "dashboard";
  route: string;
  summary: string;
  options: ExtractedDesignOption[];
  panels: ExtractedTechnicalPanel[];
  materials: string[];
  notes: string[];
};

export const extractedBoards: ExtractedBoard[] = [
  {
    id: "sci-fi-futuristic-options",
    title: "Indian Marriage Setup - Sci-Fi & Futuristic Design Options",
    image: "/extracted-boards/sci-fi-futuristic-options.png",
    dimensions: "1536x1024",
    status: "READY",
    sourceTheme: "sci-fi",
    route: "/ai/sci-fi-options",
    summary:
      "Six futuristic wedding stage options with front elevations, top plans, lighting strategy, material finishes, fabric options, and night render references.",
    options: [
      {
        id: "galactic-portal",
        label: "Option 1 - Galactic Portal",
        status: "READY",
        style: "Circular LED galaxy portal with fiber-optic star ceiling",
        dimensions: "40'-0\" x 20'-0\" x 16'-0\"",
        features: ["Circular portal with LED galaxy", "Fiber optic star ceiling", "Metallic finishes and acrylic panels", "Programmable LED light strips"],
        palette: ["cyan", "deep blue", "violet", "ice white", "gunmetal"],
        route: "/lighting/galactic-portal"
      },
      {
        id: "neon-horizon",
        label: "Option 2 - Neon Horizon",
        status: "READY",
        style: "Geometric neon frame stage with holographic panels",
        dimensions: "38'-0\" x 20'-0\" x 15'-0\"",
        features: ["Geometric LED frames", "Neon light accents", "Glossy black flooring", "Holographic back panels"],
        palette: ["hot pink", "electric blue", "purple", "lavender", "black"],
        route: "/lighting/neon-horizon"
      },
      {
        id: "cosmic-wave",
        label: "Option 3 - Cosmic Wave",
        status: "READY",
        style: "Flowing iridescent wave structure with star curtain",
        dimensions: "36'-0\" x 20'-0\" x 15'-6\"",
        features: ["Flowing wave structures", "LED star curtain", "3D printed panels", "Iridescent chrome finish"],
        palette: ["pearl lavender", "soft blue", "iridescent white", "mist", "black"],
        route: "/vr/cosmic-wave"
      },
      {
        id: "cyberpunk-city",
        label: "Option 4 - Cyberpunk City",
        status: "READY",
        style: "Neon city wall with holographic cyber panels",
        dimensions: "42'-0\" x 20'-0\" x 16'-0\"",
        features: ["Neon signage and LED walls", "Industrial metal frames", "Holographic and acrylic elements", "Urban futuristic vibe"],
        palette: ["magenta", "cyan", "violet", "blue", "black"],
        route: "/ai/cyberpunk-city"
      },
      {
        id: "starship-command",
        label: "Option 5 - Starship Command",
        status: "READY",
        style: "Starship cockpit wedding command stage",
        dimensions: "40'-0\" x 20'-0\" x 15'-0\"",
        features: ["Starship cockpit design", "Animated LED screens", "Metallic panels and trims", "Futuristic control-console look"],
        palette: ["navy", "steel blue", "silver", "white", "black"],
        route: "/cad/starship-command"
      },
      {
        id: "quantum-garden",
        label: "Option 6 - Quantum Garden",
        status: "READY",
        style: "Glowing acrylic garden rings with suspended greenery",
        dimensions: "38'-0\" x 20'-0\" x 16'-0\"",
        features: ["Glowing rings and light tunnels", "Acrylic hanging gardens", "LED fiber curtains", "Minimal ethereal vibe"],
        palette: ["aqua", "teal", "ivory", "sage", "charcoal"],
        route: "/floral/quantum-garden"
      }
    ],
    panels: [
      { label: "Key Plan", status: "READY", extractedItems: ["stage", "seating blocks", "entrance", "not-to-scale plan"] },
      { label: "Stage Platform Detail", status: "READY", extractedItems: ["2 inch top ply", "LED strip", "acrylic edge", "MS frame structure as per site"] },
      { label: "Sections", status: "READY", extractedItems: ["front section A-A", "side section B-B", "16 foot height", "20 foot depth"] },
      { label: "Lighting Plan", status: "READY", extractedItems: ["moving head", "LED par light", "wash light", "uplight", "laser light", "strobe", "star curtain"] },
      { label: "3D Render View", status: "READY", extractedItems: ["night render", "portal stage", "decor flower clusters", "client sofa"] }
    ],
    materials: ["mirror", "acrylic", "metal mesh", "LED panel", "holographic", "glossy PU", "glass", "stone finish", "satin", "chiffon", "georgette", "velvet", "organza", "sheer"],
    notes: ["All dimensions are in feet and inches", "Stage height 2'-0\" from floor level", "Electrical points as per lighting plan", "Designs can be customized by venue and budget"]
  },
  {
    id: "vedic-sacred-traditional-options",
    title: "Vedic Indian Marriage Setup - Sacred Traditional Timeless",
    image: "/extracted-boards/vedic-sacred-traditional-options.png",
    dimensions: "1624x969",
    status: "READY",
    sourceTheme: "vedic",
    route: "/mandap/vedic-sacred",
    summary:
      "Twelve Vedic mandap concepts with ritual, floral, fire, pillar, jali, kalash, material, lighting, and general-note extraction.",
    options: [
      option("vedic-raj-mandap", "1 - Vedic Raj Mandap", "READY", "Royal palace mandap with domes and red floral toran", "/mandap/vedic-raj"),
      option("sacred-fire-mandap", "2 - Sacred Fire (Agni) Mandap", "READY", "Agni kund-centered mandap with Om ceiling and warm lamps", "/mandap/agni"),
      option("kalash-mandap", "3 - Kalash Mandap", "READY", "Golden kalash centerpiece, white florals, banana leaves", "/mandap/kalash"),
      option("vyasa-peetham", "4 - Vyasa Peetham", "READY", "Round teaching platform with floral canopy and sacred seating", "/mandap/vyasa-peetham"),
      option("panch-tatva-mandap", "5 - Panch Tatva Mandap", "READY", "Five-element mandap with water/fire/space symbolism", "/mandap/panch-tatva"),
      option("vedic-lotus-mandap", "6 - Vedic Lotus Mandap", "READY", "Layered lotus petal mandap in pink and ivory", "/mandap/vedic-lotus"),
      option("nagara-temple-mandap", "7 - Nagara Temple Mandap", "READY", "Temple facade mandap with elevated steps", "/mandap/nagara-temple"),
      option("ayurvedic-green-mandap", "8 - Ayurvedic Green Mandap", "READY", "Green natural mandap with hanging plants and herbs", "/floral/ayurvedic-green"),
      option("saptapadi-circle-mandap", "9 - Saptapadi Circle Mandap", "READY", "Circular ritual mandap with ring canopy and central fire", "/layouts/circular-saptapadi"),
      option("vedic-celestial-mandap", "10 - Vedic Celestial Mandap", "READY", "Moon, stars, nakshatra ceiling and royal seating", "/lighting/vedic-celestial"),
      option("rishi-ashram-mandap", "11 - Rishi Ashram Mandap", "READY", "Ashram-inspired timber and mantra wall design", "/mandap/rishi-ashram"),
      option("south-indian-brahma-mandap", "12 - South Indian Brahma Mandap", "READY", "Banana leaf, brass lamp, and red-carpet South Indian setup", "/mandap/south-indian-brahma")
    ],
    panels: [
      { label: "Key Plan", status: "READY", extractedItems: ["stage", "entry", "seating blocks", "floral perimeter"] },
      { label: "Elevations", status: "READY", extractedItems: ["front elevation", "side elevation", "16 foot height", "40 foot width", "20 foot depth"] },
      { label: "Sacred Fire Detail", status: "READY", extractedItems: ["Agni kund", "5 foot by 5 foot footprint", "floral edge", "raised fire bowl"] },
      { label: "Pillar/Jali/Kalash Details", status: "READY", extractedItems: ["pillar options", "jali panels", "vase options", "kalash options"] },
      { label: "Material and Floral Ideas", status: "READY", extractedItems: ["wood carving", "stone finish", "brass antique", "gold leaf", "hand-painted", "kota stone", "rattan", "bamboo", "jute"] }
    ],
    materials: ["wooden carving", "stone finish", "brass antique", "gold leaf", "hand painted", "kota stone", "rattan", "bamboo", "jute", "marigold", "mogra", "lotus", "jasmine", "tulsi", "banana leaves"],
    notes: ["Vedic ritual friendly", "Traditional elements", "Sustainable materials", "Modular and reusable", "Safe and sturdy structure"]
  },
  {
    id: "traditional-royal-cad-presentation",
    title: "Indian Marriage Setup - Design Board",
    image: "/extracted-boards/traditional-royal-cad-presentation.png",
    dimensions: "1536x1024",
    status: "READY",
    sourceTheme: "traditional",
    route: "/cad/traditional-royal-board",
    summary:
      "Single detailed CAD presentation board for a traditional royal stage with project metadata, dimensions, plan/elevation/sections, details, materials, and lighting legend.",
    options: [
      {
        id: "traditional-royal-stage",
        label: "Traditional Royal Stage",
        status: "READY",
        style: "Grand elegant Indian wedding stage with floral decor, carved panels, golden accents, and warm lighting",
        dimensions: "40'-0\" W x 20'-0\" D x 16'-0\" H",
        features: ["floral decor", "carved panels", "golden accents", "soft lighting", "front elevation", "top plan", "3D perspective"],
        palette: ["gold", "cream", "pink", "ivory", "olive"],
        route: "/mandap/traditional-royal"
      }
    ],
    panels: [
      { label: "Project Metadata", status: "READY", extractedItems: ["Indian wedding setup", "Banquet hall/lawn", "traditional/royal theme", "date 27-05-2024"] },
      { label: "Plan and Elevation", status: "READY", extractedItems: ["front elevation", "plan top view", "section A-A", "section B-B"] },
      { label: "Detail Panels", status: "READY", extractedItems: ["decorative panel", "column detail", "pedestal/vase detail"] },
      { label: "Lighting Plan", status: "READY", extractedItems: ["LED par light", "moving head", "uplight", "chandelier", "focus light"] }
    ],
    materials: ["plywood", "MS frame", "white carpet finish", "MDF", "wood CNC work", "fiber/MDF columns", "golden paint", "premium satin/chiffon drapes", "fresh flower decor"],
    notes: ["All dimensions in feet and inches", "Stage height 2'-0\" from floor level", "Confirm all sizes at site before execution", "Electrical points as per lighting plan"]
  },
  {
    id: "vedic-sacred-design-options",
    title: "Indian Marriage Setup - Vedic & Sacred Design Options",
    image: "/extracted-boards/vedic-sacred-design-options.png",
    dimensions: "1536x1024",
    status: "READY",
    sourceTheme: "vedic",
    route: "/mandap/vedic-options",
    summary:
      "Six Vedic/sacred mandap options with temple, agni, rishi, lotus, wooden heritage, and cosmic variants plus details for pillars, panels, drapes, and lighting.",
    options: [
      option("vedic-raj-option", "Option 1 - Vedic Raj Mandap", "READY", "Traditional temple pillars, carved shikhar, brass diyas, floral toran", "/mandap/vedic-raj"),
      option("vedic-yagya-option", "Option 2 - Vedic Yagya Mandap", "READY", "Open mandap with cloth canopy, mango leaf vines, natural materials", "/mandap/yagya"),
      option("sapta-rishi-option", "Option 3 - Sapta Rishi Mandap", "READY", "Rishi statues, circular roof, sacred carved motifs", "/mandap/sapta-rishi"),
      option("vedic-lotus-option", "Option 4 - Vedic Lotus Mandap", "READY", "Lotus petal backdrop, curved petals, floral ceiling", "/mandap/vedic-lotus"),
      option("vedic-wooden-heritage", "Option 5 - Vedic Wooden Heritage", "READY", "Hand-carved wooden mandap with banana plants and lamps", "/mandap/wooden-heritage"),
      option("vedic-cosmic-option", "Option 6 - Vedic Cosmic Mandap", "READY", "Cosmic ceiling with nakshatra lights and planetary symbols", "/lighting/vedic-cosmic")
    ],
    panels: [
      { label: "Key Plan", status: "READY", extractedItems: ["stage", "guest seating", "entrance"] },
      { label: "Platform Detail", status: "READY", extractedItems: ["2 inch thick ply", "top finish with carpet", "MS pipe structure"] },
      { label: "Section Details", status: "READY", extractedItems: ["front section", "side section", "16 foot/12 foot markers"] },
      { label: "Pillar and Decorative Elements", status: "READY", extractedItems: ["pillar options", "toran", "kalash", "deep stambh", "vedic motifs", "jali panel"] }
    ],
    materials: ["teak wood", "stone finish", "gold leaf", "brass antique", "marble finish", "fabric drapes", "jute/kush grass", "silk", "satin", "cotton", "chiffon", "banarasi", "linen"],
    notes: ["Vastu compliant designs", "Reusable and modular elements", "Eco-friendly materials", "Safe and stable structure"]
  },
  {
    id: "general-design-options",
    title: "Indian Marriage Setup - Design Options",
    image: "/extracted-boards/general-design-options.png",
    dimensions: "1536x1024",
    status: "READY",
    sourceTheme: "traditional",
    route: "/templates/design-options",
    summary:
      "Six broad wedding-stage design options including royal, modern floral, heritage, minimal, rustic boho, and destination beach themes.",
    options: [
      option("traditional-royal", "Option 1 - Traditional Royal", "READY", "Carved backdrop, floral garland, gold pillars, warm chandeliers", "/mandap/traditional-royal"),
      option("modern-floral-elegance", "Option 2 - Modern Floral Elegance", "READY", "Modern frame, hanging florals, pastel palette", "/floral/modern-elegance"),
      option("grand-heritage", "Option 3 - Grand Heritage", "READY", "Heritage domes, temple columns, brass lamps, red drapes", "/mandap/grand-heritage"),
      option("minimal-contemporary", "Option 4 - Minimal & Contemporary", "READY", "Clean lines, white florals, neutral palette", "/mandap/minimal-contemporary"),
      option("rustic-boho", "Option 5 - Rustic Boho", "READY", "Wooden textures, pampas, earthy tones", "/templates/rustic-boho"),
      option("destination-beach", "Option 6 - Destination / Beach Theme", "READY", "White drapes, greenery, natural texture, beach-front setup", "/venue-designer/beach")
    ],
    panels: [
      { label: "Key Plan", status: "READY", extractedItems: ["stage", "guest seating", "entrance"] },
      { label: "Stage Platform Detail", status: "READY", extractedItems: ["2 inch thick ply", "top finish with carpet", "MS pipe structure"] },
      { label: "Section and Details", status: "READY", extractedItems: ["section A-A", "section B-B", "column detail", "decorative panel", "pedestal/vase detail"] },
      { label: "Lighting and Drape Options", status: "READY", extractedItems: ["LED par light", "moving head", "wash light", "warm fairy light", "chandelier", "uplight", "satin", "chiffon", "georgette", "velour"] }
    ],
    materials: ["carved MDF/CNC panels", "fabric drapes", "artificial flowers", "plywood platform with carpet", "golden paint", "MS frame", "wood finish", "stone finish", "gold metal", "brass", "mirror", "jali/CNC cut"],
    notes: ["Suitable for indoor/outdoor setups", "Modular and reusable elements", "Customizable designs as per budget", "Safe and stable structure"]
  },
  {
    id: "vedic-lotus-all-pages-board",
    title: "Vedic Lotus Mandap - All Pages Board",
    image: "/extracted-boards/vedic-lotus-all-pages-board.png",
    dimensions: "1536x1024",
    status: "READY",
    sourceTheme: "all-pages",
    route: "/templates/vedic-lotus",
    summary:
      "Eight-page Vedic Lotus Mandap presentation: cover, concept, master plan, 3D views, elevations, details, lighting, and technical information.",
    options: [
      option("cover-board", "01 - Cover Board", "READY", "Hero mandap cover with sacred/traditional/elegant positioning", "/gallery/cover-board"),
      option("concept-theme", "02 - Concept & Theme", "READY", "Sacred traditional theme with palette and materials", "/gallery/concept-theme"),
      option("master-layout-plan", "03 - Master Layout Plan", "READY", "Top view master site plan with numbered legend and capacity", "/layouts/master-plan"),
      option("perspective-views", "04 - 3D Perspective Views", "READY", "Multi-angle day/night mandap renders", "/vr/perspective-views"),
      option("elevations-sections", "05 - Elevations & Sections", "READY", "Front, side, and section panels", "/cad/elevations-sections"),
      option("details-elements", "06 - Details & Elements", "READY", "Roof, pillar, gate, havan kund, decorative elements", "/assets/details-elements"),
      option("lighting-ceiling", "07 - Lighting Plan & Ceiling Design", "READY", "Top lighting plan and ceiling detail", "/lighting/ceiling-design"),
      option("technical-general", "08 - Technical & General Information", "READY", "Platform, truss, electrical, fabric palette, legend", "/production/technical-info")
    ],
    panels: [
      { label: "Master Layout Legend", status: "READY", extractedItems: ["entry gate", "welcome area", "water feature", "main mandap", "havan kund", "bride/groom area", "family seating", "guest seating", "dining area", "stage", "photo zone", "service area", "exit gate"] },
      { label: "Capacity", status: "READY", extractedItems: ["2500-3000 pax", "120 foot by 100 foot total area"] },
      { label: "Lighting Legend", status: "READY", extractedItems: ["moving head", "LED par light", "wash light", "uplight", "profile light", "laser light", "fairy light", "ground spot", "chandelier"] },
      { label: "Technical Info", status: "READY", extractedItems: ["stage platform", "truss structure", "electrical schematic", "drape/fabric palette", "safety legend"] }
    ],
    materials: ["gold leaf", "stone finish", "wood finish", "metal antique", "fabric drapes", "fresh flowers", "water reflection", "silk drapes", "velvet fabric", "organza fabric", "net fabric", "marble", "kota stone", "wooden floor", "carpet", "granite", "grass"],
    notes: ["Where tradition meets perfection", "Custom design", "Premium quality", "Expert execution", "Memorable events"]
  },
  {
    id: "unique-design-options",
    title: "Indian Marriage Setup - Unique Design Options",
    image: "/extracted-boards/unique-design-options.png",
    dimensions: "1536x1024",
    status: "READY",
    sourceTheme: "unique",
    route: "/templates/unique-options",
    summary:
      "Nine creative wedding stage options including celestial garden, royal courtyard, forest, monochrome, Moroccan, floral cloud, temple, contemporary curves, and beach bliss.",
    options: [
      option("celestial-garden", "Option 1 - Celestial Garden", "READY", "Crescent backdrop with hanging greenery and warm lighting", "/templates/celestial-garden"),
      option("royal-rajasthani-courtyard", "Option 2 - Royal Rajasthani Courtyard", "READY", "Jharokha arches, carved panels, bougainvillea and marigold decor", "/mandap/rajasthani-courtyard"),
      option("mystic-forest", "Option 3 - Mystic Forest", "READY", "Tree and branch structures with hanging pendants", "/floral/mystic-forest"),
      option("minimal-monochrome", "Option 4 - Minimal Monochrome", "READY", "Arched layers, black and white florals, clean symmetry", "/templates/minimal-monochrome"),
      option("moroccan-nights", "Option 5 - Moroccan Nights", "READY", "Moroccan arches, lanterns, rich fabrics", "/templates/moroccan-nights"),
      option("floating-floral-cloud", "Option 6 - Floating Floral Cloud", "READY", "Hanging floral installation and pastel palette; rigging safety blocked", "/floral/floating-cloud"),
      option("temple-inspired", "Option 7 - Temple Inspired", "READY", "Temple pillars, sacred stone, brass lamps, diyas", "/mandap/temple-inspired"),
      option("contemporary-curves", "Option 8 - Contemporary Curves", "READY", "Curved layered backdrop with metallic accents and statement florals", "/templates/contemporary-curves"),
      option("beach-front-bliss", "Option 9 - Beach Front Bliss", "READY", "Open airy beach-front structure with rattan and white florals", "/venue-designer/beach-front")
    ],
    panels: [
      { label: "Plan and Platform", status: "READY", extractedItems: ["key plan", "stage platform detail", "guest seating", "entrance"] },
      { label: "Elevation and Sections", status: "READY", extractedItems: ["front view", "side view", "20 foot width", "section details"] },
      { label: "Decorative Options", status: "READY", extractedItems: ["arch options", "panel options", "column options", "floral and greenery ideas"] },
      { label: "Lighting Options", status: "READY", extractedItems: ["chandelier", "crystal drop", "fairy lights", "pendant lantern", "uplights", "spot lights"] }
    ],
    materials: ["wood finish", "stone finish", "gold metal", "brass", "mirror", "jali/CNC cut", "fabric drapes", "satin", "chiffon", "georgette", "organza", "velvet", "linen"],
    notes: ["Creative elegant memorable concepts", "Indoor/outdoor suitability varies by option", "Rigging and structural safety remain blocked where suspended florals are used"]
  },
  {
    id: "all-pages-black-gold-board",
    title: "Indian Marriage Setup - All Pages Black Gold Board",
    image: "/extracted-boards/all-pages-black-gold-board.png",
    dimensions: "1536x1024",
    status: "READY",
    sourceTheme: "all-pages",
    route: "/gallery/all-pages-board",
    summary:
      "Twelve-board black/gold presentation covering cover, design concept, site plan, mandap views, stage, entry gate, seating, lighting, sections, decor, material board, and 3D renders.",
    options: [
      option("page-cover", "01 - Cover Board", "READY", "Indian marriage setup cover board with sacred/timeless/memorable positioning", "/gallery/cover-board"),
      option("page-design-concept", "02 - Design Concept", "READY", "Theme, key themes, color palette, mood board", "/gallery/design-concept"),
      option("page-site-layout", "03 - Site Layout Plan", "READY", "Numbered top-view venue plan and parking area", "/venue-designer/site-layout"),
      option("page-mandap-plan", "04 - Mandap Plan, Elevation & 3D View", "READY", "Plan, front elevation, side elevation, isometric view", "/mandap/plan-elevation"),
      option("page-stage-design", "05 - Stage Design", "READY", "Stage front elevation, plan, 3D view, lighting mood", "/production/stage-design"),
      option("page-entry-gate", "06 - Entry Gate Design", "READY", "Royal entrance gate with plan and 3D view", "/venue-designer/entry-gate"),
      option("page-seating-layout", "07 - Seating Layout Plan", "READY", "VIP, premium, general, family seating and total capacity", "/guests/seating-layout"),
      option("page-lighting-plan", "08 - Lighting Design Plan", "READY", "Lighting top view with legend and mood images", "/lighting/design-plan"),
      option("page-sections", "09 - Section & Elevation Views", "READY", "Long front/side sections and elevation views", "/cad/sections"),
      option("page-decor-floral", "10 - Decor & Floral Design", "READY", "Mandap, stage, walkway, ceiling, centerpiece and floral palette", "/floral/decor-board"),
      option("page-material-board", "11 - Material Board", "READY", "Structure, fabrics, flooring, lighting fixture materials", "/assets/material-board"),
      option("page-renders-night", "12 - 3D Renders & Night View", "READY", "Day and night render panels", "/vr/night-view")
    ],
    panels: [
      { label: "Site Legend", status: "READY", extractedItems: ["main entrance", "welcome gate", "baraat path", "water feature", "mandap", "seating area", "dining area", "stage", "parking area"] },
      { label: "Seating Capacity", status: "READY", extractedItems: ["VIP 100 pax", "premium 300 pax", "general 800 pax", "family 200 pax", "total 1400 pax"] },
      { label: "Lighting Legend", status: "READY", extractedItems: ["moving head", "LED par light", "wash light", "profile spot", "uplight", "wall washer", "pixel light", "laser light", "focus light", "fairy light"] },
      { label: "Material Board", status: "READY", extractedItems: ["sandstone finish", "wood finish", "metal antique", "brass antique", "silk drapes", "velvet fabric", "organza fabric", "marble", "kota stone", "wooden floor", "carpet", "granite", "grass"] }
    ],
    materials: ["sandstone finish", "wood finish", "metal antique", "brass antique", "silk drapes", "velvet fabric", "organza fabric", "net fabric", "marble", "kota stone", "wooden floor", "carpet", "granite", "grass", "chandelier", "lantern"],
    notes: ["Creative immersive extraordinary", "All dimensions are in feet and inches", "Stage height 2'-0\" from floor level", "Design can be customized per client requirement"]
  },
  {
    id: "premium-dashboard-reference",
    title: "TLP Wedding CAD Premium Dashboard Reference",
    image: "/extracted-boards/premium-dashboard-reference.png",
    dimensions: "1536x1024",
    status: "READY",
    sourceTheme: "dashboard",
    route: "/dashboard",
    summary:
      "Dark premium homepage/dashboard reference with fixed luxury sidebar, top search/profile bar, hero area, KPI cards, quick actions, module cards, recent projects, project statistics, and recent activity.",
    options: [
      option("dashboard-shell", "Premium Dashboard Shell", "READY", "Dark teal/gold dashboard with sidebar, search, hero, quick actions, and neon module cards", "/dashboard"),
      option("dashboard-hero", "Hero Dashboard Frame", "READY", "TLP Wedding CAD hero with palace mandap imagery and right-side KPI cards", "/"),
      option("dashboard-modules", "Module Card Grid", "READY", "Venue, Mandap, Layout, Lighting, Floral, Budget, Asset, Vendor, Guest, Parking, Drone, VR cards", "/features")
    ],
    panels: [
      { label: "Left Navigation", status: "READY", extractedItems: ["dashboard", "venue designer", "mandap designer", "layout generator", "lighting designer", "floral designer", "budget calculator", "asset library", "vendor library", "guest planner", "parking planner", "drone planner", "CAD exporter", "VR walkthrough"] },
      { label: "Top Command Bar", status: "READY", extractedItems: ["menu", "search projects/assets/vendors", "theme", "notifications", "help", "profile plan"] },
      { label: "Hero and KPI", status: "READY", extractedItems: ["create new project", "watch demo/open editor", "projects completed", "assets available", "vendors connected", "client satisfaction"] },
      { label: "Bottom Widgets", status: "READY", extractedItems: ["recent projects", "project statistics", "recent activity"] }
    ],
    materials: ["dark teal", "gold typography", "neon module colors", "glass panels", "royal mandap hero imagery"],
    notes: ["Implemented as live React dashboard shell", "Vendor, marketplace, payment, DWG/DXF, and production compliance capabilities remain blocked when not implemented"]
  }
];

export const extractedBoardSummary = {
  boardCount: extractedBoards.length,
  optionCount: extractedBoards.reduce((sum, board) => sum + board.options.length, 0),
  panelCount: extractedBoards.reduce((sum, board) => sum + board.panels.length, 0),
  readyOptions: extractedBoards.flatMap((board) => board.options).filter((option) => option.status === "READY").length,
  partialOptions: extractedBoards.flatMap((board) => board.options).filter((option) => option.status === "PARTIAL").length,
  blockedOptions: extractedBoards.flatMap((board) => board.options).filter((option) => option.status === "BLOCKED").length
};

function option(
  id: string,
  label: string,
  status: CapabilityStatus,
  style: string,
  route: string
): ExtractedDesignOption {
  return {
    id,
    label,
    status,
    style,
    features: style.split(",").map((item) => item.trim()).filter(Boolean),
    palette: [],
    route
  };
}
