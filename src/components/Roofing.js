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
