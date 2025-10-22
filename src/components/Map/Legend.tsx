import { QUALITY_COLORS, QUALITY_LABELS, QUALITY_DESCRIPTIONS } from '../../lib/colors';
import type { QualityCategory } from '../../types/coverage';

export function Legend() {
  const categories: QualityCategory[] = ['excellent', 'good', 'moderate', 'poor', 'very_poor', 'no_data'];

  const getColorBox = (color: string) => ({
    width: '18px',
    height: '18px',
    backgroundColor: color,
    borderRadius: '4px',
    border: '1px solid rgba(0,0,0,0.1)',
    flexShrink: 0,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  });

  return (
    <div className="leaflet-bottom leaflet-left" style={{ marginBottom: '15px', marginLeft: '15px', zIndex: 1000 }}>
      <div className="leaflet-control" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '10px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        border: '1px solid rgba(0,0,0,0.1)',
        padding: '14px',
        width: '260px'
      }}>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: '13px',
          marginBottom: '10px',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div style={{
            width: '3px',
            height: '16px',
            backgroundColor: '#2563eb',
            borderRadius: '3px'
          }}></div>
          Coverage Quality
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {categories.map((category) => (
            <div key={category} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px',
              borderRadius: '6px'
            }}>
              <div style={getColorBox(QUALITY_COLORS[category])} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#111827',
                  lineHeight: '1.3'
                }}>
                  {QUALITY_LABELS[category]}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: '#6b7280',
                  lineHeight: '1.3',
                  marginTop: '1px'
                }}>
                  {QUALITY_DESCRIPTIONS[category]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
