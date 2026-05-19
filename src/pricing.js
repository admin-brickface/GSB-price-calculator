// ============================================================
// GSB Price Calculator — Static Pricing Data
// ============================================================
// This file contains ONLY static pricing constants and the
// shared discount cascade helper. No runtime state lives here.
// ============================================================

// ------------------------------------------------------------
// Shared Discount Cascade
// All tabs use the same formula:
//   1 Year Price  = subtotal
//   30 Day Price  = 1 Year Price  - 10%
//   Day Of Price  = 30 Day Price  - 10%
//   Final Sell    = Day Of Price  - 3% (33% deposit)
// ------------------------------------------------------------
export function calculateDiscountCascade(subtotal) {
  const oneYearPrice = subtotal;
  const oneYearDeduction = subtotal * 0.10;
  const thirtyDayPrice = oneYearPrice - oneYearDeduction;
  const thirtyDayDeduction = thirtyDayPrice * 0.10;
  const dayOfPrice = thirtyDayPrice - thirtyDayDeduction;
  const dayOfDeduction = dayOfPrice * 0.03;
  const finalSellPrice = dayOfPrice - dayOfDeduction;
  return {
    oneYearPrice,
    oneYearDeduction,
    thirtyDayPrice,
    thirtyDayDeduction,
    dayOfPrice,
    dayOfDeduction,
    finalSellPrice,
  };
}

// ------------------------------------------------------------
// Gutters & Leaders
// ------------------------------------------------------------
export const gutterTypes = [
  { name: '6" White Gutters & Leaders', price: 12.75 },
  { name: '6" Colored Gutters & Leaders', price: 14.15 },
  { name: '5" White Gutters & Leaders', price: 10.95 },
  { name: '5" Colored Gutters & Leaders', price: 12.30 },
];

export const leaderLengths = {
  firstFloor: 15,
  secondFloor: 25,
};

export const miterSurcharge = 25;

export const gutterGuardTypes = [
  { name: '5" Hangtite Gutter Guard', price: 14.55 },
  { name: '6" Hangtite Gutter Guard', price: 16.36 },
  { name: '5" Gutter Screen', price: 12.73 },
  { name: '6" Gutter Screen', price: 14.55 },
];

// ------------------------------------------------------------
// Stone Veneers
// ------------------------------------------------------------
export const demolitionItems = [
  { name: 'Remove vinyl or aluminum siding', price: 237 },
  { name: 'Remove wood siding (clapboard)', price: 267 },
  { name: 'Remove wood siding (wood shake)', price: 297 },
  { name: 'Remove EIFS up to 2" only', price: 400 },
];

export const debrisRemovalItems = [
  { name: 'Debris removal under 4 squares (REQUIRED even if no demo)', price: 830 },
  { name: '10 yard dumpster (removal from 4 to 10 squares)', price: 1542 },
  { name: '20 yard dumpster (removal from 11 to 20 squares)', price: 1868 },
];

export const stoneItemPrices = {
  flats: 58,
  corners: 32,
  sills: 26,
  deliveryFee: 222,
};

export const stoneMiscItems = [
  { name: 'Wrap Corner 4" (Wood or Vinyl Siding)', unit: "Per 8' Corner", price: 297 },
  { name: 'Limestone Treads (up to 12" Deep)', unit: 'LF', price: 128 },
  { name: 'Limestone Treads (up to 14" Deep)', unit: 'LF', price: 144 },
  { name: 'Cement Pad (Up to 20sf) Demo/New', unit: 'Per Item', price: 890 },
  { name: 'Chimney Scaffolding Fee', unit: 'Full chimney on roof', price: 741 },
  { name: 'Stainless Steel Chimney Cover', unit: 'Per Item', price: 1605 },
  { name: '1/2" Plywood Replacement', unit: 'Per Item', price: 374 },
];

