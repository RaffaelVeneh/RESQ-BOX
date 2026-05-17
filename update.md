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
