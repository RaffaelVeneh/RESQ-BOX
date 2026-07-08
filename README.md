# RESQ-BOX Web Ecosystem (ResqueBlock)

Platform pembelajaran mitigasi bencana interaktif berbasis *Visual Block Programming* yang dirancang khusus untuk memenuhi kebutuhan Divisi Inovasi Pembelajaran Digital Pendidikan pada ajang LIDM 2026.

Ekosistem web ini berfungsi sebagai ruang rancang bangun logika (*logical simulation hub*) bagi siswa untuk menyusun instruksi sistem kesiapsiagaan bencana, yang kemudian diintegrasikan secara langsung ke perangkat keras simulator **RESQ-BOX**.

## 🌟 Fitur Utama (Fokus Pembelajaran Mitigasi)

- **Pedagogi Berbasis Design Thinking:** Platform didesain agar siswa fokus menguji logika penanganan bencana alam (Gempa & Erupsi), bukan menghafal sintaksis pemrograman.
- **Contextual Block Editor:** Kategori blok pemrograman yang telah dikonstruksi ulang menggunakan terminologi kebencanaan (Sistem Peringatan Dini, Jalur Evakuasi, Pantauan Sensor Alam).
- **Mission Center & Skenario Kasus:** Panduan langkah-demi-langkah berbasis skenario riil bencana geologis lereng Gunung Merapi.
- **Hardware Integration Node:** Mengirimkan konfigurasi logika logika yang disusun di web secara langsung ke mikrokontroler ESP32 pada koper simulator melalui koneksi USB Web Serial API.

## 🛠️ Arsitektur Teknologi

Aplikasi web ini dibangun menggunakan ekosistem *full-stack* modern:
- **Frontend Framework:** React.js dengan Tailwind CSS (Antarmuka Responsif & Grid System)
- **Block Engine:** Custom Blockly Core (Dimodifikasi khusus untuk menyembunyikan fungsionalitas *raw coding*)
- **Backend Service:** Laravel (Manajemen Progres Siswa, Misi, dan Sinkronisasi Data)

## 🚀 Perubahan Paradigma dari Versi 1.0 (Refactoring)

Untuk menjaga fokus substansi pada materi mitigasi bencana bagi siswa SMP, beberapa fitur teknis telah dipangkas:
1. **Penyembunyian Kode Teks (`Show Code` Dihapus):** Siswa tidak lagi diorientasikan untuk melihat baris kode C++/Arduino.
2. **Peniadaan Emulator Pihak Ketiga (`Wokwi` Dihapus):** Alur kerja dialihkan dari simulasi sirkuit virtual langsung menuju aksi nyata pada perangkat keras koper terintegrasi.
3. **Abstraksi Data Sensor:** Input simulasi slider tidak lagi menggunakan nilai analog mentah `0-1023`, melainkan tingkatan status kebencanaan konvensional (Aman, Waspada, Siaga, Awas).

## 📦 Cara Menjalankan Project (Local Development)

### Prasyarat
- Node.js (Versi 18 atau yang lebih baru)
- PHP (Versi 8.1 atau yang lebih baru) & Composer

### Langkah Instalasi

1. **Clone Repositori:**
   ```bash
   git clone [https://github.com/username/resq-box-web.git](https://github.com/username/resq-box-web.git)
   cd resq-box-web