export const stoneJobMinimums = [
  { zone: 'All counties excluding below', amount: 7500 },
  { zone: 'Zone (1): Sussex, Warren, Hunterdon, Mercer', amount: 8500 },
  { zone: 'Zone (2): Ocean, Burlington, Camden', amount: 9500 },
];

// ------------------------------------------------------------
// Stucco Painting
// ------------------------------------------------------------

// Price-per-SF tiers based on total wall SF
// priceAbove = walls above 8 ft; priceBelow = walls below 8 ft
export const stuccoWallPriceRanges = [
  { range: [200, 499],    priceAbove: 14.27, priceBelow: 9.69 },
  { range: [500, 999],    priceAbove: 13.00, priceBelow: 9.11 },
  { range: [1000, 1699],  priceAbove: 12.45, priceBelow: 8.73 },
  { range: [1700, 2999],  priceAbove: 11.78, priceBelow: 8.24 },
  { range: [3000, 4499],  priceAbove: 11.38, priceBelow: 7.95 },
  { range: [4500, Infinity], priceAbove: 11.09, priceBelow: 7.75 },
];

export const stuccoTrimPrices = {
  windowDoorTrim: 7.25,  // per LF, up to 6"
  soffit: 11.67,         // per LF, up to 12"
  fascia: 8.15,          // per LF, up to 8"
  quoins: 11.67,         // per single side
};

export const stuccoCaulkingTypes = [
  { name: 'Caulk only (no raking) - up to 3/4"', price: 8.36 },
  { name: 'Caulk and install backer rod (no raking) - up to 3/4"', price: 11.17 },
  { name: 'Rake out and caulk only - up to 3/4"', price: 12.54 },
  { name: 'Rake out and install backer rod - up to 3/4"', price: 15.32 },
];

export const stuccoMiscItems = [
  { name: 'EIFS Repair', unit: 'Per SF', price: 60 },
  { name: 'BCMA (Fiberglass, Basecoat, Acrylic Stucco)', unit: 'Per SF', price: 17.59 },
  { name: 'Remove and Re-Install Existing Shutters', unit: 'Per Pair', price: 145 },
  { name: 'Remove, Paint and Re-Install Shutters (per pair)', unit: 'Per Pair', price: 290 },
  { name: 'Stainless Steel Chimney Cover', unit: 'Per Item', price: 1509 },
  { name: 'Plywood (demo, debris, install 1 sheet of plywood) 32 sf', unit: 'Per Item', price: 439 },
  { name: 'Remove and Re-Install Existing Gutters', unit: 'Per LF', price: 6 },
  { name: 'Additional Rigging (For Caulking Only Projects)', unit: 'Per Side', price: 435 },
  { name: 'Clear Sealer, Ladders, Powerwash', unit: 'Per SF', price: 7 },
  { name: 'Additional Heavy Duty Powerwash', unit: 'Per SF', price: 2 },
  { name: 'Additional stucco crack repair above 50 lf (1" or less)', unit: 'Per LF', price: 7 },
  { name: 'Spot Point Brick     (* See rules page)', unit: 'Per SF', price: 29 },
  { name: 'Full Cut and Re-Point (Under 500sf)', unit: 'Per SF', price: 29 },
  { name: 'Full Cut and Re-Point (Over 500sf)', unit: 'Per SF', price: 24 },
  { name: 'Full Coping over Parepit Wall up to 12" (*See Rules Page)', unit: 'Per LF', price: 85 },
  { name: 'Paint Samples (Includes 1 Color Sample)', unit: 'Per Item', price: 108 },
];

export const stuccoExtras = {
  repair: 2100,
  rigging: 1400,
};

export const stuccoMinimums = [
  { name: 'LOXON', amount: 4200 },
  { name: 'CLEAR SEALER', amount: 3500 },
  { name: 'WOODPECKER HOLES (INCLUDES UP TO 6 HOLES)', amount: 3500, note: 'ADD $500 PER HOLE' },
  { name: 'BCMA', amount: 4200 },
  { name: 'SPOT POINTING', amount: 4900 },
  { name: 'FULL POINTING', amount: 5600 },
  { name: 'CAULKING', amount: 5600 },
];

