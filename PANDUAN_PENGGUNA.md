# 📘 BUKU PANDUAN PENGGUNA (USER MANUAL) AGROPLUS - EDISI LENGKAP

![Cover AgroPlus](https://images.unsplash.com/photo-1592982537447-6f29efcb25aa?auto=format&fit=crop&w=1200&q=80)

**Versi:** 3.0 (Mobile & Web Platform)  
**Ekosistem:** Pertanian, Peternakan, Perikanan, dan Perhutanan  
**Dikembangkan oleh:** Tim Pengembang AgroPlus Digital (TaniCare)  
**Tahun:** 2026

<div style="page-break-after: always;"></div>

## 📑 DAFTAR ISI

1. **[BAB 1: Pendahuluan & Filosofi Sistem](#bab-1-pendahuluan--filosofi-sistem)**
2. **[BAB 2: Persiapan Infrastruktur & Kebutuhan Sistem](#bab-2-persiapan-infrastruktur--kebutuhan-sistem)**
3. **[BAB 3: Modul Autentikasi & Keamanan Akses (TaniCare)](#bab-3-modul-autentikasi--keamanan-akses-tanicare)**
4. **[BAB 4: Navigasi Beranda Utama (Dashboard Terpadu)](#bab-4-navigasi-beranda-utama-dashboard-terpadu)**
5. **[BAB 5: Pusat Kendali Utama (Cyber-Farm Dashboard)](#bab-5-pusat-kendali-utama-cyber-farm-dashboard)**
6. **[BAB 6: Panduan Ekstensif AI Scanner (Dokter Tani Pintar)](#bab-6-panduan-ekstensif-ai-scanner-dokter-tani-pintar)**
7. **[BAB 7: Ekosistem TaniMarket (Jual Beli Hasil Bumi)](#bab-7-ekosistem-tanimarket-jual-beli-hasil-bumi)**
8. **[BAB 8: TaniHub (Pusat Komunitas & AI Chatbot)](#bab-8-tanihub-pusat-komunitas--ai-chatbot)**
9. **[BAB 9: Personalisasi Profil & Pengaturan Akun](#bab-9-personalisasi-profil--pengaturan-akun)**
10. **[BAB 10: Pemecahan Masalah Komprehensif (Troubleshooting)](#bab-10-pemecahan-masalah-komprehensif-troubleshooting)**

<div style="page-break-after: always;"></div>

## BAB 1: Pendahuluan & Filosofi Sistem

![Pendahuluan](https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1000&q=80)

AgroPlus (didukung oleh ekosistem **TaniCare**) hadir bukan sekadar sebagai aplikasi pencatat, melainkan sebagai sebuah **Asisten Digital Cerdas (Smart Digital Assistant)** yang memadukan kekuatan *Artificial Intelligence* (AI) dan *Internet of Things* (IoT). Pada Versi 3.0, AgroPlus telah mengimplementasikan optimasi performa tinggi (*Lazy Loading*), keamanan *Protected Routing*, serta validasi data terpusat (*Zod & React Hook Form*) untuk memberikan pengalaman pengguna yang sangat responsif dan aman.

### 1.1 Visi Multi-Sektor
Berbeda dengan aplikasi agrikultur konvensional yang hanya berfokus pada tanaman, AgroPlus dirancang dengan arsitektur **Multi-Sektor**. Platform ini mampu mengadaptasi sistemnya untuk 4 divisi utama:
1. **Pertanian (Agriculture):** Mengoptimalkan hasil panen melalui pemantauan nutrisi tanah, klorofil daun, dan kelembapan secara real-time.
2. **Peternakan (Livestock):** Mencegah wabah penyakit menular pada hewan melalui analisis visual postur dan pergerakan ternak.
3. **Perikanan (Fishery/Aquaculture):** Menjaga ekosistem tambak melalui kalkulasi kualitas air, kadar oksigen terlarut (DO), dan pH air.
4. **Perhutanan (Forestry):** Mengurangi risiko deforestasi dan kebakaran hutan melalui pemantauan satelit dan peringatan dini titik panas (hotspot).

### 1.2 Tujuan Buku Panduan
Buku panduan ini disusun secara rinci dan visual untuk memandu pengguna dari level pemula (petani tradisional yang baru beralih ke digital) hingga level mahir (manajer perkebunan skala besar) agar dapat memanfaatkan seluruh fitur AgroPlus secara maksimal.

<div style="page-break-after: always;"></div>

## BAB 2: Persiapan Infrastruktur & Kebutuhan Sistem

Agar pengalaman penggunaan platform AgroPlus berjalan mulus tanpa hambatan teknis, perangkat yang Anda gunakan harus memenuhi persyaratan berikut:

### 2.1 Persyaratan Perangkat Keras (Hardware)
- **Smartphone/Tablet:** Memiliki sistem operasi minimum Android 8.0 (Oreo) atau iOS 12. Diutamakan perangkat dengan resolusi kamera minimal 8 Megapixel (MP) untuk akurasi AI Scanner.
- **Komputer/Laptop:** Sistem operasi Windows 10/11, macOS, atau Linux dengan RAM minimum 4GB.

### 2.2 Kebutuhan Jaringan & Sensor Perangkat
- **Koneksi Internet:** Diperlukan koneksi internet stabil (minimal 3G/HSPA) untuk sinkronisasi data ke Cloud Firestore. AgroPlus memiliki mode *Offline Fallback* (penyimpanan lokal sementara), namun data tidak akan diunggah ke server hingga jaringan kembali stabil.
- **Sistem Pemosisian Global (GPS):** Pastikan fitur **Lokasi (Location Services)** selalu aktif. Tanpa GPS, sistem prediksi cuaca lokal tidak akan bisa mendeteksi area kebun Anda.
- **Kamera (Camera):** Modul pemindai kesehatan (AI Scanner) mutlak membutuhkan izin akses kamera utama. Pastikan lensa kamera Anda selalu bersih sebelum melakukan pemindaian.

<div style="page-break-after: always;"></div>

## BAB 3: Modul Autentikasi & Keamanan Akses (TaniCare)

![Autentikasi](https://images.unsplash.com/photo-1614064641913-6b05f41cb581?auto=format&fit=crop&w=1000&q=80)

AgroPlus menggunakan protokol keamanan tingkat tinggi melalui **Protected Routing** untuk memastikan data pertanian dan transaksi Anda tetap privat dan aman. Aplikasi hanya dapat diakses oleh pengguna yang telah tervalidasi.

### 3.1 Pendaftaran Akun Baru (Sign Up)
1. Buka aplikasi AgroPlus.
2. Pada layar utama, tekan tombol **"Daftar Akun Baru"**.
3. Isi data profil dengan valid:
   - **Nama Lengkap:** Gunakan nama asli (akan memengaruhi penyebutan di beranda).
   - **Email & Kata Sandi:** Pastikan email aktif karena akan digunakan untuk reset password. Kata sandi wajib terdiri dari minimal 8 karakter demi keamanan ganda (telah divalidasi sistem otomatis).
   - **Data Demografi:** (Usia, Alamat Lengkap, dan Nomor Telepon). Alamat sangat krusial jika Anda berencana menjadi penjual di TaniMarket.
4. Tekan tombol **"Daftar Sekarang"**. Sistem akan otomatis membuatkan *Avatar Adventurer* yang unik khusus untuk Anda.

### 3.2 Prosedur Masuk (Login)
1. Masukkan alamat Email dan Kata Sandi yang telah terdaftar.
2. Klik tombol **"Masuk"**. Sistem dilengkapi dengan notifikasi pintar jika Anda salah memasukkan kata sandi atau email.
3. **Fitur Auto-Login:** Anda tidak perlu login setiap kali membuka aplikasi. AgroPlus menyimpan token sesi Anda secara aman di dalam perangkat. Sesi ini hanya akan terhapus jika Anda menekan tombol "Keluar (Logout)" di menu profil.

### 3.3 Lupa Kata Sandi (Forgot Password)
Jika Anda lupa kata sandi, jangan panik. TaniCare menghadirkan alur pemulihan kata sandi yang aman dan profesional:
1. Di layar *Login*, klik tautan **"Lupa Kata Sandi?"** yang berada di bawah kolom input.
2. Masukkan alamat email terdaftar Anda pada formulir yang muncul.
3. Klik tombol **"Kirim Tautan Reset"**.
4. AgroPlus akan terhubung langsung ke layanan Firebase Authentication untuk mengirimkan email berisi tautan pemulihan (*Reset Link*).
5. Buka kotak masuk (*Inbox*) email Anda, klik tautan tersebut, dan buat kata sandi baru yang kuat. Anda juga akan menerima notifikasi berbasis perangkat saat proses reset berhasil dikirim.

<div style="page-break-after: always;"></div>

## BAB 4: Navigasi Beranda Utama (Dashboard Terpadu)

Beranda (Home) adalah pusat informasi strategis (Command Center ringkas) yang memberikan pandangan 360 derajat atas seluruh kondisi aset Anda di lapangan.

### 4.1 Sapaan Pintar & Status Keseluruhan
Bagian atas layar akan menampilkan sapaan "Halo, [Nama Anda]!". Di bawahnya, terdapat **Circular Chart (Grafik Lingkaran)** yang sangat penting:
- **Angka Persentase:** Menunjukkan nilai rata-rata dari seluruh pemindaian aset Anda. Jika Anda memiliki 3 kebun dengan nilai kesehatan 90%, 80%, dan 70%, maka nilai rata-ratanya adalah 80%.
- **Indikator LIVE:** Menunjukkan bahwa data tersebut bersumber dari pemindaian terbaru dan telah tersinkronisasi.
- **Indikator IDLE:** Muncul apabila Anda belum mendaftarkan aset apa pun atau belum pernah memindai aset tersebut menggunakan AI Scanner.

### 4.2 Stasiun Cuaca Satelit (Hyper-Local Weather)
Berkat sistem GPS, AgroPlus tidak memberikan perkiraan cuaca untuk satu provinsi, melainkan cuaca yang spesifik di radius area perkebunan/peternakan Anda.
- **Angka Utama:** Suhu udara dalam derajat Celcius (°C).
- **Lokasi:** Menampilkan nama kota/kabupaten yang sedang terdeteksi.
- **Parameter Ekstra:** Kecepatan Angin (Wind Speed), Kelembapan Udara (Humidity), Indeks Sinar UV (UV Index).

### 4.3 Navigasi Divisi Cepat (Quick Action Cards)
Empat kartu penuh warna di tengah layar memungkinkan Anda berpindah konteks divisi dengan satu klik:
1. **IoT Agrikultur:** (Warna Hijau/Emerald) Akses cepat ke panel kendali irigasi dan nutrisi tanaman.
2. **Pemantauan Ternak:** (Warna Kuning/Sun) Akses menuju data CCTV kandang dan suhu area ternak.
3. **Kualitas Air Kolam:** (Warna Biru/Sky) Rute cepat menuju kalibrasi parameter kolam (DO dan pH).
4. **Satelit Kehutanan:** (Warna Oranye) Panel untuk mendeteksi anomali suhu ekstrim.

<div style="page-break-after: always;"></div>

## BAB 5: Pusat Kendali Utama (Cyber-Farm Dashboard)

Halaman "TaniDashboard" adalah inti fungsional dari aplikasi ini. Di sinilah Anda melakukan tindakan manajemen harian, menambah proyek, dan memicu perangkat keras (hardware) di lapangan.

### 5.1 Menambah & Menghapus Proyek
Setiap kali Anda menanam bibit baru atau mendatangkan benih ternak baru, Anda wajib mendaftarkannya di sistem.
1. **Tambah Proyek Baru:**
   - Cari panel "Kelola Proyek" di sebelah kiri.
   - Klik tombol bundar berikon **(+)**.
   - Isi formulir menggunakan sistem yang kini dilindungi oleh *React Hook Form* (sehingga mencegah input error/kosong).
   - Ketik **Nama Aset**, pilih **Divisi Agrikultur**, ketik **Varietas**, dan tekan **Simpan Proyek**.
2. **Hapus Proyek:**
   - Klik ikon keranjang sampah di kartu proyek jika masa panen usai.

### 5.2 Membaca Data Sensor Node Terpadu & Sistem Otomasi Jarak Jauh
Sistem menampilkan panel *glassmorphism* untuk pembacaan sensor lapangan secara real-time (Suhu Udara, Kelembapan, Nutrisi Tanah). Di sudut panel, Anda dapat mengaktifkan **Growlight UV-C** atau **Irigasi Tetes (Drip Irrigation)** jarak jauh hanya dengan sekali sentuh.

### 5.3 Mode Visibilitas Lapangan (Field Vision)
- **Mode MAPS (Peta Satelit):** Memuat peta geospasial (citra satelit).
- **Mode CCTV:** Menghubungkan aplikasi ke sistem kamera keamanan (*IP Camera*) yang dipasang di area proyek dengan tampilan *Live Streaming*.

## BAB 6: Panduan Ekstensif AI Scanner (Dokter Tani Pintar)

Fitur revolusioner yang membenamkan algoritma *Computer Vision* untuk mendeteksi kelainan atau penyakit pada aset dari jepretan kamera.

### 6.1 Langkah Melakukan Pemindaian (Scanning)
1. **Pilih Objek:** Di menu Pusat Kendali, klik salah satu proyek dari daftar "Kelola Proyek".
2. **Aktivasi Lensa:** Tekan tombol **"Aktifkan Kamera"** di area *Cyber Scanner*.
3. **Penyelarasan Subjek:** Arahkan kamera tepat kepada objek uji (daun, hewan, air kolam).
4. **Mulai Pindai:** Tekan tombol **"Pindai [Nama Proyek]"** dan jaga agar perangkat tetap stabil.

### 6.2 Sistem Proteksi / Validasi Objek (AI Rejection)
AI AgroPlus sangat cerdas. Ia akan **menolak (Reject)** dan tidak mengeluarkan hasil diagnosa palsu apabila mendeteksi kehadiran wajah manusia, kekurangan unsur warna hijau (untuk tanaman), atau ketidaksesuaian divisi objek dengan bidikan kamera.

### 6.3 Membaca Hasil Diagnosa AI
Sistem akan memberikan *Judul Diagnosa*, *Skor Kesehatan (Health Score)*, dan *Rekomendasi / Deskripsi* penanganan awal yang disimpan langsung di riwayat kesehatan proyek Anda.

## BAB 7: Ekosistem TaniMarket (Jual Beli Hasil Bumi)

AgroPlus mengintegrasikan sistem perdagangan *peer-to-peer* (petani ke pembeli/petani lain) melalui TaniMarket dengan pengkategorian cerdas.

### 7.1 Menjelajahi Produk & Visualisasi Asal Produk
TaniMarket kini hadir dengan visualisasi baru yang memudahkan pembeli untuk mengenali asal usul barang.
1. Buka menu **TaniMarket** dari navigasi utama.
2. Jelajahi etalase berdasarkan kategori (Bibit, Alat Pertanian, Hasil Panen, Nutrisi Hewan).
3. **Visualisasi Hasil Panen Pengguna vs Pasar Umum:**
   - Aplikasi kini memberikan indikator atau label khusus pada produk yang merupakan *hasil panen langsung (user-uploaded harvests)* yang diunggah oleh petani di dalam jaringan AgroPlus.
   - Hal ini memudahkan pembeli (end-user atau restoran) untuk membeli produk segar langsung dari tangan pertama yang terjamin riwayat perawatannya.

### 7.2 Menjadi Penjual
Anda bisa menjual kelebihan hasil panen dengan memajangnya di TaniMarket. Sistem akan menandai produk Anda secara eksklusif agar mudah ditemukan pembeli. Pastikan profil dan alamat Anda sudah diperbarui di sistem.

## BAB 8: TaniHub (Pusat Komunitas & AI Chatbot)

### 8.1 Konsultasi dengan AI Chatbot (Virtual Agronomist)
Chatbot AgroPlus adalah *Large Language Model* yang dilatih khusus dengan literatur kedokteran hewan, ilmu tanah, dan patologi tanaman.
- Masuk ke menu **TaniHub**, pilih tab **"Tanya AI"**.
- Bertanyalah dengan spesifik (umur tanaman, cuaca, gejala visual) agar AI dapat memberikan rekomendasi tindakan darurat hingga rekomendasi obat.

### 8.2 Forum Komunitas Petani/Peternak
Bagikan kesuksesan panen, tanyakan masalah lapangan di utas (*thread*), dan perluas *networking* dengan pengepul besar maupun pakar lapangan.

## BAB 9: Personalisasi Profil & Pengaturan Akun

### 9.1 Mengubah Data Diri & Logout
1. Klik Ikon Pengguna (Avatar) di sudut layar.
2. Ubah data demografi, lokasi, maupun nomor handphone.
3. **Keluar Akun (Logout):** Tombol logout telah dioptimalkan untuk membersihkan seluruh sisa riwayat sesi di penyimpanan lokal secara total guna menjamin keamanan privasi.

### 9.2 Sistem Avatar Dinamis (The Adventurer)
AgroPlus mengintegrasikan mesin *Procedural Generation* yang menciptakan karakter kartun bergaya "Adventurer" (Penjelajah Alam) yang digambar secara unik (sesuai seed nama/usia Anda) tanpa perlu unggah KTP/Foto asli.

## BAB 10: Pemecahan Masalah Komprehensif (Troubleshooting)

AgroPlus versi terbaru dilengkapi **Sistem Penanganan Eror Terpusat (Centralized Error Handling)** yang akan memberi notifikasi jelas setiap terjadi masalah. Berikut adalah solusi kendala umum:

### A. Kendala Kamera & Sensor AI Scanner
**Masalah:** Saat menekan tombol "Aktifkan Kamera", kamera tidak terbuka, layar tetap gelap, atau muncul error peringatan.
**Solusi:** Di Google Chrome, klik ikon Gembok (*Lock Icon*) pada URL, pilih *Site Settings*, dan ubah *Camera* menjadi **"Allow" (Izinkan)**.

### B. Kendala Lokasi & Cuaca (Selalu Menampilkan "Indonesia")
**Masalah:** Cuaca selalu menampilkan "Indonesia" dengan koordinat ibu kota, bukan lokasi aktual kebun Anda.
**Solusi:** Pastikan fitur **Location (Lokasi)** di perangkat Anda menyala, lalu *Refresh* browser dan tekan **Allow** saat web meminta izin lokasi.

### C. Masalah Tampilan "Cut-off" atau Layout Berantakan
**Masalah:** Tampilan tombol tertutup atau *dropdown* tidak terlihat jelas.
**Solusi:** AgroPlus telah memperbaiki visibilitas *dropdown*, namun jika *layout* masih berantakan, kembalikan ukuran Font Sistem HP Anda ke **"Standar/Default"**.

### D. Tidak Menerima Email Lupa Kata Sandi
**Masalah:** Anda meminta reset *password* tapi email tidak masuk.
**Solusi:** 
- Pastikan alamat email yang dimasukkan benar.
- Cek folder **Spam** atau **Junk** pada aplikasi email Anda.
- Pastikan koneksi internet stabil saat menekan tombol kirim.

### E. Data Proyek Tidak Terupdate atau Hilang Sementara
**Masalah:** Setelah mengisi data, proyek kembali kosong saat dimuat ulang.
**Solusi:** Gunakan fitur *Pull-to-refresh* di Dashboard untuk sinkronisasi paksa dengan Firebase *Cloud Storage*.

---

**Butuh Bantuan Lebih Lanjut?**
Silakan gunakan fitur Chatbot pada **TaniHub** untuk bantuan teknis aplikasi 24/7 secara otomatis, atau hubungi pusat bantuan AgroPlus (TaniCare) di support@agroplus.id.

*(Dokumen ini merupakan properti resmi dari AgroPlus Ecosystem (TaniCare). Dilarang menggandakan tanpa izin tertulis dari pihak pengembang. Versi 3.0)*
