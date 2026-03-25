import React, { useState } from 'react';
import { HotTable } from '@handsontable/react';
import {
  stuccoWallPriceRanges,
  stuccoTrimPrices,
  stuccoCaulkingTypes,
  stuccoMiscItems,
  stuccoExtras,
  stuccoMinimums,
  calculateDiscountCascade,
} from '../pricing';

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

  const [caulkingLF, setCaulkingLF] = useState(new Array(stuccoCaulkingTypes.length).fill(0));

  const [miscellaneousItems, setMiscellaneousItems] = useState(
    stuccoMiscItems.map(item => ({ ...item, qty: 0 }))
  );

  const [repairChecked, setRepairChecked] = useState(false);
  const [addRiggingChecked, setAddRiggingChecked] = useState(false);

  // Calculate totals
  const calculateWallsSubtotal = () => {
    return wallsData.reduce((sum, row) => {
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
    for (let i = 0; i < stuccoWallPriceRanges.length; i++) {
      if (roundedSquares >= stuccoWallPriceRanges[i].range[0] && roundedSquares <= stuccoWallPriceRanges[i].range[1]) {
        return roundedSquares * stuccoWallPriceRanges[i].priceAbove;
      }
    }
    return 0;
  };

  const wallsTotal = getWallsPrice();
  const trimTotal = (totalWindowTrim + totalDoorTrim) * stuccoTrimPrices.windowDoorTrim + totalSoffit * stuccoTrimPrices.soffit + totalFascia * stuccoTrimPrices.fascia + totalQuoins * stuccoTrimPrices.quoins;
  const caulkingTotal = caulkingLF.reduce((sum, lf, idx) => sum + (lf * stuccoCaulkingTypes[idx].price), 0);
  const miscTotal = miscellaneousItems.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const grandTotal = wallsTotal + trimTotal + caulkingTotal + miscTotal;
  const repairCost = repairChecked ? stuccoExtras.repair : 0;
  const riggingCost = addRiggingChecked ? stuccoExtras.rigging : 0;
  const cascade = calculateDiscountCascade(grandTotal + repairCost + riggingCost);

  const {
    oneYearPrice,
    oneYearDeduction,
    thirtyDayPrice,
    thirtyDayDeduction,
    dayOfPrice,
    dayOfDeduction,
    finalSellPrice,
  } = cascade;

  const wallsColumns = [
    {
      data: 0,
      type: 'text',
      className: 'location-cell',
      readOnly: false,
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
                cellProperties.renderer = function(instance, td) {
                  td.innerHTML = '';
                  td.style.backgroundColor = '#000000';
                  return td;
                };
              }

              // For Single Dormers rows, show formula text in column 3
              if (location === 'Single Dormers' && col === 3) {
                cellProperties.readOnly = true;
                cellProperties.renderer = function(instance, td) {
                  td.innerHTML = 'x 75 sf =';
                  td.style.textAlign = 'center';
                  td.style.backgroundColor = '#F0F0F0';
                  return td;
                };
              }

              // For Gables/Rakes, show formula in column 3
              if ((location === 'Gables' || location === 'Rakes') && col === 3) {
                cellProperties.readOnly = true;
                cellProperties.renderer = function(instance, td) {
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
                { range: '200 - 499', price: stuccoWallPriceRanges[0].priceAbove, sf: roundedSquares >= 200 && roundedSquares <= 499 ? roundedSquares : 0 },
                { range: '500 - 999', price: stuccoWallPriceRanges[1].priceAbove, sf: roundedSquares >= 500 && roundedSquares <= 999 ? roundedSquares : 0 },
                { range: '1000 - 1699', price: stuccoWallPriceRanges[2].priceAbove, sf: roundedSquares >= 1000 && roundedSquares <= 1699 ? roundedSquares : 0 },
                { range: '1700 - 2999', price: stuccoWallPriceRanges[3].priceAbove, sf: roundedSquares >= 1700 && roundedSquares <= 2999 ? roundedSquares : 0 },
                { range: '3000 - 4499', price: stuccoWallPriceRanges[4].priceAbove, sf: roundedSquares >= 3000 && roundedSquares <= 4499 ? roundedSquares : 0 },
                { range: 'Above 4500', price: stuccoWallPriceRanges[5].priceAbove, sf: roundedSquares >= 4500 ? roundedSquares : 0 },
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
                { range: '200 - 499', price: stuccoWallPriceRanges[0].priceBelow, sf: roundedSquares >= 200 && roundedSquares <= 499 ? roundedSquares : 0 },
                { range: '500 - 999', price: stuccoWallPriceRanges[1].priceBelow, sf: roundedSquares >= 500 && roundedSquares <= 999 ? roundedSquares : 0 },
                { range: '1000 - 1699', price: stuccoWallPriceRanges[2].priceBelow, sf: roundedSquares >= 1000 && roundedSquares <= 1699 ? roundedSquares : 0 },
                { range: '1700 - 2999', price: stuccoWallPriceRanges[3].priceBelow, sf: roundedSquares >= 1700 && roundedSquares <= 2999 ? roundedSquares : 0 },
                { range: '3000 - 4499', price: stuccoWallPriceRanges[4].priceBelow, sf: roundedSquares >= 3000 && roundedSquares <= 4499 ? roundedSquares : 0 },
                { range: 'Above 4500', price: stuccoWallPriceRanges[5].priceBelow, sf: roundedSquares >= 4500 ? roundedSquares : 0 },
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
                <td>${stuccoTrimPrices.windowDoorTrim.toFixed(2)}</td>
                <td className="total-price-cell">${((totalWindowTrim + totalDoorTrim) * stuccoTrimPrices.windowDoorTrim).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Two coats of Loxon XP over stucco soffit (up to 12")</td>
                <td>{totalSoffit.toFixed(2)}</td>
                <td>${stuccoTrimPrices.soffit.toFixed(2)}</td>
                <td className="total-price-cell">${(totalSoffit * stuccoTrimPrices.soffit).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Two coats of Loxon XP over stucco fascia (up to 8")</td>
                <td>{totalFascia.toFixed(2)}</td>
                <td>${stuccoTrimPrices.fascia.toFixed(2)}</td>
                <td className="total-price-cell">${(totalFascia * stuccoTrimPrices.fascia).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Apply two coats of Loxon XP over single side quoin</td>
                <td>{totalQuoins.toFixed(2)}</td>
                <td>${stuccoTrimPrices.quoins.toFixed(2)}</td>
                <td className="total-price-cell">${(totalQuoins * stuccoTrimPrices.quoins).toFixed(2)}</td>
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
              {stuccoCaulkingTypes.map((item, idx) => (
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
                        const newItems = miscellaneousItems.map((mi, i) =>
                          i === idx ? { ...mi, qty: parseFloat(e.target.value) || 0 } : mi
                        );
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
              {stuccoMinimums.map((min, idx) => (
                <tr key={idx}>
                  <td>
                    {min.name}
                    {min.note && (
                      <> <span style={{color: '#FF0000'}}>{min.note}</span></>
                    )}
                  </td>
                  <td>${min.amount.toLocaleString()}</td>
                </tr>
              ))}
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

export default StuccoPainting;
