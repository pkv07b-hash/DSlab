import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Activity } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const usageData = [
  { name: 'Mon', screen: 4.5, productivity: 6 },
  { name: 'Tue', screen: 5.2, productivity: 5 },
  { name: 'Wed', screen: 3.8, productivity: 7.5 },
  { name: 'Thu', screen: 6.1, productivity: 4 },
  { name: 'Fri', screen: 4.2, productivity: 6.5 },
  { name: 'Sat', screen: 2.5, productivity: 8 },
  { name: 'Sun', screen: 3.1, productivity: 7 },
];

const appUsage = [
  { name: 'Deep Work (Focus)', value: 40, color: '#00C2CB' },
  { name: 'Instagram', value: 25, color: '#E1306C' },
  { name: 'WhatsApp', value: 20, color: '#25D366' },
  { name: 'X', value: 15, color: '#ffffff' },
];

const Analytics = () => {
  return (
    <div className="analytics-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 className="text-gradient">Digital Wellness Analytics</h1>
        <p className="text-muted">Deep dive into your digital habits and productivity trends.</p>
      </header>

      <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <GlassCard title="Productivity vs Screen Time" subtitle="Weekly overview of your digital balance">
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15,15,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="screen" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Screen Time (h)" />
                <Line type="monotone" dataKey="productivity" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Productivity (h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="App Distribution" subtitle="Where your time goes">
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appUsage}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              {appUsage.map(app => (
                <div key={app.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '2px', background: app.color }}></div>
                    {app.name}
                  </span>
                  <span>{app.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
