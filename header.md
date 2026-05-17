
## 🧱 Tech Stack

### Frontend Core
| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **React + TypeScript** | Ecosystem terbaik, type-safe |
| Build Tool | **Vite** | Cepat, PWA-ready |
| Styling | **Tailwind CSS** | Rapid UI development |
| State | **Zustand** | Lightweight, cocok untuk app kompleks |

### Block Editor
| | |
|---|---|
| Engine | **Google Blockly** | Open source, proven, bisa custom block + generate kode apapun |
| Code Generator | **Custom Arduino C Generator** | Kita tulis di atas Blockly |

### Simulator (ini yang menarik)
| Layer | Pilihan | Alasan |
|---|---|---|
| Canvas | **React Flow** | Menggantikan Konva untuk kemudahan merender komponen DOM secara native. Handling drag, zoom, wire routing dengan mudah. |
| Komponen visual | **@wokwi/elements** | Library open-source resmi Wokwi untuk visual komponen Arduino — di-render secara native di DOM React Flow. |
| Simulation Engine | **Custom JS Behavioral Interpreter** | Bukan SPICE, tapi interpretasi logic block secara real-time (digital HIGH/LOW, analog 0-1023) |
| Upgrade path | **avr8js** | Library open-source (juga dari Wokwi creator) — AVR emulator in JS, bisa run compiled Arduino code. Opsi fase lanjut. |

> **Kenapa bukan SPICE?** Karena target kita adalah sensor digital + komponen sederhana (LED, buzzer, servo, sensor air/getar). Behavioral simulation sudah lebih dari cukup dan 100x lebih feasible.

### PWA & Offline
- **Vite PWA Plugin** + Service Worker
- Semua assets di-cache → offline ready
- Simulasi tetap jalan offline karena engine-nya pure JS
- **Local Storage / IndexedDB** untuk menyimpan draft *workspace* (Multi sub-page / project)

---

## 📁 Struktur Project

```
RESQ-BOX/
├── src/
│   ├── app/
│   │   ├── Dashboard/              ← Halaman utama (List Draft Local & Misi)
│   │   └── Workspace/              ← Halaman Editor
│   │       ├── BlockEditor/        ← Tab coding (Blockly)
│   │       └── Simulator/          ← Tab rangkaian Arduino
│   │
│   ├── engine/
│   │   ├── interpreter/            ← JS interpreter untuk jalankan logika block
│   │   ├── components/             ← Model behavior tiap komponen (LED, buzzer, dll)
│   │   └── codegen/                ← Generator kode Arduino C dari Blockly
│   │
│   ├── simulator/
│   │   ├── canvas/                 ← React Flow canvas setup
│   │   ├── components/             ← Wrapper @wokwi/elements
│   │   ├── wiring/                 ← Logika routing wire antar komponen
│   │   └── store/                  ← State simulasi & manajemen workspace (multi-page)
│   │
│   ├── missions/
│   │   ├── data/                   ← JSON definisi misi per level
│   │   └── engine/                 ← Logic evaluasi misi & trigger pembuatan workspace baru
│   │
│   ├── components/ui/              ← Shared UI components
│   └── assets/
│
├── public/
├── vite.config.ts
└── package.json
```

---

## 🗺️ Phase Roadmap

### Phase 0 — Fondasi `(1 minggu)`
- Setup project (Vite + React + TS + Tailwind)
- Design system: warna, font, komponen UI dasar (sesuai branding SIGAP BOX)
- Layout tab utama (Block Editor / Simulator / Mission)
- Routing antar tab

---

### Phase 1 — Block Editor `(2-3 minggu)`
- Integrasi Google Blockly ke React
- Buat **custom block library** khusus Arduino:
  - `digitalWrite`, `analogRead`, `delay`
  - Block sensor (air, getar, suhu)
  - Block output (LED, buzzer, servo)
- Tulis **Arduino C code generator** custom di atas Blockly
- Fitur export `.ino` file
- Preview kode C secara live di samping canvas block

---

### Phase 2 — Simulator `(4-5 minggu)` ← fase terbesar
**2a — Circuit Canvas**
- Setup React Flow canvas
- Drag-drop komponen dari panel ke canvas
- Komponen library awal:
  - Arduino Uno board
  - LED, Resistor
  - Buzzer, Servo
  - Water sensor, Vibration sensor
  - LCD mini, Button

**2b — Wiring System**
- Klik pin → tarik wire → sambung ke pin lain
- Auto-routing wire sederhana
- Validasi koneksi (pin yang salah → warning)

**2c — Simulation Engine**
- JS interpreter: baca program dari Blockly → jalankan step-by-step
- Pin state manager: track HIGH/LOW tiap pin Arduino
- Komponen bereaksi ke pin state:
  - LED → nyala/mati berdasarkan pin
  - Buzzer → animasi + suara Web Audio API
  - Sensor → bisa di-inject nilai manual (slider untuk simulasi trigger)
- Play / Pause / Step / Reset controls

---

### Phase 3 — Mission System `(2-3 minggu)`
- Struktur data misi (JSON-based, mudah di-extend):
```json
{
  "id": "mission_01",
  "title": "Nyalakan Alarm Gempa",
  "level": 1,
  "objective": "Buat buzzer berbunyi saat sensor getar terpicu",
  "required_components": ["arduino", "vibration_sensor", "buzzer"],
  "validation": { "pin_9": "HIGH", "trigger": "sensor_vibration" }
}
```
- UI quest: level map, progress bar, badge system
- Auto-validation: cek apakah rangkaian & kode siswa memenuhi objective
- 5 misi starter (sesuai konteks bencana Indonesia)

---

### Phase 4 — PWA + Polish `(1-2 minggu)`
- Vite PWA plugin, Service Worker, offline cache
- Performance audit
- Responsive untuk tablet (target device sekolah)
- Onboarding / tutorial singkat untuk siswa baru

---

### Phase 5 — Admin Panel `(2 minggu)`
- Login guru (simple auth)
- Dashboard: lihat progress siswa per misi
- Bisa assign misi ke kelas
- Export laporan

---

## ⏱️ Total Estimasi

| Phase | Durasi |
|---|---|
| Phase 0 — Fondasi | 1 minggu |
| Phase 1 — Block Editor | 3 minggu |
| Phase 2 — Simulator | 5 minggu |
| Phase 3 — Mission | 3 minggu |
| Phase 4 — PWA + Polish | 2 minggu |
| Phase 5 — Admin | 2 minggu |
| **Total** | **~16 minggu** |

> MVP yang demo-able (Phase 0–3) bisa dicapai dalam **~11 minggu** — cukup kuat untuk pitching LIDM.

---

## 🚨 Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Wiring system kompleks | Mulai dengan koneksi snap-to-pin, bukan free-draw |
| Simulation tidak akurat | Scope ke komponen terbatas dulu, tambah bertahap |
| Blockly learning curve | Ada dokumentasi lengkap + komunitas besar |
| Scope creep | Freeze fitur di Phase 2, polish dulu sebelum tambah baru |

---


