import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

import GuttersAndLeaders from './components/GuttersAndLeaders';
import StoneVeneers from './components/StoneVeneers';
import StuccoPainting from './components/StuccoPainting';
import HousePainting from './components/HousePainting';
import WindowReplacement from './components/WindowReplacement';
import Roofing from './components/Roofing';
import Masonry from './components/Masonry';

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

      <div className="service-selector">
        <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
          <option value="gutters">Gutters &amp; Leaders</option>
          <option value="stone-veneers">Stone Veneers</option>
          <option value="stucco-painting">Stucco Painting</option>
          <option value="house-painting">House Painting</option>
          <option value="window-replacement">Provia Endure Vinyl Replacement Windows</option>
          <option value="roofing">Roofing</option>
          <option value="masonry">Masonry</option>
        </select>
      </div>

            <main ref={contentRef}>
        <div style={{ display: activeTab === 'gutters' ? 'block' : 'none' }}><GuttersAndLeaders /></div>
        <div style={{ display: activeTab === 'stone-veneers' ? 'block' : 'none' }}><StoneVeneers /></div>
        <div style={{ display: activeTab === 'stucco-painting' ? 'block' : 'none' }}><StuccoPainting /></div>
        <div style={{ display: activeTab === 'house-painting' ? 'block' : 'none' }}><HousePainting /></div>
        <div style={{ display: activeTab === 'window-replacement' ? 'block' : 'none' }}><WindowReplacement /></div>
        <div style={{ display: activeTab === 'roofing' ? 'block' : 'none' }}><Roofing /></div>
        <div style={{ display: activeTab === 'masonry' ? 'block' : 'none' }}><Masonry /></div>

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
