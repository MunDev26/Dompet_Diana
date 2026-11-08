# Product Requirement Document (PRD) - MVP

**Nama Produk:** Dompet Diana  
**Versi:** 1.0 (MVP)  
**Tipe:** Web App (*Mobile-First Responsive*)

---

## 1. Tujuan Produk
Menyediakan aplikasi web ringan dan sederhana yang dapat diakses dengan cepat melalui browser HP untuk membantu pengguna mencatat serta memantau pengeluaran harian tanpa fitur yang rumit.

---

## 2. Target Pengguna
Pengguna umum yang membutuhkan alat pencatat pengeluaran harian yang praktis, cepat, dan tidak memerlukan instalasi aplikasi dari App Store/Play Store.

---

## 3. Scope & Fitur Utama (MVP)

Aplikasi versi awal ini hanya berfokus pada **3 fitur inti**:

### 3.1. Pencatatan Transaksi Cepat (Quick Add)
* **Input Ringkas:**
  * Nominal (Otomatis membuka keypad angka di HP).
  * Jenis Transaksi (Pengeluaran / Pemasukan).
  * Kategori (Pilihan sederhana: *Makanan, Transportasi, Belanja, Tagihan, Lainnya*).
  * Catatan Singkat (Opsional).
  * Tanggal Transaksi (Default: Hari ini).

### 3.2. Dashboard Ringkasan Saldo & Riwayat
* **Kartu Ringkasan:** Menampilkan Total Pemasukan, Total Pengeluaran, dan Saldo Akhir bulan berjalan.
* **Daftar Transaksi (Riwayat):** Menampilkan daftar transaksi terbaru secara kronologis (diurutkan berdasarkan tanggal terbaru).
* **Aksi Hapus/Edit:** Kemampuan sederhana untuk menghapus atau mengubah catatan transaksi yang salah.

### 3.3. Akses & Tampilan Mobile-First
* Layout dioptimalkan untuk layar smartphone (tombol besar, ramah ibu jari).
* Menggunakan penyimpanan lokal/akun sederhana agar data tersimpan dengan aman.

---

## 4. Fitur yang Ditunda (Post-MVP)
Fitur-fitur berikut **tidak dimasukkan** pada versi awal agar pengembangan tetap cepat dan fokus:
* ❌ Notifikasi & Pengingat
* ❌ Laporan Grafik Kompleks / Pie Chart
* ❌ Multi-Dompet / Transfer antar bank
* ❌ Fitur Anggaran (Budgeting limit)
* ❌ Ekspor ke PDF/Excel
* ❌ OCR Pemindai Struk

---

## 5. Alur Pengguna (User Flow) MVP

```
Buka Web Dompet Diana ──> Lihat Dashboard & Saldo ──> Tekan Tombol "+" ──> Masukkan Nominal & Kategori ──> Simpan ──> Kembali ke Dashboard
```

---

## 6. Ukuran Keberhasilan (Success Metric MVP)
* Pengguna dapat menyelesaikan pencatatan transaksi dalam kurun waktu **kurang dari 5 detik**.
* Tampilan web berjalan lancar di layar HP tanpa *glitch* atau *horizontal scroll*.

---

## 7. Tech Stack (Gratis)

### 7.1. Rekomendasi Utama

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | React + Vite | Komponen UI, build cepat |
| **Styling** | Tailwind CSS | Mobile-first by default, utility class |
| **Backend & Auth** | Supabase | PostgreSQL + Auth gratis hingga 500 MB |
| **Hosting** | Vercel | Deploy otomatis dari GitHub, gratis |

### 7.2. Alasan Memilih Stack Ini
* **Supabase** — data tersimpan di server sehingga tidak hilang saat ganti HP atau bersihkan cache.
* **Vercel** — deploy hanya dengan satu perintah, terhubung langsung ke repository GitHub.
* **Tailwind CSS** — mempercepat styling mobile-first tanpa menulis CSS dari nol.
* Semua layanan memiliki **free tier** yang cukup untuk MVP hingga ratusan pengguna awal.

### 7.3. Alternatif

| Skenario | Teknologi | Catatan |
|---|---|---|
| Auth + DB alternatif | Firebase (Firestore) | Lebih mudah setup, vendor lock-in lebih kuat |
| Tanpa backend sama sekali | `localStorage` / IndexedDB | Data hanya di browser, cocok untuk prototipe awal |