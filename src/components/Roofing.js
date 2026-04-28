import React, { useState } from 'react';
import {
  roofingPrices,
  roofingTiers,
  roofingDumpsterPerSquare,
  roofingLaborPerSquare,
} from '../pricing';

function RoofingCalculator({ tier, dimensions }) {
  const { squares, pitch } = dimensions;
  const [surcharge, setSurcharge] = useState(0);
  const [greenSkyChecked, setGreenSkyChecked] = useState(() => Array(3).fill(null).map(() => Array(5).fill(false)));

  const productRows = tier.products.map(p => {
    const qty = squares > 0 ? p.qty(dimensions) : 0;
    const total = +(qty * p.unitPrice).toFixed(2);
    return { ...p, qty, total };
  });

  const totalMaterial = productRows.reduce((s, r) => s + r.total, 0);
  const costPerSquare = squares > 0 ? totalMaterial / squares : 0;
  const dumpster = +(squares * roofingDumpsterPerSquare).toFixed(2);
  const pitchUpcharge = pitch > 8 ? 30 : 0;
  const labor = +(squares * (roofingLaborPerSquare + pitchUpcharge)).toFixed(2);
  const totalCosts = totalMaterial + dumpster + labor + surcharge;
  const totalCostPerSquare = squares > 0 ? totalCosts / squares : 0;

  const margins = [
    { label: '45%', factor: 0.45 },
    { label: '40%', factor: 0.40 },
    { label: '35%', factor: 0.35 },
  ];

  const sellPrices = margins.map(m => {
    const perSquare = squares > 0 ? totalCostPerSquare / (1 - m.factor) : 0;
    const totalSale = +(perSquare * squares).toFixed(2);
    const commission = +(totalSale * 0.10).toFixed(2);
    const netProfit = +(totalSale - totalCosts - commission).toFixed(2);
    return { ...m, perSquare, totalSale, commission, netProfit };
  });

  const fmt = (n) => '$' + Number(n.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="roofing-calculator">
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style={{ width: 60 }}>Qty</th>
            <th>Unit</th>
            <th>Unit Cost</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {productRows.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td className="right-align">{r.qty}</td>
              <td>{r.unit}</td>
              <td className="right-align">{fmt(r.unitPrice)}</td>
              <td className="right-align">{fmt(r.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="window-summary-section">
        <div className="window-summary-grid">
          <div className="window-summary-box">
            <h3>Summary</h3>
            <table className="calculation-table">
              <tbody>
                <tr>
                  <td className="label-cell">Total Material Cost</td>
                  <td className="input-cell">{fmt(totalMaterial)}</td>
                </tr>
                <tr>
                  <td className="label-cell">Cost Per Square</td>
                  <td className="input-cell">{fmt(costPerSquare)}</td>
                </tr>
                <tr>
                  <td className="label-cell">Dumpster</td>
                  <td className="input-cell">{fmt(dumpster)}</td>
                </tr>
                <tr>
                  <td className="label-cell">Labor</td>
                  <td className="input-cell">{fmt(labor)}</td>
                </tr>
                <tr>
                  <td className="label-cell">Steep Pitch Surcharge</td>
                  <td className="input-cell">
                    $<input
                      type="number"
                      min="0"
                      value={surcharge || ''}
                      onChange={e => {
                        const v = parseFloat(e.target.value);
                        setSurcharge(isNaN(v) ? 0 : Math.max(0, v));
                      }}
                      className="window-surcharge-input"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="window-summary-box">
            <h3>Pricing &amp; Margins</h3>
            <table className="calculation-table">
              <tbody>
                <tr>
                  <td className="label-cell">Total Cost Per Square</td>
                  <td className="input-cell">{fmt(totalCostPerSquare)}</td>
                </tr>
                {sellPrices.map(sp => (
                  <tr key={sp.label}>
                    <td className="label-cell">Sell Price ({sp.label} Margin)</td>
                    <td className="input-cell">{fmt(sp.perSquare)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="window-final-summary">
          <h3>Final Summary</h3>
          <table className="calculation-table">
            <thead>
              <tr>
                <th></th>
                <th>Total Sale Price</th>
                <th>Commission (10%)</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {sellPrices.map(sp => (
                <tr key={sp.label}>
                  <td className="label-cell">At {sp.label} Margin</td>
                  <td className="input-cell">{fmt(sp.totalSale)}</td>
                  <td className="input-cell" style={{ color: '#C0392B' }}>{fmt(sp.commission)}</td>
                  <td className="input-cell" style={{ color: '#27AE60', fontWeight: 700 }}>{fmt(sp.netProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GreenSky Financing */}
        <div className="window-final-summary" style={{ marginTop: '20px' }}>
          <h3>GreenSky Financing</h3>
          <table className="calculation-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}></th>
                <th>GreenSky Plan Name</th>
                <th style={{ textAlign: 'right' }}>GreenSky Plan Fee</th>
                <th style={{ textAlign: 'right' }}>Financed Amount</th>
              </tr>
            </thead>
            <tbody>
              {sellPrices.map((sp, mi) => (
                <React.Fragment key={sp.label}>
                  <tr>
                    <td colSpan={4} className="label-cell" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                      At {sp.label} Margin — Total Sale: {fmt(sp.totalSale)}
                    </td>
                  </tr>
                  {[
                    { name: 'GreenSky Plan 6124 - 12.50%', pct: 0.125 },
                    { name: 'GreenSky Plan 3108 - 7.80%', pct: 0.078 },
                    { name: 'GreenSky Plan 4158 - 6.50%', pct: 0.065 },
                    { name: 'GreenSky Plan 3068 - 5.00%', pct: 0.05 },
                    { name: 'GreenSky Plan 9991 - 0%', pct: 0 },
                  ].map((plan, pi) => (
                    <tr key={pi}>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={greenSkyChecked[mi][pi]}
                          onChange={() => setGreenSkyChecked(prev =>
                            prev.map((row, r) => r === mi ? row.map((v, c) => c === pi ? !v : v) : row)
                          )}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                      </td>
                      <td className="label-cell">{plan.name}</td>
                      <td className="input-cell">{fmt(sp.totalSale * plan.pct)}</td>
                      <td className="input-cell">{fmt(sp.totalSale * (1 + plan.pct))}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Roofing() {
  const [activeSubTab, setActiveSubTab] = useState('patriot');
  const [dimensions, setDimensions] = useState({
    squares: 0,
    eave: 0,
    ridge: 0,
    valley: 0,
    pitch: 0,
  });

  const handleDimChange = (field, value) => {
    const parsed = parseFloat(value);
    setDimensions({ ...dimensions, [field]: isNaN(parsed) ? 0 : Math.max(0, parsed) });
  };

  const fmt = (n) => '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="roofing">
      <h2>Roofing Cost Calculator</h2>

      <div className="roofing-dimensions">
        <h3>Project Dimensions</h3>
        <div className="roofing-dimensions-grid">
          <label>
            Total Roof Squares
            <input
              type="number"
              min="0"
              step="0.01"
              value={dimensions.squares || ''}
              onChange={e => handleDimChange('squares', e.target.value)}
            />
          </label>
          <label>
            Eave Linear Footage
            <input
              type="number"
              min="0"
              step="0.01"
              value={dimensions.eave || ''}
              onChange={e => handleDimChange('eave', e.target.value)}
            />
          </label>
          <label>
            Ridge Linear Footage
            <input
              type="number"
              min="0"
              step="0.01"
              value={dimensions.ridge || ''}
              onChange={e => handleDimChange('ridge', e.target.value)}
            />
          </label>
          <label>
            Valley Linear Footage
            <input
              type="number"
              min="0"
              step="0.01"
              value={dimensions.valley || ''}
              onChange={e => handleDimChange('valley', e.target.value)}
            />
          </label>
          <label>
            Predominant Roof Pitch
            <input
              type="number"
              min="0"
              step="0.5"
              value={dimensions.pitch || ''}
              onChange={e => handleDimChange('pitch', e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="roofing-sub-tabs">
        {Object.entries(roofingTiers).map(([key, tier]) => (
          <button
            key={key}
            className={activeSubTab === key ? 'active' : ''}
            onClick={() => setActiveSubTab(key)}
          >
            {tier.label}
          </button>
        ))}
      </div>

      <RoofingCalculator
        key={activeSubTab}
        tier={roofingTiers[activeSubTab]}
        dimensions={dimensions}
      />

      <div className="roofing-price-sheet">
        <h3>Roofing Prices</h3>
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity / UOM</th>
            </tr>
          </thead>
          <tbody>
            {roofingPrices.map((cat) => (
              <React.Fragment key={cat.category}>
                <tr className="roofing-category-row">
                  <td colSpan={3}>{cat.category}</td>
                </tr>
                {cat.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td className="right-align">{fmt(item.price)}</td>
                    <td>{item.uom}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Roofing;
