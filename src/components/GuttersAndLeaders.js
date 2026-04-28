import React, { useState } from 'react';
import { gutterTypes, gutterGuardTypes, leaderLengths, miterSurcharge, calculateDiscountCascade } from '../pricing';

const SIDES = ['FRONT', 'RIGHT', 'BACK', 'LEFT'];
const ROWS_PER_SIDE = 4;

function buildInitialGrid() {
  const data = [];
  SIDES.forEach(side => {
    for (let i = 0; i < ROWS_PER_SIDE; i++) {
      data.push([i === 0 ? side : '', '', '']);
    }
  });
  return data;
}

function MeasurementGrid({ title, data, setData, typeOptions }) {
  const updateCell = (rowIndex, colIndex, value) => {
    setData(prev => prev.map((row, ri) =>
      ri === rowIndex
        ? row.map((cell, ci) => (ci === colIndex ? value : cell))
        : row
    ));
  };

  return (
    <div className="table-section">
      <h3>{title}</h3>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Type</th>
            <th>LF</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const sideIndex = Math.floor(rowIndex / ROWS_PER_SIDE);
            const isFirstRow = rowIndex % ROWS_PER_SIDE === 0;
            return (
              <tr key={rowIndex}>
                <td
                  style={{
                    fontWeight: isFirstRow ? 'bold' : 'normal',
                    minWidth: '70px',
                    padding: '4px 8px',
                  }}
                >
                  {isFirstRow ? SIDES[sideIndex] : ''}
                </td>
                <td style={{ padding: '2px' }}>
                  <select
                    value={row[1]}
                    onChange={(e) => updateCell(rowIndex, 1, e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '4px 8px',
                      fontSize: '14px',
                    }}
                  >
                    <option value=""></option>
                    {typeOptions.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '2px' }}>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={row[2]}
                    onChange={(e) => updateCell(rowIndex, 2, e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '4px 8px',
                      fontSize: '14px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GuttersAndLeaders() {
  // Gutters grid data (Front/Right/Back/Left with type dropdown + LF)
  const [guttersData, setGuttersData] = useState(buildInitialGrid);

  // Leaders: count per type per floor
  const initialLeaderCounts = () => {
    const counts = {};
    gutterTypes.forEach(type => {
      counts[type.name] = { firstFloor: 0, secondFloor: 0 };
    });
    return counts;
  };
  const [leaderCounts, setLeaderCounts] = useState(initialLeaderCounts);

  // Gutter Guards grid data
  const [gutterGuardsData, setGutterGuardsData] = useState(buildInitialGrid);

  // Miters count
  const [miterCount, setMiterCount] = useState(0);

  // Calculate gutter totals by type
  const calculateTotalsByType = (data, types) => {
    const totals = {};
    types.forEach(type => {
      totals[type.name] = 0;
    });
    data.forEach(row => {
      const typeName = row[1];
      const lf = parseFloat(row[2]) || 0;
      if (typeName && totals.hasOwnProperty(typeName)) {
        totals[typeName] += lf;
      }
    });
    return totals;
  };

  const gutterTotals = calculateTotalsByType(guttersData, gutterTypes);
  const gutterGuardTotals = calculateTotalsByType(gutterGuardsData, gutterGuardTypes);

  // Gutter total price
  const gutterTotalPrice = gutterTypes.reduce((sum, type) => {
    return sum + ((gutterTotals[type.name] || 0) * type.price);
  }, 0);

  // Leader totals and price
  const leaderDetails = gutterTypes.map(type => {
    const counts = leaderCounts[type.name] || { firstFloor: 0, secondFloor: 0 };
    const firstFloorLF = counts.firstFloor * leaderLengths.firstFloor;
    const secondFloorLF = counts.secondFloor * leaderLengths.secondFloor;
    const totalLF = firstFloorLF + secondFloorLF;
    const totalPrice = totalLF * type.price;
    return { ...type, counts, firstFloorLF, secondFloorLF, totalLF, totalPrice };
  });

  const leaderTotalPrice = leaderDetails.reduce((sum, d) => sum + d.totalPrice, 0);

  // Gutter guard total price
  const gutterGuardTotalPrice = gutterGuardTypes.reduce((sum, type) => {
    return sum + ((gutterGuardTotals[type.name] || 0) * type.price);
  }, 0);

  // Miters total
  const miterTotalPrice = miterCount * miterSurcharge;

  // Custom miscellaneous items
  const [customMiscItems, setCustomMiscItems] = useState([
    { name: '', unit: '', qty: 0, price: 0 },
  ]);
  const [greenSkyChecked, setGreenSkyChecked] = useState([false, false, false]);
  const customMiscTotal = customMiscItems.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);

  // Project calculation
  const totalPrice = gutterTotalPrice + leaderTotalPrice + gutterGuardTotalPrice + miterTotalPrice + customMiscTotal;
  const cascade = calculateDiscountCascade(totalPrice);

  const updateLeaderCount = (typeName, floor, value) => {
    setLeaderCounts(prev => ({
      ...prev,
      [typeName]: {
        ...prev[typeName],
        [floor]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <div className="gutters-and-leaders">
      <h2>Gutters & Leaders</h2>

      {/* Measurement Tables */}
      <div className="three-column-layout">
        <MeasurementGrid
          title="GUTTERS"
          data={guttersData}
          setData={setGuttersData}
          typeOptions={gutterTypes}
        />

        <div className="table-section">
          <h3>LEADERS</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>1st Floor</th>
                <th>2nd Floor</th>
              </tr>
            </thead>
            <tbody>
              {gutterTypes.map((type, idx) => (
                <tr key={idx}>
                  <td>{type.name}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={leaderCounts[type.name]?.firstFloor || 0}
                      onChange={(e) => updateLeaderCount(type.name, 'firstFloor', e.target.value)}
                      style={{width: '60px', textAlign: 'center'}}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={leaderCounts[type.name]?.secondFloor || 0}
                      onChange={(e) => updateLeaderCount(type.name, 'secondFloor', e.target.value)}
                      style={{width: '60px', textAlign: 'center'}}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
            1st floor = {leaderLengths.firstFloor} LF each &nbsp;|&nbsp; 2nd floor = {leaderLengths.secondFloor} LF each
          </p>
        </div>

        <MeasurementGrid
          title="GUTTER GUARDS"
          data={gutterGuardsData}
          setData={setGutterGuardsData}
          typeOptions={gutterGuardTypes}
        />
      </div>

      {/* Miters Input */}
      <div style={{marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
        <label style={{fontWeight: 'bold'}}>Miters:</label>
        <input
          type="number"
          min="0"
          value={miterCount}
          onChange={(e) => setMiterCount(parseFloat(e.target.value) || 0)}
          style={{width: '60px', textAlign: 'center'}}
        />
        <span style={{color: '#666'}}>x ${miterSurcharge} each = ${miterTotalPrice.toFixed(2)}</span>
      </div>

      {/* Price Tables */}
      <div className="price-tables-section">
        <h2 style={{marginTop: '40px', marginBottom: '20px'}}>Price Tables</h2>

        {/* Gutters Price Table */}
        <div className="price-table">
          <h3>Gutters</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Total LF</th>
                <th>Price Per Ft</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {gutterTypes.map((type, idx) => (
                <tr key={idx}>
                  <td>{type.name}</td>
                  <td>{gutterTotals[type.name] || 0}</td>
                  <td>${type.price.toFixed(2)}</td>
                  <td className="total-price-cell">
                    ${((gutterTotals[type.name] || 0) * type.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leaders Price Table */}
        <div className="price-table">
          <h3>Leaders</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>1st Fl</th>
                <th>2nd Fl</th>
                <th>Total LF</th>
                <th>Price Per Ft</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {leaderDetails.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.name}</td>
                  <td>{d.counts.firstFloor} ({d.firstFloorLF} LF)</td>
                  <td>{d.counts.secondFloor} ({d.secondFloorLF} LF)</td>
                  <td>{d.totalLF}</td>
                  <td>${d.price.toFixed(2)}</td>
                  <td className="total-price-cell">${d.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gutter Guards Price Table */}
        <div className="price-table">
          <h3>Gutter Guards</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Total LF</th>
                <th>Price Per Ft</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {gutterGuardTypes.map((type, idx) => (
                <tr key={idx}>
                  <td>{type.name}</td>
                  <td>{gutterGuardTotals[type.name] || 0}</td>
                  <td>${type.price.toFixed(2)}</td>
                  <td className="total-price-cell">
                    ${((gutterGuardTotals[type.name] || 0) * type.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Miscellaneous Items */}
        <div className="price-table">
          <h3>MISCELLANEOUS</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Sub-Total</th>
              </tr>
            </thead>
            <tbody>
              {customMiscItems.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <input type="text" placeholder="Item name" value={item.name}
                      onChange={(e) => { const updated = customMiscItems.map((c, i) => i === idx ? { ...c, name: e.target.value } : c); setCustomMiscItems(updated); }}
                      style={{width: '100%', minHeight: '40px'}} />
                  </td>
                  <td>
                    <input type="text" placeholder="Unit" value={item.unit}
                      onChange={(e) => { const updated = customMiscItems.map((c, i) => i === idx ? { ...c, unit: e.target.value } : c); setCustomMiscItems(updated); }}
                      style={{width: '60px', minHeight: '40px', textAlign: 'center'}} />
                  </td>
                  <td>
                    <input type="number" inputMode="decimal" value={item.qty || ''}
                      onChange={(e) => { const updated = customMiscItems.map((c, i) => i === idx ? { ...c, qty: e.target.value } : c); setCustomMiscItems(updated); }}
                      style={{width: '60px', textAlign: 'center'}} />
                  </td>
                  <td>
                    <input type="number" inputMode="decimal" value={item.price || ''}
                      onChange={(e) => { const updated = customMiscItems.map((c, i) => i === idx ? { ...c, price: e.target.value } : c); setCustomMiscItems(updated); }}
                      style={{width: '80px', textAlign: 'center'}} />
                  </td>
                  <td className="total-price-cell">
                    ${((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setCustomMiscItems([...customMiscItems, { name: '', unit: '', qty: 0, price: 0 }])}
            style={{marginTop: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', border: '1px solid #BDC3C7', borderRadius: '4px', backgroundColor: '#ECF0F1'}}
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Project Calculation */}
      <div style={{display: 'flex', gap: '30px', marginTop: '40px', alignItems: 'flex-start'}}>
  <div className="project-calculation-section" style={{flex: '0 0 500px', marginTop: '0'}}>
        <div className="red-notice">
          JOB MINIMUM IS $650 IF COMBINED WITH OTHER WORK - STAND ALONE JOB MINIMUM IS $2800
        </div>

        <table className="calculation-table">
          <thead>
            <tr>
              <th>Project Calculation</th>
              <th>Rep</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="label-cell">Gutters</td>
              <td className="input-cell">
                ${gutterTotalPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Leaders</td>
              <td className="input-cell">
                ${leaderTotalPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Gutter Guards</td>
              <td className="input-cell">
                ${gutterGuardTotalPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Miters</td>
              <td className="input-cell">
                ${miterTotalPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Miscellaneous</td>
              <td className="input-cell">
                ${customMiscTotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">1 Year Price</td>
              <td className="input-cell">
                ${cascade.oneYearPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10% to get to 30 Day Price</td>
              <td className="input-cell">
                (${cascade.oneYearDeduction.toFixed(2)})
              </td>
            </tr>
            <tr>
              <td className="label-cell">30 Day Price</td>
              <td className="input-cell">
                ${cascade.thirtyDayPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10% to get to Day of Price</td>
              <td className="input-cell">
                (${cascade.thirtyDayDeduction.toFixed(2)})
              </td>
            </tr>
            <tr>
              <td className="label-cell">Day of Price</td>
              <td className="input-cell">
                ${cascade.dayOfPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 3% for 33% Deposit</td>
              <td className="input-cell">
                (${cascade.dayOfDeduction.toFixed(2)})
              </td>
            </tr>
            <tr>
              <td className="label-cell">Final Sell Price</td>
              <td className="input-cell">
                ${cascade.finalSellPrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="red-notice" style={{marginTop: '10px'}}>
          50% deposit required for all gutter and leader projects
        </div>

        {/* GreenSky Financing */}
        <table className="calculation-table" style={{marginTop: '16px'}}>
          <thead>
            <tr>
              <th style={{width: '40px', textAlign: 'center'}}></th>
              <th>GreenSky Plan Name</th>
              <th style={{textAlign: 'right'}}>GreenSky Plan Fee</th>
              <th style={{textAlign: 'right'}}>Financed Amount</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'GreenSky Plan 6160', pct: 0.23 },
              { name: 'GreenSky Plan 4158', pct: 0.065 },
              { name: 'GreenSky Plan 3068', pct: 0.05 },
            ].map((plan, i) => (
              <tr key={i}>
                <td style={{textAlign: 'center'}}>
                  <input
                    type="checkbox"
                    checked={greenSkyChecked[i]}
                    onChange={() => setGreenSkyChecked(prev => prev.map((v, j) => j === i ? !v : v))}
                    style={{width: '20px', height: '20px', cursor: 'pointer'}}
                  />
                </td>
                <td className="label-cell">{plan.name}</td>
                <td className="input-cell">${(cascade.oneYearPrice * plan.pct).toFixed(2)}</td>
                <td className="input-cell">${(cascade.oneYearPrice * (1 + plan.pct)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contract Specifications */}
      <div className="contract-specs-section" style={{maxWidth: '400px', marginLeft: 'auto', marginRight: '200px'}}>
        <div className="specs-header">CONTRACT SPECIFICATIONS BELOW</div>

        <div className="specs-content">
          <ul>
            <li>Work area and Location</li>
            <li>Type of removal <span className="red-text">(if any)</span></li>
          </ul>
          <ul>
            <li>Install gutters and leaders on entire home</li>
            <li>Available sizes: 5" and 6"</li>
            <li>Colors: White or Colored</li>
            <li>Gutter guard options: Hangtite or Gutter Screen <span className="red-text">(if any)</span></li>
          </ul>
        </div>
      </div>
    </div>
      </div>
  );
}

export default GuttersAndLeaders;