// ------------------------------------------------------------
// House Painting
// ------------------------------------------------------------

// Radio-style wall type selection
export const housePaintingWallTypes = [
  { name: 'Vinyl and Aluminum ---- (Use vinyl safe colors for vinyl only)', price: 8.06 },
  { name: 'Wood Clapboard ---- (20% sand and spot prime)', price: 9.28 },
  { name: 'Wood Clapboard ---- (Full sanding only)', price: 11.5 },
  { name: 'Wood Shake ---- (20% sand and spot prime)', price: 10.02 },
  { name: 'Wood Shake ---- (Full sanding only)', price: 12.19 },
];

export const housePaintingTrimPrices = {
  windowTrim: 61.48,      // per opening, up to 4"
  doorTrim: 61.48,        // per opening, up to 4"
  fascia: 6.36,           // per LF, up to 6"
  soffit: 8.48,           // per LF, up to 12"
  shuttersRemove: 77.38,  // per pair
  shuttersPaint: 106.0,   // per pair
  entryDoor: 424.0,       // per opening
  garageDoor: 530.0,      // per opening
};

export const housePaintingMiscItems = [
  { name: 'Remove / replace (1) sheet of plywood ---- (up to 32sf)', unit: '', price: 316.94 },
  { name: 'Remove / replace vinyl siding ---- (up to 4.5in exposure)', unit: 'Per 12ft Piece', price: 320.12 },
  { name: 'Remove / replace aluminum siding ---- (up to 8in exposure)', unit: 'Per 12ft Piece', price: 320.12 },
  { name: 'Remove / replace wood trim ---- (5/4in x 3ft x 16ft)', unit: 'Per 16ft Piece', price: 151.58 },
  { name: 'Remove / replace wood clapboard ---- (1/2in x 8in x 16ft)', unit: 'Per 16ft Piece', price: 338.14 },
  { name: 'Remove / replace wood shake ---- (up to 12in Exposure)', unit: 'Per 1/2 Square', price: 647.66 },
  { name: 'Remove / re-install existing gutters', unit: 'Per LF', price: 4.24 },
  { name: 'Additional powerwash', unit: 'Per SF', price: 1.59 },
  { name: 'Caulk only (no raking) ---- (up to 1/2in)', unit: 'Per LF', price: 8.48 },
  { name: 'Rake out and caulk only ---- (up to 1/2in)', unit: 'Per LF', price: 12.72 },
  { name: 'Paint samples ---- (Includes 1 color sample)', unit: 'Per Item', price: 82.68 },
];

export const housePaintingMinimum = 5600;

// ------------------------------------------------------------
// Window Replacement
// Provia Endure White In / White Out Vinyl Replacement Windows
// Unit Cost = ROUNDUP(Ext.Cost + Material, 0)
// Labor Cost from Labor Pricing table by size bracket
// ------------------------------------------------------------

