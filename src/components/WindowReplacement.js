import React, { useState } from 'react';
import { windowProducts, calculateWindowDumpster } from '../pricing';

function WindowReplacement() {
  const buildInitialQtys = () => {
    const qtys = {};
    windowProducts.forEach(group => {
      group.products.forEach((_, i) => {
        qtys[`${group.bracket}-${i}`] = 0;
      });
    });
    return qtys;
  };

  const [quantities, setQuantities] = useState(buildInitialQtys);
  const [surcharge, setSurcharge] = useState(0);

  const handleQtyChange = (key, value) => {
    const parsed = parseInt(value, 10);
    setQuantities({ ...quantities, [key]: isNaN(parsed) ? 0 : Math.max(0, parsed) });
  };

  // Compute totals
  let totalMaterialCost = 0;
  let totalLaborCost = 0;
  let totalWindowQty = 0;

  const rows = [];
  windowProducts.forEach(group => {
    group.products.forEach((product, i) => {
      const key = `${group.bracket}-${i}`;
      const qty = quantities[key] || 0;
      const totalCost = Math.ceil((product.unitCost + product.laborCost) * qty);
      totalMaterialCost += product.unitCost * qty;
      totalLaborCost += product.laborCost * qty;
      totalWindowQty += qty;
      rows.push({ ...product, key, qty, totalCost, bracket: group.bracket });
    });
  });

  totalMaterialCost = Math.ceil(totalMaterialCost);
  totalLaborCost = Math.ceil(totalLaborCost);

  const dumpster = calculateWindowDumpster(totalWindowQty);
  const totalCosts = totalMaterialCost + dumpster + totalLaborCost + surcharge;
  const costPerWindow = totalWindowQty > 0 ? Math.ceil(totalCosts / totalWindowQty) : 0;

  const margins = [
    { label: '45%', factor: 0.45 },
    { label: '40%', factor: 0.40 },
    { label: '35%', factor: 0.35 },
  ];

  const sellPrices = margins.map(m => {
    const perWindow = totalWindowQty > 0 ? Math.ceil(costPerWindow / (1 - m.factor)) : 0;
    const totalSale = Math.ceil(perWindow * totalWindowQty);
    const commission = Math.ceil(totalSale * 0.10);
    const netProfit = Math.ceil(totalSale - totalCosts - commission);
    return { ...m, perWindow, totalSale, commission, netProfit };
  });

  const fmt = (n) => '$' + n.toLocaleString();

  let lastBracket = '';

  return (
    <div className="window-replacement">
      <h2>Provia Endure White In / White Out Vinyl Replacement Windows</h2>

      <div className="window-product-table-wrapper">
        <table className="pricing-table window-product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style={{ width: 70 }}>Qty</th>
              <th>Unit</th>
              <th>Unit Cost</th>
              <th>Labor Cost</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const showHeader = row.bracket !== lastBracket;
              lastBracket = row.bracket;
              return (
                <React.Fragment key={row.key}>
                  {showHeader && (
                    <tr className="window-bracket-header">
                      <td colSpan={6}>{row.bracket}</td>
                    </tr>
                  )}
                  <tr>
                    <td>{row.name}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={row.qty || ''}
                        onChange={e => handleQtyChange(row.key, e.target.value)}
                        className="window-qty-input"
                      />
                    </td>
                    <td>EA</td>
                    <td className="right-align">{fmt(row.unitCost)}</td>
                    <td className="right-align">{fmt(row.laborCost)}</td>
                    <td className="right-align total-price-cell">
                      {row.qty > 0 ? fmt(row.totalCost) : '$0'}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="window-summary-section">
        <div className="window-summary-grid">
          {/* Summary */}
          <div className="window-summary-box">
            <h3>Summary</h3>
            <table className="calculation-table">
              <tbody>
                <tr>
                  <td className="label-cell">Total Windows</td>
                  <td className="input-cell">{totalWindowQty}</td>
                </tr>
                <tr>
                  <td className="label-cell">Total Material Cost</td>
                  <td className="input-cell">{fmt(totalMaterialCost)}</td>
                </tr>
                <tr>
                  <td className="label-cell">Labor</td>
                  <td className="input-cell">{fmt(totalLaborCost)}</td>
                </tr>
                <tr>
                  <td className="label-cell">Dumpster</td>
                  <td className="input-cell">{fmt(dumpster)}</td>
                </tr>
                <tr>
                  <td className="label-cell">Surcharge</td>
                  <td className="input-cell">
                    $<input
                      type="number"
                      min="0"
                      value={surcharge || ''}
                      onChange={e => {
                        const v = parseInt(e.target.value, 10);
                        setSurcharge(isNaN(v) ? 0 : Math.max(0, v));
                      }}
                      className="window-surcharge-input"
                    />
                  </td>
                </tr>
                <tr className="window-highlight-row">
                  <td className="label-cell">Cost Per Window</td>
                  <td className="input-cell">{fmt(costPerWindow)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing & Margins */}
          <div className="window-summary-box">
            <h3>Pricing &amp; Margins</h3>
            <table className="calculation-table">
              <tbody>
                <tr>
                  <td className="label-cell">Total Cost Per Window</td>
                  <td className="input-cell">{fmt(costPerWindow)}</td>
                </tr>
                {sellPrices.map(sp => (
                  <tr key={sp.label}>
                    <td className="label-cell">Sell Price ({sp.label} Margin)</td>
                    <td className="input-cell">{fmt(sp.perWindow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Summary */}
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

export default WindowReplacement;
