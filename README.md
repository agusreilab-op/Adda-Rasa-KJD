# ADDA RASA KJD - Sistem Manajemen Inventaris & Stok (Production Ready)

Sistem Manajemen Inventaris & Pergudangan Modern untuk **ADDA RASA KJD**, dilengkapi dengan kalkulasi stok fisik real-time, pencatatan transaksi mutasi (Barang Masuk, Penjualan, Retur), integrasi 2 arah Google Spreadsheet (Google Apps Script), barcode scanner, import/export Excel (.xlsx), dan cetak laporan PDF resmi dengan tanda tangan Admin & Owner yang dapat dikustomisasi.

---

## 🌟 Fitur Utama & Modul Sistem

1. **Dashboard & Ringkasan Metrik**:
   - Total Produk (SKU) terdaftar.
   - Total Stok Fisik Real-Time (`Stok Awal + Masuk + Retur Masuk - Keluar - Retur Keluar`).
   - Total Mutasi Masuk & Mutasi Keluar.
   - Grafik Donut Distribusi Supplier & Grafik Batang Distribusi Kategori.
   - Peringatan Otomatis Produk Kritis (di bawah batas minimum stok).

2. **Master Data Produk**:
   - CRUD Produk (Kode SKU, Nama, Kategori, Satuan, Supplier, Harga, Stok Awal, Stok Minimum).
   - Filter Kategori & Filter Supplier.
   - Import Data Produk via Excel (.xlsx) dengan auto-mapping kolom & deteksi supplier baru.
   - Export Katalog Produk ke Excel (.xlsx).
   - Cetak Label Barcode / QR Code Produk.
   - Opsi Kosongkan / Reset Database Bersih.

3. **Manajemen Stok & Stock Opname**:
   - Monitoring status kesehatan stok (Aman, Menipis, Habis).
   - Penyesuaian Kuantitas Fisik (Stock Opname) langsung di tabel.
   - Tombol Sinkronisasi Mutasi Real-Time.
   - Generator Pesan Restock Darurat via WhatsApp / Email ke Vendor Supplier.

4. **Transaksi & Mutasi Barang**:
   - **Barang Masuk (IN)**: Dari supplier / vendor rekanan ke gudang.
   - **Penjualan / Barang Keluar (OUT)**: Ke konsumen / outlet / pesanan dine-in.
   - **Retur Masuk (RETUR_IN)**: Pengembalian barang dari konsumen/outlet.
   - **Retur Keluar (RETUR_OUT)**: Pengembalian barang rusak/cacat ke supplier.
   - Fitur Hapus Riwayat per transaksi atau Hapus Semua Data Transaksi sekaligus.
   - Ekspor data transaksi ke Excel & PDF.

5. **Master Mitra Supplier**:
   - Database Supplier (Kode, Nama PT/CV, PIC, No. Telepon/WhatsApp, Email, Alamat).
   - Tautan langsung WhatsApp & Email ke supplier.
   - Status Aktif / Tidak Aktif.

6. **Laporan & Export PDF / Excel**:
   - Tab Laporan Ringkasan Stok, Laporan Barang Masuk, Laporan Penjualan, dan Laporan Retur.
   - Filter rentang tanggal dan periode bulan.
   - Cetak langsung ke printer fisik (ukuran A4) & download PDF resmi dengan kop surat ADDA RASA KJD.
   - Pengaturan nama & jabatan Admin dan Owner yang dapat diedit langsung pada template.

7. **Integrasi Google Spreadsheet (2-Way Realtime Sync)**:
   - Koneksi via Google Apps Script Web App (bebas hambatan CORS, fallback multi-tier ke backend proxy).
   - Sinkronisasi otomatis saat ada mutasi data.
   - Fitur Upload ke Sheet dan Tarik Data dari Sheet kapan saja.

8. **Pengaturan Akun & Multi-Pengguna**:
   - Manajemen profil pengguna & hak akses.
   - Kredensial default: Username `admin` / Password `admin123`.

---

## 🚀 Persiapan File untuk GitHub & Deployment