export const windowProducts = [
  { bracket: '0-60 UI', products: [
    { name: 'Slider 0-60"', unitCost: 289, laborCost: 200 },
    { name: 'Casement 624/625 0-54"', unitCost: 353, laborCost: 200 },
    { name: 'Picture 0-56"', unitCost: 195, laborCost: 200 },
    { name: 'Awning 0-60"', unitCost: 377, laborCost: 200 },
  ]},
  { bracket: '61-72 UI', products: [
    { name: 'Slider 61-72"', unitCost: 338, laborCost: 200 },
    { name: 'Casement 624/625 55-66"', unitCost: 395, laborCost: 200 },
    { name: 'Twin Casement 55-66"', unitCost: 669, laborCost: 200 },
    { name: 'Picture 55-66"', unitCost: 220, laborCost: 200 },
    { name: 'Awning 61-72"', unitCost: 419, laborCost: 200 },
  ]},
  { bracket: '73-84 UI', products: [
    { name: 'Slider 73-84"', unitCost: 404, laborCost: 220 },
    { name: 'Casement 624/625 67-78"', unitCost: 421, laborCost: 220 },
    { name: 'Twin Casement 67-78"', unitCost: 709, laborCost: 220 },
    { name: '3-Lite Casement 67-78"', unitCost: 865, laborCost: 220 },
    { name: 'Picture 67-78"', unitCost: 248, laborCost: 220 },
    { name: 'Awning 73-84"', unitCost: 473, laborCost: 220 },
  ]},
  { bracket: '85-96 UI', products: [
    { name: 'Slider 85-96"', unitCost: 412, laborCost: 220 },
    { name: 'Casement 624/625 79-90"', unitCost: 475, laborCost: 220 },
    { name: 'Twin Casement 79-90"', unitCost: 765, laborCost: 220 },
    { name: '3-Lite Casement 79-90"', unitCost: 916, laborCost: 220 },
    { name: 'Picture 79-90"', unitCost: 299, laborCost: 220 },
  ]},
  { bracket: '97-108 UI', products: [
    { name: 'Double Hung >99 UI', unitCost: 395, laborCost: 240 },
    { name: 'Slider 97-108"', unitCost: 453, laborCost: 240 },
    { name: 'Casement 624/625 91-102"', unitCost: 568, laborCost: 240 },
    { name: '3-Lite Casement 91-102"', unitCost: 966, laborCost: 240 },
    { name: 'Picture 91-102"', unitCost: 325, laborCost: 240 },
  ]},
  { bracket: '109-120 UI', products: [
    { name: 'Slider 109-120"', unitCost: 522, laborCost: 260 },
    { name: '3-Lite Casement 103-114"', unitCost: 1012, laborCost: 260 },
    { name: 'Picture 103-114"', unitCost: 427, laborCost: 260 },
  ]},
  { bracket: '121-132 UI', products: [
    { name: 'Double Hung 102-122"', unitCost: 467, laborCost: 280 },
    { name: 'Slider 121-132"', unitCost: 554, laborCost: 280 },
    { name: '3-Lite Casement 115-126"', unitCost: 1097, laborCost: 280 },
    { name: 'Picture 115-126"', unitCost: 495, laborCost: 280 },
  ]},
  { bracket: '133-144 UI', products: [
    { name: '3-Lite Casement 127-138"', unitCost: 1173, laborCost: 300 },
    { name: 'Picture 127-137"', unitCost: 646, laborCost: 300 },
  ]},
  { bracket: '145-156 UI', products: [
    { name: '3-Lite Casement 139-150"', unitCost: 1221, laborCost: 320 },
    { name: '3-Lite Casement 151-156"', unitCost: 1343, laborCost: 320 },
  ]},
];

export function calculateWindowDumpster(totalQty) {
  if (totalQty >= 20) return 1500;
  if (totalQty >= 10) return 1100;
  if (totalQty > 5) return 900;
  return totalQty * 90;
}

// ------------------------------------------------------------
// Roofing
// ------------------------------------------------------------

