import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, LabelList, PieChart, Pie
} from 'recharts';
import { Activity, Clock, FileText } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useUser } from '../context/UserContext';

const usageData = [
  { name: 'Mon', screen: 4.5, productivity: 6 },
  { name: 'Tue', screen: 5.2, productivity: 5 },
  { name: 'Wed', screen: 3.8, productivity: 7.5 },
  { name: 'Thu', screen: 6.1, productivity: 4 },
  { name: 'Fri', screen: 4.2, productivity: 6.5 },
  { name: 'Sat', screen: 2.5, productivity: 8 },
  { name: 'Sun', screen: 3.1, productivity: 7 },
];

// Default App Distribution (without WhatsApp by default)
const baseAppUsage = [
  { name: 'Deep Work (Focus)', value: 50, color: '#00C2CB' },
  { name: 'Instagram', value: 30, color: '#E1306C' },
  { name: 'X', value: 20, color: '#ffffff' },
];

// Palette for manual entry bars
const BAR_COLORS = [
  '#6366f1', '#22d3ee', '#a855f7', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#14b8a6',
  '#f97316', '#84cc16',
];

// Custom tooltip for the manual bar chart
const ManualTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const mins = payload[0].value;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return (
      <div style={{
        background: 'rgba(15,15,20,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px 16px',
        color: '#fff',
        fontSize: '13px',
      }}>
        <p style={{ margin: 0, fontWeight: 700 }}>{label}</p>
        <p style={{ margin: '4px 0 0', color: '#6366f1' }}>
          {h > 0 ? `${h}h ` : ''}{m}m
        </p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { manualEntries } = useUser();
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('aura_analytics_notes') || '';
  });

  useEffect(() => {
    localStorage.setItem('aura_analytics_notes', notes);
  }, [notes]);

  // Check if user has manually entered WhatsApp
  const hasWhatsApp = manualEntries.some(
    e => e.website && e.website.toLowerCase().includes('whatsapp')
  );

  const appUsage = hasWhatsApp
    ? [
        { name: 'Deep Work (Focus)', value: 40, color: '#00C2CB' },
        { name: 'Instagram', value: 25, color: '#E1306C' },
        { name: 'WhatsApp', value: 20, color: '#25D366' },
        { name: 'X', value: 15, color: '#ffffff' },
      ]
    : baseAppUsage;

  // Build bar chart data from manual entries
  const barData = manualEntries.map((entry, i) => ({
    name: entry.website,
    minutes: entry.minutes,
    fill: BAR_COLORS[i % BAR_COLORS.length],
  }));

  // Build dynamic pie chart data based on manual entries, or fallback to default app usage if empty
  const pieData = manualEntries.length > 0
    ? manualEntries.map((entry, i) => ({
        name: entry.website,
        value: entry.minutes,
        fill: BAR_COLORS[i % BAR_COLORS.length],
      }))
    : appUsage.map(app => ({
        name: app.name,
        value: app.value,
        fill: app.color,
      }));

  const totalManual = manualEntries.reduce((s, e) => s + e.minutes, 0);
  const totalH = Math.floor(totalManual / 60);
  const totalM = totalManual % 60;

  return (
    <div className="analytics-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 className="text-gradient">Digital Wellness Analytics</h1>
        <p className="text-muted" style={{ fontStyle: 'italic' }}>Deep dive into your digital habits and productivity trends.</p>
      </header>

      {/* ── Manual Screen Time Bar Chart ── */}
      <GlassCard
        title="Manual Screen Time Log"
        subtitle={
          manualEntries.length > 0
            ? `Total logged: ${totalH > 0 ? `${totalH}h ` : ''}${totalM}m across ${manualEntries.length} app${manualEntries.length !== 1 ? 's' : ''}`
            : 'Log screen time from the Dashboard to see your data here'
        }
      >
        {manualEntries.length === 0 ? (
          <div style={{
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: 'var(--text-muted, #64748b)',
          }}>
            <Clock size={36} style={{ opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: '14px' }}>
              No data yet — click "Log Screen Time" on the Dashboard to add entries.
            </p>
          </div>
        ) : (
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={v => v >= 60 ? `${Math.floor(v/60)}h` : `${v}m`}
                />
                <Tooltip content={<ManualTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="minutes"
                    position="top"
                    formatter={v => v >= 60 ? `${Math.floor(v/60)}h${v%60 ? `${v%60}m` : ''}` : `${v}m`}
                    style={{ fill: 'var(--text-muted, #64748b)', fontSize: 11 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend */}
        {manualEntries.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {barData.map((entry, i) => {
              const h = Math.floor(entry.minutes / 60);
              const m = entry.minutes % 60;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '3px', background: entry.fill, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main, #fff)', fontWeight: 600 }}>{entry.name}</span>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>
                    {h > 0 ? `${h}h ` : ''}{m}m
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* ── Existing charts ── */}
      <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <GlassCard title="NOTES" subtitle="Your personal notebook & reminders">
          <div style={{ height: 350 }}>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Write down your focus goals, reminders, or general wellness notes here..."
              style={{
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                transition: 'border-color 0.2s',
                lineHeight: '1.6',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
        </GlassCard>

        <GlassCard title="App Distribution" subtitle="Percentage share of screen time">
          <div style={{ height: 350, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15,15,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    formatter={(value) => `${value}m`}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', maxHeight: '100px', overflowY: 'auto' }}>
              {pieData.map((app, i) => {
                const totalMinutes = pieData.reduce((s, e) => s + e.value, 0);
                const percent = totalMinutes > 0 ? Math.round((app.value / totalMinutes) * 100) : 0;
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '2px', background: app.fill }}></div>
                      {app.name}
                    </span>
                    <span style={{ fontWeight: 600 }}>{percent}% ({app.value}m)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
