# Panduan Deploy Dompet Diana

Stack: **React + Vite → Supabase (database) → Vercel (hosting)**

---

## Langkah 1 — Setup Supabase

### 1.1 Buat Project
1. Buka [supabase.com](https://supabase.com) → **Start your project** → Login dengan GitHub
2. Klik **New project**
3. Isi:
   - **Name:** `dompet-diana`
   - **Database Password:** buat password kuat (simpan di tempat aman)
   - **Region:** pilih `Southeast Asia (Singapore)`
4. Klik **Create new project** → tunggu ~2 menit sampai selesai provisioning

### 1.2 Buat Tabel Transaksi
1. Di sidebar kiri klik **SQL Editor**
2. Klik **New query**
3. Paste SQL berikut lalu klik **Run (Ctrl+Enter):**

```sql
-- Buat tabel transaksi
CREATE TABLE transactions (
  id          TEXT        PRIMARY KEY,
  type        TEXT        NOT NULL CHECK (type IN ('income', 'expense')),
  amount      INTEGER     NOT NULL CHECK (amount > 0),
  category_id TEXT        NOT NULL,
  note        TEXT        DEFAULT '',
  date        DATE        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Aktifkan Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Izinkan akses publik (anon key) untuk semua operasi
CREATE POLICY "public_access" ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 1.3 Ambil Credentials
1. Di sidebar klik **Project Settings** → **API**
2. Salin:
   - **Project URL** → ini adalah `VITE_SUPABASE_URL`
   - **anon / public** (di bagian Project API keys) → ini adalah `VITE_SUPABASE_ANON_KEY`

---

## Langkah 2 — Setup Lokal

### 2.1 Buat file `.env.local`
Buat file `.env.local` di root project (sejajar dengan `package.json`):

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ganti nilainya dengan credentials dari Langkah 1.3.

### 2.2 Jalankan lokal
```bash
npm install
npm run dev
```

Buka `http://localhost:5173` — coba tambah transaksi dan verifikasi data masuk ke Supabase (cek di **Table Editor → transactions**).

---

## Langkah 3 — Deploy ke Vercel

### 3.1 Push ke GitHub
Pastikan semua perubahan sudah di-commit dan di-push ke GitHub:
```bash
git add .
git commit -m "integrate supabase"
git push
```

> **Penting:** File `.env.local` **tidak** ikut ter-push (sudah ada di `.gitignore`). Credentials aman.

### 3.2 Import Project di Vercel
1. Buka [vercel.com](https://vercel.com) → **Add New Project**
2. Klik **Import** pada repo `Dompet_Diana`
3. Framework preset otomatis terdeteksi sebagai **Vite** ✓
4. Sebelum klik Deploy, buka bagian **Environment Variables**:
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://xxxxxxxxxxxxxxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
5. Klik **Deploy** → tunggu ~1 menit
6. Vercel memberikan URL seperti `https://dompet-diana.vercel.app` ✓

### 3.3 Auto-deploy selanjutnya
Setiap kali `git push` ke branch `main`, Vercel otomatis rebuild dan deploy ulang.

---

## Ringkasan File Penting

| File | Keterangan |
|------|-----------|
| `src/supabase.js` | Inisialisasi Supabase client |
| `src/db.js` | Semua operasi database (fetch, insert, update, delete) |
| `.env.local` | Credentials lokal (tidak di-commit) |
| `.env.example` | Template — boleh di-commit, tanpa nilai asli |

---

## Tips Keamanan

- **Jangan pernah** commit `.env.local` ke GitHub
- Anon key aman dipakai di frontend (sudah dibatasi oleh RLS policy)
- Jika ingin membatasi akses hanya untuk satu user (Diana), tambahkan Supabase Auth di tahap berikutnya
