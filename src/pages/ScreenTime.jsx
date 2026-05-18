import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Clock, Plus, Save } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import '../styles/ScreenTime.css';

const ScreenTime = () => {
  const { screenTime, addScreenTime, addCustomCategory, resetForNewUser } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('entertainment');
  const [minutes, setMinutes] = useState('');
  const [customName, setCustomName] = useState('');

  const handleAdd = () => {
    const mins = parseInt(minutes, 10);
    if (!isNaN(mins) && mins > 0) {
      addScreenTime(selectedCategory, mins);
      setMinutes('');
    }
  };

  const handleCustomAdd = () => {
    if (customName.trim()) {
      addCustomCategory(customName.trim());
      setSelectedCategory(customName.trim());
      setCustomName('');
    }
  };

  return (
    <div className="screen-time-page">
      <GlassCard title="Manual Screen‑Time Entry" className="screen-time-card">
        <div className="category-select">
          <label>Category:</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="entertainment">Entertainment</option>
            <option value="news">News</option>
            <option value="coding">Coding</option>
            <option value="focus">Focus</option>
            {Object.keys(screenTime.categories.custom || {}).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="btn-glass" onClick={handleAdd} title="Add minutes">
            <Plus size={16} /> Add Minutes
          </button>
        </div>
        <div className="minutes-input">
          <input
            type="number"
            placeholder="Minutes"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
          />
        </div>
        <div className="custom-category">
          <input
            type="text"
            placeholder="New category name"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
          />
          <button className="btn-glass" onClick={handleCustomAdd} title="Create custom category">
            <Plus size={16} /> Create Category
          </button>
        </div>
        <div className="summary">
          <h3>Total: {screenTime.total} min</h3>
          <ul>
            {Object.entries(screenTime.categories).map(([cat, value]) => (
              <li key={cat}>
                <strong>{cat}:</strong> {typeof value === 'object' ? Object.values(value).reduce((a, b) => a + b, 0) : value} min
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </div>
  );
};

export default ScreenTime;
