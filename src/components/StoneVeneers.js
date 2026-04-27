import React, { useState } from 'react';
import {
  demolitionItems,
  debrisRemovalItems,
  stoneItemPrices,
  stoneMiscItems,
  stoneJobMinimums,
  calculateDiscountCascade,
} from '../pricing';

const inputStyles = {
  text: {
    width: '100%',
    minHeight: '44px',
    padding: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '14px',
  },
  number: {
    width: '100%',
    minHeight: '44px',
    padding: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '14px',
    textAlign: 'right',
  },
  computed: {
    width: '100%',
    minHeight: '44px',
    padding: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '14px',
    textAlign: 'right',
    backgroundColor: '#f0f0f0',
  },
};

function StoneVeneers() {
  // Stone Flats Data
  const [stoneFlatsData, setStoneFlatsData] = useState([
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ]);

  // Stone Corners Data
  const [stoneCornersData, setStoneCornersData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  // Stone Sills Data
  const [stoneSillsData, setStoneSillsData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  // Outs Data
  const [outsData, setOutsData] = useState([
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ]);

  // Manual inputs for price tables
  const [demolition, setDemolition] = useState(
    demolitionItems.map(item => ({ ...item, perSquare: 0 }))
  );

  const [debrisRemoval, setDebrisRemoval] = useState(
    debrisRemovalItems.map(item => ({ ...item, quantity: 0 }))
  );

  const [miscellaneous, setMiscellaneous] = useState(
    stoneMiscItems.map(item => ({ ...item, sflfq: 0 }))
  );

  const [customMiscItems, setCustomMiscItems] = useState([
    { name: '', unit: '', qty: 0, price: 0 },
  ]);

  // Calculations
  const calculateFlatsSubtotal = () => {
    return stoneFlatsData.reduce((sum, row) => {
      const width = parseFloat(row[1]) || 0;
      const height = parseFloat(row[2]) || 0;
      return sum + (width * height);
    }, 0);
  };

  const calculateTotalOuts = () => {
    return outsData.reduce((sum, row) => {
      const width = parseFloat(row[1]) || 0;
      const height = parseFloat(row[2]) || 0;
      return sum + (width * height);
    }, 0);
  };

  const flatsSubtotal = calculateFlatsSubtotal();
  const totalOuts = calculateTotalOuts();
  const deductOuts = totalOuts; // Automatically use Total Outs
  const boxSize = 33;
  const rawFlats = flatsSubtotal - deductOuts;
  const totalFlats = rawFlats > 0 ? Math.ceil(rawFlats / boxSize) * boxSize : 0;

  const calculateCornersSubtotal = () => {
    return stoneCornersData.reduce((sum, row) => {
      const lf = parseFloat(row[1]) || 0;
      return sum + lf;
    }, 0);
  };

  const cornersSubtotal = calculateCornersSubtotal();
  const totalCorners = cornersSubtotal > 0 ? Math.ceil(cornersSubtotal / boxSize) * boxSize : 0;

  const calculateSillsSubtotal = () => {
    return stoneSillsData.reduce((sum, row) => {
      const lf = parseFloat(row[1]) || 0;
      return sum + lf;
    }, 0);
  };

  const sillsSubtotal = calculateSillsSubtotal();
  const totalSills = sillsSubtotal > 0 ? Math.ceil(sillsSubtotal / boxSize) * boxSize : 0;

  // Project Calculation totals
  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const stoneItemsTotal = (totalFlats * stoneItemPrices.flats) + (totalCorners * stoneItemPrices.corners) + (totalSills * stoneItemPrices.sills);
  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
  const customMiscTotal = customMiscItems.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);
  const subtotal = demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal + customMiscTotal;
  const cascade = calculateDiscountCascade(subtotal + stoneItemPrices.deliveryFee);

  // Helper to update a cell in an array-of-arrays state
  const updateCell = (data, setData, rowIdx, colIdx, value) => {
    const newData = data.map((row, ri) =>
      ri === rowIdx ? row.map((cell, ci) => (ci === colIdx ? value : cell)) : [...row]
    );
    // Auto-compute total column for 4-column tables (width * height)
    if (newData[rowIdx].length === 4 && (colIdx === 1 || colIdx === 2)) {
      const width = parseFloat(newData[rowIdx][1]) || 0;
      const height = parseFloat(newData[rowIdx][2]) || 0;
      newData[rowIdx][3] = width * height;
    }
    setData(newData);
  };

  const renderFourColTable = (headers, data, setData) => (
    <table className="pricing-table" style={{width: '100%', borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{padding: '6px', border: '1px solid #ccc', backgroundColor: '#f5f5f5', fontSize: '13px'}}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => {
          const computedTotal = (parseFloat(row[1]) || 0) * (parseFloat(row[2]) || 0);
          return (
            <tr key={rowIdx}>
              <td style={{padding: '2px', border: '1px solid #ccc'}}>
                <input
                  type="text"
                  value={row[0]}
                  onChange={(e) => updateCell(data, setData, rowIdx, 0, e.target.value)}
                  style={inputStyles.text}
                />
              </td>
              <td style={{padding: '2px', border: '1px solid #ccc'}}>
                <input
                  type="number"
                  inputMode="decimal"
                  value={row[1]}
                  onChange={(e) => updateCell(data, setData, rowIdx, 1, e.target.value)}
                  style={inputStyles.number}
                />
              </td>
              <td style={{padding: '2px', border: '1px solid #ccc'}}>
                <input
                  type="number"
                  inputMode="decimal"
                  value={row[2]}
                  onChange={(e) => updateCell(data, setData, rowIdx, 2, e.target.value)}
                  style={inputStyles.number}
                />
              </td>
              <td style={{padding: '2px', border: '1px solid #ccc'}}>
                <div style={inputStyles.computed}>
                  {computedTotal || ''}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderTwoColTable = (headers, data, setData) => (
    <table className="pricing-table" style={{width: '100%', borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{padding: '6px', border: '1px solid #ccc', backgroundColor: '#f5f5f5', fontSize: '13px'}}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx}>
            <td style={{padding: '2px', border: '1px solid #ccc'}}>
              <input
                type="text"
                value={row[0]}
                onChange={(e) => updateCell(data, setData, rowIdx, 0, e.target.value)}
                style={inputStyles.text}
              />
            </td>
            <td style={{padding: '2px', border: '1px solid #ccc'}}>
              <input
                type="number"
                inputMode="decimal"
                value={row[1]}
                onChange={(e) => updateCell(data, setData, rowIdx, 1, e.target.value)}
                style={inputStyles.number}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="stone-veneers">
      <h2>Stone Veneers</h2>

      {/* Measurement Tables */}
      <div className="three-column-layout">
        <div className="table-section">
          <h3>STONE FLATS</h3>
          {renderFourColTable(['Location', 'Width', 'Height', 'Total SF'], stoneFlatsData, setStoneFlatsData)}
          <div className="subtotal-row">Flats SF Subtotal: {flatsSubtotal.toFixed(2)}</div>
          <div className="deduct-row">
            Deduct Outs: ({totalOuts.toFixed(2)})
          </div>
          <div className="total-row">Total Flats: {totalFlats.toFixed(2)}</div>
        </div>

        <div className="table-section">
          <h3>STONE CORNERS</h3>
          {renderTwoColTable(['Location', 'LF'], stoneCornersData, setStoneCornersData)}
          <div className="subtotal-row">Subtotal: {cornersSubtotal.toFixed(2)}</div>
          <div className="note-row">IF ODD # ROUND UP TO NEAREST EVEN FOOT</div>
          <div className="total-row">Total Corners: {totalCorners}</div>
        </div>

        <div className="table-section">
          <h3>STONE SILLS</h3>
          {renderTwoColTable(['Location', 'LF'], stoneSillsData, setStoneSillsData)}
          <div className="subtotal-row">Subtotal: {sillsSubtotal.toFixed(2)}</div>
          <div className="note-row">IF ODD # ROUND UP TO NEAREST EVEN FOOT</div>
          <div className="total-row">Total Sills: {totalSills}</div>
        </div>
      </div>

      {/* Outs Table and Guidelines */}
      <div className="two-column-layout" style={{marginTop: '30px'}}>
        <div className="table-section">
          <h3>OUTS (TAKE 100% OUTS)</h3>
          {renderFourColTable(['Location', 'Width', 'Height', 'Total'], outsData, setOutsData)}
          <div className="total-row">Total Outs: ({totalOuts.toFixed(2)})</div>
        </div>

        <div className="guidelines-box">
          <h3>STONE VENEER GUIDELINES</h3>
          <ul>
            <li>Measurements must be tip to tip</li>
            <li>Brick returns at windows/doors, must include in SF &amp; LF</li>
            <li>New treads/cap required if existing overhang is not a min of 2 1</li>
            <li>Charge wrap corner fee if turning into vinyl siding or wood siding</li>
            <li>Chimney caps required when stone on chimneys</li>
            <li>Chimney scaffolding required if stone on chimney</li>
          </ul>
        </div>
      </div>

      {/* Price Tables */}
      <div className="price-tables-section" style={{marginTop: '40px'}}>
        {/* Demolition Table */}
        <div className="price-table">
          <h3>DEMOLITION</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Per Square</th>
                <th>Price</th>
                <th>Sub-Total</th>
              </tr>
            </thead>
            <tbody>
              {demolition.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      value={item.perSquare}
                      onChange={(e) => {
                        const newDemolition = demolition.map((d, i) =>
                          i === idx ? { ...d, perSquare: parseFloat(e.target.value) || 0 } : d
                        );
                        setDemolition(newDemolition);
                      }}
                      style={{width: '60px', textAlign: 'center'}}
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="total-price-cell">
                    ${(item.perSquare * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Debris Removal Table */}
        <div className="price-table">
          <h3>DEBRIS REMOVAL (REQUIRED ON ALL JOBS)</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Sub-Total</th>
              </tr>
            </thead>
            <tbody>
              {debrisRemoval.map((item, idx) => (
                <tr key={idx}>
                  <td style={{fontSize: '10px'}}>
                    {item.name}
                    {idx === 0 && <strong> (REQUIRED even if no demo)</strong>}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newDebris = debrisRemoval.map((d, i) =>
                          i === idx ? { ...d, quantity: parseFloat(e.target.value) || 0 } : d
                        );
                        setDebrisRemoval(newDebris);
                      }}
                      style={{width: '60px', textAlign: 'center'}}
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="total-price-cell">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="note-row" style={{fontSize: '11px', fontStyle: 'italic', marginTop: '5px'}}>
            ** Dumpsters can be provided by the customer at their own expense - they would soley be responsible for delivery, pick up and weight overage fees if applicable. Must be written that way on contract.
          </div>
        </div>

        {/* Stone Items Table */}
        <div className="price-table">
          <h3>STONE ITEMS (REQUIRED ON ALL JOBS)</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>SF / LF / Q</th>
                <th>Price</th>
                <th>Sub-Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Stone Flats (1/2" joint only)</td>
                <td>SF: {totalFlats.toFixed(2)}</td>
                <td>${stoneItemPrices.flats}</td>
                <td className="total-price-cell">${(totalFlats * stoneItemPrices.flats).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Stone Corners</td>
                <td>LF: {totalCorners}</td>
                <td>${stoneItemPrices.corners}</td>
                <td className="total-price-cell">${(totalCorners * stoneItemPrices.corners).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Chiseled Stone Sills</td>
                <td>LF: {totalSills}</td>
                <td>${stoneItemPrices.sills}</td>
                <td className="total-price-cell">${(totalSills * stoneItemPrices.sills).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Miscellaneous Table */}
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
              {miscellaneous.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={item.sflfq || ''}
                      onChange={(e) => {
                        const newMisc = miscellaneous.map((m, i) =>
                          i === idx ? { ...m, sflfq: parseFloat(e.target.value) || 0 } : m
                        );
                        setMiscellaneous(newMisc);
                      }}
                      style={{width: '60px', textAlign: 'center'}}
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="total-price-cell">
                    ${(item.sflfq * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
              {customMiscItems.map((item, idx) => (
                <tr key={`custom-${idx}`}>
                  <td>
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => {
                        const updated = customMiscItems.map((c, i) => i === idx ? { ...c, name: e.target.value } : c);
                        setCustomMiscItems(updated);
                      }}
                      style={{width: '100%', minHeight: '40px'}}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Unit"
                      value={item.unit}
                      onChange={(e) => {
                        const updated = customMiscItems.map((c, i) => i === idx ? { ...c, unit: e.target.value } : c);
                        setCustomMiscItems(updated);
                      }}
                      style={{width: '60px', minHeight: '40px', textAlign: 'center'}}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={item.qty || ''}
                      onChange={(e) => {
                        const updated = customMiscItems.map((c, i) => i === idx ? { ...c, qty: e.target.value } : c);
                        setCustomMiscItems(updated);
                      }}
                      style={{width: '60px', textAlign: 'center'}}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={item.price || ''}
                      onChange={(e) => {
                        const updated = customMiscItems.map((c, i) => i === idx ? { ...c, price: e.target.value } : c);
                        setCustomMiscItems(updated);
                      }}
                      style={{width: '80px', textAlign: 'center'}}
                    />
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

        {/* Job Minimums */}
        <div className="job-minimums" style={{marginTop: '30px'}}>
          <h3 style={{color: '#FF0000', fontSize: '16px'}}>JOB MINIMUMS</h3>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <tbody>
              {stoneJobMinimums.map((minimum, idx) => (
                <tr key={idx}>
                  <td style={{padding: '8px', border: '1px solid black'}}>{minimum.zone}</td>
                  <td style={{padding: '8px', border: '1px solid black', textAlign: 'right', fontWeight: 'bold'}}>
                    ${minimum.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Calculation for Stone Veneers */}
      <div style={{display: 'flex', gap: '30px', marginTop: '40px', alignItems: 'flex-start'}}>
        <div className="project-calculation-section" style={{flex: '0 0 500px', marginTop: '0'}}>
          <table className="calculation-table">
            <thead>
              <tr>
                <th>Project Calculation</th>
                <th>Rep</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label-cell">Subtotal</td>
                <td className="input-cell">${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="label-cell">Delivery Fee</td>
                <td className="input-cell">${stoneItemPrices.deliveryFee}</td>
              </tr>
              <tr>
                <td className="label-cell">1 Year Price</td>
                <td className="input-cell">${cascade.oneYearPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="label-cell">Deduct 10% to get to 30 Day Price</td>
                <td className="input-cell">(${cascade.oneYearDeduction.toFixed(2)})</td>
              </tr>
              <tr>
                <td className="label-cell">30 Day Price</td>
                <td className="input-cell">${cascade.thirtyDayPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="label-cell">Deduct 10% to get to Day of Price</td>
                <td className="input-cell">(${cascade.thirtyDayDeduction.toFixed(2)})</td>
              </tr>
              <tr>
                <td className="label-cell">Day of Price</td>
                <td className="input-cell">${cascade.dayOfPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="label-cell">Deduct 3% for 33% Deposit</td>
                <td className="input-cell">(${cascade.dayOfDeduction.toFixed(2)})</td>
              </tr>
              <tr>
                <td className="label-cell">Final Sell Price</td>
                <td className="input-cell">${cascade.finalSellPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Contract Specifications */}
        <div className="contract-specs-section" style={{flex: '1', minWidth: '500px'}}>
          <div className="specs-header" style={{backgroundColor: '#FFFF00', color: '#000000', padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>
            CONTRACT SPECIFICATIONS BELOW
          </div>

          <div className="specs-content">
            <ul style={{listStyleType: 'circle'}}>
              <li>Work area and Location</li>
              <li>Type of removal <span className="red-text">(if any)</span></li>
              <li>Layers of removal <span className="red-text">(if any)</span></li>
              <li>Any other special requirements</li>
            </ul>
            <ul>
              <li>Install two layers of jumbo tex felt paper <span className="red-text">(only if over plywood)</span></li>
              <li>Install water lathe</li>
              <li>Install metal j-channel where required</li>
              <li>Install cement scratch coat</li>
              <li>Install stone flats</li>
              <li>Install stone corners <span className="red-text">(only when required)</span></li>
              <li>Install stone sill <span className="red-text">(only when required)</span></li>
              <li>Stone to be installed as "1/2" joint</li>
              <li>Caulk where required</li>
              <li>Install mortar into joints as required</li>
              <li>Dispose of debris</li>
            </ul>
            <div style={{marginTop: '15px'}}>
              <strong style={{color: '#FF0000', fontStyle: 'italic'}}>Additional Requirements</strong>
              <ul>
                <li>Stone Selection</li>
                <li>Sill Color</li>
                <li>Joint Color</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoneVeneers;