export const roofingPrices = [
  { category: 'ROOFING', items: [
    { name: '3 BD/SQ LASALLE CT PATRIOT XL RAVEN BLACK 48 BD/PAL', price: 105.00, uom: '1 SQ' },
    { name: '3 BD/SQ NORWOOD CT LM AR CHARCOAL BLACK LANDMARK, 48 BD/PAL', price: 123.55, uom: '1 SQ' },
    { name: '3 BD/SQ NORWOOD CT LM PRO AR MAX DEF CHARCOAL BLACK LANDMARK, 40 BD/PAL', price: 136.95, uom: '1 SQ' },
  ]},
  { category: 'ICE & WATER SHIELD', items: [
    { name: '2 SQ/RL CT WINTERGUARD ICE & WATER GRANULATED 30 RL/PAL', price: 98.00, uom: '1 RL' },
    { name: '2 SQ/RL TOP SHIELD SECUREGRIP ICE & WATER NO BOX SELF-ADHERED, 25 RL/PAL', price: 68.00, uom: '1 RL' },
  ]},
  { category: 'UNDERLAYMENT', items: [
    { name: '10 SQ/RL CT ROOFRUNNER SYNTHETIC UNDERLAYMENT 56 RL/PAL', price: 105.00, uom: '1 RL' },
    { name: '10 SQ/RL TOP SHIELD CRAFTGRADE UDL W20 GRAY SYNTHETIC UNDERLAYMENT, 64 RL/PAL', price: 78.45, uom: '1 RL' },
  ]},
  { category: 'DRIP EDGE', items: [
    { name: "10' .019 TOP SHIELD ALUM F5M DRIP EDGE 30 WHITE PREMIUM, ALUMINUM, 50 PC/CTN, BERGER", price: 8.55, uom: '1 PC' },
  ]},
  { category: 'STARTER SHINGLES', items: [
    { name: '116 LF/BD CT SWIFTSTART STARTER SHINGLE 48 BD/PAL', price: 63.06, uom: '1 BD' },
    { name: '105 LF/BD TOP SHIELD STARTER STRIP PLUS 36 BD/PAL', price: 51.35, uom: '1 BD' },
  ]},
  { category: 'NAILS', items: [
    { name: '1-1/4" 7.2M/BX TOP SHIELD EG COIL ROOFING NAILS 48 BX/PAL', price: 48.00, uom: '1 BX' },
    { name: '3/8" 5M/BX TOP SHIELD A11 STAPLES T-50', price: 8.00, uom: '1 BX' },
    { name: '1" 2000/BX NAT STINGER EG PLASTIC CAP NAILS NATIONAL NAIL, ELECTRO GALVANIZED, 96 BX/PAL', price: 54.00, uom: '1 BX' },
  ]},
  { category: 'FLASHING & ACCESSORIES', items: [
    { name: '29.6 LF/BD LASALLE CT SHADOW RIDGE XL RAVEN BLACK 48 BD/PAL', price: 65.00, uom: '1 BD' },
    { name: '12" X 30\' NORWOOD CT SHADOW RIDGE AR CHARCOAL/MOIRE BLACK 28 BD/PAL', price: 68.00, uom: '1 BD' },
    { name: '12" X 4\' CT FILTERED RIDGE VENT W/ NAILS 10 PC/CTN', price: 15.37, uom: '1 PC' },
    { name: '12" X 28\' CT FILTERED ROLLED RIDGE VENT W/ NAILS 15 RL/PAL', price: 129.00, uom: '1 RL' },
    { name: '12" X 4\' CT FILTERED INTAKE VENT EDGE 10 PC/CTN', price: 18.50, uom: '1 PC' },
    { name: '6" X 8" .011 100/BD TOP SHIELD ALUM FLAT STEP FLASH BLACK, ALUMINUM, 5 BD/CTN', price: 47.78, uom: '1 BD' },
    { name: '6" X 8" TOP SHIELD ALUMINUM FLAT STEP FLASHING MILL, 100 PC/BD, BERGER', price: 41.00, uom: '1 BD' },
    { name: '5" X 5" X 8" TOP SHIELD ALUM PREBENT STEP FLASHING BLACK, ALUMINUM, 50 PC/BD', price: 40.00, uom: '1 BD' },
    { name: '1"-4" IPS 4N1 ALUMINUM PIPE FLASHING BLACK 20 PC/CTN', price: 8.75, uom: '1 EA' },
    { name: '11" X 5/8" X 20\' QUARRIX ATTICDEFENSE RIDGE VENT ATTIC PROTECTION, 36 RL/PAL', price: 42.75, uom: '1 RL' },
    { name: 'HAZMAT 10.3 OZ NPC #900 SOLAR SEAL 05 CLEAR 12 TB/CTN', price: 8.95, uom: '1 TB' },
    { name: '1170 CFM AIR VENT RM POWER ATTIC VENT W/H&T BLACK ROOF-MOUNT, W/ PRE-WIRED HUMID/THERM', price: 175.00, uom: '1 EA' },
  ]},
];

