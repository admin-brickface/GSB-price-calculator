import React, { useState } from 'react';
import {
  calculateDiscountCascade,
  masonryScaffoldingTiers,
  masonryDemolitionItems,
  masonryDumpsterItems,
  masonryBrickfaceItems,
  masonryLaborAdditionItems,
  masonryExcessiveCarryItems,
  masonryFlushBandsItems,
  masonryRaisedFoamItems,
  masonryStepsTreadsAItems,
  masonryStepsTreadsBItems,
  masonryCarpentryItems,
  masonryZones,
  masonryVolumeDiscounts,
} from '../pricing';

// ─── Shared input styles ────────────────────────────────────────────────────
const inputStyle = {
  minHeight: '44px',
  padding: '8px',
  fontSize: '14px',
  boxSizing: 'border-box',
  width: '100%',
  border: '1px solid #ccc',
  borderRadius: '2px',
};
const numStyle = { ...inputStyle, textAlign: 'right' };
const cbStyle  = { width: 20, height: 20, cursor: 'pointer' };

// ─── GreenSky plans ─────────────────────────────────────────────────────────
const greenSkyPlans = [
  { name: 'GreenSky Plan 6124 - 12.50%', pct: 0.125, term: 24  },
  { name: 'GreenSky Plan 3108 - 7.80%',  pct: 0.078, term: 84  },
  { name: 'GreenSky Plan 4158 - 6.50%',  pct: 0.065, term: 84  },
  { name: 'GreenSky Plan 3068 - 5.00%',  pct: 0.05,  term: 84  },
  { name: 'GreenSky Plan 9991 - 0%',     pct: 0,     term: 120 },
];

// ─── Measurement-table helpers ───────────────────────────────────────────────
const SECTION_HEADERS = new Set(['Front', 'Front Right', 'Rear', 'Front Left']);
const SPECIAL_ROWS    = new Set(['Gables', 'Rakes', 'Single Dormers']);

