import React, { useState } from 'react';
import { HotTable } from '@handsontable/react';
import { gutterTypes, leaderTypes, gutterGuardTypes, calculateDiscountCascade } from '../pricing';

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

  // Project Calculation
  const totalPrice = gutterTotalPrice + leaderTotalPrice + gutterGuardTotalPrice;
  const cascade = calculateDiscountCascade(totalPrice);

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
            <li>5" gutters @ .27 gauge</li>
            <li>2x3 leaders @ .19 gauge</li>
            <li>Install metal gutter screens <span className="red-text">(if any)</span></li>
            <li>Color is White</li>
          </ul>
        </div>
      </div>
    </div>
      </div>
  );
}

export default GuttersAndLeaders;
