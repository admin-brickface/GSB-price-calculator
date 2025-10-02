import React, { useState, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import html2canvas from 'html2canvas';
import './App.css';

// Register cell types
import { registerAllModules } from 'handsontable/registry';
registerAllModules();

// Gutters and Leaders Component (Combined)
function GuttersAndLeaders() {
  // Gutters Data with dropdown types
  const [guttersData, setGuttersData] = useState([
    ['FRONT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['RIGHT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['BACK', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['LEFT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  // Leaders Data
  const [leadersData, setLeadersData] = useState([
    ['FRONT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['RIGHT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['BACK', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['LEFT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  // Gutter Guards Data
  const [gutterGuardsData, setGutterGuardsData] = useState([
    ['FRONT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['RIGHT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['BACK', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['LEFT', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  // Price tables
  const gutterTypes = [
    { name: 'Gutter 5in white', price: 14.50 },
    { name: 'Gutter 5in all colors', price: 16.75 },
    { name: 'Gutter 6in white', price: 20 },
    { name: 'Gutter 6in all colors', price: 21 },
    { name: 'Extra Gauge (0.032 gauge)', price: 1.25 },
  ];

  const leaderTypes = [
    { name: 'Leaders 2x3 white', price: 13.50 },
    { name: 'Leaders 2x3 all colors', price: 14.50 },
    { name: 'Leader 2x3 white - PVC', price: 20 },
    { name: 'Leaders 3x4 white', price: 16.75 },
    { name: 'Leaders 3x4 all colors', price: 18 },
    { name: 'Leader 3in Round Corrugated - White', price: 52.25 },
    { name: 'Extra Gauge (0.032 gauge)', price: 1.25 },
  ];

  const gutterGuardTypes = [
    { name: 'Shur-flow 5in (white)', price: 16.75 },
    { name: 'Shur-flow 5in (black or aluminum)', price: 17.75 },
    { name: 'Shur-flow 6in (white)', price: 17.75 },
    { name: 'Shur-flow 6in (black or aluminum)', price: 20 },
    { name: 'Screen 5in', price: 11.25 },
    { name: 'Screen 6in', price: 13.50 },
    { name: 'Leafshelter 6in - White', price: 20 },
    { name: 'Leafshelter 6in - All Colors', price: 23.50 },
    { name: 'Strap Hangers per LF', price: 4.50 },
    { name: 'Miscellaneous - Fill in', price: 0, isManual: true },
  ];

  const guttersColumns = [
    { data: 0, type: 'text', readOnly: true, className: 'location-cell' },
    { 
      data: 1, 
      type: 'dropdown',
      source: gutterTypes.map(t => t.name),
      strict: false,
      allowEmpty: true
    },
    { data: 2, type: 'numeric' },
  ];

  const leadersColumns = [
    { data: 0, type: 'text', readOnly: true, className: 'location-cell' },
    { 
      data: 1, 
      type: 'dropdown',
      source: leaderTypes.map(t => t.name),
      strict: false,
      allowEmpty: true
    },
    { data: 2, type: 'numeric' },
  ];

  const gutterGuardsColumns = [
    { data: 0, type: 'text', readOnly: true, className: 'location-cell' },
    { 
      data: 1, 
      type: 'dropdown',
      source: gutterGuardTypes.map(t => t.name),
      strict: false,
      allowEmpty: true
    },
    { data: 2, type: 'numeric' },
  ];

  // Miscellaneous manual input state
  const [miscLF, setMiscLF] = useState(0);
  const [miscPrice, setMiscPrice] = useState(0);

  // Calculate totals by type
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
  const leaderTotals = calculateTotalsByType(leadersData, leaderTypes);
  const gutterGuardTotals = calculateTotalsByType(gutterGuardsData, gutterGuardTypes);

  // Calculate total prices
  const gutterTotalPrice = gutterTypes.reduce((sum, type) => {
    return sum + ((gutterTotals[type.name] || 0) * type.price);
  }, 0);

  const leaderTotalPrice = leaderTypes.reduce((sum, type) => {
    return sum + ((leaderTotals[type.name] || 0) * type.price);
  }, 0);

  const gutterGuardTotalPrice = gutterGuardTypes.reduce((sum, type) => {
    if (type.name === 'Miscellaneous - Fill in') {
      return sum + (miscLF * miscPrice);
    }
    return sum + ((gutterGuardTotals[type.name] || 0) * type.price);
  }, 0);

  // Project Calculation calculations
  const totalPrice = gutterTotalPrice + leaderTotalPrice + gutterGuardTotalPrice;
  const oneYearPrice = totalPrice * 0.90; // minus 10%
  const oneYearDeduction = totalPrice * 0.10; // the 10% deducted
  const thirtyDayPrice = oneYearPrice * 0.90; // minus 10% from 1 year price
  const thirtyDayDeduction = oneYearPrice * 0.10; // the 10% deducted
  const dayOfPrice = thirtyDayPrice * 0.97; // minus 3% from 30 day price
  const dayOfDeduction = thirtyDayPrice * 0.03; // the 3% deducted
  const finalSellPrice = dayOfPrice; // same as day of price

  return (
    <div className="gutters-and-leaders">
      <h2>Gutters & Leaders</h2>
      
      {/* Measurement Tables */}
      <div className="three-column-layout">
        <div className="table-section">
          <h3>GUTTERS</h3>
          <HotTable
            data={guttersData}
            columns={guttersColumns}
            colHeaders={['Location', 'Type', 'LF']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            afterChange={(changes) => {
              if (changes) {
                const newData = [...guttersData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                });
                setGuttersData(newData);
              }
            }}
          />
        </div>

        <div className="table-section">
          <h3>LEADERS</h3>
          <HotTable
            data={leadersData}
            columns={leadersColumns}
            colHeaders={['Location', 'Type', 'LF']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            afterChange={(changes) => {
              if (changes) {
                const newData = [...leadersData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                });
                setLeadersData(newData);
              }
            }}
          />
        </div>

        <div className="table-section">
          <h3>GUTTER GUARDS</h3>
          <HotTable
            data={gutterGuardsData}
            columns={gutterGuardsColumns}
            colHeaders={['Location', 'Type', 'LF']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            afterChange={(changes) => {
              if (changes) {
                const newData = [...gutterGuardsData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                });
                setGutterGuardsData(newData);
              }
            }}
          />
        </div>
      </div>

      {/* Price Tables */}
      <div className="price-tables-section">
        <h2 style={{marginTop: '40px', marginBottom: '20px'}}>Price Tables</h2>
        
        {/* Gutters Price Table */}
        <div className="price-table">
          <h3>Gutters (Standard) .27 Gauge</h3>
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
          <h3>Leaders (Standard) .19 Gauge</h3>
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
              {leaderTypes.map((type, idx) => (
                <tr key={idx}>
                  <td>{type.name}</td>
                  <td>{leaderTotals[type.name] || 0}</td>
                  <td>${type.price.toFixed(2)}</td>
                  <td className="total-price-cell">
                    ${((leaderTotals[type.name] || 0) * type.price).toFixed(2)}
                  </td>
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
                  <td>
                    {type.isManual ? (
                      <input 
                        type="number" 
                        value={miscLF} 
                        onChange={(e) => setMiscLF(parseFloat(e.target.value) || 0)}
                        style={{width: '60px', textAlign: 'center'}}
                      />
                    ) : (
                      gutterGuardTotals[type.name] || 0
                    )}
                  </td>
                  <td>
                    {type.isManual ? (
                      <span>
                        $<input 
                          type="number" 
                          value={miscPrice} 
                          onChange={(e) => setMiscPrice(parseFloat(e.target.value) || 0)}
                          style={{width: '50px', textAlign: 'center', marginLeft: '2px'}}
                        />
                      </span>
                    ) : (
                      "$" + type.price.toFixed(2)
                    )}
                  </td>
                  <td className="total-price-cell">
                    ${type.isManual 
                      ? (miscLF * miscPrice).toFixed(2)
                      : ((gutterGuardTotals[type.name] || 0) * type.price).toFixed(2)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Calculation */}
      <div className="project-calculation-section">
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
              <td className="label-cell">1 Year Price</td>
              <td className="input-cell">
                ${oneYearPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10% to get to 30 Day Price</td>
              <td className="input-cell">
                (${oneYearDeduction.toFixed(2)})
              </td>
            </tr>
            <tr>
              <td className="label-cell">30 Day Price</td>
              <td className="input-cell">
                ${thirtyDayPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10% to get to Day of Price</td>
              <td className="input-cell">
                (${thirtyDayDeduction.toFixed(2)})
              </td>
            </tr>
            <tr>
              <td className="label-cell">Day of Price</td>
              <td className="input-cell">
                ${dayOfPrice.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 3% for 33% Deposit</td>
              <td className="input-cell">
                (${dayOfDeduction.toFixed(2)})
              </td>
            </tr>
            <tr>
              <td className="label-cell">Final Sell Price</td>
              <td className="input-cell">
                ${finalSellPrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="red-notice" style={{marginTop: '10px'}}>
          50% deposit required for all gutter and leader projects
        </div>
      </div>

      {/* Contract Specifications */}
      <div className="contract-specs-section">
        <div className="specs-header">CONTRACT SPECIFICATIONS BELOW</div>
        
        <div className="specs-content">
          <ul>
            <li>Work area and Location</li>
            <li>Type of removal <span className="red-text">(if any)</span></li>
          </ul>
          <ul>
            <li>Install gutters and leaders on entire home</li>
            <li>5" gutters @ .27 gauge</li>
            <li>2x3 leaders @ .19 gauge</li>
            <li>Install metal gutter screens <span className="red-text">(if any)</span></li>
            <li>Color is White</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Stone Veneers Component
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
  const [demolition, setDemolition] = useState([
    { name: 'Remove vinyl or aluminum siding', perSquare: 0, price: 237 },
    { name: 'Remove wood siding (clapboard)', perSquare: 0, price: 267 },
    { name: 'Remove wood siding (wood shake)', perSquare: 0, price: 297 },
    { name: 'Remove EIFS up to 2" only', perSquare: 0, price: 400 },
  ]);

  const [debrisRemoval, setDebrisRemoval] = useState([
    { name: 'Debris removal under 4 squares (REQUIRED even if no demo)', quantity: 0, price: 830 },
    { name: '10 yard dumpster (removal from 4 to 10 squares)', quantity: 0, price: 1542 },
    { name: '20 yard dumpster (removal from 11 to 20 squares)', quantity: 0, price: 1868 },
  ]);

  const [miscellaneous, setMiscellaneous] = useState([
    { name: 'Wrap Corner 4" (Wood or Vinyl Siding)', unit: 'Per 8\' Corner', sflfq: 0, price: 297 },
    { name: 'Limestone Treads (up to 12" Deep)', unit: 'LF', sflfq: 0, price: 128 },
    { name: 'Limestone Treads (up to 14" Deep)', unit: 'LF', sflfq: 0, price: 144 },
    { name: 'Cement Pad (Up to 20sf) Demo/New', unit: 'Per Item', sflfq: 0, price: 890 },
    { name: 'Chimney Scaffolding Fee', unit: 'Full chimney on roof', sflfq: 0, price: 741 },
    { name: 'Stainless Steel Chimney Cover', unit: 'Per Item', sflfq: 0, price: 1605 },
    { name: '1/2" Plywood Replacement', unit: 'Per Item', sflfq: 0, price: 374 },
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
  const totalFlats = flatsSubtotal - deductOuts;

  const calculateCornersSubtotal = () => {
    return stoneCornersData.reduce((sum, row) => {
      const lf = parseFloat(row[1]) || 0;
      return sum + lf;
    }, 0);
  };

  const cornersSubtotal = calculateCornersSubtotal();
  const totalCorners = Math.ceil(cornersSubtotal);

  const calculateSillsSubtotal = () => {
    return stoneSillsData.reduce((sum, row) => {
      const lf = parseFloat(row[1]) || 0;
      return sum + lf;
    }, 0);
  };

  const sillsSubtotal = calculateSillsSubtotal();
  const totalSills = Math.ceil(sillsSubtotal);

  const stoneFlatsColumns = [
    { data: 0, type: 'text' },
    { data: 1, type: 'numeric' },
    { data: 2, type: 'numeric' },
    { data: 3, type: 'numeric', readOnly: true },
  ];

  const stoneCornersColumns = [
    { data: 0, type: 'text' },
    { data: 1, type: 'numeric' },
  ];

  const stoneSillsColumns = [
    { data: 0, type: 'text' },
    { data: 1, type: 'numeric' },
  ];

  const outsColumns = [
    { data: 0, type: 'text' },
    { data: 1, type: 'numeric' },
    { data: 2, type: 'numeric' },
    { data: 3, type: 'numeric', readOnly: true },
  ];

  return (
    <div className="stone-veneers">
      <h2>Stone Veneers</h2>
      
      {/* Measurement Tables */}
      <div className="three-column-layout">
        <div className="table-section">
          <h3>STONE FLATS</h3>
          <HotTable
            data={stoneFlatsData}
            columns={stoneFlatsColumns}
            colHeaders={['Location', 'Width', 'Height', 'Total SF']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            afterChange={(changes) => {
              if (changes) {
                const newData = [...stoneFlatsData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                  const width = parseFloat(newData[row][1]) || 0;
                  const height = parseFloat(newData[row][2]) || 0;
                  newData[row][3] = width * height;
                });
                setStoneFlatsData(newData);
              }
            }}
          />
          <div className="subtotal-row">Flats SF Subtotal: {flatsSubtotal.toFixed(2)}</div>
          <div className="deduct-row">
            Deduct Outs: ({totalOuts.toFixed(2)})
          </div>
          <div className="total-row">Total Flats: {totalFlats.toFixed(2)}</div>
        </div>

        <div className="table-section">
          <h3>STONE CORNERS</h3>
          <HotTable
            data={stoneCornersData}
            columns={stoneCornersColumns}
            colHeaders={['Location', 'LF']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            afterChange={(changes) => {
              if (changes) {
                const newData = [...stoneCornersData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                });
                setStoneCornersData(newData);
              }
            }}
          />
          <div className="subtotal-row">Subtotal: {cornersSubtotal.toFixed(2)}</div>
          <div className="note-row">IF ODD # ROUND UP TO NEAREST EVEN FOOT</div>
          <div className="total-row">Total Corners: {totalCorners}</div>
        </div>

        <div className="table-section">
          <h3>STONE SILLS</h3>
          <HotTable
            data={stoneSillsData}
            columns={stoneSillsColumns}
            colHeaders={['Location', 'LF']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            afterChange={(changes) => {
              if (changes) {
                const newData = [...stoneSillsData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                });
                setStoneSillsData(newData);
              }
            }}
          />
          <div className="subtotal-row">Subtotal: {sillsSubtotal.toFixed(2)}</div>
          <div className="note-row">IF ODD # ROUND UP TO NEAREST EVEN FOOT</div>
          <div className="total-row">Total Sills: {totalSills}</div>
        </div>
      </div>

      {/* Outs Table and Guidelines */}
      <div className="two-column-layout" style={{marginTop: '30px'}}>
        <div className="table-section">
          <h3>OUTS (TAKE 100% OUTS)</h3>
          <HotTable
            data={outsData}
            columns={outsColumns}
            colHeaders={['Location', 'Width', 'Height', 'Total']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            afterChange={(changes) => {
              if (changes) {
                const newData = [...outsData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                  const width = parseFloat(newData[row][1]) || 0;
                  const height = parseFloat(newData[row][2]) || 0;
                  newData[row][3] = width * height;
                });
                setOutsData(newData);
              }
            }}
          />
          <div className="total-row">Total Outs: ({totalOuts.toFixed(2)})</div>
        </div>

        <div className="guidelines-box">
          <h3>STONE VENEER GUIDELINES</h3>
          <ul>
            <li>Measurements must be tip to tip</li>
            <li>Brick returns at windows/doors, must include in SF & LF</li>
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
                        const newDemolition = [...demolition];
                        newDemolition[idx].perSquare = parseFloat(e.target.value) || 0;
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
                        const newDebris = [...debrisRemoval];
                        newDebris[idx].quantity = parseFloat(e.target.value) || 0;
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
                <td>$58</td>
                <td className="total-price-cell">${(totalFlats * 58).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Stone Corners</td>
                <td>LF: {totalCorners}</td>
                <td>$32</td>
                <td className="total-price-cell">${(totalCorners * 32).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Chiseled Stone Sills</td>
                <td>LF: {totalSills}</td>
                <td>$26</td>
                <td className="total-price-cell">${(totalSills * 26).toFixed(2)}</td>
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
                <th></th>
                <th>SF / LF / Q</th>
                <th>Price</th>
                <th>Sub-Total</th>
              </tr>
            </thead>
            <tbody>
              {miscellaneous.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>
                    {item.unit}:
                    <input 
                      type="number" 
                      value={item.sflfq}
                      onChange={(e) => {
                        const newMisc = [...miscellaneous];
                        newMisc[idx].sflfq = parseFloat(e.target.value) || 0;
                        setMiscellaneous(newMisc);
                      }}
                      style={{width: '50px', textAlign: 'center', marginLeft: '5px'}}
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="total-price-cell">
                    ${(item.sflfq * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Job Minimums */}
        <div className="job-minimums" style={{marginTop: '30px'}}>
          <h3 style={{color: '#FF0000', fontSize: '16px'}}>JOB MINIMUMS</h3>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <tbody>
              <tr>
                <td style={{padding: '8px', border: '1px solid black'}}>All counties excluding below</td>
                <td style={{padding: '8px', border: '1px solid black', textAlign: 'right', fontWeight: 'bold'}}>$7,500</td>
              </tr>
              <tr>
                <td style={{padding: '8px', border: '1px solid black'}}>Zone (1): Sussex, Warren, Hunterdon, Mercer</td>
                <td style={{padding: '8px', border: '1px solid black', textAlign: 'right', fontWeight: 'bold'}}>$8,500</td>
              </tr>
              <tr>
                <td style={{padding: '8px', border: '1px solid black'}}>Zone (2): Ocean, Burlington, Camden</td>
                <td style={{padding: '8px', border: '1px solid black', textAlign: 'right', fontWeight: 'bold'}}>$9,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Calculation for Stone Veneers */}
      <div className="project-calculation-section">
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
              <td className="input-cell">
                ${(() => {
                  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
                  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const stoneItemsTotal = (totalFlats * 58) + (totalCorners * 32) + (totalSills * 26);
                  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
                  return (demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal).toFixed(2);
                })()}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Delivery Fee</td>
              <td className="input-cell">$222</td>
            </tr>
            <tr>
              <td className="label-cell">1 Year Price</td>
              <td className="input-cell">
                ${(() => {
                  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
                  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const stoneItemsTotal = (totalFlats * 58) + (totalCorners * 32) + (totalSills * 26);
                  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
                  const subtotal = demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal;
                  const withDelivery = subtotal + 222;
                  return (withDelivery * 0.90).toFixed(2);
                })()}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10% to get to 30 Day Price</td>
              <td className="input-cell">
                (${(() => {
                  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
                  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const stoneItemsTotal = (totalFlats * 58) + (totalCorners * 32) + (totalSills * 26);
                  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
                  const subtotal = demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal;
                  const withDelivery = subtotal + 222;
                  return (withDelivery * 0.10).toFixed(2);
                })()})
              </td>
            </tr>
            <tr>
              <td className="label-cell">30 Day Price</td>
              <td className="input-cell">
                ${(() => {
                  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
                  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const stoneItemsTotal = (totalFlats * 58) + (totalCorners * 32) + (totalSills * 26);
                  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
                  const subtotal = demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal;
                  const withDelivery = subtotal + 222;
                  const oneYearPrice = withDelivery * 0.90;
                  return (oneYearPrice * 0.90).toFixed(2);
                })()}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10% to get to Day of Price</td>
              <td className="input-cell">
                (${(() => {
                  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
                  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const stoneItemsTotal = (totalFlats * 58) + (totalCorners * 32) + (totalSills * 26);
                  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
                  const subtotal = demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal;
                  const withDelivery = subtotal + 222;
                  const oneYearPrice = withDelivery * 0.90;
                  return (oneYearPrice * 0.10).toFixed(2);
                })()})
              </td>
            </tr>
            <tr>
              <td className="label-cell">Day of Price</td>
              <td className="input-cell">
                ${(() => {
                  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
                  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const stoneItemsTotal = (totalFlats * 58) + (totalCorners * 32) + (totalSills * 26);
                  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
                  const subtotal = demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal;
                  const withDelivery = subtotal + 222;
                  const oneYearPrice = withDelivery * 0.90;
                  const thirtyDayPrice = oneYearPrice * 0.90;
                  return (thirtyDayPrice * 0.97).toFixed(2);
                })()}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 3% for 33% Deposit</td>
              <td className="input-cell">
                (${(() => {
                  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
                  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const stoneItemsTotal = (totalFlats * 58) + (totalCorners * 32) + (totalSills * 26);
                  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
                  const subtotal = demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal;
                  const withDelivery = subtotal + 222;
                  const oneYearPrice = withDelivery * 0.90;
                  const thirtyDayPrice = oneYearPrice * 0.90;
                  return (thirtyDayPrice * 0.03).toFixed(2);
                })()})
              </td>
            </tr>
            <tr>
              <td className="label-cell">Final Sell Price</td>
              <td className="input-cell">
                ${(() => {
                  const demolitionTotal = demolition.reduce((sum, item) => sum + (item.perSquare * item.price), 0);
                  const debrisTotal = debrisRemoval.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const stoneItemsTotal = (totalFlats * 58) + (totalCorners * 32) + (totalSills * 26);
                  const miscTotal = miscellaneous.reduce((sum, item) => sum + (item.sflfq * item.price), 0);
                  const subtotal = demolitionTotal + debrisTotal + stoneItemsTotal + miscTotal;
                  const withDelivery = subtotal + 222;
                  const oneYearPrice = withDelivery * 0.90;
                  const thirtyDayPrice = oneYearPrice * 0.90;
                  const dayOfPrice = thirtyDayPrice * 0.97;
                  return dayOfPrice.toFixed(2);
                })()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Contract Specifications */}
      <div className="contract-specs-section">
        <div className="specs-header" style={{backgroundColor: '#FFFF00', color: '#000000'}}>CONTRACT SPECIFICATIONS BELOW</div>
        
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
  );
}

// Stucco Painting Component  
function StuccoPainting() {
  // Walls Data - with pre-filled location labels
  const [wallsData, setWallsData] = useState([
    ['Front', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['Gables', '', '', '', ''],
    ['Rakes', '', '', '', ''],
    ['Single Dormers', '', '', '', ''],
    ['Front Right', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['Gables', '', '', '', ''],
    ['Rakes', '', '', '', ''],
    ['Single Dormers', '', '', '', ''],
    ['Rear', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['Gables', '', '', '', ''],
    ['Rakes', '', '', '', ''],
    ['Single Dormers', '', '', '', ''],
    ['Front Left', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['Gables', '', '', '', ''],
    ['Rakes', '', '', '', ''],
    ['Single Dormers', '', '', '', ''],
  ]);

  const [windowTrimData, setWindowTrimData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [doorTrimData, setDoorTrimData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [soffitData, setSoffitData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [fasciaData, setFasciaData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [quoinsData, setQuoinsData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [otherTrimData, setOtherTrimData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [outsValues, setOutsValues] = useState({
    front: 0,
    frontRight: 0,
    rear: 0,
    frontLeft: 0,
  });

  const [caulkingLF, setCaulkingLF] = useState([0, 0, 0, 0]);

  const [miscellaneousItems, setMiscellaneousItems] = useState([
    { name: 'EIFS Repair', unit: 'Per SF', qty: 0, price: 60 },
    { name: 'BCMA (Fiberglass, Basecoat, Acrylic Stucco)', unit: 'Per SF', qty: 0, price: 17.59 },
    { name: 'Remove and Re-Install Existing Shutters', unit: 'Per Pair', qty: 0, price: 145 },
    { name: 'Remove, Paint and Re-Install Shutters (per pair)', unit: 'Per Pair', qty: 0, price: 290 },
    { name: 'Stainless Steel Chimney Cover', unit: 'Per Item', qty: 0, price: 1509 },
    { name: 'Plywood (demo, debris, install 1 sheet of plywood) 32 sf', unit: 'Per Item', qty: 0, price: 439 },
    { name: 'Remove and Re-Install Existing Gutters', unit: 'Per LF', qty: 0, price: 6 },
    { name: 'Additional Rigging (For Caulking Only Projects)', unit: 'Per Side', qty: 0, price: 435 },
    { name: 'Clear Sealer, Ladders, Powerwash', unit: 'Per SF', qty: 0, price: 7 },
    { name: 'Additional Heavy Duty Powerwash', unit: 'Per SF', qty: 0, price: 2 },
    { name: 'Additional stucco crack repair above 50 lf (1" or less)', unit: 'Per LF', qty: 0, price: 7 },
    { name: 'Spot Point Brick     (* See rules page)', unit: 'Per SF', qty: 0, price: 29 },
    { name: 'Full Cut and Re-Point (Under 500sf)', unit: 'Per SF', qty: 0, price: 29 },
    { name: 'Full Cut and Re-Point (Over 500sf)', unit: 'Per SF', qty: 0, price: 24 },
    { name: 'Full Coping over Parepit Wall up to 12" (*See Rules Page)', unit: 'Per LF', qty: 0, price: 85 },
    { name: 'Paint Samples (Includes 1 Color Sample)', unit: 'Per Item', qty: 0, price: 108 },
  ]);

  const [repairChecked, setRepairChecked] = useState(false);
  const [addRiggingChecked, setAddRiggingChecked] = useState(false);

  // Calculate totals
  const calculateWallsSubtotal = () => {
    return wallsData.reduce((sum, row, idx) => {
      const location = row[0];
      const width = parseFloat(row[1]) || 0;
      const height = parseFloat(row[2]) || 0;
      
      if (location === 'Gables' || location === 'Rakes') {
        return sum + (width * height * 0.5);
      } else if (location === 'Single Dormers') {
        // For Single Dormers, Width column is used as quantity
        return sum + (width * 75);
      } else {
        return sum + (width * height);
      }
    }, 0);
  };

  const subtotalSquares = calculateWallsSubtotal();
  const totalOuts = outsValues.front + outsValues.frontRight + outsValues.rear + outsValues.frontLeft;
  const squaresSubtotal = subtotalSquares - totalOuts;
  const roundedSquares = Math.ceil(squaresSubtotal);

  const totalWindowTrim = windowTrimData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalDoorTrim = doorTrimData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalSoffit = soffitData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalFascia = fasciaData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalQuoins = quoinsData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);

  // Calculate price totals
  const getWallsPrice = () => {
    const priceRanges = [
      { range: [200, 499], priceAbove: 14.27, priceBelow: 9.69 },
      { range: [500, 999], priceAbove: 13.00, priceBelow: 9.11 },
      { range: [1000, 1699], priceAbove: 12.45, priceBelow: 8.73 },
      { range: [1700, 2999], priceAbove: 11.78, priceBelow: 8.24 },
      { range: [3000, 4499], priceAbove: 11.38, priceBelow: 7.95 },
      { range: [4500, Infinity], priceAbove: 11.09, priceBelow: 7.75 },
    ];
    
    for (let i = 0; i < priceRanges.length; i++) {
      if (roundedSquares >= priceRanges[i].range[0] && roundedSquares <= priceRanges[i].range[1]) {
        // For now, using "Above 8" price - you can add logic to choose between above/below
        return roundedSquares * priceRanges[i].priceAbove;
      }
    }
    return 0;
  };

  const wallsTotal = getWallsPrice();
  const trimTotal = (totalWindowTrim + totalDoorTrim) * 7.25 + totalSoffit * 11.67 + totalFascia * 8.15 + totalQuoins * 11.67;
  const caulkingTotal = caulkingLF.reduce((sum, lf, idx) => {
    const prices = [8.36, 11.17, 12.54, 15.32];
    return sum + (lf * prices[idx]);
  }, 0);
  const miscTotal = miscellaneousItems.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const grandTotal = wallsTotal + trimTotal + caulkingTotal + miscTotal;
  const repairCost = repairChecked ? 2100 : 0;
  const riggingCost = addRiggingChecked ? 1400 : 0;
  const totalWithExtras = grandTotal + repairCost + riggingCost;
  
  const oneYearPrice = totalWithExtras * 0.90;
  const oneYearDeduction = totalWithExtras * 0.10;
  const thirtyDayPrice = oneYearPrice * 0.90;
  const thirtyDayDeduction = oneYearPrice * 0.10;
  const dayOfPrice = thirtyDayPrice * 0.97;
  const dayOfDeduction = thirtyDayPrice * 0.03;
  const finalSellPrice = dayOfPrice;

  const wallsColumns = [
    { 
      data: 0, 
      type: 'text', 
      className: 'location-cell',
      readOnly: false  // Allow editing for all location cells
    },
    { data: 1, type: 'numeric' },
    { data: 2, type: 'numeric' },
    { data: 3, type: 'numeric' },
    { data: 4, type: 'numeric', readOnly: true },
  ];

  const trimColumns = [
    { data: 0, type: 'text' },
    { data: 1, type: 'numeric' },
  ];

  return (
    <div className="stucco-painting">
      <h2>Stucco Painting</h2>
      
      <div className="stucco-layout">
        {/* Walls Table - Left Side */}
        <div className="walls-table-section">
          <h3 style={{backgroundColor: '#000000', color: '#FFFFFF', padding: '8px', textAlign: 'center', marginBottom: '0'}}>Walls</h3>
          <HotTable
            data={wallsData}
            columns={wallsColumns}
            colHeaders={['Location', 'Width', 'Height', '', 'Total SF']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            cells={(row, col) => {
              const cellProperties = {};
              const location = wallsData[row][0];
              
              // For Single Dormers rows, black out Height column (column 2)
              if (location === 'Single Dormers' && col === 2) {
                cellProperties.readOnly = true;
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                  td.innerHTML = '';
                  td.style.backgroundColor = '#000000';
                  return td;
                };
              }
              
              // For Single Dormers rows, show formula text in column 3
              if (location === 'Single Dormers' && col === 3) {
                cellProperties.readOnly = true;
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                  td.innerHTML = 'x 75 sf =';
                  td.style.textAlign = 'center';
                  td.style.backgroundColor = '#F0F0F0';
                  return td;
                };
              }
              
              // For Gables/Rakes, show formula in column 3
              if ((location === 'Gables' || location === 'Rakes') && col === 3) {
                cellProperties.readOnly = true;
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                  td.innerHTML = 'x .5 =';
                  td.style.textAlign = 'center';
                  td.style.backgroundColor = '#F0F0F0';
                  return td;
                };
              }

              return cellProperties;
            }}
            afterChange={(changes) => {
              if (changes) {
                const newData = [...wallsData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                  
                  const location = newData[row][0];
                  const width = parseFloat(newData[row][1]) || 0;
                  const height = parseFloat(newData[row][2]) || 0;
                  const quantity = parseFloat(newData[row][1]) || 0; // For Single Dormers, use Width column as quantity
                  
                  if (location === 'Gables' || location === 'Rakes') {
                    newData[row][4] = width * height * 0.5;
                  } else if (location === 'Single Dormers') {
                    newData[row][4] = quantity * 75;
                  } else {
                    newData[row][4] = width * height;
                  }
                });
                setWallsData(newData);
              }
            }}
          />
          <div className="subtotal-row">Subtotal of Squares: {subtotalSquares.toFixed(2)}</div>
          <div className="outs-inputs">
            <div>Front (Outs): (<input type="number" value={outsValues.front} onChange={(e) => setOutsValues({...outsValues, front: parseFloat(e.target.value) || 0})} style={{width: '60px'}} />)</div>
            <div>Front Right (Outs): (<input type="number" value={outsValues.frontRight} onChange={(e) => setOutsValues({...outsValues, frontRight: parseFloat(e.target.value) || 0})} style={{width: '60px'}} />)</div>
            <div>Rear (Outs): (<input type="number" value={outsValues.rear} onChange={(e) => setOutsValues({...outsValues, rear: parseFloat(e.target.value) || 0})} style={{width: '60px'}} />)</div>
            <div>Front Left (Outs): (<input type="number" value={outsValues.frontLeft} onChange={(e) => setOutsValues({...outsValues, frontLeft: parseFloat(e.target.value) || 0})} style={{width: '60px'}} />)</div>
          </div>
          <div className="total-row">Squares (Subtotal): {squaresSubtotal.toFixed(2)}</div>
          <div className="note-row">Round up to Nearest Full Square: {roundedSquares}</div>
        </div>

        {/* Right Side Tables */}
        <div className="trim-tables-section">
          <div className="small-table">
            <h3>Window Trim (up to 6")</h3>
            <HotTable
              data={windowTrimData}
              columns={trimColumns}
              colHeaders={['Location', 'LF']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...windowTrimData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setWindowTrimData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalWindowTrim.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Door Trim (up to 6")</h3>
            <HotTable
              data={doorTrimData}
              columns={trimColumns}
              colHeaders={['Location', 'LF']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...doorTrimData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setDoorTrimData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalDoorTrim.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Soffit (up to 12")</h3>
            <HotTable
              data={soffitData}
              columns={trimColumns}
              colHeaders={['Location', 'LF']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...soffitData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setSoffitData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalSoffit.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Fascia (up to 8")</h3>
            <HotTable
              data={fasciaData}
              columns={trimColumns}
              colHeaders={['Location', 'LF']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...fasciaData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setFasciaData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalFascia.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Quoins (per 1 side only)</h3>
            <HotTable
              data={quoinsData}
              columns={trimColumns}
              colHeaders={['Location', 'Quantity']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...quoinsData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setQuoinsData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalQuoins.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Other Trim If Any</h3>
            <HotTable
              data={otherTrimData}
              columns={trimColumns}
              colHeaders={['Location', 'Quantity']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...otherTrimData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setOtherTrimData(newData);
                }
              }}
            />
            <div className="total-row">Total</div>
          </div>
        </div>
      </div>
{/* Rules and Guidelines */}
      <div className="rules-guidelines-section" style={{marginTop: '40px', marginBottom: '40px'}}>
        <div style={{backgroundColor: '#000000', color: '#FFFFFF', padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>
          RULES AND GUIDELINES
        </div>
        <div style={{border: '2px solid #000000', padding: '20px', backgroundColor: '#FEFEFE'}}>
          <p style={{marginBottom: '15px', fontWeight: '600'}}>
            Pricing on this sheet is for standard 2 1/2 story residential homes only - any structure higher than a 2 1/2 story residential home, this price sheet cannot be used and should be called into the office for review
          </p>
          
          <div style={{marginBottom: '15px'}}>
            <strong>Outs</strong>
            <p>100% Outs can be taken</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Gables</strong>
            <p>Single window dormers should be counted as 75 sf of wall space as written. If double window dormer, multiply using x 1, if triple window then multiply by 1.25. Must still charge separately for window trim, fascia trim or soffit.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Stucco Crack Repair</strong>
            <p>Pricing above is ONLY for minor crack repair and filling cracks slightly less than 1" wide. If a section of stucco needs to be removed and replaced, you must use the pricing from the Brickface sheet for Brickface, Cement Stucco and Hardcoat and add make sure to calculate demolition, debris removal and scaffolding (if required).</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Loxon XP (For Trim Only)</strong>
            <p>Price includes powerwashing and painting of trim only; does not include repairs of trim. If repair work is needed additional pricing needs to be applied.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Quions</strong>
            <p>Painting price includes one side of a quoin only. If there are two sides to a quion then you must multiply x2.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Caulking</strong>
            <p>Caulk work is not included with any project. If caulking required on a full Loxon Project, then charge accordingly. When not in conjunction with a full Loxon project - additional rigging must be charged. Each side of the house should be charged separately and for example if doing 4 sides of a house, then multiply x4.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Additonal Rigging</strong>
            <p>An example of when additional rigging would be needed is when it is a caulking only project or spot pointing. The fee above would be charged per side of the house. If we are working on 3 sides of a house, then multiply x3.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Spot Pointing Bricks</strong>
            <p>Minimum for stand alone spot pointing jobs is $4200. Includes powerwash, scrape out loose mortar and re-fill where missing.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Full Cut and Re-Point Bricks</strong>
            <p>Includes scrape out joints 1/2" deep on a full wall. Powerwash area where mortar removed and then apply new mortar.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Full Coping over Parepit Wall 12"</strong>
            <p>Includes stainless steel coping for straight runs only. Does not include steppped coping.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Paint Samples</strong>
            <p>Sherman Williams charges for paint samples; if customer wants us to provide them, then charge the fee on the sheet for each sample needed. You do not have to charge the fee if the customer chooses to do it on their own. If we are billed for the paint samples and the customer does not pay for them, it will be deducted from commission</p>
          </div>
        </div>
      </div>
      {/* Price Tables */}
      <div className="price-tables-section" style={{marginTop: '40px'}}>
        {/* LOXON XP Above 8" - Walls Only */}
        <div className="price-table">
          <h3>LOXON XP (Above 8") - WALLS ONLY</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>SF RANGE</th>
                <th>SF</th>
                <th>PRICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: '200 - 499', price: 14.27, sf: roundedSquares >= 200 && roundedSquares <= 499 ? roundedSquares : 0 },
                { range: '500 - 999', price: 13.00, sf: roundedSquares >= 500 && roundedSquares <= 999 ? roundedSquares : 0 },
                { range: '1000 - 1699', price: 12.45, sf: roundedSquares >= 1000 && roundedSquares <= 1699 ? roundedSquares : 0 },
                { range: '1700 - 2999', price: 11.78, sf: roundedSquares >= 1700 && roundedSquares <= 2999 ? roundedSquares : 0 },
                { range: '3000 - 4499', price: 11.38, sf: roundedSquares >= 3000 && roundedSquares <= 4499 ? roundedSquares : 0 },
                { range: 'Above 4500', price: 11.09, sf: roundedSquares >= 4500 ? roundedSquares : 0 },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td style={{fontSize: '10px'}}>
                    {idx === 0 && 'Includes ladders and access'}
                    {idx === 1 && 'Includes powerwash of all work areas'}
                    {idx === 2 && 'Crack repair up to 50 linear ft (1" or less)'}
                    {idx === 3 && 'Apply Two Coats of Loxon XP'}
                    {idx === 4 && 'Loxon will be rolled or sprayed at our discretion'}
                    {idx === 5 && 'Wall texture will remain the same'}
                  </td>
                  <td>{row.range}</td>
                  <td>{row.sf}</td>
                  <td>${row.price.toFixed(2)}</td>
                  <td className="total-price-cell">${(row.sf * row.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LOXON XP Below 8" - Walls Only */}
        <div className="price-table">
          <h3>LOXON XP (Below 8") - WALLS ONLY</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>SF RANGE</th>
                <th>SF</th>
                <th>PRICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: '200 - 499', price: 9.69, sf: roundedSquares >= 200 && roundedSquares <= 499 ? roundedSquares : 0 },
                { range: '500 - 999', price: 9.11, sf: roundedSquares >= 500 && roundedSquares <= 999 ? roundedSquares : 0 },
                { range: '1000 - 1699', price: 8.73, sf: roundedSquares >= 1000 && roundedSquares <= 1699 ? roundedSquares : 0 },
                { range: '1700 - 2999', price: 8.24, sf: roundedSquares >= 1700 && roundedSquares <= 2999 ? roundedSquares : 0 },
                { range: '3000 - 4499', price: 7.95, sf: roundedSquares >= 3000 && roundedSquares <= 4499 ? roundedSquares : 0 },
                { range: 'Above 4500', price: 7.75, sf: roundedSquares >= 4500 ? roundedSquares : 0 },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td style={{fontSize: '10px'}}>
                    {idx === 0 && 'Does not include ladders, all ground work'}
                    {idx === 1 && 'Includes powerwash of all work areas'}
                    {idx === 2 && 'Crack repair up to 50 linear ft (1" or less)'}
                    {idx === 3 && 'Apply Two Coats of Loxon XP'}
                    {idx === 4 && 'Loxon will be rolled or sprayed at our discretion'}
                    {idx === 5 && 'Wall texture will remain the same'}
                  </td>
                  <td>{row.range}</td>
                  <td>{row.sf}</td>
                  <td>${row.price.toFixed(2)}</td>
                  <td className="total-price-cell">${(row.sf * row.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LOXON XP Trim Only */}
        <div className="price-table">
          <h3>LOXON XP (TRIM ONLY)</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>LF</th>
                <th>PRICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Two coats of Loxon XP over stucco window/door trim (up to 6")</td>
                <td>{(totalWindowTrim + totalDoorTrim).toFixed(2)}</td>
                <td>$7.25</td>
                <td className="total-price-cell">${((totalWindowTrim + totalDoorTrim) * 7.25).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Two coats of Loxon XP over stucco soffit (up to 12")</td>
                <td>{totalSoffit.toFixed(2)}</td>
                <td>$11.67</td>
                <td className="total-price-cell">${(totalSoffit * 11.67).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Two coats of Loxon XP over stucco fascia (up to 8")</td>
                <td>{totalFascia.toFixed(2)}</td>
                <td>$8.15</td>
                <td className="total-price-cell">${(totalFascia * 8.15).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Apply two coats of Loxon XP over single side quoin</td>
                <td>{totalQuoins.toFixed(2)}</td>
                <td>$11.67</td>
                <td className="total-price-cell">${(totalQuoins * 11.67).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Caulking */}
        <div className="price-table">
          <h3>CAULKING (IN CONJUNCTION WITH LOXON PROJECT ONLY)</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>LF</th>
                <th>PRICE</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Caulk only (no raking) - up to 3/4"', price: 8.36 },
                { name: 'Caulk and install backer rod (no raking) - up to 3/4"', price: 11.17 },
                { name: 'Rake out and caulk only - up to 3/4"', price: 12.54 },
                { name: 'Rake out and install backer rod - up to 3/4"', price: 15.32 },
              ].map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>
                    <input 
                      type="number" 
                      value={caulkingLF[idx]}
                      onChange={(e) => {
                        const newCaulking = [...caulkingLF];
                        newCaulking[idx] = parseFloat(e.target.value) || 0;
                        setCaulkingLF(newCaulking);
                      }}
                      style={{width: '60px', textAlign: 'center'}}
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="total-price-cell">${(caulkingLF[idx] * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Miscellaneous Items */}
        <div className="price-table">
          <h3>MISCELLANEOUS ITEMS</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th>PRICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {miscellaneousItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>
                    <input 
                      type="number" 
                      value={item.qty}
                      onChange={(e) => {
                        const newItems = [...miscellaneousItems];
                        newItems[idx].qty = parseFloat(e.target.value) || 0;
                        setMiscellaneousItems(newItems);
                      }}
                      style={{width: '60px', textAlign: 'center'}}
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="total-price-cell">${(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Minimums */}
        <div className="price-table">
          <h3 style={{backgroundColor: '#000000', color: '#FFFF00'}}>MINIMUMS (FOR WORK ON STANDARD 2 1/2 STORY HOMES LESS THAN 26")</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LOXON</td>
                <td>$4,200</td>
              </tr>
              <tr>
                <td>CLEAR SEALER</td>
                <td>$3,500</td>
              </tr>
              <tr>
                <td>WOODPECKER HOLES (INCLUDES UP TO 6 HOLES) <span style={{color: '#FF0000'}}>ADD $500 PER HOLE</span></td>
                <td>$3,500</td>
              </tr>
              <tr>
                <td>BCMA</td>
                <td>$4,200</td>
              </tr>
              <tr>
                <td>SPOT POINTING</td>
                <td>$4,900</td>
              </tr>
              <tr>
                <td>FULL POINTING</td>
                <td>$5,600</td>
              </tr>
              <tr>
                <td>CAULKING</td>
                <td>$5,600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Calculation */}
      <div className="project-calculation-section" style={{marginTop: '30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
          <div></div>
          <div style={{display: 'flex', gap: '30px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input 
                type="checkbox" 
                checked={repairChecked}
                onChange={(e) => setRepairChecked(e.target.checked)}
              />
              <span>Repair - $2,100</span>
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input 
                type="checkbox" 
                checked={addRiggingChecked}
                onChange={(e) => setAddRiggingChecked(e.target.checked)}
              />
              <span>Add rigging - $1,400</span>
            </label>
          </div>
        </div>

        <table className="calculation-table">
          <thead>
            <tr>
              <th>PROJECT CALCULATION</th>
              <th>REP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="label-cell">1 Year Price</td>
              <td className="input-cell">${oneYearPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10%</td>
              <td className="input-cell">(${oneYearDeduction.toFixed(2)})</td>
            </tr>
            <tr>
              <td className="label-cell">30 Day Price</td>
              <td className="input-cell">${thirtyDayPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10%</td>
              <td className="input-cell">(${thirtyDayDeduction.toFixed(2)})</td>
            </tr>
            <tr>
              <td className="label-cell">Day of Price</td>
              <td className="input-cell">${dayOfPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 3% for 33% Deposit</td>
              <td className="input-cell">(${dayOfDeduction.toFixed(2)})</td>
            </tr>
            <tr>
              <td className="label-cell">Final Sell Price</td>
              <td className="input-cell">${finalSellPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// House Painting Component
function HousePainting() {
  // Walls Data - same structure as Stucco Painting
  const [wallsData, setWallsData] = useState([
    ['Front', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['Gables', '', '', '', ''],
    ['Rakes', '', '', '', ''],
    ['Single Dormers', '', '', '', ''],
    ['Front Right', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['Gables', '', '', '', ''],
    ['Rakes', '', '', '', ''],
    ['Single Dormers', '', '', '', ''],
    ['Rear', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['Gables', '', '', '', ''],
    ['Rakes', '', '', '', ''],
    ['Single Dormers', '', '', '', ''],
    ['Front Left', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['Gables', '', '', '', ''],
    ['Rakes', '', '', '', ''],
    ['Single Dormers', '', '', '', ''],
  ]);

  const [windowTrimData, setWindowTrimData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [doorTrimData, setDoorTrimData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [soffitData, setSoffitData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [fasciaData, setFasciaData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [entryDoorsData, setEntryDoorsData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [garageDoorsData, setGarageDoorsData] = useState([
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ]);

  const [outsValues, setOutsValues] = useState({
    front: 0,
    frontRight: 0,
    rear: 0,
    frontLeft: 0,
  });

  // Painting walls only - with checkboxes
  const [paintingWalls, setPaintingWalls] = useState([
    { name: 'Vinyl and Aluminum ---- (Use vinyl safe colors for vinyl only)', sf: 0, price: 8.06, checked: false },
    { name: 'Wood Clapboard ---- (20% sand and spot prime)', sf: 0, price: 9.28, checked: false },
    { name: 'Wood Clapboard ---- (Full sanding only)', sf: 0, price: 11.5, checked: false },
    { name: 'Wood Shake ---- (20% sand and spot prime)', sf: 0, price: 10.02, checked: false },
    { name: 'Wood Shake ---- (Full sanding only)', sf: 0, price: 12.19, checked: false },
  ]);

  // Painting trim only
  const [shuttersRemove, setShuttersRemove] = useState(0);
  const [shuttersPaint, setShuttersPaint] = useState(0);

  // Miscellaneous items
  const [miscellaneousItems, setMiscellaneousItems] = useState([
    { name: 'Remove / replace (1) sheet of plywood ---- (up to 32sf)', unit: '', qty: 0, price: 316.94 },
    { name: 'Remove / replace vinyl siding ---- (up to 4.5in exposure)', unit: 'Per 12ft Piece', qty: 0, price: 320.12 },
    { name: 'Remove / replace aluminum siding ---- (up to 8in exposure)', unit: 'Per 12ft Piece', qty: 0, price: 320.12 },
    { name: 'Remove / replace wood trim ---- (5/4in x 3ft x 16ft)', unit: 'Per 16ft Piece', qty: 0, price: 151.58 },
    { name: 'Remove / replace wood clapboard ---- (1/2in x 8in x 16ft)', unit: 'Per 16ft Piece', qty: 0, price: 338.14 },
    { name: 'Remove / replace wood shake ---- (up to 12in Exposure)', unit: 'Per 1/2 Square', qty: 0, price: 647.66 },
    { name: 'Remove / re-install existing gutters', unit: 'Per LF', qty: 0, price: 4.24 },
    { name: 'Additional powerwash', unit: 'Per SF', qty: 0, price: 1.59 },
    { name: 'Caulk only (no raking) ---- (up to 1/2in)', unit: 'Per LF', qty: 0, price: 8.48 },
    { name: 'Rake out and caulk only ---- (up to 1/2in)', unit: 'Per LF', qty: 0, price: 12.72 },
    { name: 'Paint samples ---- (Includes 1 color sample)', unit: 'Per Item', qty: 0, price: 82.68 },
  ]);

  // Calculate totals
  const calculateWallsSubtotal = () => {
    return wallsData.reduce((sum, row) => {
      const location = row[0];
      const width = parseFloat(row[1]) || 0;
      const height = parseFloat(row[2]) || 0;
      
      if (location === 'Gables' || location === 'Rakes') {
        return sum + (width * height * 0.5);
      } else if (location === 'Single Dormers') {
        return sum + (width * 75);
      } else {
        return sum + (width * height);
      }
    }, 0);
  };

  const subtotalSquares = calculateWallsSubtotal();
  const totalOuts = outsValues.front + outsValues.frontRight + outsValues.rear + outsValues.frontLeft;
  const squaresSubtotal = subtotalSquares - totalOuts;
  const roundedSquares = Math.ceil(squaresSubtotal);

  const totalWindowTrim = windowTrimData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalDoorTrim = doorTrimData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalSoffit = soffitData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalFascia = fasciaData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalEntryDoors = entryDoorsData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
  const totalGarageDoors = garageDoorsData.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);

  // Calculate price totals
  const selectedWallsTotal = paintingWalls.find(w => w.checked) ?
    roundedSquares * paintingWalls.find(w => w.checked).price : 0;
  const trimTotal = totalWindowTrim * 61.48 + totalDoorTrim * 61.48 + totalFascia * 6.36 + totalSoffit * 8.48 + shuttersRemove * 77.38 + shuttersPaint * 106.0 + totalEntryDoors * 424.0 + totalGarageDoors * 530.0;
  const miscTotal = miscellaneousItems.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const grandTotal = selectedWallsTotal + trimTotal + miscTotal;
  const oneYearPrice = grandTotal * 0.90;
  const oneYearDeduction = grandTotal * 0.10;
  const thirtyDayPrice = oneYearPrice * 0.90;
  const thirtyDayDeduction = oneYearPrice * 0.10;
  const dayOfPrice = thirtyDayPrice * 0.97;
  const dayOfDeduction = thirtyDayPrice * 0.03;
  const finalSellPrice = dayOfPrice;

  const wallsColumns = [
    { data: 0, type: 'text', className: 'location-cell', readOnly: false },
    { data: 1, type: 'numeric' },
    { data: 2, type: 'numeric' },
    { data: 3, type: 'numeric' },
    { data: 4, type: 'numeric', readOnly: true },
  ];

  const trimColumns = [
    { data: 0, type: 'text' },
    { data: 1, type: 'numeric' },
  ];

  return (
    <div className="house-painting">
      <h2>House Painting</h2>
      
      <div className="stucco-layout">
        {/* Walls Table - Left Side */}
        <div className="walls-table-section">
          <h3 style={{backgroundColor: '#000000', color: '#FFFFFF', padding: '8px', textAlign: 'center', marginBottom: '0'}}>Walls</h3>
          <HotTable
            data={wallsData}
            columns={wallsColumns}
            colHeaders={['Location', 'Width', 'Height', '', 'Total SF']}
            rowHeaders={false}
            width="100%"
            height="auto"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            cells={(row, col) => {
              const cellProperties = {};
              const location = wallsData[row][0];
              
              if (location === 'Single Dormers' && col === 2) {
                cellProperties.readOnly = true;
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                  td.innerHTML = '';
                  td.style.backgroundColor = '#000000';
                  return td;
                };
              }
              
              if (location === 'Single Dormers' && col === 3) {
                cellProperties.readOnly = true;
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                  td.innerHTML = 'x 75 sf =';
                  td.style.textAlign = 'center';
                  td.style.backgroundColor = '#F0F0F0';
                  return td;
                };
              }
              
              if ((location === 'Gables' || location === 'Rakes') && col === 3) {
                cellProperties.readOnly = true;
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                  td.innerHTML = 'x .5 =';
                  td.style.textAlign = 'center';
                  td.style.backgroundColor = '#F0F0F0';
                  return td;
                };
              }

              return cellProperties;
            }}
            afterChange={(changes) => {
              if (changes) {
                const newData = [...wallsData];
                changes.forEach(([row, prop, oldValue, newValue]) => {
                  newData[row][prop] = newValue;
                  
                  const location = newData[row][0];
                  const width = parseFloat(newData[row][1]) || 0;
                  const height = parseFloat(newData[row][2]) || 0;
                  const quantity = parseFloat(newData[row][1]) || 0;
                  
                  if (location === 'Gables' || location === 'Rakes') {
                    newData[row][4] = width * height * 0.5;
                  } else if (location === 'Single Dormers') {
                    newData[row][4] = quantity * 75;
                  } else {
                    newData[row][4] = width * height;
                  }
                });
                setWallsData(newData);
              }
            }}
          />
          <div className="subtotal-row">Subtotal of Squares: {subtotalSquares.toFixed(2)}</div>
          <div className="outs-inputs">
            <div>Front (Outs): (<input type="number" value={outsValues.front} onChange={(e) => setOutsValues({...outsValues, front: parseFloat(e.target.value) || 0})} style={{width: '60px'}} />)</div>
            <div>Front Right (Outs): (<input type="number" value={outsValues.frontRight} onChange={(e) => setOutsValues({...outsValues, frontRight: parseFloat(e.target.value) || 0})} style={{width: '60px'}} />)</div>
            <div>Rear (Outs): (<input type="number" value={outsValues.rear} onChange={(e) => setOutsValues({...outsValues, rear: parseFloat(e.target.value) || 0})} style={{width: '60px'}} />)</div>
            <div>Front Left (Outs): (<input type="number" value={outsValues.frontLeft} onChange={(e) => setOutsValues({...outsValues, frontLeft: parseFloat(e.target.value) || 0})} style={{width: '60px'}} />)</div>
          </div>
          <div className="total-row">Squares (Subtotal): {squaresSubtotal.toFixed(2)}</div>
          <div className="note-row" style={{fontStyle: 'italic'}}>Round up to Nearest Full Square: {roundedSquares}</div>
        </div>

        {/* Right Side Tables */}
        <div className="trim-tables-section">
          <div className="small-table">
            <h3>Window Trim (up to 4")</h3>
            <HotTable
              data={windowTrimData}
              columns={trimColumns}
              colHeaders={['Location', 'Openings']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...windowTrimData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setWindowTrimData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalWindowTrim.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Door Trim (up to 4")</h3>
            <HotTable
              data={doorTrimData}
              columns={trimColumns}
              colHeaders={['Location', 'Openings']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...doorTrimData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setDoorTrimData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalDoorTrim.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Soffit (up to 12")</h3>
            <HotTable
              data={soffitData}
              columns={trimColumns}
              colHeaders={['Location', 'LF']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...soffitData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setSoffitData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalSoffit.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Fascia (up to 6")</h3>
            <HotTable
              data={fasciaData}
              columns={trimColumns}
              colHeaders={['Location', 'LF']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...fasciaData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setFasciaData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalFascia.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Entry Doors</h3>
            <HotTable
              data={entryDoorsData}
              columns={trimColumns}
              colHeaders={['Location', 'Openings']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...entryDoorsData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setEntryDoorsData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalEntryDoors.toFixed(2)}</div>
          </div>

          <div className="small-table">
            <h3>Garage Doors</h3>
            <HotTable
              data={garageDoorsData}
              columns={trimColumns}
              colHeaders={['Location', 'Openings']}
              rowHeaders={false}
              width="100%"
              height="auto"
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes) => {
                if (changes) {
                  const newData = [...garageDoorsData];
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    newData[row][prop] = newValue;
                  });
                  setGarageDoorsData(newData);
                }
              }}
            />
            <div className="total-row">Total: {totalGarageDoors.toFixed(2)}</div>
          </div>
        </div>
      </div>
{/* Rules and Guidelines */}
      <div className="rules-guidelines-section" style={{marginTop: '40px', marginBottom: '40px'}}>
        <div style={{backgroundColor: '#000000', color: '#FFFFFF', padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>
          RULES AND GUIDELINES
        </div>
        <div style={{border: '2px solid #000000', padding: '20px', backgroundColor: '#FEFEFE'}}>
          <p style={{marginBottom: '15px', fontWeight: '600'}}>
            Pricing on this sheet is for standard 2 1/2 story residential homes only - any structure higher than a 2 1/2 story residential home, this price sheet cannot be used and should be called into the office for review
          </p>
          
          <div style={{marginBottom: '15px'}}>
            <strong>Outs</strong>
            <p>100% Outs can be taken</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Window and Door Openings</strong>
            <p>The average size opening includes up to approx 14' linear ft of trim. If it is a double window, then it should be counted as two windows; triple window should be counted as 3 windows.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Gables</strong>
            <p>Single window dormers should be counted as 75 sf of wall space as written. If double window dormer, multiply using x 1, if triple window then multiply by 1.25. Must still charge separately for window trim, fascia trim or soffit.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Paint Samples</strong>
            <p>Sherman Williams charges for paint samples; if customer wants us to provide them, then charge the fee on the sheet for each sample needed. You do not have to charge the fee if the customer chooses to do it on their own. If we are billed for the paint samples and the customer does not pay for them, it will be deducted from commission.</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Interior Work</strong>
            <p>No interior work is included in the price sheet and should not be sold under any circumstances</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Plywood</strong>
            <p>All plywood is sold by the sheet; cannot break it down and sold by sf. No Exceptions</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Vinyl Siding Replacement</strong>
            <p>All vinyl siding replacement pieces have to be sold in 12' pieces; cannot break it down lf. No Exceptions</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Aluminum Siding Replacement</strong>
            <p>All aluminum siding replacement pieces have to be sold in 12' pieces; cannot break it down lf. No Exceptions</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Wood Trim Replacement</strong>
            <p>All wood trim must be sold in 16' increments; cannot break it down by linear ft. No Exceptions</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Wood Clapboard Siding Replacement</strong>
            <p>All wood clapboard siding replacement pieces must be sold in 16' increments; cannot break it down by linear ft. No Exceptions</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Wood Shake Siding Replacement</strong>
            <p>All wood shake siding replacement pieces must be sold as 1/2 squares; cannot break it down by sf. No Exceptions</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Remove / re-install existing gutters</strong>
            <p>If customers do not pay remove and re-installation price, then we will only paint the exposed fascia</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Caulking</strong>
            <p>Caulk pricing is based on it being done in conjunction with a full painting project</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <strong>Vinyl Safe Colors</strong>
            <p>Can only use Vinyl Safe Colors brochure when painting vinyl siding. Cannot use Loxon/Emerald Color wheel.</p>
          </div>
        </div>
      </div>
      {/* Price Tables */}
      <div className="price-tables-section" style={{marginTop: '40px'}}>
        {/* Painting Walls Only */}
        <div className="price-table">
          <h3 style={{backgroundColor: '#4472C4', color: '#FFFFFF'}}>PAINTING (WALLS ONLY)</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Total SF</th>
                <th>Price Per SF</th>
                <th>TOTAL</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {paintingWalls.map((item, idx) => (
                <tr key={idx}>
                  <td style={{fontSize: '11px'}}>{item.name}</td>
                   <td style={{fontWeight: 'bold', textAlign: 'center'}}>
                    {roundedSquares}
                    </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="total-price-cell">
                    {item.checked ? `$${(roundedSquares * item.price).toFixed(2)}` : '$0.00'}
                    </td>
                  <td style={{textAlign: 'center'}}>
                    <input 
                      type="checkbox" 
                      checked={item.checked}
                      onChange={(e) => {
                        const newWalls = paintingWalls.map((w, i) => ({
                          ...w,
                          checked: i === idx ? e.target.checked : false
                        }));
                        setPaintingWalls(newWalls);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{fontSize: '10px', fontStyle: 'italic', marginTop: '10px', padding: '5px'}}>
            All of the above include a powerwash + two coats of paint on exterior walls only, no trim is included. Vinyl Siding must use Vinyl Safe Colors. Aluminum Siding and Wood Siding use Emerald Exterior from the color wheel. Foundations are Loxon XP from color wheel (foundations include up to 25 lf of crack repair that is less than 1in in wide).
          </div>
        </div>

        {/* Painting Trim Only */}
        <div className="price-table">
          <h3 style={{backgroundColor: '#4472C4', color: '#FFFFFF'}}>PAINTING (TRIM ONLY)</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Total Qty</th>
                <th>Price Per Unit</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Window trim ---- (up to 4in wide)</td>
                <td>Per Opening</td>
                <td>{totalWindowTrim.toFixed(2)}</td>
                <td>$61.48</td>
                <td className="total-price-cell">${(totalWindowTrim * 61.48).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Door trim ---- (up to 4in wide)</td>
                <td>Per Opening</td>
                <td>{totalDoorTrim.toFixed(2)}</td>
                <td>$61.48</td>
                <td className="total-price-cell">${(totalDoorTrim * 61.48).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Fascia for frieze board trim ---- (up to 6in wide)</td>
                <td>Per LF</td>
                <td>{totalFascia.toFixed(2)}</td>
                <td>$6.36</td>
                <td className="total-price-cell">${(totalFascia * 6.36).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Soffit - Non Vented ---- (up to 12in deep)</td>
                <td>Per LF</td>
                <td>{totalSoffit.toFixed(2)}</td>
                <td>$8.48</td>
                <td className="total-price-cell">${(totalSoffit * 8.48).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Remove and re-install existing shutters</td>
                <td>Per Pair</td>
                <td>
                  <input 
                    type="number" 
                    value={shuttersRemove}
                    onChange={(e) => setShuttersRemove(parseFloat(e.target.value) || 0)}
                    style={{width: '60px', textAlign: 'center'}}
                  />
                </td>
                <td>$77.38</td>
                <td className="total-price-cell">${(shuttersRemove * 77.38).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Remove, paint and re-install existing shutters</td>
                <td>Per Pair</td>
                <td>
                  <input 
                    type="number" 
                    value={shuttersPaint}
                    onChange={(e) => setShuttersPaint(parseFloat(e.target.value) || 0)}
                    style={{width: '60px', textAlign: 'center'}}
                  />
                </td>
                <td>$106.0</td>
                <td className="total-price-cell">${(shuttersPaint * 106.0).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Single front entry door ---- (wood surface only)</td>
                <td>Per Opening</td>
                <td>{totalEntryDoors.toFixed(2)}</td>
                <td>$424.0</td>
                <td className="total-price-cell">${(totalEntryDoors * 424.0).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Garage doors ---- (wood surface only)</td>
                <td>Per Opening</td>
                <td>{totalGarageDoors.toFixed(2)}</td>
                <td>$530.0</td>
                <td className="total-price-cell">${(totalGarageDoors * 530.0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{fontSize: '10px', fontStyle: 'italic', marginTop: '10px', padding: '5px'}}>
            All items above included powerwash and two coats of Emerald Exterior; no sanding or repair work of any kind is included. If sanding or repair work is needed, call office for pricing. All pricing is for exterior work only.
          </div>
        </div>

        {/* Miscellaneous Items */}
        <div className="price-table">
          <h3 style={{backgroundColor: '#4472C4', color: '#FFFFFF'}}>MISCELLANEOUS ITEMS</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Quantity</th>
                <th>Price Per Unit</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {miscellaneousItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{fontSize: '11px'}}>{item.name}</td>
                  <td>
                    {item.unit}
                    <input 
                      type="number" 
                      value={item.qty}
                      onChange={(e) => {
                        const newItems = [...miscellaneousItems];
                        newItems[idx].qty = parseFloat(e.target.value) || 0;
                        setMiscellaneousItems(newItems);
                      }}
                      style={{width: '60px', textAlign: 'center', marginLeft: '5px'}}
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="total-price-cell">${(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Job Minimums */}
        <div className="price-table">
          <h3 style={{backgroundColor: '#000000', color: '#FFFF00'}}>JOB MINIMUMS (FOR WORK ON STANDARD 2 1/2 STORY HOMES LESS THAN 26")</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>All painting</td>
                <td>$5,600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Calculation */}
      <div className="project-calculation-section" style={{marginTop: '30px'}}>
        <table className="calculation-table">
          <thead>
            <tr>
              <th>PROJECT CALCULATION</th>
              <th>REP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="label-cell">1 Year Price</td>
              <td className="input-cell">${oneYearPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10%</td>
              <td className="input-cell">(${oneYearDeduction.toFixed(2)})</td>
            </tr>
            <tr>
              <td className="label-cell">30 Day Price</td>
              <td className="input-cell">${thirtyDayPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10%</td>
              <td className="input-cell">(${thirtyDayDeduction.toFixed(2)})</td>
            </tr>
            <tr>
              <td className="label-cell">Day of Price</td>
              <td className="input-cell">${dayOfPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 3% for 33% Deposit</td>
              <td className="input-cell">(${dayOfDeduction.toFixed(2)})</td>
            </tr>
            <tr>
              <td className="label-cell">Final Sell Price</td>
              <td className="input-cell">${finalSellPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('gutters');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    salesRep: ''
  });

  const contentRef = useRef();

  const generatePDF = () => {
  const element = contentRef.current;
  const timestamp = new Date().toLocaleDateString().replace(/\//g, '-');
  const fileName = `${activeTab}_${customerInfo.name || 'estimate'}_${timestamp}.jpg`;

  // Scroll to top to ensure everything is visible
  window.scrollTo(0, 0);

  // Use html2canvas to capture the entire content as one image
  html2canvas(element, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  }).then(canvas => {
    // Convert canvas to JPEG blob
    canvas.toBlob(function(blob) {
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(link.href);
    }, 'image/jpeg', 0.95);
  });
};


  return (

    <div className="App">
      <header>
        <h1>🏗️ Garden State Brickface & Siding Pricing Calculator</h1>
      </header>

      <div className="tabs">
        <button 
          className={activeTab === 'gutters' ? 'active' : ''}
          onClick={() => setActiveTab('gutters')}
        >
          Gutters & Leaders
        </button>
        <button 
          className={activeTab === 'stone-veneers' ? 'active' : ''}
          onClick={() => setActiveTab('stone-veneers')}
        >
          Stone Veneers
        </button>
        <button 
          className={activeTab === 'stucco-painting' ? 'active' : ''}
          onClick={() => setActiveTab('stucco-painting')}
        >
          Stucco Painting
        </button>
        <button 
          className={activeTab === 'house-painting' ? 'active' : ''}
           onClick={() => setActiveTab('house-painting')}
>
          House Painting
        </button>
      </div>

            <main ref={contentRef}>
        {activeTab === 'gutters' && <GuttersAndLeaders />}
        {activeTab === 'stone-veneers' && <StoneVeneers />}
        {activeTab === 'stucco-painting' && <StuccoPainting />}
        {activeTab === 'house-painting' && <HousePainting />}
        
        {/* Customer info section - will appear in PDF */}
        <div className="pdf-customer-info">
          <div className="customer-row">
            <strong>Customer Name:</strong> {customerInfo.name || '_________________'}
          </div>
          <div className="customer-row">
            <strong>Project Location:</strong> {customerInfo.address || '_________________'}
          </div>
          <div className="customer-row">
            <strong>Sales Rep:</strong> {customerInfo.salesRep || '_________________'}
          </div>
        </div>
      </main>

      <footer>
        <div className="customer-info">
          <input 
            type="text" 
            placeholder="Customer Name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Address"
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Sales Rep"
            value={customerInfo.salesRep}
            onChange={(e) => setCustomerInfo({...customerInfo, salesRep: e.target.value})}
          />
        </div>
        <button className="generate-pdf" onClick={generatePDF}>Download Image</button>
      </footer>

    </div>
  );
}

export default App;
