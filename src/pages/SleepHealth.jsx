import React from 'react';
import { Moon, Droplets, Zap, Wind, Bed, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../components/GlassCard';

const sleepData = [
  { day: 'Mon', hours: 7.2 },
  { day: 'Tue', hours: 6.8 },
  { day: 'Wed', hours: 8.1 },
  { day: 'Thu', hours: 7.5 },
  { day: 'Fri', hours: 6.5 },
  { day: 'Sat', hours: 9.0 },
  { day: 'Sun', hours: 8.5 },
];

const SleepHealth = () => {
  return (
    <div className="sleep-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 className="text-gradient">Sleep & Physical Health</h1>
        <p className="text-muted">Track your recovery and maintain physical vitality.</p>
      </header>

      <div className="sleep-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <GlassCard title="Sleep Duration" subtitle="Average: 7.6 hours">
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepData}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Area type="monotone" dataKey="hours" stroke="#a855f7" fillOpacity={1} fill="url(#colorSleep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Water Intake" className="water-tracking">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px' }}>
            <div className="water-bubble" style={{ 
              width: 120, height: 120, borderRadius: '50%', background: 'rgba(34, 211, 238, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--accent)',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '70%', background: 'var(--accent)', opacity: 0.6 }}></div>
              <h2 style={{ zIndex: 1 }}>1.8L</h2>
            </div>
            <p className="text-muted">Goal: 2.5L</p>
            <button className="btn-primary">+ 250ml</button>
          </div>
        </GlassCard>

        <GlassCard title="Stress Level" subtitle="Current: Moderate">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Relaxed</span>
              <span>Stressed</span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <div className="progress-fill" style={{ width: '45%', background: 'linear-gradient(90deg, var(--success), var(--warning))' }}></div>
            </div>
            <p className="text-dim" style={{ fontSize: '13px' }}>Your heart rate variability is stable. Consider a short walk.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SleepHealth;
