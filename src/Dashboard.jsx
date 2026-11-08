import { CATEGORIES, MONTHS_ID } from './constants'
import { fmt, fmtDateGroup, groupByDate } from './utils'

const P = '#d6336c'
const P2 = '#e8699a'
const PD = '#b8234f'

export default function Dashboard({
  txs, summary, month, onMonthChange,
  onAdd, onEdit, delId, onDelReq, onDelConfirm, onDelCancel,
}) {
  const groups = groupByDate(txs)
  const { income, expense, balance } = summary

  function prevMonth() {
    onMonthChange(({ y, m }) => m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 })
  }
  function nextMonth() {
    onMonthChange(({ y, m }) => m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 })
  }

  return (
    <div className="app-shell">
      {/* ── Scrollable area ── */}
      <div className="scroll-area">
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${P} 0%, ${P2} 100%)`, padding: '16px 20px 36px', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 700 }}>🤍 Dompet Diana</span>
            <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,.22)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
            <NavBtn onClick={prevMonth}>‹</NavBtn>
            <span>{MONTHS_ID[month.m]} {month.y}</span>
            <NavBtn onClick={nextMonth}>›</NavBtn>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'flex', gap: 10, padding: '0 16px', marginTop: -28, position: 'relative', zIndex: 2 }}>
          <Card label="Pemasukan"   emoji="⬆️" value={`Rp ${fmt(income)}`}                              color="#1aab6d" />
          <Card label="Saldo"       emoji="💰" value={`${balance < 0 ? '−' : ''}Rp ${fmt(balance)}`}   color={balance >= 0 ? PD : '#e64c4c'} border />
          <Card label="Pengeluaran" emoji="⬇️" value={`Rp ${fmt(expense)}`}                             color="#e64c4c" />
        </div>

        {/* Section header */}
        <div style={{ padding: '20px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>Transaksi Terbaru</span>
          <span style={{ fontSize: 11, color: PD, fontWeight: 600 }}>Bulan ini</span>
        </div>

        {/* Transaction list */}
        <div style={{ padding: '0 16px 100px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {groups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#ccc' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🌸</div>
              <div style={{ fontSize: 14 }}>Belum ada transaksi bulan ini.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Tekan tombol + untuk mulai mencatat.</div>
            </div>
          ) : groups.map(([date, items]) => (
            <div key={date}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#a06070', letterSpacing: '.6px', textTransform: 'uppercase', margin: '10px 2px 5px' }}>
                {fmtDateGroup(date)}
              </div>
              {items.map(tx => (
                <TxItem
                  key={tx.id}
                  tx={tx}
                  isDeleting={delId === tx.id}
                  onEdit={() => onEdit(tx.id)}
                  onDelReq={() => onDelReq(tx.id)}
                  onDelConfirm={() => onDelConfirm(tx.id)}
                  onDelCancel={onDelCancel}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar (FAB + nav) ── */}
      <div className="bottom-bar">
        {/* FAB */}
        <div className="fab-wrap">
          <span style={{ fontSize: 10, fontWeight: 700, color: PD, background: '#fff', padding: '3px 8px', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,.12)', whiteSpace: 'nowrap' }}>
            Catat cepat
          </span>
          <button
            onClick={onAdd}
            style={{ width: 58, height: 58, borderRadius: 18, background: `linear-gradient(135deg, ${P}, ${P2})`, boxShadow: '0 8px 24px rgba(214,51,108,.4)', border: 'none', color: '#fff', fontSize: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
            aria-label="Tambah transaksi"
          >+</button>
        </div>

        {/* Bottom nav */}
        <div style={{ height: '100%', background: '#fff', borderTop: '1px solid #ffd6e7', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 10px 10px', boxShadow: '0 -4px 20px rgba(214,51,108,.06)' }}>
          <NavItem emoji="🏠" label="Beranda" active />
          <NavItem emoji="📋" label="Riwayat" />
          <div style={{ width: 58 }} />
          <NavItem emoji="📊" label="Laporan" />
          <NavItem emoji="⚙️" label="Setelan" />
        </div>
      </div>
    </div>
  )
}

/* ─── Sub-components ─── */

function NavBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: 'rgba(255,255,255,.22)', border: 'none', borderRadius: 7, color: '#fff', width: 26, height: 26, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
      {children}
    </button>
  )
}

function Card({ label, emoji, value, color, border }) {
  return (
    <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '12px 8px', boxShadow: '0 4px 16px rgba(214,51,108,.1)', textAlign: 'center', border: border ? '1.5px solid #ffd6e7' : 'none', minWidth: 0 }}>
      <div style={{ fontSize: 18, marginBottom: 3 }}>{emoji}</div>
      <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 10, fontWeight: 700, marginTop: 2, color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
    </div>
  )
}

function TxItem({ tx, isDeleting, onEdit, onDelReq, onDelConfirm, onDelCancel }) {
  const cat    = CATEGORIES.find(c => c.id === tx.categoryId) || CATEGORIES[11]
  const income = tx.type === 'income'

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{
        background: isDeleting ? '#fff5f5' : '#fff',
        border: isDeleting ? '2px solid #e64c4c' : 'none',
        borderRadius: 12, padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 1px 6px rgba(0,0,0,.05)',
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
          {cat.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{cat.label}</div>
          <div style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.note || '—'}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: income ? '#1aab6d' : '#e64c4c', whiteSpace: 'nowrap' }}>
            {income ? '+' : '−'}Rp {fmt(tx.amount)}
          </div>
          <div style={{ fontSize: 10, color: '#aaa' }}>
            {new Date(tx.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={onEdit} style={{ width: 28, height: 28, border: 'none', borderRadius: 8, background: '#fce8f1', color: '#b8234f', cursor: 'pointer', fontSize: 13 }} title="Edit">✏️</button>
          <button onClick={onDelReq} style={{ width: 28, height: 28, border: 'none', borderRadius: 8, background: '#fff0f0', color: '#e64c4c', cursor: 'pointer', fontSize: 13 }} title="Hapus">🗑</button>
        </div>
      </div>

      {isDeleting && (
        <div style={{ background: '#fff0f0', border: '1.5px solid #e64c4c', borderRadius: 12, padding: '14px 16px', marginTop: -4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e64c4c', marginBottom: 4 }}>🗑 Hapus transaksi ini?</div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>{cat.label} · Rp {fmt(tx.amount)}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onDelCancel} style={{ flex: 1, background: '#f0f0f0', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 12, fontWeight: 600, color: '#555', cursor: 'pointer' }}>Batal</button>
            <button onClick={onDelConfirm} style={{ flex: 1, background: '#e64c4c', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Ya, Hapus</button>
          </div>
        </div>
      )}
    </div>
  )
}

function NavItem({ emoji, label, active }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontSize: 10, color: active ? P : '#999', fontWeight: 600, cursor: 'pointer' }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <span>{label}</span>
    </div>
  )
}
