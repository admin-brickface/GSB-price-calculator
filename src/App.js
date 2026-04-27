import React, { useState, useRef } from 'react';
import 'handsontable/dist/handsontable.full.css';
import { registerAllModules } from 'handsontable/registry';
import html2canvas from 'html2canvas';
import './App.css';

import GuttersAndLeaders from './components/GuttersAndLeaders';
import StoneVeneers from './components/StoneVeneers';
import StuccoPainting from './components/StuccoPainting';
import HousePainting from './components/HousePainting';
import WindowReplacement from './components/WindowReplacement';

registerAllModules();

function App() {
  const [activeTab, setActiveTab] = useState('gutters');
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', salesRep: '' });
  const contentRef = useRef(null);

  const generatePDF = () => {
    const element = contentRef.current;
    const timestamp = new Date().toLocaleDateString().replace(/\//g, '-');
    const fileName = `${activeTab}_${customerInfo.name || 'estimate'}_${timestamp}.jpg`;
    window.scrollTo(0, 0);
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
      canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        <button
          className={activeTab === 'window-replacement' ? 'active' : ''}
          onClick={() => setActiveTab('window-replacement')}
        >
          Window Replacement
        </button>
      </div>

            <main ref={contentRef}>
        {activeTab === 'gutters' && <GuttersAndLeaders />}
        {activeTab === 'stone-veneers' && <StoneVeneers />}
        {activeTab === 'stucco-painting' && <StuccoPainting />}
        {activeTab === 'house-painting' && <HousePainting />}
        {activeTab === 'window-replacement' && <WindowReplacement />}

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
