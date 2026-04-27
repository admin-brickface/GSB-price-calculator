import React, { useState } from 'react';
import { housePaintingWallTypes, housePaintingTrimPrices, housePaintingMiscItems, housePaintingMinimum, calculateDiscountCascade } from '../pricing';

const inputStyle = {
  minHeight: '44px',
  padding: '8px',
  fontSize: '14px',
  boxSizing: 'border-box',
  width: '100%',
  border: '1px solid #ccc',
  borderRadius: '2px',
};

const textInputStyle = { ...inputStyle };
const numberInputStyle = { ...inputStyle, textAlign: 'right' };

function isSpecialRow(location) {
  return location === 'Gables' || location === 'Rakes' || location === 'Single Dormers';
}

function computeRowTotal(row) {
  const location = row[0];
  const width = parseFloat(row[1]) || 0;
  const height = parseFloat(row[2]) || 0;

  if (location === 'Gables' || location === 'Rakes') {
    return width * height * 0.5;
  } else if (location === 'Single Dormers') {
    return width * 75;
  } else {
    return width * height;
  }
}

function formulaLabel(location) {
  if (location === 'Gables' || location === 'Rakes') {
    return 'x .5 =';
  } else if (location === 'Single Dormers') {
    return 'x 75 sf =';
  }
  return '';
}