function buildWallsInitial() {
  const section = (label) => [
    [label, '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['Gables', '', ''],
    ['Rakes', '', ''],
    ['Single Dormers', '', ''],
  ];
  return [
    ...section('Front'),
    ...section('Front Right'),
    ...section('Rear'),
    ...section('Front Left'),
  ];
}

function computeRowSF(row) {
  const loc = row[0];
  const w   = parseFloat(row[1]) || 0;
  const h   = parseFloat(row[2]) || 0;
  if (loc === 'Gables' || loc === 'Rakes') return w * h * 0.7;
  if (loc === 'Single Dormers')            return w * 75;
  return w * h;
}

function formulaLabel(loc) {
  if (loc === 'Gables' || loc === 'Rakes') return '× 0.7 =';
  if (loc === 'Single Dormers')            return '× 75 sf =';
  return '';
}

// ─── WallsMeasurementTable ───────────────────────────────────────────────────
function WallsMeasurementTable({ data, setData }) {
  const handleChange = (rowIdx, colIdx, value) => {
    setData(data.map((row, i) => {
      if (i !== rowIdx) return row;
      const next = [...row];
      next[colIdx] = value;
      return next;
    }));
  };

  return (
    <table className="pricing-table" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th style={{ width: '30%' }}>Location</th>
          <th style={{ width: '18%' }}>Width / Qty</th>
          <th style={{ width: '18%' }}>Height</th>
          <th style={{ width: '14%', fontSize: '12px' }}></th>
          <th style={{ width: '20%' }}>Total SF</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => {
          const loc     = row[0];
          const sf      = computeRowSF(row);
          const formula = formulaLabel(loc);
          const isHdr   = SECTION_HEADERS.has(loc);
          const isSpc   = SPECIAL_ROWS.has(loc);
          const isDorm  = loc === 'Single Dormers';

          return (
            <tr key={rowIdx} style={isHdr ? { backgroundColor: '#e8f0fe' } : {}}>
              <td>
                {isSpc || isHdr ? (
                  <span style={{ padding: '8px', display: 'inline-block', fontWeight: isHdr ? 'bold' : 'normal' }}>
                    {loc}
                  </span>
                ) : (
                  <input type="text" value={row[0]}
                    onChange={e => handleChange(rowIdx, 0, e.target.value)}
                    style={inputStyle} />
                )}
              </td>
              <td>
                <input type="number" inputMode="decimal" value={row[1]}
                  onChange={e => handleChange(rowIdx, 1, e.target.value)}
                  style={numStyle} placeholder={isDorm ? 'Qty' : ''} />
              </td>
              <td>
                {isDorm ? (
                  <div style={{ minHeight: '44px', backgroundColor: '#000', borderRadius: '2px' }} />
                ) : (
                  <input type="number" inputMode="decimal" value={row[2]}
                    onChange={e => handleChange(rowIdx, 2, e.target.value)}
                    style={numStyle} />
                )}
              </td>
              <td style={{ textAlign: 'center', backgroundColor: formula ? '#f0f0f0' : 'transparent', fontSize: '12px' }}>
                {formula}
              </td>
              <td style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>
                {sf > 0 ? sf.toFixed(2) : ''}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
function Masonry() {

  // Measurement grids
  const [scaffoldData, setScaffoldData] = useState(buildWallsInitial);
  const [workAreaData, setWorkAreaData] = useState(buildWallsInitial);

  // Scaffolding DoD – radio-style (-1 = none)
  const [scaffoldTierIdx, setScaffoldTierIdx] = useState(-1);
  // Manual inputs for LF and flat-rate scaffold rows (indexed by row position in masonryScaffoldingTiers)
  const [scaffoldManualQty, setScaffoldManualQty] = useState(() => masonryScaffoldingTiers.map(() => ''));

  // Demolition – manual SF per row
  const [demoSqft, setDemoSqft] = useState(() => masonryDemolitionItems.map(() => ''));

  // Dumpsters – manual qty per row
  const [dumpsterQty, setDumpsterQty] = useState(() => masonryDumpsterItems.map(() => ''));

  // Brickface
  const [bfChecked,    setBfChecked]    = useState(() => masonryBrickfaceItems.map(() => false));
  const [bfSFOverride, setBfSFOverride] = useState(() => masonryBrickfaceItems.map(() => ''));
  const [bfGlobalTier, setBfGlobalTier] = useState('standard');
  const [bfRowTier,    setBfRowTier]    = useState(() => masonryBrickfaceItems.map(() => null));

  // Labor Additions
  const [laborSqft, setLaborSqft] = useState(() => masonryLaborAdditionItems.map(() => ''));

  // Excessive Carry
  const [carryQty, setCarryQty] = useState(() => masonryExcessiveCarryItems.map(() => ''));

  // Flush Masonry Bands
  const [flushLF, setFlushLF] = useState(() => masonryFlushBandsItems.map(() => ''));

  // Raised Foam Bands
  const [foamQty, setFoamQty] = useState(() => masonryRaisedFoamItems.map(() => ''));
  const [foamPer, setFoamPer] = useState(() =>
    masonryRaisedFoamItems.map(item => item.manualPer ? '' : String(item.pricePerUnit))
  );

  // Steps & Treads A
  const [stepsAYesNo, setStepsAYesNo] = useState(null);
  const [stepsALF,    setStepsALF]    = useState(() => masonryStepsTreadsAItems.map(() => ''));

  // Steps & Treads B
  const [stepsBQty, setStepsBQty] = useState(() => masonryStepsTreadsBItems.map(() => ''));

  // Carpentry Work
  const [carpentryQty, setCarpentryQty] = useState(() => masonryCarpentryItems.map(() => ''));

  // Zoning
  const [zoneIdx, setZoneIdx] = useState(-1);

  // Project Calculation
  const [officePublishedPrice, setOfficePublishedPrice] = useState('');
  const [contractPriceRep,     setContractPriceRep]     = useState('');
  const [contractPriceOffice,  setContractPriceOffice]  = useState('');
  const [overUnderRep,         setOverUnderRep]         = useState('');
  const [overUnderOffice,      setOverUnderOffice]      = useState('');

  // GreenSky
  const [greenSkyChecked, setGreenSkyChecked] = useState(() => Array(5).fill(false));

  // ── Calculations ──────────────────────────────────────────────────────────

  const totalScaffoldArea = scaffoldData.reduce((s, row) => s + computeRowSF(row), 0);
  const totalWorkArea     = workAreaData.reduce((s, row) => s + computeRowSF(row), 0);

  const scaffoldTotal = (() => {
    if (scaffoldTierIdx < 0) return 0;
    const tier = masonryScaffoldingTiers[scaffoldTierIdx];
    if (tier.unit === 'SF')   return totalScaffoldArea * tier.pricePerUnit;
    if (tier.unit === 'LF')   return (parseFloat(scaffoldManualQty[scaffoldTierIdx]) || 0) * tier.pricePerUnit;
    if (tier.unit === 'flat') return (parseFloat(scaffoldManualQty[scaffoldTierIdx]) || 1) * tier.pricePerUnit;
    return 0;
  })();

  const demoTotal = masonryDemolitionItems.reduce((s, item, i) =>
    s + (parseFloat(demoSqft[i]) || 0) * item.pricePerSF, 0);

  const dumpsterTotal = masonryDumpsterItems.reduce((s, item, i) =>
    s + (parseFloat(dumpsterQty[i]) || 0) * item.priceEach, 0);

  const getEffectiveTier = (rowIdx) => bfRowTier[rowIdx] || bfGlobalTier;

  const brickfaceTotal = masonryBrickfaceItems.reduce((s, item, i) => {
    if (!bfChecked[i]) return s;
    const sfOv = parseFloat(bfSFOverride[i]);
    const sf   = sfOv > 0 ? sfOv : totalWorkArea;
    const tier = getEffectiveTier(i);
    const price = tier === 'over35' ? item.over35Price
                : tier === 'over26' ? item.over26Price
                : item.standardPrice;
    return s + sf * price;
  }, 0);

  const laborTotal = masonryLaborAdditionItems.reduce((s, item, i) =>
    s + (parseFloat(laborSqft[i]) || 0) * item.pricePerSF, 0);

  const carryTotal = masonryExcessiveCarryItems.reduce((s, item, i) =>
    s + (parseFloat(carryQty[i]) || 0) * item.priceEach, 0);

  const flushTotal = masonryFlushBandsItems.reduce((s, item, i) =>
    s + (parseFloat(flushLF[i]) || 0) * item.pricePerLF, 0);

  const foamTotal = masonryRaisedFoamItems.reduce((s, item, i) => {
    const qty = parseFloat(foamQty[i]) || 0;
    const per = parseFloat(foamPer[i]);
    return s + qty * (isNaN(per) ? item.pricePerUnit : per);
  }, 0);

  const stepsATotal = masonryStepsTreadsAItems.reduce((s, item, i) => {
    if (item.displayOnly) return s;
    if (item.requiresYes && stepsAYesNo !== 'yes') return s;
    return s + (parseFloat(stepsALF[i]) || 0) * item.pricePerLF;
  }, 0);

  const stepsBTotal = masonryStepsTreadsBItems.reduce((s, item, i) =>
    s + (parseFloat(stepsBQty[i]) || 0) * item.priceEach, 0);

  const carpentryTotal = masonryCarpentryItems.reduce((s, item, i) =>
    s + (parseFloat(carpentryQty[i]) || 0) * item.priceEach, 0);

  const subtotal = scaffoldTotal + demoTotal + dumpsterTotal + brickfaceTotal
    + laborTotal + carryTotal + flushTotal + foamTotal
    + stepsATotal + stepsBTotal + carpentryTotal;

  const zoneAmount = zoneIdx >= 0 ? subtotal * masonryZones[zoneIdx].pct : 0;
  const totalCost  = subtotal + zoneAmount;

  const repCascade    = calculateDiscountCascade(totalCost);
  const officePubNum  = parseFloat(officePublishedPrice) || 0;
  const officeCascade = calculateDiscountCascade(officePubNum);

  const fmt = (n) => '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const updateArr = (arr, idx, val) => arr.map((v, i) => i === idx ? val : v);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="masonry">
      <h2>Masonry</h2>

      {/* ── Measurement Tables ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div>
          <h3>Scaffolding</h3>
          <WallsMeasurementTable data={scaffoldData} setData={setScaffoldData} />
          <div className="masonry-area-total">Total Scaffold Area: <strong>{totalScaffoldArea.toFixed(2)} SF</strong></div>
        </div>
        <div>
          <h3>Work Area – Wall</h3>
          <WallsMeasurementTable data={workAreaData} setData={setWorkAreaData} />
          <div className="masonry-area-total">Total Work Area: <strong>{totalWorkArea.toFixed(2)} SF</strong></div>
        </div>
      </div>

      {/* ── Scaffolding (Degree of Difficulty) ───────────────────────────── */}
      <h3>Scaffolding (Degree of Difficulty)</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th style={{ width: 50 }}></th>
            <th>Description</th>
            <th className="right-align">Sq Ft / Qty</th>
            <th className="right-align">$ Per Sq Ft</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryScaffoldingTiers.map((tier, i) => {
            const checked = scaffoldTierIdx === i;
            const sfDisplay = tier.unit === 'SF'
              ? totalScaffoldArea.toFixed(2)
              : tier.unit === 'LF' || tier.unit === 'flat'
              ? null : '';
            const total = (() => {
              if (!checked) return 0;
              if (tier.unit === 'SF')   return totalScaffoldArea * tier.pricePerUnit;
              if (tier.unit === 'LF')   return (parseFloat(scaffoldManualQty[i]) || 0) * tier.pricePerUnit;
              if (tier.unit === 'flat') return tier.pricePerUnit;
              return 0;
            })();
            return (
              <tr key={i}>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" style={cbStyle} checked={checked}
                    onChange={() => setScaffoldTierIdx(checked ? -1 : i)} />
                </td>
                <td>{tier.name}</td>
                <td>
                  {sfDisplay !== null ? (
                    <div style={{ textAlign: 'right', padding: '8px' }}>{sfDisplay}</div>
                  ) : (
                    <input type="number" inputMode="decimal" min="0" style={numStyle}
                      placeholder={tier.unit === 'LF' ? 'Linear Ft' : 'Qty'}
                      value={scaffoldManualQty[i]}
                      onChange={e => setScaffoldManualQty(updateArr(scaffoldManualQty, i, e.target.value))} />
                  )}
                </td>
                <td className="right-align">
                  {tier.unit === 'flat' ? 'Flat Rate' : fmt(tier.pricePerUnit)}
                </td>
                <td className="right-align total-price-cell">{fmt(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Demolition ───────────────────────────────────────────────────── */}
      <h3>Demolition</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 120 }} className="right-align">Sq Ft</th>
            <th className="right-align">$ Per Sq Ft</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryDemolitionItems.map((item, i) => {
            const sf = parseFloat(demoSqft[i]) || 0;
            return (
              <tr key={i}>
                <td>{item.name}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    value={demoSqft[i]}
                    onChange={e => setDemoSqft(updateArr(demoSqft, i, e.target.value))} />
                </td>
                <td className="right-align">{fmt(item.pricePerSF)}</td>
                <td className="right-align total-price-cell">{fmt(sf * item.pricePerSF)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Dumpsters ────────────────────────────────────────────────────── */}
      <h3>Dumpsters (Standard Debris and Masonry)</h3>
      {/* Important notice about dumpsters */}
      <div style={{ border: '2px solid #C0392B', borderRadius: '4px', padding: '12px 16px', margin: '0 0 8px 0', color: '#C0392B', backgroundColor: '#fff5f5', fontSize: '14px' }}>
        <div><strong>DEBRIS REMOVAL OR DUMPSTERS ARE REQUIRED ON EVERY JOB</strong></div>
        <div style={{ marginTop: '6px' }}>Dumpsters can be provided by the customer at their own expense – they would solely be responsible for delivery, pick up and weight overage fees if applicable.</div>
        <div style={{ marginTop: '6px' }}>Must be written that way on contract.</div>
      </div>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 100 }} className="right-align">Quantity</th>
            <th className="right-align">Per Item</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryDumpsterItems.map((item, i) => {
            const qty = parseFloat(dumpsterQty[i]) || 0;
            return (
              <tr key={i}>
                <td>{item.name}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    value={dumpsterQty[i]}
                    onChange={e => setDumpsterQty(updateArr(dumpsterQty, i, e.target.value))} />
                </td>
                <td className="right-align">{fmt(item.priceEach)}</td>
                <td className="right-align total-price-cell">{fmt(qty * item.priceEach)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Brickface + Troweled Stucco + Hardcoat ───────────────────────── */}
      <h3>Brickface + Troweled Stucco + Hardcoat</h3>
      <div style={{ color: '#C0392B', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>
        No outs can be deducted unless it is 50% of garage door outs which is allowed
      </div>
      <table className="pricing-table">
        <thead>
          <tr>
            <th style={{ width: 50 }}></th>
            <th>Description</th>
            <th className="right-align">Sq Ft</th>
            <th style={{ width: 110 }}>SF Override</th>
            <th style={{ textAlign: 'center' }}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="checkbox" style={cbStyle}
                  checked={bfGlobalTier === 'standard'}
                  onChange={() => setBfGlobalTier('standard')} />
                Standard
              </label>
            </th>
            <th style={{ textAlign: 'center' }}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="checkbox" style={cbStyle}
                  checked={bfGlobalTier === 'over26'}
                  onChange={() => setBfGlobalTier('over26')} />
                Over 26'
              </label>
            </th>
            <th style={{ textAlign: 'center' }}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="checkbox" style={cbStyle}
                  checked={bfGlobalTier === 'over35'}
                  onChange={() => setBfGlobalTier('over35')} />
                Over 35'
              </label>
            </th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryBrickfaceItems.map((item, i) => {
            const sfOv     = parseFloat(bfSFOverride[i]);
            const effectSF = sfOv > 0 ? sfOv : totalWorkArea;
            const rowTier  = getEffectiveTier(i);
            const price    = rowTier === 'over35' ? item.over35Price
                           : rowTier === 'over26' ? item.over26Price
                           : item.standardPrice;
            const rowTotal = bfChecked[i] ? effectSF * price : 0;
            const toggleRowTier = (tier) =>
              setBfRowTier(updateArr(bfRowTier, i, bfRowTier[i] === tier ? null : tier));

            return (
              <tr key={i}>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" style={cbStyle}
                    checked={bfChecked[i]}
                    onChange={() => setBfChecked(updateArr(bfChecked, i, !bfChecked[i]))} />
                </td>
                <td>
                  <div>{item.name}</div>
                  {item.note && (
                    <div style={{ color: '#C0392B', fontSize: '12px', marginTop: '2px' }}>{item.note}</div>
                  )}
                </td>
                <td className="right-align">{totalWorkArea.toFixed(2)}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    placeholder="Override"
                    value={bfSFOverride[i]}
                    onChange={e => setBfSFOverride(updateArr(bfSFOverride, i, e.target.value))} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="checkbox" style={{ ...cbStyle, width: 16, height: 16 }}
                      checked={bfRowTier[i] === 'standard'}
                      onChange={() => toggleRowTier('standard')} />
                    {fmt(item.standardPrice)}
                  </label>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="checkbox" style={{ ...cbStyle, width: 16, height: 16 }}
                      checked={bfRowTier[i] === 'over26'}
                      onChange={() => toggleRowTier('over26')} />
                    {fmt(item.over26Price)}
                  </label>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="checkbox" style={{ ...cbStyle, width: 16, height: 16 }}
                      checked={bfRowTier[i] === 'over35'}
                      onChange={() => toggleRowTier('over35')} />
                    {fmt(item.over35Price)}
                  </label>
                </td>
                <td className="right-align total-price-cell">{fmt(rowTotal)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Labor Additions ───────────────────────────────────────────────── */}
      <h3>Labor Additions</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 120 }} className="right-align">Sq Ft</th>
            <th className="right-align">$ Per Sq Ft</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryLaborAdditionItems.map((item, i) => {
            const sf = parseFloat(laborSqft[i]) || 0;
            return (
              <tr key={i}>
                <td>{item.name}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    value={laborSqft[i]}
                    onChange={e => setLaborSqft(updateArr(laborSqft, i, e.target.value))} />
                </td>
                <td className="right-align">{fmt(item.pricePerSF)}</td>
                <td className="right-align total-price-cell">{fmt(sf * item.pricePerSF)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Excessive Carry ───────────────────────────────────────────────── */}
      <h3>Excessive Carry – 100ft from Truck</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 100 }} className="right-align">Qty</th>
            <th className="right-align">Price / EA</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryExcessiveCarryItems.map((item, i) => {
            const qty = parseFloat(carryQty[i]) || 0;
            return (
              <tr key={i}>
                <td>{item.name}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    value={carryQty[i]}
                    onChange={e => setCarryQty(updateArr(carryQty, i, e.target.value))} />
                </td>
                <td className="right-align">{fmt(item.priceEach)}</td>
                <td className="right-align total-price-cell">{fmt(qty * item.priceEach)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Flush Masonry Bands ───────────────────────────────────────────── */}
      <h3>Flush Masonry Bands</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 120 }} className="right-align">Linear Ft</th>
            <th className="right-align">$ Per LF</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryFlushBandsItems.map((item, i) => {
            const lf = parseFloat(flushLF[i]) || 0;
            return (
              <tr key={i}>
                <td>{item.name}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    value={flushLF[i]}
                    onChange={e => setFlushLF(updateArr(flushLF, i, e.target.value))} />
                </td>
                <td className="right-align">{fmt(item.pricePerLF)}</td>
                <td className="right-align total-price-cell">{fmt(lf * item.pricePerLF)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Raised Foam Bands ─────────────────────────────────────────────── */}
      <h3>Raised Foam Bands</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 110 }} className="right-align">Quantity</th>
            <th style={{ width: 120 }} className="right-align">Per</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryRaisedFoamItems.map((item, i) => {
            const qty  = parseFloat(foamQty[i]) || 0;
            const per  = parseFloat(foamPer[i]);
            const unit = isNaN(per) ? item.pricePerUnit : per;
            return (
              <tr key={i}>
                <td>{item.name}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    value={foamQty[i]}
                    onChange={e => setFoamQty(updateArr(foamQty, i, e.target.value))} />
                </td>
                <td>
                  {item.manualPer ? (
                    <input type="number" inputMode="decimal" min="0" style={numStyle}
                      placeholder="$ Per"
                      value={foamPer[i]}
                      onChange={e => setFoamPer(updateArr(foamPer, i, e.target.value))} />
                  ) : (
                    <div style={{ textAlign: 'right', padding: '8px' }}>{fmt(item.pricePerUnit)}</div>
                  )}
                </td>
                <td className="right-align total-price-cell">{fmt(qty * unit)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Steps and Treads A ────────────────────────────────────────────── */}
      <h3>Steps and Treads (A)</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th colSpan={4}>
              Are brick treads being removed? (Circle One)&nbsp;&nbsp;
              <label style={{ cursor: 'pointer', marginRight: '20px' }}>
                <input type="checkbox" style={{ ...cbStyle, width: 16, height: 16, marginRight: 4 }}
                  checked={stepsAYesNo === 'yes'}
                  onChange={() => setStepsAYesNo(stepsAYesNo === 'yes' ? null : 'yes')} />
                Yes
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input type="checkbox" style={{ ...cbStyle, width: 16, height: 16, marginRight: 4 }}
                  checked={stepsAYesNo === 'no'}
                  onChange={() => setStepsAYesNo(stepsAYesNo === 'no' ? null : 'no')} />
                No
              </label>
            </th>
          </tr>
          <tr>
            <th>Description</th>
            <th style={{ width: 120 }} className="right-align">Linear Ft</th>
            <th className="right-align">Per LF</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Note row between "remove brick treads" and width rows */}
          {masonryStepsTreadsAItems.map((item, i) => {
            // Insert info note before 10" Wide row (index 1)
            const noteRow = i === 1 ? (
              <tr key="note">
                <td colSpan={4} style={{ fontSize: '13px', fontStyle: 'italic', padding: '8px', backgroundColor: '#f9f9f9' }}>
                  Pricing below "only" includes remove an existing limestone tread and replacing with new; does not include building it up.
                </td>
              </tr>
            ) : null;

            const disabled = item.requiresYes && stepsAYesNo !== 'yes';
            const lf       = parseFloat(stepsALF[i]) || 0;
            const total    = disabled || item.displayOnly ? 0 : lf * item.pricePerLF;

            return (
              <React.Fragment key={i}>
                {noteRow}
                <tr style={disabled ? { opacity: 0.4 } : {}}>
                  <td>{item.name}</td>
                  <td>
                    {item.displayOnly ? (
                      <div style={{ padding: '8px', textAlign: 'center', fontStyle: 'italic', color: '#666' }}>Call for pricing</div>
                    ) : (
                      <input type="number" inputMode="decimal" min="0" style={numStyle}
                        value={stepsALF[i]}
                        disabled={disabled}
                        onChange={e => setStepsALF(updateArr(stepsALF, i, e.target.value))} />
                    )}
                  </td>
                  <td className="right-align">
                    {item.displayOnly ? '' : fmt(item.pricePerLF)}
                  </td>
                  <td className="right-align total-price-cell">
                    {item.displayOnly ? '' : fmt(total)}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
          {/* Red note at bottom */}
          <tr>
            <td colSpan={4} style={{ color: '#C0392B', fontSize: '13px', fontStyle: 'italic', padding: '8px' }}>
              <strong>Important!</strong> Always add 1" to each side of the existing width of the tread when pricing out; and add 1" to front facing of tread
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Steps and Treads B ────────────────────────────────────────────── */}
      <h3>Steps and Treads (B)</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 100 }} className="right-align">Quantity</th>
            <th className="right-align">Per</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryStepsTreadsBItems.map((item, i) => {
            const qty = parseFloat(stepsBQty[i]) || 0;
            return (
              <tr key={i}>
                <td style={item.highlight ? { color: '#C0392B', fontWeight: 'bold' } : {}}>{item.name}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    value={stepsBQty[i]}
                    onChange={e => setStepsBQty(updateArr(stepsBQty, i, e.target.value))} />
                </td>
                <td className="right-align">{fmt(item.priceEach)}</td>
                <td className="right-align total-price-cell">{fmt(qty * item.priceEach)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Carpentry Work ────────────────────────────────────────────────── */}
      <h3>Carpentry Work</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 100 }} className="right-align">Quantity</th>
            <th className="right-align">Per</th>
            <th className="right-align">Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {masonryCarpentryItems.map((item, i) => {
            const qty = parseFloat(carpentryQty[i]) || 0;
            return (
              <tr key={i}>
                <td style={item.highlight ? { color: '#C0392B' } : {}}>{item.name}</td>
                <td>
                  <input type="number" inputMode="decimal" min="0" style={numStyle}
                    value={carpentryQty[i]}
                    onChange={e => setCarpentryQty(updateArr(carpentryQty, i, e.target.value))} />
                </td>
                <td className="right-align">{fmt(item.priceEach)}</td>
                <td className="right-align total-price-cell">{fmt(qty * item.priceEach)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Subtotals ─────────────────────────────────────────────────────── */}
      <h3>Subtotals</h3>
      <table className="pricing-table">
        <tbody>
          <tr>
            <td className="label-cell"><strong>Subtotal</strong></td>
            <td className="input-cell total-price-cell">{fmt(subtotal)}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Zoning Charges ────────────────────────────────────────────────── */}
      <h3>Zoning Charges (If Applicable)</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th style={{ width: 50 }}></th>
            <th>Zone</th>
            <th className="right-align">%</th>
            <th className="right-align">Sub-Total (Amount Added)</th>
          </tr>
        </thead>
        <tbody>
          {masonryZones.map((zone, i) => {
            const checked = zoneIdx === i;
            return (
              <tr key={i}>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" style={cbStyle}
                    checked={checked}
                    onChange={() => setZoneIdx(checked ? -1 : i)} />
                </td>
                <td><strong>{zone.name.split(':')[0]}:</strong>{zone.name.slice(zone.name.indexOf(':') + 1)}</td>
                <td className="right-align">{(zone.pct * 100).toFixed(0)}%</td>
                <td className="right-align total-price-cell">{fmt(subtotal * zone.pct)}</td>
              </tr>
            );
          })}
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f4f8' }}>
            <td colSpan={3} className="label-cell">
              Total Cost (Subtotal + Zone Charge If Any) = Published Price
            </td>
            <td className="input-cell total-price-cell">{fmt(totalCost)}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Volume Discount Chart ─────────────────────────────────────────── */}
      <h3>Volume Discount Chart</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th colSpan={4} style={{ textAlign: 'center' }}>Volume Discount Chart</th>
          </tr>
        </thead>
        <tbody>
          {masonryVolumeDiscounts.map((row, i) => (
            <tr key={i}>
              <td style={{ width: '15%' }}>{row.high ? 'Between' : 'Over'}</td>
              <td className="right-align" style={{ width: '20%' }}>{row.low}</td>
              <td style={{ width: '20%' }}>{row.high ? row.high : ''}</td>
              <td style={{ width: '10%', textAlign: 'center' }}>=</td>
              <td className="right-align" style={{ width: '15%' }}>{row.discount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Project Calculation ───────────────────────────────────────────── */}
      <div className="window-final-summary" style={{ marginTop: '20px' }}>
        <h3>Project Calculation</h3>
        <table className="calculation-table">
          <thead>
            <tr>
              <th></th>
              <th style={{ textAlign: 'right' }}>Rep</th>
              <th style={{ textAlign: 'right' }}>Office</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="label-cell">Published Price</td>
              <td className="input-cell">{fmt(repCascade.oneYearPrice)}</td>
              <td className="input-cell">
                $<input type="number" inputMode="decimal" min="0"
                  className="window-surcharge-input"
                  value={officePublishedPrice}
                  onChange={e => setOfficePublishedPrice(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className="label-cell">Total Published Price</td>
              <td className="input-cell">{fmt(repCascade.oneYearPrice)}</td>
              <td className="input-cell">{fmt(officeCascade.oneYearPrice)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 30 Day Discount</td>
              <td className="input-cell" style={{ color: '#C0392B' }}>{fmt(repCascade.oneYearDeduction)}</td>
              <td className="input-cell" style={{ color: '#C0392B' }}>{fmt(officeCascade.oneYearDeduction)}</td>
            </tr>
            <tr>
              <td className="label-cell">30 Day Price</td>
              <td className="input-cell">{fmt(repCascade.thirtyDayPrice)}</td>
              <td className="input-cell">{fmt(officeCascade.thirtyDayPrice)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct Ready to Go 10%</td>
              <td className="input-cell" style={{ color: '#C0392B' }}>{fmt(repCascade.thirtyDayDeduction)}</td>
              <td className="input-cell" style={{ color: '#C0392B' }}>{fmt(officeCascade.thirtyDayDeduction)}</td>
            </tr>
            <tr>
              <td className="label-cell">Ready to Go Work Price</td>
              <td className="input-cell">{fmt(repCascade.dayOfPrice)}</td>
              <td className="input-cell">{fmt(officeCascade.dayOfPrice)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 3% Deposit</td>
              <td className="input-cell" style={{ color: '#C0392B' }}>{fmt(repCascade.dayOfDeduction)}</td>
              <td className="input-cell" style={{ color: '#C0392B' }}>{fmt(officeCascade.dayOfDeduction)}</td>
            </tr>
            <tr>
              <td className="label-cell">Final Price</td>
              <td className="input-cell" style={{ color: '#27AE60', fontWeight: 700 }}>{fmt(repCascade.finalSellPrice)}</td>
              <td className="input-cell" style={{ color: '#27AE60', fontWeight: 700 }}>{fmt(officeCascade.finalSellPrice)}</td>
            </tr>
            <tr>
              <td className="label-cell">Contract Price Charged</td>
              <td className="input-cell">
                $<input type="number" inputMode="decimal" min="0"
                  className="window-surcharge-input"
                  value={contractPriceRep}
                  onChange={e => setContractPriceRep(e.target.value)} />
              </td>
              <td className="input-cell">
                $<input type="number" inputMode="decimal" min="0"
                  className="window-surcharge-input"
                  value={contractPriceOffice}
                  onChange={e => setContractPriceOffice(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td className="label-cell">Over / Under Target Price</td>
              <td className="input-cell">
                $<input type="number" inputMode="decimal"
                  className="window-surcharge-input"
                  value={overUnderRep}
                  onChange={e => setOverUnderRep(e.target.value)} />
              </td>
              <td className="input-cell">
                $<input type="number" inputMode="decimal"
                  className="window-surcharge-input"
                  value={overUnderOffice}
                  onChange={e => setOverUnderOffice(e.target.value)} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── GreenSky Financing ────────────────────────────────────────────── */}
      <div className="window-final-summary" style={{ marginTop: '20px' }}>
        <h3>GreenSky Financing</h3>
        <table className="calculation-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: 'center' }}></th>
              <th>GreenSky Plan Name</th>
              <th style={{ textAlign: 'center' }}>Months</th>
              <th style={{ textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ textAlign: 'right' }}>Financed Amount</th>
            </tr>
          </thead>
          <tbody>
            {greenSkyPlans.map((plan, pi) => {
              const financed = repCascade.oneYearPrice * (1 + plan.pct);
              const monthly  = financed / plan.term;
              return (
                <tr key={pi}>
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" style={cbStyle}
                      checked={greenSkyChecked[pi]}
                      onChange={() => setGreenSkyChecked(greenSkyChecked.map((v, j) => j === pi ? !v : v))} />
                  </td>
                  <td className="label-cell">{plan.name}</td>
                  <td className="input-cell" style={{ textAlign: 'center' }}>{plan.term}</td>
                  <td className="input-cell">{fmt(monthly)}</td>
                  <td className="input-cell">{fmt(financed)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Masonry;