// Each calculator tier defines its product list with qty formulas
// sq = total roof squares, eave/ridge/valley = linear footage
export const roofingTiers = {
  patriot: {
    label: 'Patriot',
    products: [
      { name: 'CT Patriot XL', unit: 'SQ', unitPrice: 105.00, qty: (d) => d.squares },
      { name: 'Top Shield SecureGrip', unit: 'RL', unitPrice: 68.00, qty: (d) => Math.ceil((d.eave + d.valley) / 66) },
      { name: 'Top Shield Craftgrade UDL', unit: 'RL', unitPrice: 78.45, qty: (d) => Math.ceil(d.squares / 10) },
      { name: 'Top Shield Starter Strip Plus', unit: 'BD', unitPrice: 51.35, qty: (d) => Math.ceil(d.eave / 105) },
      { name: 'CT Shadow Ridge XL', unit: 'BD', unitPrice: 65.00, qty: (d) => Math.ceil(d.ridge / 29.6) },
      { name: 'Quarrix AtticDefense', unit: 'RL', unitPrice: 42.75, qty: (d) => Math.ceil(d.ridge / 20) },
      { name: 'Top Shield Drip Edge', unit: 'PC', unitPrice: 8.55, qty: (d) => Math.ceil(d.eave / 10) },
      { name: 'Coil Roofing Nails', unit: 'BX', unitPrice: 48.00, qty: (d) => Math.ceil(d.squares / 20) },
    ],
  },
  landmark: {
    label: 'Landmark',
    products: [
      { name: 'Landmark AR Charcoal', unit: 'SQ', unitPrice: 123.55, qty: (d) => d.squares },
      { name: 'CT Winterguard', unit: 'RL', unitPrice: 98.00, qty: (d) => Math.ceil((d.eave + d.valley) / 66) },
      { name: 'CT Roofrunner', unit: 'RL', unitPrice: 105.00, qty: (d) => Math.ceil(d.squares / 10) },
      { name: 'CT Swiftstart', unit: 'BD', unitPrice: 63.06, qty: (d) => Math.ceil(d.eave / 116) },
      { name: 'CT Shadow Ridge AR', unit: 'BD', unitPrice: 68.00, qty: (d) => Math.ceil(d.ridge / 30) },
      { name: 'Top Shield Drip Edge', unit: 'PC', unitPrice: 8.55, qty: (d) => Math.ceil(d.eave / 10) },
      { name: 'Coil Roofing Nails', unit: 'BX', unitPrice: 48.00, qty: (d) => Math.ceil(d.squares / 20) },
    ],
  },
  pro: {
    label: 'Pro',
    products: [
      { name: 'Landmark Pro', unit: 'SQ', unitPrice: 136.95, qty: (d) => d.squares },
      { name: 'CT Winterguard', unit: 'RL', unitPrice: 98.00, qty: (d) => Math.ceil((d.eave + d.valley) / 66) },
      { name: 'CT Roofrunner', unit: 'RL', unitPrice: 105.00, qty: (d) => Math.ceil(d.squares / 10) },
      { name: 'CT Swiftstart', unit: 'BD', unitPrice: 63.06, qty: (d) => Math.ceil(d.eave / 116) },
      { name: 'CT Shadow Ridge AR', unit: 'BD', unitPrice: 68.00, qty: (d) => Math.ceil(d.ridge / 30) },
      { name: 'Top Shield Drip Edge', unit: 'PC', unitPrice: 8.55, qty: (d) => Math.ceil(d.eave / 10) },
      { name: 'Coil Roofing Nails', unit: 'BX', unitPrice: 48.00, qty: (d) => Math.ceil(d.squares / 20) },
    ],
  },
};

