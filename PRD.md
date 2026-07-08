# Product Requirement Document (PRD)

## 📌 Informasi Dokumen
- **Nama Proyek:** RESQ-BOX Web Platform (ResqueBlock)
- **Versi:** 2.0 (Fokus Edukasi Mitigasi & Design Thinking)
- **Nama Tim:** RESQ-TEAM
- **Target Kompetisi:** Divisi Inovasi Pembelajaran Digital Pendidikan - LIDM 2026

---

## 1. Tujuan Produk (Product Purpose)
Mengubah paradigma platform *visual block programming* dari alat penunjang *computer science* murni menjadi media simulasi logika interaktif yang berfokus pada pemecahan masalah kebencanaan (*design thinking*) bagi siswa SMP. Platform menyembunyikan kompleksitas sintaks koding dan komponen perangkat keras, memaksa fokus siswa tertuju pada runtutan aksi penyelamatan diri dan manajemen risiko bencana geologis (Gempa Bumi & Erupsi Gunung Berapi).

## 2. Pengguna Utama (Target Audience)
* **Siswa Sekolah Menengah Pertama (SMP)** di kawasan rawan bencana (khususnya wilayah KRB Merapi).
* **Guru Mata Pelajaran IPA/Geografi** yang membutuhkan media pembelajaran mitigasi bencana berbasis *experiential learning*.

---

## 3. Fitur Utama & Perubahan Ruang Lingkup (Scope Changes)

### A. Penyederhanaan Kode & Simulasi Virtual (Hapus Elemen "Ngoding")
* **`Show Code` Button [REMOVED]:** Fitur untuk melihat translasi visual block ke kode C++ Arduino ditiadakan secara permanen dari Workspace Editor.
* **Integrasi `Wokwi` [REMOVED]:** Tombol ekspor simulasi sirkuit ke Wokwi dihapus. Sebagai gantinya, hasil program akan diintegrasikan langsung ke perangkat fisik koper jinjing RESQ-BOX via koneksi serial USB.

### B. Workspace Refactoring (Framing Mitigasi Bencana)
* **Kontekstualisasi Blok:** Mengubah penamaan fungsi blok agar dekat dengan materi mitigasi bencana:
  * Blok perintah output `LED Merah Nyala` $\rightarrow$ `Aktifkan Lampu Jalur Bahaya (Merah)`.
  * Blok perintah `Buzzer Bunyi` $\rightarrow$ `Bunyikan Sirine Peringatan Dini`.
* **Penyederhanaan Input Sensor:** Mengubah panel simulasi sensor (Slider Analog 0 - 1023) ke unit pengukuran bencana yang kontekstual:
  * Sensor Getaran: Skala MMI (*Modified Mercalli Intensity*) atau Magnitudo Gempa.
  * Sensor Humidifier/Asap: Status Ketebalan Solfatara/Awan Panas (Normal/Waspada/Awas).

### C. Alur Pembelajaran (Mission Center)
* **Mode Belajar Terpadu:** Membagi modul menjadi misi penugasan berbasis skenario:
  * *Skenario A:* Sistem Peringatan Dini Gempa Bumi.
  * *Skenario B:* Sistem Evakuasi Mandiri Erupsi Merapi.
* **Mission Guide Panel:** Panel panduan di sisi kiri dipertahankan untuk memberikan instruksi kontekstual berbasis studi kasus wilayah lokal (Kawasan Pakem/Sleman).

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **Kinerja:** Proses *upload* logika dari web ke hardware via Web Serial API harus memiliki *delay* kurang dari 3 detik.
* **Aksesibilitas:** Antarmuka web harus intuitif untuk anak usia 12-15 tahun (Siswa SMP) tanpa perlu memahami dasar-dasar teknik elektro.
* **Keandalan:** Platform web dapat berjalan secara *offline* (Offline Ready) untuk mengantisipasi keterbatasan jaringan internet di laboratorium sekolah daerah rawan bencana.