# 📝 RESQ-BOX Update Log

Catatan perjalanan pengembangan aplikasi web RESQ-BOX.

---

## [2026-05-16] Fase Perencanaan & Brainstorming
- **Nama Proyek:** Fix menggunakan nama `RESQ-BOX`.
- **Arsitektur Halaman:** Beralih ke model *Multi Sub-page*. 
  - Akan ada **Dashboard** untuk melihat daftar proyek (draft lokal) dan daftar misi.
  - Memilih sebuah misi atau membuat proyek baru akan membuka **Workspace** baru (berisi Block Editor & Simulator).
- **Simulator Engine:** Fix 100% menggunakan *Custom JS Behavioral Engine* untuk simulasi rangkaian secara *real-time* ala Wokwi.
- **Penyimpanan:** Menggunakan `Local Storage` / `IndexedDB` untuk menyimpan data canvas/workspace secara lokal di *device* pengguna.
- **Struktur Folder:** `header.md` telah diupdate untuk merefleksikan perubahan struktur halaman (`app/Dashboard` dan `app/Workspace`).

---

## [2026-05-16] Penyelesaian Phase 0: Fondasi
- Menginisialisasi proyek menggunakan Vite + React + TypeScript.
- Berhasil setup **Tailwind CSS v4** menggunakan `@tailwindcss/vite` plugin dan mendefinisikan variabel global (warna *rescue orange*, *tech blue*, dan *dark mode*).
- Membuat logo animasi burung hantu yang imut menggunakan *AI image generation*.
- Menyelesaikan struktur *Routing* dengan `react-router-dom`.
- Membuat *placeholder component* UI dasar untuk `Dashboard`, `Workspace`, `BlockEditor`, dan `Simulator`.
- Struktur siap dilanjutkan ke eksekusi Phase 1 (Integrasi Blockly).

---

## [2026-05-18] Redesign Mission Panel → Step-by-Step Guide
- **MissionPanel.tsx** dirombak total dari tampilan info statis menjadi **stepper UI bertahap**.
  - Tiap misi kini punya 5 langkah: *Kenali Misi → Ambil Komponen → Sambungkan Kabel → Tulis Kode → Jalankan & Validasi*.
  - Setiap langkah punya: judul, deskripsi ramah anak, ikon warna-warni, dan tips opsional.
  - Navigasi Prev/Next dengan progress bar visual (dot indicator + bar indicator di header).
  - Tombol **VALIDASI MISI** hanya muncul di langkah terakhir — memaksa anak mengikuti urutan.
  - Tip box kuning muncul otomatis kalau langkah ada tips.
- **missions.ts** diupdate: interface `Mission` ditambah field `steps: MissionStep[]`, dan data tiap misi (level 1–5) sudah dilengkapi langkah bertahap yang ditulis dalam bahasa ramah anak-anak.
- Desain mengikuti color system yang sudah ada (primary, secondary-container, surface tokens Tailwind).