Repository ini telah dilengkapi dengan seluruh file konfigurasi standar produksi:

| File | Fungsi |
| :--- | :--- |
| `.gitignore` | Mencegah file sensitif, node_modules, build cache, dan file OS ter-upload ke GitHub |
| `.env.example` | Template variabel lingkungan untuk konfigurasi API |
| `vercel.json` | Konfigurasi routing rewrite SPA untuk deploy di **Vercel** |
| `netlify.toml` | Konfigurasi otomatis build & redirect untuk deploy di **Netlify** |
| `public/_redirects` | Fallback SPA routing untuk hosting statis |
| `Dockerfile` | Multi-stage Docker build untuk deploy ke **Cloud Run**, **Railway**, **Render**, atau **VPS** |
| `.dockerignore` | Mengoptimalkan kecepatan dan ukuran image Docker |
| `.github/workflows/ci.yml` | Otomasi GitHub Actions untuk type-check & build setiap ada push/pull request |

---

## 🐙 Cara 1: Push ke GitHub via Git CLI (Terminal)

Jika Anda mendownload ZIP atau bekerja di komputer lokal:

```bash
# 1. Buka folder proyek di terminal
cd adda-rasa-kjd-inventory

# 2. Inisialisasi git (jika belum)
git init

# 3. Tambahkan semua file yang sudah siap
git add .

# 4. Buat commit pertama
git commit -m "feat: initial production release of ADDA RASA KJD Inventory System"

# 5. Ubah branch utama menjadi main
git branch -M main

# 6. Hubungkan ke repository GitHub Anda (ganti URL dengan repo Anda)
git remote add origin https://github.com/USERNAME/NAMA-REPO-ANDA.git

# 7. Push ke GitHub
git push -u origin main
```

> **Tips:** Jika repository di GitHub sudah memiliki file README atau lisensi, gunakan `git pull origin main --rebase` sebelum melakukan `git push`.

---

## 🐙 Cara 2: Export Langsung dari Google AI Studio

Anda juga dapat langsung mengekspor kode ini dari Google AI Studio:
1. Klik tombol **Settings** (ikon gerigi) di pojok kanan atas jendela AI Studio.
2. Pilih menu **Export to GitHub** atau **Download ZIP**.
3. Jika memilih **Export to GitHub**, login ke akun GitHub Anda dan pilih repository target.

---

## 🌐 Panduan Deployment

### A. Deploy ke Vercel (Paling Cepat & Gratis)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **"Add New Project"** dan pilih repository GitHub Anda.
3. Vercel akan otomatis mendeteksi konfigurasi `Vite`.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Klik **Deploy**. Dalam 1-2 menit, aplikasi Anda sudah live dengan domain HTTPS gratis!

### B. Deploy ke Netlify
1. Buka [app.netlify.com](https://app.netlify.com) dan login.
2. Klik **"Add new site"** > **"Import an existing project"** > Pilih **GitHub**.
3. Pilih repository Anda. File `netlify.toml` akan otomatis mengisi pengaturan build.
4. Klik **"Deploy site"**.

### C. Deploy Full-Stack ke Railway / Render / Cloud Run
Jika Anda ingin menjalankan backend server Node.js (`server.ts` / `dist/server.cjs`):
- **Railway / Render**: Hubungkan repo GitHub, pilih platform Node.js atau Dockerfile. Build command: `npm run build`, Start command: `npm start`.
- **Google Cloud Run**: Gunakan `Dockerfile` bawaan untuk build dan deploy container serverless langsung ke Google Cloud.

---

## 💻 Menjalankan Secara Lokal (Development)

```bash
# Install seluruh dependensi
npm install

# Jalankan server development
npm run dev
```
Akses di browser: `http://localhost:3000`

---

## 🏢 Kontak & Dukungan
**ADDA RASA KJD**  
Kompleks Alvita Blok Q Nomor 14, Kelurahan Sawah Lama, Kecamatan Ciputat, Kota Tangerang Selatan, Banten  
WhatsApp: `+62 081282585434` | Email: `addarasakjd@gmail.com`
