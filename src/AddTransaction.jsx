import { useState } from 'react'
import { CATEGORIES } from './constants'
import { fmt, todayStr } from './utils'

const P = '#d6336c'
const P2 = '#e8699a'

const KEYS = ['7','8','9','4','5','6','1','2','3','000','0','⌫']

export default function AddTransaction({ onBack, onSave, initialData }) {
  const isEdit = !!initialData

  const [type,       setType]       = useState(initialData?.type       || 'expense')
  const [rawAmount,  setRawAmount]  = useState(initialData ? String(initialData.amount) : '')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [note,       setNote]       = useState(initialData?.note       || '')
  const [date,       setDate]       = useState(initialData?.date       || todayStr())

  function handleKey(k) {
    if (k === '⌫') {
      setRawAmount(p => p.slice(0, -1))
      return
    }
    if (k === '000') {
      setRawAmount(p => p.length === 0 ? p : (p.length <= 9 ? p + '000' : p))
      return
    }
    if (rawAmount === '0') { setRawAmount(k); return }
    if (rawAmount.length < 12) setRawAmount(p => p + k)
  }

  function handleSave() {
    const amount = parseInt(rawAmount, 10)
    if (!amount || amount <= 0 || !categoryId) return
    onSave({ type, amount, categoryId, note: note.trim(), date })
  }

  const amount   = parseInt(rawAmount, 10) || 0
  const isValid  = amount > 0 && categoryId
  const displayAmt = amount ? fmt(amount) : '0'
  const fontSize = rawAmount.length > 9 ? 26 : rawAmount.length > 6 ? 32 : 38

  return (
    <div className="app-shell" style={{ background: '#fff' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${P} 0%, ${P2} 100%)`, padding: '16px 20px 18px', color: '#fff', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 34, height: 34, background: 'rgba(255,255,255,.22)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>{isEdit ? 'Edit Transaksi' : 'Catat Transaksi'}</span>
      </div>

      {/* Scrollable form area */}
      <div className="scroll-area" style={{ background: '#fff' }}>
        {/* Type toggle */}
        <div style={{ display: 'flex', background: '#fff0f6', borderRadius: 12, padding: 4, margin: '18px 20px 0' }}>
          <Toggle active={type === 'expense'} color="#e64c4c" onClick={() => setType('expense')}>⬇️ Pengeluaran</Toggle>
          <Toggle active={type === 'income'}  color="#1aab6d" onClick={() => setType('income')}>⬆️ Pemasukan</Toggle>
        </div>

        {/* Amount display */}
        <div style={{ padding: '20px 20px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#8a5568', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Nominal</div>
          <div style={{ fontSize, fontWeight: 700, color: '#222', letterSpacing: -1, lineHeight: 1.1 }}>
            <span style={{ fontSize: fontSize * 0.56, color: '#999', fontWeight: 600 }}>Rp </span>
            {displayAmt}
            <span className="amount-cursor" />
          </div>
        </div>

        <div style={{ padding: '0 20px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Category */}
          <div>
            <Label>Kategori</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '8px 4px', borderRadius: 10,
                    border: `1.5px solid ${categoryId === cat.id ? P : '#f0a8c4'}`,
                    background: categoryId === cat.id ? P : '#fff5f9',
                    cursor: 'pointer', fontSize: 10,
                    color: categoryId === cat.id ? '#fff' : '#6b3a4f',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <Label>Catatan <span style={{ color: '#ccc', fontSize: 10, fontWeight: 400 }}>(opsional)</span></Label>
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Contoh: makan siang warteg..."
              style={{ width: '100%', border: '1.5px solid #f0a8c4', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#333', background: '#fff5f9', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* Date */}
          <div>
            <Label>Tanggal</Label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #f0a8c4', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#333', background: '#fff5f9', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Save button */}
        <div style={{ padding: '0 20px 12px' }}>
          <button
            onClick={handleSave}
            disabled={!isValid}
            style={{
              width: '100%', background: isValid ? `linear-gradient(135deg, ${P}, ${P2})` : '#f0a8c4',
              color: '#fff', border: 'none', borderRadius: 14, padding: '15px 0', fontSize: 15,
              fontWeight: 700, cursor: isValid ? 'pointer' : 'not-allowed',
              boxShadow: isValid ? '0 6px 20px rgba(214,51,108,.35)' : 'none',
            }}
          >
            ✓ &nbsp; {isEdit ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
          </button>
        </div>
      </div>

      {/* Keypad — always visible at bottom */}
      <div style={{ background: '#fef0f5', borderTop: '1px solid #f0a8c4', padding: '8px 16px 10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, flexShrink: 0 }}>
        {KEYS.map(k => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            style={{
              background: k === '⌫' ? '#fff0f0' : '#fff',
              border: '1px solid #f0a8c4',
              borderRadius: 10,
              padding: '13px 8px',
              fontSize: k === '⌫' ? 15 : k === '000' ? 15 : 18,
              fontWeight: 600,
              color: k === '⌫' ? '#e64c4c' : '#333',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,.05)',
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}

function Toggle({ active, color, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ flex: 1, padding: '10px 8px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: active ? '#fff' : 'transparent', color: active ? color : '#888', boxShadow: active ? '0 2px 10px rgba(0,0,0,.08)' : 'none', transition: 'all .15s' }}
    >
      {children}
    </button>
  )
}

function Label({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#8a5568', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </div>
  )
}