export const roofingDumpsterPerSquare = 55;
export const roofingLaborPerSquare = 150;

// ------------------------------------------------------------
// Masonry
// ------------------------------------------------------------

export const masonryScaffoldingTiers = [
  { name: 'Standard', pricePerSF: 0 },
  { name: 'Moderate', pricePerSF: 0 },
  { name: 'Difficult', pricePerSF: 0 },
  { name: 'Very Difficult', pricePerSF: 0 },
];

export const masonryDemolitionItems = [
  { name: 'Demo Old Stucco', pricePerSF: 0 },
  { name: 'Demo Old Brickface', pricePerSF: 0 },
  { name: 'Demo Old Hardcoat', pricePerSF: 0 },
];

export const masonryDumpsterItems = [
  { name: 'Debris removal under 4 squares', priceEach: 830 },
  { name: '10 yard dumpster (4–10 squares)', priceEach: 1542 },
  { name: '20 yard dumpster (11–20 squares)', priceEach: 1868 },
];

// Standard = below 26 ft, over26 = 26–35 ft, over35 = above 35 ft
export const masonryBrickfaceItems = [
  { name: 'Brickface',         standardPrice: 0, over26Price: 0, over35Price: 0 },
  { name: 'Troweled Stucco',   standardPrice: 0, over26Price: 0, over35Price: 0 },
  { name: 'Hardcoat',          standardPrice: 0, over26Price: 0, over35Price: 0 },
];

export const masonryLaborAdditionItems = [
  { name: 'Labor Addition 1', pricePerSF: 0 },
  { name: 'Labor Addition 2', pricePerSF: 0 },
];

export const masonryExcessiveCarryItems = [
  { name: 'Excessive Carry – 100ft from truck', priceEach: 0 },
];

export const masonryFlushBandsItems = [
  { name: '4" Flush Band', pricePerLF: 0 },
  { name: '6" Flush Band', pricePerLF: 0 },
];

// manualPer: true means both qty and per-unit price are manual inputs
export const masonryRaisedFoamItems = [
  { name: '4" Raised Foam Band',                         pricePerUnit: 0, manualPer: false },
  { name: '6" Raised Foam Band',                         pricePerUnit: 0, manualPer: false },
  { name: 'Additional Foam Bands (see price book)',       pricePerUnit: 0, manualPer: true  },
];

// requiresYes: row only counts when stepsAYesNo === 'yes'
export const masonryStepsTreadsAItems = [
  { name: 'Remove brick treads',  pricePerLF: 0, requiresYes: true  },
  { name: 'New bluestone treads', pricePerLF: 0, requiresYes: false },
  { name: 'Tuck point treads',    pricePerLF: 0, requiresYes: false },
];

export const masonryStepsTreadsBItems = [
  { name: 'Precast steps', priceEach: 0 },
  { name: 'Brick steps',   priceEach: 0 },
];

export const masonryCarpentryItems = [
  { name: 'Carpentry Work', priceEach: 0 },
];

export const masonryZones = [
  { name: 'Zone 1 (Sussex, Warren, Hunterdon, Mercer)', pct: 0.04 },
  { name: 'Zone 2 (Ocean, Burlington, Camden)',          pct: 0.05 },
  { name: 'Zone 3',                                      pct: 0.06 },
];

export const masonryVolumeDiscounts = [
  { range: 'Under $10,000',          discount: '0%' },
  { range: '$10,000 – $14,999', discount: '0%' },
  { range: '$15,000 – $19,999', discount: '0%' },
  { range: '$20,000 – $24,999', discount: '0%' },
  { range: '$25,000+',               discount: '0%' },
];
