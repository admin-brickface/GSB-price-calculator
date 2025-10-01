import React, { useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

const StuccoPainting = () => {
  const hotRef = useRef(null);
  
  const [wallsData] = useState([
    ['Front', '', 'x', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['Gables', '', '', '', 'x .5 =', ''],
    ['Rakes', '', '', '', 'x .5 =', ''],
    ['Single Dormers', 'Quantity = (', '', ')', 'x 75 sf =', ''],
    ['Front Right', '', 'x', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['Gables', '', '', '', 'x .5 =', ''],
    ['Rakes', '', '', '', 'x .5 =', ''],
    ['Single Dormers', 'Quantity = (', '', ')', 'x 75 sf =', ''],
    ['Rear', '', 'x', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['Gables', '', '', '', 'x .5 =', ''],
    ['Rakes', '', '', '', 'x .5 =', ''],
    ['Single Dormers', 'Quantity = (', '', ')', 'x 75 sf =', ''],
    ['Front Left', '', 'x', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['', '', '', '', '=', ''],
    ['Gables', '', '', '', 'x .5 =', ''],
    ['Rakes', '', '', '', 'x .5 =', ''],
    ['Single Dormers', 'Quantity = (', '', ')', 'x 75 sf =', '']
  ]);

  const afterChange = (changes, source) => {
    if (source === 'edit' && changes) {
      const hot = hotRef.current.hotInstance;
      changes.forEach(([row, col, oldValue, newValue]) => {
        if (col === 1 || col === 3) {
          const width = parseFloat(hot.getDataAtCell(row, 1)) || 0;
          const height = parseFloat(hot.getDataAtCell(row, 3)) || 0;
          const formula = hot.getDataAtCell(row, 4);
          
          if (width && height && formula) {
            let result = 0;
            if (formula === '=') {
              result = (width * height) / 144;
            } else if (formula === 'x .5 =') {
              result = (width * height * 0.5) / 144;
            } else if (formula.includes('x 75 sf =')) {
              const quantity = parseFloat(hot.getDataAtCell(row, 1)) || 0;
              result = quantity * 75;
            }
            hot.setDataAtCell(row, 5, result.toFixed(2));
          }
        }
      });
    }
  };

  return (
    <div className="stucco-painting">
      <h2>Stucco Painting Measurements</h2>
      <div className="walls-section">
        <h3>Walls</h3>
        <HotTable
          ref={hotRef}
          data={wallsData}
          colHeaders={['Location', 'Width', 'x', 'Height', '', 'Total SF']}
          columns={[
            { readOnly: true },
            { type: 'numeric' },
            { readOnly: true },
            { type: 'numeric' },
            { readOnly: true },
            { readOnly: true, type: 'numeric' }
          ]}
          rowHeaders={false}
          width="100%"
          height="auto"
          licenseKey="non-commercial-and-evaluation"
          afterChange={afterChange}
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default StuccoPainting;