function WallsTable({ wallsData, setWallsData }) {
  const handleChange = (rowIdx, colIdx, value) => {
    const newData = wallsData.map((row, i) => {
      if (i !== rowIdx) return row;
      const newRow = [...row];
      newRow[colIdx] = value;
      newRow[4] = computeRowTotal(newRow);
      return newRow;
    });
    setWallsData(newData);
  };

  return (
    <table className="pricing-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ width: '28%' }}>Location</th>
          <th style={{ width: '18%' }}>Width</th>
          <th style={{ width: '18%' }}>Height</th>
          <th style={{ width: '16%' }}></th>
          <th style={{ width: '20%' }}>Total SF</th>
        </tr>
      </thead>
      <tbody>
        {wallsData.map((row, rowIdx) => {
          const location = row[0];
          const isDormer = location === 'Single Dormers';
          const total = computeRowTotal(row);
          const formula = formulaLabel(location);

          return (
            <tr key={rowIdx}>
              <td>
                {isSpecialRow(location) ? (
                  <span style={{ padding: '8px', display: 'inline-block', fontWeight: 'bold' }}>{location}</span>
                ) : (
                  <input
                    type="text"
                    value={row[0]}
                    onChange={(e) => handleChange(rowIdx, 0, e.target.value)}
                    style={textInputStyle}
                  />
                )}
              </td>
              <td>
                <input
                  type="number"
                  inputMode="decimal"
                  value={row[1]}
                  onChange={(e) => handleChange(rowIdx, 1, e.target.value)}
                  style={numberInputStyle}
                  placeholder={isDormer ? 'Qty' : ''}
                />
              </td>
              <td>
                {isDormer ? (
                  <div style={{ minHeight: '44px', backgroundColor: '#000000', borderRadius: '2px' }} />
                ) : (
                  <input
                    type="number"
                    inputMode="decimal"
                    value={row[2]}
                    onChange={(e) => handleChange(rowIdx, 2, e.target.value)}
                    style={numberInputStyle}
                  />
                )}
              </td>
              <td style={{ textAlign: 'center', backgroundColor: formula ? '#F0F0F0' : 'transparent', fontSize: '13px' }}>
                {formula}
              </td>
              <td style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>
                {total ? total.toFixed(2) : ''}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TrimTable({ data, setData, title, valueHeader }) {
  const handleChange = (rowIdx, colIdx, value) => {
    const newData = data.map((row, i) => {
      if (i !== rowIdx) return row;
      const newRow = [...row];
      newRow[colIdx] = value;
      return newRow;
    });
    setData(newData);
  };

  const total = data.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);

  return (
    <div className="small-table">
      <h3>{title}</h3>
      <table className="pricing-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ width: '60%' }}>Location</th>
            <th style={{ width: '40%' }}>{valueHeader}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td>
                <input
                  type="text"
                  value={row[0]}
                  onChange={(e) => handleChange(rowIdx, 0, e.target.value)}
                  style={textInputStyle}
                />
              </td>
              <td>
                <input
                  type="number"
                  inputMode="decimal"
                  value={row[1]}
                  onChange={(e) => handleChange(rowIdx, 1, e.target.value)}
                  style={numberInputStyle}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-row">Total: {total.toFixed(2)}</div>
    </div>
  );
}

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
  const [paintingWalls, setPaintingWalls] = useState(
    housePaintingWallTypes.map(item => ({ ...item, checked: false }))
  );

  // Painting trim only
  const [shuttersRemove, setShuttersRemove] = useState(0);
  const [shuttersPaint, setShuttersPaint] = useState(0);

  // Miscellaneous items
  const [miscellaneousItems, setMiscellaneousItems] = useState(
    housePaintingMiscItems.map(item => ({ ...item, qty: 0 }))
  );

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
  const trimTotal = totalWindowTrim * housePaintingTrimPrices.windowTrim + totalDoorTrim * housePaintingTrimPrices.doorTrim + totalFascia * housePaintingTrimPrices.fascia + totalSoffit * housePaintingTrimPrices.soffit + shuttersRemove * housePaintingTrimPrices.shuttersRemove + shuttersPaint * housePaintingTrimPrices.shuttersPaint + totalEntryDoors * housePaintingTrimPrices.entryDoor + totalGarageDoors * housePaintingTrimPrices.garageDoor;
  const miscTotal = miscellaneousItems.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const cascade = calculateDiscountCascade(selectedWallsTotal + trimTotal + miscTotal);

  return (
    <div className="house-painting">
      <h2>House Painting</h2>

      <div className="stucco-layout">
        {/* Walls Table - Left Side */}
        <div className="walls-table-section">
          <h3 style={{backgroundColor: '#000000', color: '#FFFFFF', padding: '8px', textAlign: 'center', marginBottom: '0'}}>Walls</h3>
          <WallsTable wallsData={wallsData} setWallsData={setWallsData} />
          <div className="subtotal-row">Subtotal of Squares: {subtotalSquares.toFixed(2)}</div>
          <div className="outs-inputs">
            <div>Front (Outs): (<input type="number" inputMode="decimal" value={outsValues.front} onChange={(e) => setOutsValues({...outsValues, front: parseFloat(e.target.value) || 0})} style={{width: '60px', minHeight: '44px', padding: '8px'}} />)</div>
            <div>Front Right (Outs): (<input type="number" inputMode="decimal" value={outsValues.frontRight} onChange={(e) => setOutsValues({...outsValues, frontRight: parseFloat(e.target.value) || 0})} style={{width: '60px', minHeight: '44px', padding: '8px'}} />)</div>
            <div>Rear (Outs): (<input type="number" inputMode="decimal" value={outsValues.rear} onChange={(e) => setOutsValues({...outsValues, rear: parseFloat(e.target.value) || 0})} style={{width: '60px', minHeight: '44px', padding: '8px'}} />)</div>
            <div>Front Left (Outs): (<input type="number" inputMode="decimal" value={outsValues.frontLeft} onChange={(e) => setOutsValues({...outsValues, frontLeft: parseFloat(e.target.value) || 0})} style={{width: '60px', minHeight: '44px', padding: '8px'}} />)</div>
          </div>
          <div className="total-row">Squares (Subtotal): {squaresSubtotal.toFixed(2)}</div>
          <div className="note-row" style={{fontStyle: 'italic'}}>Round up to Nearest Full Square: {roundedSquares}</div>
        </div>

        {/* Right Side Tables */}
        <div className="trim-tables-section">
          <TrimTable data={windowTrimData} setData={setWindowTrimData} title="Window Trim (up to 4&quot;)" valueHeader="Openings" />
          <TrimTable data={doorTrimData} setData={setDoorTrimData} title="Door Trim (up to 4&quot;)" valueHeader="Openings" />
          <TrimTable data={soffitData} setData={setSoffitData} title="Soffit (up to 12&quot;)" valueHeader="LF" />
          <TrimTable data={fasciaData} setData={setFasciaData} title="Fascia (up to 6&quot;)" valueHeader="LF" />
          <TrimTable data={entryDoorsData} setData={setEntryDoorsData} title="Entry Doors" valueHeader="Openings" />
          <TrimTable data={garageDoorsData} setData={setGarageDoorsData} title="Garage Doors" valueHeader="Openings" />
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
                <td>${housePaintingTrimPrices.windowTrim.toFixed(2)}</td>
                <td className="total-price-cell">${(totalWindowTrim * housePaintingTrimPrices.windowTrim).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Door trim ---- (up to 4in wide)</td>
                <td>Per Opening</td>
                <td>{totalDoorTrim.toFixed(2)}</td>
                <td>${housePaintingTrimPrices.doorTrim.toFixed(2)}</td>
                <td className="total-price-cell">${(totalDoorTrim * housePaintingTrimPrices.doorTrim).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Fascia for frieze board trim ---- (up to 6in wide)</td>
                <td>Per LF</td>
                <td>{totalFascia.toFixed(2)}</td>
                <td>${housePaintingTrimPrices.fascia.toFixed(2)}</td>
                <td className="total-price-cell">${(totalFascia * housePaintingTrimPrices.fascia).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Soffit - Non Vented ---- (up to 12in deep)</td>
                <td>Per LF</td>
                <td>{totalSoffit.toFixed(2)}</td>
                <td>${housePaintingTrimPrices.soffit.toFixed(2)}</td>
                <td className="total-price-cell">${(totalSoffit * housePaintingTrimPrices.soffit).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Remove and re-install existing shutters</td>
                <td>Per Pair</td>
                <td>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={shuttersRemove}
                    onChange={(e) => setShuttersRemove(parseFloat(e.target.value) || 0)}
                    style={{width: '60px', textAlign: 'center', minHeight: '44px', padding: '8px'}}
                  />
                </td>
                <td>${housePaintingTrimPrices.shuttersRemove.toFixed(2)}</td>
                <td className="total-price-cell">${(shuttersRemove * housePaintingTrimPrices.shuttersRemove).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Remove, paint and re-install existing shutters</td>
                <td>Per Pair</td>
                <td>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={shuttersPaint}
                    onChange={(e) => setShuttersPaint(parseFloat(e.target.value) || 0)}
                    style={{width: '60px', textAlign: 'center', minHeight: '44px', padding: '8px'}}
                  />
                </td>
                <td>${housePaintingTrimPrices.shuttersPaint.toFixed(2)}</td>
                <td className="total-price-cell">${(shuttersPaint * housePaintingTrimPrices.shuttersPaint).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Single front entry door ---- (wood surface only)</td>
                <td>Per Opening</td>
                <td>{totalEntryDoors.toFixed(2)}</td>
                <td>${housePaintingTrimPrices.entryDoor.toFixed(2)}</td>
                <td className="total-price-cell">${(totalEntryDoors * housePaintingTrimPrices.entryDoor).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Garage doors ---- (wood surface only)</td>
                <td>Per Opening</td>
                <td>{totalGarageDoors.toFixed(2)}</td>
                <td>${housePaintingTrimPrices.garageDoor.toFixed(2)}</td>
                <td className="total-price-cell">${(totalGarageDoors * housePaintingTrimPrices.garageDoor).toFixed(2)}</td>
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
                      inputMode="decimal"
                      value={item.qty}
                      onChange={(e) => {
                        const newItems = miscellaneousItems.map((it, i) =>
                          i === idx ? { ...it, qty: parseFloat(e.target.value) || 0 } : it
                        );
                        setMiscellaneousItems(newItems);
                      }}
                      style={{width: '60px', textAlign: 'center', marginLeft: '5px', minHeight: '44px', padding: '8px'}}
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
                <td>${housePaintingMinimum.toLocaleString()}</td>
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
              <td className="input-cell">${cascade.oneYearPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10%</td>
              <td className="input-cell">(${cascade.oneYearDeduction.toFixed(2)})</td>
            </tr>
            <tr>
              <td className="label-cell">30 Day Price</td>
              <td className="input-cell">${cascade.thirtyDayPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label-cell">Deduct 10%</td>
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
    </div>
  );
}

export default HousePainting;
