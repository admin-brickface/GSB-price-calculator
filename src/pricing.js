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
