export interface MissionValidation {
  requiredBlocks?: string[];
  codeContains?: string[];
  ancestorConstraints?: Record<string, string>; // { childType: requiredAncestorType }
}

export interface MissionStep {
  title: string;
  description: string;
  icon: string;
  tip?: string;
}

export type MissionCategory = 'pengenalan' | 'gempa' | 'banjir' | 'gunung' | 'ujian';

export const CATEGORIES: { id: MissionCategory; title: string; icon: string; missions: number }[] = [
  { id: 'pengenalan', title: 'Perkenalan', icon: 'school', missions: 3 },
  { id: 'gempa', title: 'Gempa Bumi', icon: 'landslide', missions: 5 },
  { id: 'banjir', title: 'Banjir', icon: 'water_drop', missions: 5 },
  { id: 'gunung', title: 'Gunung Meletus', icon: 'volcano', missions: 5 },
  { id: 'ujian', title: 'Ujian', icon: 'quiz', missions: 4 },
];

export interface Mission {
  id: string;
  category: MissionCategory;
  level: number;
  title: string;
  icon: string;
  scenario: string;
  objective: string;
  hint: string;
  steps: MissionStep[];
  validation: MissionValidation;
}

const st = (title: string, description: string, icon: string, tip?: string): MissionStep => ({ title, description, icon, tip });

export const MISSIONS: Mission[] = [

  // ═══ KATEGORI 1: PERKENALAN (3 misi) ═══
  {
    id: 'pengenalan_01', category: 'pengenalan', level: 1,
    title: 'Nyalakan LED Pertama', icon: 'lightbulb',
    scenario: 'Desa Cikaret mengalami pemadaman listrik saat malam hari akibat badai. Kamu perlu membuat lampu darurat agar warga tidak panik.',
    objective: 'Buat program agar LED Merah menyala terus-menerus.',
    hint: 'Buka kategori 💡 Aksi, ambil blok "LED Merah Nyala", lalu taruh di dalam "Jalan Sekali" pada blok Program RESQ-BOX.',
    steps: [
      st('Kenali Misimu! 🌟', 'Desa Cikaret gelap gulita karena badai. Tugasmu adalah membuat lampu darurat supaya warga tidak panik!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Buka kategori 💡 Aksi di panel kiri, cari blok:\n• "LED Merah Nyala"\n\nBlok Program RESQ-BOX sudah ada di kanvas. Kamu tinggal menambahkan blok ke dalamnya!', 'inventory_2', 'Klik nama kategori di panel kiri untuk melihat semua blok yang tersedia.'),
      st('Susun Blok-nya', 'Seret blok "LED Merah Nyala" ke dalam kotak "Jalan Sekali" di blok Program RESQ-BOX.\n\nBlok "Jalan Sekali" dijalankan satu kali saat program dimulai — cocok untuk menyalakan lampu!', 'extension', 'Pastikan blok LED menempel (snap) di dalam "Jalan Sekali", bukan di luar.'),
      st('Jalankan & Validasi! 🚀', 'Klik tombol "Run" di atas untuk menjalankan program. Kalau berhasil, klik tombol "VALIDASI MISI" di bawah ini.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_program', 'resq_led'], ancestorConstraints: { 'resq_led': 'resq_program' }, codeContains: ["api.setPin('10', 'HIGH')"] },
  },
  {
    id: 'pengenalan_02', category: 'pengenalan', level: 2,
    title: 'LED Berkedip', icon: 'flash_on',
    scenario: 'Lampu darurat saja tidak cukup untuk menarik perhatian. Warga butuh lampu yang berkedip agar tahu lokasi titik kumpul!',
    objective: 'Buat LED Merah berkedip: nyala 1 detik, mati 1 detik, berulang terus.',
    hint: 'Pakai blok "Tunggu" dari ⚙️ Program, dan blok "Berulang" agar kedip berlanjut.',
    steps: [
      st('Lampu Isyarat! 💡', 'Sekarang kita buat lampu yang berkedip supaya warga tahu jalan ke titik kumpul. Lampu ini akan terus berkedip tanpa henti!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari blok-blok ini:\n• 💡 Aksi → "LED Merah Nyala" dan "LED Merah Mati"\n• ⚙️ Program → "Tunggu 1 detik" (2x)', 'inventory_2', 'Blok "Tunggu" bisa kamu ganti angka waktunya.'),
      st('Susun Pola Kedip', 'Di dalam "Jalan Sekali" di Program, susun:\n1. LED Merah Nyala\n2. Tunggu 1 detik\n3. LED Merah Mati\n4. Tunggu 1 detik\n\nUlangi pola ini di dalam blok "Berulang".', 'extension', 'Jangan lupa blok "Berulang" membungkus semua blok di dalamnya!'),
      st('Lihat Kedipnya! 🔴', 'Klik "Run" — LED merah harus berkedip tiap 1 detik. Kalau sudah, klik "VALIDASI MISI" di bawah.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_program', 'resq_led', 'resq_tunggu', 'resq_ulangi'], ancestorConstraints: { 'resq_led': 'resq_program' }, codeContains: ["api.setPin('10', 'HIGH')", "api.setPin('10', 'LOW')", 'api.tunggu'] },
  },
  {
    id: 'pengenalan_03', category: 'pengenalan', level: 3,
    title: 'Tombol & LED', icon: 'touch_app',
    scenario: 'Relawan butuh tombol untuk menyalakan lampu tanda bahaya. Lampu hanya boleh menyala saat tombol ditekan.',
    objective: 'Jika Tombol 1 ditekan, nyalakan LED Merah. Jika tidak, matikan LED.',
    hint: 'Gunakan blok "Jika...Kalau Tidak" dari 🔀 Logika dan blok "🔘 Tombol 1 ditekan?" dari 📡 Sensor.',
    steps: [
      st('Tombol Ajaib! 🔘', 'Sekarang kita buat lampu yang cuma nyala kalau tombol ditekan. Ini berguna untuk memberi sinyal darurat!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari blok-blok ini:\n• 📡 Sensor → "🔘 Tombol 1 ditekan?"\n• 🔀 Logika → "Jika...Kalau Tidak"\n• 💡 Aksi → "LED Merah Nyala" dan "LED Merah Mati"', 'inventory_2'),
      st('Susun Logikanya', 'Di dalam "Berulang", susun:\n\n🔀 Jika → 🔘 Tombol 1 ditekan?\n   Maka → 💡 LED Merah Nyala\nKalau Tidak → 💡 LED Merah Mati', 'extension', 'Program harus terus mengecek tombol, makanya pakai "Berulang".'),
      st('Coba Tekan Tombolnya! 🖐️', 'Klik "Run", lalu tekan Tombol 1 di panel Sensor — LED harus menyala! Kalau berhasil, klik "VALIDASI MISI".', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_tombol_1', 'resq_led'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program' }, codeContains: ["api.getPin('D2')", "api.setPin('10', 'HIGH')"] },
  },

  // ═══ KATEGORI 2: GEMPA BUMI (5 misi) ═══
  {
    id: 'gempa_01', category: 'gempa', level: 1,
    title: 'Deteksi Getaran', icon: 'vibration',
    scenario: 'Wilayah Lombok rawan gempa. Warga butuh peringatan dini: LED Merah harus menyala begitu getaran kuat terdeteksi.',
    objective: 'Gunakan sensor getaran. Jika getaran kuat, nyalakan LED Merah.',
    hint: 'Pakai blok "🔔 Getaran kuat?" dari 📡 Sensor, gabungkan dengan "Jika...Maka".',
    steps: [
      st('Kenali Gempa! 🌍', 'Lombok sering gempa. Kamu akan membuat sensor yang mendeteksi getaran dan menyalakan lampu peringatan!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "🔔 Getaran kuat?"\n• 🔀 Logika → "Jika...Kalau Tidak"\n• 💡 Aksi → "LED Merah Nyala" dan "LED Merah Mati"', 'inventory_2'),
      st('Susun Detektor Getaran', 'Di dalam "Berulang":\n\n🔀 Jika → 🔔 Getaran kuat?\n   Maka → 💡 LED Merah Nyala\nKalau Tidak → 💡 LED Merah Mati', 'extension'),
      st('Simulasikan Gempa! 📳', 'Klik "Run", buka panel Sensor, geser nilai getaran ke atas (>700). LED Merah harus menyala! Klik VALIDASI jika berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_getar_kuat', 'resq_led'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program' }, codeContains: ["api.getSensor('A1') > 700"] },
  },
  {
    id: 'gempa_02', category: 'gempa', level: 2,
    title: 'Alarm Getaran', icon: 'notification_important',
    scenario: 'Lampu saja tidak cukup — warga perlu sirine keras supaya semua orang dengar peringatan gempa!',
    objective: 'Jika getaran kuat, bunyikan Buzzer sebagai sirine peringatan.',
    hint: 'Ganti blok LED dengan blok "Buzzer berbunyi" dan "Buzzer berhenti" dari 💡 Aksi.',
    steps: [
      st('Sirine Gempa! 📢', 'LED peringatan saja kurang keras. Sekarang kita tambahkan Buzzer yang akan berbunyi saat gempa terdeteksi!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "🔔 Getaran kuat?"\n• 💡 Aksi → "Buzzer berbunyi" dan "Buzzer berhenti"\n• 🔀 Logika → "Jika...Kalau Tidak"', 'inventory_2'),
      st('Susun Alarm', 'Di dalam "Berulang":\n\n🔀 Jika → 🔔 Getaran kuat?\n   Maka → Buzzer berbunyi\nKalau Tidak → Buzzer berhenti', 'extension'),
      st('Bunyikan Sirine! 🔊', 'Jalankan, geser sensor getaran ke tinggi — Buzzer harus berbunyi! VALIDASI MISI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_getar_kuat', 'resq_buzzer', 'resq_buzzer_stop'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_buzzer_stop': 'resq_program' }, codeContains: ["api.getSensor('A1') > 700"] },
  },
  {
    id: 'gempa_03', category: 'gempa', level: 3,
    title: 'Level Getaran', icon: 'equalizer',
    scenario: 'Tidak semua getaran berbahaya. Petugas BPBD perlu tahu level getaran: ringan (LED Hijau) atau kuat (LED Merah + Buzzer).',
    objective: 'Bedakan 2 level getaran. Jika kuat → LED Merah + Buzzer. Jika ringan → LED Hijau saja.',
    hint: 'Gunakan "Jika...Kalau Tidak" lalu di dalam "Kalau Tidak" tambahkan lagi pengaturan LED Hijau.',
    steps: [
      st('Level Getaran 📊', 'Getaran ada yang ringan dan kuat. Kita akan buat 2 level peringatan berbeda!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "🔔 Getaran kuat?"\n• 🔀 Logika → "Jika...Kalau Tidak"\n• 💡 Aksi → LED Merah, LED Hijau, Buzzer, Matikan Semua LED', 'inventory_2', 'LED Hijau untuk tanda AMAN. LED Merah + Buzzer untuk tanda BAHAYA.'),
      st('Susun Level Peringatan', 'Di "Berulang":\n\n🔀 Jika → 🔔 Getaran kuat?\n   Maka → 💡 LED Merah Nyala + Buzzer\nKalau Tidak → 💡 Matikan Semua LED\n              💡 LED Hijau Nyala', 'extension'),
      st('Uji Kedua Level! 🟢🔴', 'Run, lalu uji: 1) Getaran rendah → LED Hijau. 2) Getaran tinggi → LED Merah + Buzzer. VALIDASI kalau sukses!', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_getar_kuat', 'resq_buzzer', 'resq_semua_led_mati'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_semua_led_mati': 'resq_program' }, codeContains: ["api.getSensor('A1') > 700"] },
  },
  {
    id: 'gempa_04', category: 'gempa', level: 4,
    title: 'Evakuasi Gempa', icon: 'directions_run',
    scenario: 'Gempa besar terdeteksi! Sistem harus otomatis menyalakan Alarm Darurat jika getaran kuat ATAU tombol panik ditekan.',
    objective: 'Gabungkan sensor getaran dan tombol darurat. Jika salah satu aktif, jalankan Alarm Darurat.',
    hint: 'Di 🔀 Logika, pakai blok "ATAU" untuk menggabungkan dua kondisi.',
    steps: [
      st('Evakuasi Darurat! 🏃', 'Saat gempa besar atau tombol panik ditekan, seluruh sistem evakuasi harus jalan otomatis!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• 📡 Sensor → "🔔 Getaran kuat?" + "🔘 Tombol 1 ditekan?"\n• 🔀 Logika → "ATAU" + "Jika...Kalau Tidak"\n• 💡 Aksi → "🚨 Alarm Darurat" + LED Hijau', 'inventory_2'),
      st('Susun Kondisi ATAU', 'Pertama gabungkan kondisi:\n\n🔀 Blok "ATAU"\n   Kiri → 🔔 Getaran kuat?\n  Kanan → 🔘 Tombol 1 ditekan?\n\nLalu masukkan ke "Jika".', 'extension', 'Ubah opsi di blok logika jadi "ATAU", bukan "DAN".'),
      st('Aktifkan Evakuasi! 🚨', 'Jika [Gempa ATAU Tombol] → 🚨 Alarm Darurat 5 kali. Kalau tidak → LED Hijau. Jalankan & uji kedua pemicunya!', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_dan_atau', 'resq_jika_tidak', 'resq_getar_kuat', 'resq_tombol_1', 'resq_alarm_darurat'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_alarm_darurat': 'resq_program' }, codeContains: ['||'] },
  },
  {
    id: 'gempa_05', category: 'gempa', level: 5,
    title: 'Sistem Peringatan Dini', icon: 'cell_tower',
    scenario: 'Kota besar butuh sistem monitoring 24 jam. Setiap beberapa detik, sistem cek getaran. Jika kuat, aktifkan semua output darurat.',
    objective: 'Buat loop monitoring dengan jeda 2 detik. Jika getaran kuat, jalankan LED, Buzzer, dan Motor secara bersamaan.',
    hint: 'Gunakan blok "Berulang" + "Tunggu 2 detik" untuk monitoring. Aktifkan 3 output bersamaan di dalam "Maka".',
    steps: [
      st('Monitoring 24 Jam! 🕐', 'Sistem ini harus terus mengecek getaran setiap 2 detik. Begitu ada gempa, SEMUA alarm langsung aktif!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• ⚙️ Program → "Berulang" + "Tunggu 2 detik"\n• 📡 Sensor → "🔔 Getaran kuat?"\n• 💡 Aksi → LED Merah + Buzzer + Motor\n• 🔀 Logika → "Jika...Kalau Tidak"', 'inventory_2'),
      st('Susun Loop Monitoring', 'Di dalam "Berulang":\n1. 🔀 Jika getaran kuat → LED + Buzzer + Motor nyala\n2. Kalau tidak → semuanya mati\n3. ⏱️ Tunggu 2 detik (biar hemat daya)', 'extension', 'Blok "Tunggu" di akhir loop penting — tanpa ini sensor dicek terus-terusan!'),
      st('Uji Sistem Penuh! 🎯', 'Run, geser sensor getaran naik. LED, Buzzer, Motor harus aktif bersamaan! VALIDASI MISI kalau sukses.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_ulangi', 'resq_tunggu', 'resq_getar_kuat', 'resq_jika_tidak', 'resq_led', 'resq_buzzer', 'resq_motor'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_motor': 'resq_program' }, codeContains: ['api.tunggu'] },
  },

  // ═══ KATEGORI 3: BANJIR (5 misi) ═══
  {
    id: 'banjir_01', category: 'banjir', level: 1,
    title: 'Sensor Air', icon: 'water_drop',
    scenario: 'Sungai Ciliwung sering meluap. Pasang sensor air: jika air sudah tinggi, LED Merah harus menyala sebagai peringatan.',
    objective: 'Jika sensor air mendeteksi level tinggi (>800), nyalakan LED Merah.',
    hint: 'Pakai blok "💧 Air berbahaya?" dari 📡 Sensor, dan blok "Jika...Kalau Tidak" dari 🔀 Logika.',
    steps: [
      st('Banjir Mengancam! 💧', 'Sungai Ciliwung hampir meluap! Pasang sensor air untuk mendeteksi ketinggian air dan menyalakan lampu peringatan.', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "💧 Air berbahaya?"\n• 🔀 Logika → "Jika...Kalau Tidak"\n• 💡 Aksi → "LED Merah Nyala" + "LED Merah Mati"', 'inventory_2'),
      st('Susun Sensor Air', 'Di dalam "Berulang":\n\n🔀 Jika → 💧 Air berbahaya?\n   Maka → LED Merah Nyala\nKalau Tidak → LED Merah Mati', 'extension'),
      st('Simulasikan Banjir! 🌊', 'Run, buka panel Sensor, naikkan nilai sensor air di atas 800. LED Merah harus menyala! VALIDASI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_air_bahaya', 'resq_led'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program' }, codeContains: ["api.getSensor('A0') > 800"] },
  },
  {
    id: 'banjir_02', category: 'banjir', level: 2,
    title: 'Alarm Banjir', icon: 'warning',
    scenario: 'Lampu saja kurang — warga sekitar sungai butuh sirine keras saat air sudah berbahaya!',
    objective: 'Jika air berbahaya, bunyikan Buzzer terus-menerus sebagai alarm.',
    hint: 'Ganti LED dengan Buzzer. Jangan lupa matikan buzzer saat air aman.',
    steps: [
      st('Sirine Banjir! 📢', 'Lampu peringatan saja tidak cukup keras. Tambahkan Buzzer agar semua warga dengar!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "💧 Air berbahaya?"\n• 💡 Aksi → "Buzzer berbunyi" + "Buzzer berhenti"\n• 🔀 Logika → "Jika...Kalau Tidak"', 'inventory_2'),
      st('Susun Alarm', 'Di "Berulang":\n\n🔀 Jika → 💧 Air berbahaya?\n   Maka → Buzzer berbunyi\nKalau Tidak → Buzzer berhenti', 'extension'),
      st('Bunyikan Alarm! 🔊', 'Run, naikkan sensor air >800. Buzzer harus bunyi! VALIDASI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_air_bahaya', 'resq_buzzer', 'resq_buzzer_stop'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_buzzer_stop': 'resq_program' }, codeContains: ["api.getSensor('A0') > 800"] },
  },
  {
    id: 'banjir_03', category: 'banjir', level: 3,
    title: 'Level Air', icon: 'water_medium',
    scenario: 'Air sungai naik bertahap: waspada (LED Merah) lalu bahaya (LED Merah + Buzzer). Sistem harus bisa bedakan!',
    objective: 'Jika air waspada → LED Merah. Jika air bahaya → LED Merah + Buzzer. Jika aman → matikan semua.',
    hint: 'Gunakan 2 blok "Jika" bertumpuk: cek dulu air bahaya, lalu di "Kalau Tidak"-nya cek air waspada.',
    steps: [
      st('Level Ketinggian Air 📈', 'Air sungai naik bertahap. Sistem harus bisa bedakan: aman, waspada, atau bahaya!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "💧 Air berbahaya?" + "💧 Air waspada?"\n• 🔀 Logika → 2x "Jika...Kalau Tidak"\n• 💡 Aksi → LED Merah + Buzzer + Matikan Semua LED', 'inventory_2'),
      st('Susun Level Air', 'Di "Berulang":\n\n🔀 Jika → 💧 Air berbahaya?\n   Maka → LED Merah + Buzzer\nKalau Tidak →\n   🔀 Jika → 💧 Air waspada?\n      Maka → LED Merah (saja)\n   Kalau Tidak → Matikan Semua LED + Buzzer berhenti', 'extension'),
      st('Uji 3 Level! 🟢🟠🔴', 'Run, uji: rendah (aman), sedang (waspada), tinggi (bahaya). Tiap level harus beda respons! VALIDASI kalau sukses.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_air_bahaya', 'resq_air_waspada', 'resq_led', 'resq_buzzer', 'resq_buzzer_stop'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_buzzer_stop': 'resq_program' }, codeContains: ["api.getSensor('A0') > 800"] },
  },
  {
    id: 'banjir_04', category: 'banjir', level: 4,
    title: 'Pompa Air', icon: 'water_pump',
    scenario: 'Air sudah tinggi! Aktifkan Pompa Air (Motor) otomatis begitu air mencapai level bahaya untuk mengurangi debit air.',
    objective: 'Jika air bahaya, nyalakan Motor (pompa) + Buzzer peringatan. Jika aman, matikan.',
    hint: 'Di dalam "Maka", tambahkan blok Motor dari 💡 Aksi bersamaan dengan Buzzer.',
    steps: [
      st('Pompa Darurat! ⚡', 'Air sudah di level bahaya! Kita harus menyalakan pompa otomatis untuk menyedot air keluar!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "💧 Air berbahaya?"\n• 💡 Aksi → Motor Nyala/Mati + Buzzer\n• 🔀 Logika → "Jika...Kalau Tidak"', 'inventory_2'),
      st('Susun Pompa + Alarm', 'Di "Berulang":\n\n🔀 Jika → 💧 Air berbahaya?\n   Maka → Motor Nyala + Buzzer\nKalau Tidak → Motor Mati + Buzzer berhenti', 'extension'),
      st('Aktifkan Pompa! 🚿', 'Run, naikkan air >800 — Motor + Buzzer harus aktif bareng! VALIDASI kalau sukses.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_air_bahaya', 'resq_motor', 'resq_buzzer'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_motor': 'resq_program', 'resq_buzzer': 'resq_program' }, codeContains: ["api.getSensor('A0') > 800"] },
  },
  {
    id: 'banjir_05', category: 'banjir', level: 5,
    title: 'Sistem Anti Banjir', icon: 'engineering',
    scenario: 'Sistem anti banjir lengkap: monitoring 24 jam, 3 level respons, pompa otomatis, alarm, dan lampu status.',
    objective: 'Buat sistem monitoring dengan 3 level: aman (LED Hijau), waspada (LED Merah), bahaya (LED Merah + Buzzer + Motor).',
    hint: 'Gunakan loop + 2 "Jika" bertumpuk untuk 3 level. Di level bahaya, aktifkan 3 output bersamaan.',
    steps: [
      st('Sistem Anti Banjir 🛡️', 'Ini sistem terpadu! Monitoring terus-menerus dengan 3 level peringatan dan respons otomatis.', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Kumpulkan semua:\n• ⚙️ Program → "Berulang" + "Tunggu 2 detik"\n• 📡 Sensor → Air bahaya + Air waspada\n• 💡 Aksi → LED Merah + LED Hijau + Buzzer + Motor + Matikan Semua LED\n• 🔀 Logika → 2x "Jika...Kalau Tidak"', 'inventory_2'),
      st('Susun Monitoring Anti Banjir', 'Di "Berulang":\n🔀 Jika air bahaya → LED Merah + Buzzer + Motor\nKalau Tidak →\n   🔀 Jika air waspada → LED Merah\n   Kalau Tidak → LED Hijau + matikan lainnya\n⏱️ Tunggu 2 detik', 'extension'),
      st('Uji Semua Level! 🎯', 'Run dan uji 3 level air. Semua output harus sesuai! VALIDASI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_ulangi', 'resq_tunggu', 'resq_jika_tidak', 'resq_air_bahaya', 'resq_air_waspada', 'resq_led', 'resq_buzzer', 'resq_motor'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_motor': 'resq_program' }, codeContains: ["api.getSensor('A0') > 800", 'api.tunggu'] },
  },

  // ═══ KATEGORI 4: GUNUNG MELETUS (5 misi) ═══
  {
    id: 'gunung_01', category: 'gunung', level: 1,
    title: 'Sensor Suhu', icon: 'thermostat',
    scenario: 'Gunung Merapi menunjukkan peningkatan suhu. Pasang sensor suhu untuk mendeteksi panas berlebih dan menyalakan LED peringatan.',
    objective: 'Jika suhu panas (>35°C) terdeteksi, nyalakan LED Merah.',
    hint: 'Pakai blok "🌡 Suhu panas?" dari 📡 Sensor, gabungkan dengan "Jika...Kalau Tidak".',
    steps: [
      st('Gunung Memanas! 🌡️', 'Gunung Merapi suhunya naik! Kamu akan memasang sensor suhu untuk memantau panas gunung.', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "🌡 Suhu panas?"\n• 🔀 Logika → "Jika...Kalau Tidak"\n• 💡 Aksi → "LED Merah Nyala" + "LED Merah Mati"', 'inventory_2'),
      st('Susun Sensor Suhu', 'Di dalam "Berulang":\n\n🔀 Jika → 🌡 Suhu panas?\n   Maka → LED Merah Nyala\nKalau Tidak → LED Merah Mati', 'extension'),
      st('Simulasikan Panas! 🔥', 'Run, buka panel Sensor, geser suhu di atas 35°C. LED Merah harus menyala! VALIDASI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_suhu_panas', 'resq_led'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program' }, codeContains: ['0.4887'] },
  },
  {
    id: 'gunung_02', category: 'gunung', level: 2,
    title: 'Alarm Panas', icon: 'fireplace',
    scenario: 'Suhu gunung sudah di level berbahaya! Buzzer harus berbunyi keras agar semua warga di lereng segera evakuasi.',
    objective: 'Jika suhu panas, bunyikan Buzzer sebagai sirine evakuasi.',
    hint: 'Ganti LED dengan Buzzer. Jangan lupa matikan saat suhu normal.',
    steps: [
      st('Sirine Panas! 🔥📢', 'Suhu gunung sudah di atas 35°C! Buzzer harus berbunyi untuk memperingatkan semua warga!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "🌡 Suhu panas?"\n• 💡 Aksi → "Buzzer berbunyi" + "Buzzer berhenti"\n• 🔀 Logika → "Jika...Kalau Tidak"', 'inventory_2'),
      st('Susun Alarm Panas', 'Di "Berulang":\n\n🔀 Jika → 🌡 Suhu panas?\n   Maka → Buzzer berbunyi\nKalau Tidak → Buzzer berhenti', 'extension'),
      st('Bunyikan Sirine! 🔊', 'Run, geser suhu >35°C. Buzzer harus bunyi! VALIDASI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_suhu_panas', 'resq_buzzer', 'resq_buzzer_stop'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_buzzer_stop': 'resq_program' }, codeContains: ['0.4887'] },
  },
  {
    id: 'gunung_03', category: 'gunung', level: 3,
    title: 'Status Gunung', icon: 'monitoring',
    scenario: 'PVMBG menetapkan status gunung berdasarkan suhu dan getaran vulkanik. Sistem harus merespons: Normal atau Awas.',
    objective: 'Jika suhu panas ATAU getaran kuat, status Awas: aktifkan LED, Buzzer, dan Servo. Jika tidak, LED Hijau.',
    hint: 'Cek suhu panas dulu, gabungkan dengan getaran kuat pakai "ATAU". Di level Awas, aktifkan 3 output bersamaan.',
    steps: [
      st('Status Gunung 🟢🔴', 'PVMBG menetapkan status gunung berdasarkan suhu dan getaran vulkanik. Sistem harus merespons sesuai!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• 📡 Sensor → "🌡 Suhu panas?" + "🔔 Getaran kuat?"\n• 🔀 Logika → "ATAU" + "Jika...Kalau Tidak"\n• 💡 Aksi → LED Merah, LED Hijau, Buzzer, Servo', 'inventory_2'),
      st('Susun Status Gunung', 'Di "Berulang":\n🔀 Jika [Suhu Panas ATAU Getaran Kuat] → LED Merah + Buzzer + Servo\nKalau Tidak → LED Hijau + matikan lainnya', 'extension', 'Servo berguna untuk menutup pintu evakuasi otomatis!'),
      st('Uji Semua Status! 🎯', 'Run, uji kombinasi suhu dan getaran. Tiap status harus beda respons! VALIDASI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_suhu_panas', 'resq_getar_kuat', 'resq_dan_atau', 'resq_led', 'resq_buzzer', 'resq_servo'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_servo': 'resq_program' }, codeContains: ['||'] },
  },
  {
    id: 'gunung_04', category: 'gunung', level: 4,
    title: 'Evakuasi Gunung', icon: 'directions_walk',
    scenario: 'Status Awas! Semua pintu evakuasi harus tertutup (Servo), alarm berbunyi, lampu darurat dan motor evakuasi menyala otomatis.',
    objective: 'Jika status Awas (suhu panas ATAU getaran kuat), aktifkan 4 output: LED Merah, Buzzer, Motor, dan Servo.',
    hint: 'Gabungkan 2 sensor dengan "ATAU". Di dalam "Maka", susun 4 blok output berurutan.',
    steps: [
      st('Evakuasi Gunung! 🏃💨', 'Gunung status AWAS! Semua sistem evakuasi harus jalan: alarm, lampu, motor, dan pintu otomatis!', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• 📡 Sensor → "🌡 Suhu panas?" + "🔔 Getaran kuat?"\n• 🔀 Logika → "ATAU" + "Jika...Kalau Tidak"\n• 💡 Aksi → LED Merah + Buzzer + Motor + Servo', 'inventory_2'),
      st('Susun Evakuasi Penuh', 'Di "Berulang":\n\n🔀 Jika [🌡 Suhu panas ATAU 🔔 Getaran kuat]\n   Maka → LED Merah + Buzzer + Motor + Servo\nKalau Tidak → Matikan Semua', 'extension'),
      st('Aktifkan Evakuasi! 🚨', 'Run, naikkan suhu atau getaran. Semua 4 output harus aktif! VALIDASI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_dan_atau', 'resq_jika_tidak', 'resq_suhu_panas', 'resq_getar_kuat', 'resq_led', 'resq_buzzer', 'resq_motor', 'resq_servo'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_motor': 'resq_program', 'resq_servo': 'resq_program' }, codeContains: ['||'] },
  },
  {
    id: 'gunung_05', category: 'gunung', level: 5,
    title: 'Sistem Monitoring Gunung', icon: 'satellite_alt',
    scenario: 'Pusat vulkanologi butuh sistem monitoring 24 jam: cek suhu tiap 3 detik, 3 level status, dan respon otomatis tiap level.',
    objective: 'Buat loop monitoring 3 detik dengan multi-sensor. Jika Awas → semua output. Normal → LED Hijau.',
    hint: 'Loop + "ATAU" untuk kondisi Awas. Di dalam "Kalau Tidak", tambahkan "Jika" kedua untuk cek suhu saja.',
    steps: [
      st('Pusat Vulkanologi 🏔️', 'Sistem monitoring gunung terlengkap! Cek tiap 3 detik, 3 level status, respons otomatis penuh.', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Semua blok:\n• ⚙️ Program → "Berulang" + "Tunggu"\n• 📡 Sensor → Suhu panas + Getaran kuat\n• 💡 Aksi → Semua output\n• 🔀 Logika → 2x "Jika" + "ATAU"', 'inventory_2'),
      st('Susun Sistem Lengkap', 'Di "Berulang":\n🔀 Jika [Suhu Panas ATAU Getaran Kuat]\n   Maka → LED Merah + Buzzer + Motor + Servo\nKalau Tidak →\n   🔀 Jika suhu >30°C → LED Merah (Waspada)\n   Kalau Tidak → LED Hijau (Normal)\n⏱️ Tunggu 3 detik', 'extension'),
      st('Uji Sistem Penuh! 🎯', 'Run dan uji semua kombinasi sensor. Tiap level harus respons tepat! VALIDASI kalau berhasil.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_ulangi', 'resq_tunggu', 'resq_jika_tidak', 'resq_dan_atau', 'resq_suhu_panas', 'resq_getar_kuat', 'resq_led', 'resq_buzzer', 'resq_servo'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_servo': 'resq_program' }, codeContains: ['0.4887', 'api.tunggu'] },
  },

  // ═══ KATEGORI 5: UJIAN (4 misi) ═══
  {
    id: 'ujian_01', category: 'ujian', level: 1,
    title: 'Kombinasi Gempa + Banjir', icon: 'landslide',
    scenario: 'Bencana ganda! Suatu daerah rawan gempa DAN banjir. Sistem harus bisa mendeteksi keduanya dan merespons dengan tepat.',
    objective: 'Jika getaran kuat ATAU air bahaya, aktifkan Alarm Darurat. Gunakan blok "ATAU" untuk menggabungkan sensor.',
    hint: 'Gabungkan "🔔 Getaran kuat?" dan "💧 Air berbahaya?" dengan blok "ATAU".',
    steps: [
      st('Bencana Ganda! 🌍💧', 'Ujian pertama: gabungkan sensor gempa dan banjir dalam satu sistem! Gunakan logika ATAU.', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Cari:\n• 📡 Sensor → "🔔 Getaran kuat?" + "💧 Air berbahaya?"\n• 🔀 Logika → "ATAU" + "Jika...Kalau Tidak"\n• 💡 Aksi → "🚨 Alarm Darurat" + LED Hijau', 'inventory_2'),
      st('Susun Kombinasi Sensor', 'Di "Berulang":\n\n🔀 Jika [🔔 Getaran kuat ATAU 💧 Air bahaya]\n   Maka → 🚨 Alarm Darurat 5 kali\nKalau Tidak → LED Hijau', 'extension'),
      st('Uji Kedua Sensor! 🧪', 'Run, uji: 1) Naikkan air, 2) Naikkan getaran. Masing-masing harus picu Alarm! VALIDASI.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_dan_atau', 'resq_jika_tidak', 'resq_getar_kuat', 'resq_air_bahaya', 'resq_alarm_darurat'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_alarm_darurat': 'resq_program' }, codeContains: ['||'] },
  },
  {
    id: 'ujian_02', category: 'ujian', level: 2,
    title: 'Sistem Tanggap Darurat', icon: 'emergency_home',
    scenario: 'Pusat komando darurat harus memprioritaskan respons. Gempa = prioritas tertinggi, banjir = kedua, suhu panas = waspada saja.',
    objective: 'Buat prioritas 3 level: gempa → Alarm Darurat, banjir → Buzzer + Motor, suhu → LED Merah saja.',
    hint: 'Cek gempa dulu, lalu banjir, lalu suhu. Pakai 3 blok "Jika" bertumpuk.',
    steps: [
      st('Prioritas Respons! 🚨', 'Tidak semua bencana sama. Sistem harus memprioritaskan: gempa paling bahaya, lalu banjir, lalu suhu panas.', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• 📡 Sensor → Getaran kuat + Air bahaya + Suhu panas\n• 🔀 Logika → 3x "Jika...Kalau Tidak"\n• 💡 Aksi → Alarm Darurat + Buzzer + Motor + LED Merah + LED Hijau', 'inventory_2'),
      st('Susun Prioritas', 'Di "Berulang":\n🔀 Jika getaran kuat → Alarm Darurat\nKalau Tidak →\n   🔀 Jika air bahaya → Buzzer + Motor\n   Kalau Tidak →\n      🔀 Jika suhu panas → LED Merah\n      Kalau Tidak → LED Hijau', 'extension'),
      st('Uji Prioritas! 🧪', 'Run, uji kombinasi sensor. Alarm Darurat harus menang atas yang lain! VALIDASI kalau sukses.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_jika_tidak', 'resq_getar_kuat', 'resq_air_bahaya', 'resq_suhu_panas', 'resq_alarm_darurat', 'resq_buzzer', 'resq_motor'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_alarm_darurat': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_motor': 'resq_program' }, codeContains: ["api.getSensor('A1') > 700"] },
  },
  {
    id: 'ujian_03', category: 'ujian', level: 3,
    title: 'Bencana Alam Lengkap', icon: 'warning_amber',
    scenario: 'Semua bencana alam bisa terjadi bersamaan! Buat sistem yang mendeteksi gempa, banjir, DAN suhu tinggi sekaligus.',
    objective: 'Jika gempa DAN banjir terjadi bersamaan, aktifkan SEMUA output. Jika hanya salah satu, Alarm Darurat saja.',
    hint: 'Gunakan "DAN" untuk deteksi bencana ganda. Lalu "ATAU" untuk kondisi individual di dalam "Kalau Tidak".',
    steps: [
      st('Bencana Triple! 🌍💧🔥', 'Gempa, banjir, dan suhu panas bisa terjadi bersamaan! Sistem harus bisa menangani semuanya.', 'auto_stories'),
      st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• 📡 Sensor → Getaran kuat + Air bahaya + Suhu panas\n• 🔀 Logika → "DAN" + "ATAU" + 2x "Jika...Kalau Tidak"\n• 💡 Aksi → Semua output', 'inventory_2'),
      st('Susun Deteksi Multi Bencana', 'Pertama, buat kondisi:\n🔀 [Getaran kuat DAN Air bahaya] → kondisi "Double"\n\nLalu di "Berulang":\n🔀 Jika Double → SEMUA output darurat\nKalau Tidak →\n   🔀 Jika [Getaran ATAU Air ATAU Suhu] → Alarm Darurat\n   Kalau Tidak → LED Hijau', 'extension'),
      st('Uji Kombinasi Ekstrim! 🧪🔥', 'Run, uji: satu sensor, dua sensor, tiga sensor bersamaan. Respons harus berbeda! VALIDASI kalau sukses.', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_dan_atau', 'resq_jika_tidak', 'resq_getar_kuat', 'resq_air_bahaya', 'resq_suhu_panas', 'resq_alarm_darurat', 'resq_led', 'resq_buzzer', 'resq_motor'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_alarm_darurat': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_motor': 'resq_program' }, codeContains: ['||', '&&'] },
  },
  {
    id: 'ujian_04', category: 'ujian', level: 4,
    title: 'Pusat Komando Bencana', icon: 'shield_with_heart',
    scenario: 'Ujian terakhir! Bangun Pusat Komando Bencana: monitoring 24 jam, 3 sensor, 4 level prioritas, logika DAN/ATAU, dan respons otomatis penuh.',
    objective: 'Sistem monitoring lengkap: loop 2 detik, prioritas multi-sensor, semua output, logika advance, dan counter kejadian.',
    hint: 'Kombinasikan SEMUA yang sudah dipelajari: loop, DAN, ATAU, jika bertumpuk, multi-output, dan counter.',
    steps: [
      st('Pusat Komando! 🏛️', 'Ini ujian terberat! Gabungkan SEMUA yang sudah kamu pelajari menjadi satu sistem komando bencana terlengkap!', 'auto_stories'),
      st('Semua Blok!', 'Kamu butuh hampir semua blok:\n• ⚙️ Program → "Berulang" + "Tunggu" + "Hitung"\n• 📡 Sensor → Getaran + Air + Suhu\n• 🔀 Logika → "DAN" + "ATAU" + 3x "Jika"\n• 💡 Aksi → Semua output', 'inventory_2'),
      st('Rancang Arsitektur', '1. Setup counter di awal\n2. Loop monitoring tiap 2 detik\n3. Cek bencana ganda (DAN)\n4. Cek bencana tunggal (ATAU)\n5. Prioritas respons\n6. Update counter tiap kejadian\n7. Tampilkan status', 'extension', 'Gambar dulu flowchart-nya di kertas sebelum menyusun blok!'),
      st('Uji Semua Skenario! 🏆', 'Uji 10+ kombinasi sensor. Counter harus akurat. Semua output harus tepat. Ini ujian terakhir — buktikan kamu ahlinya! VALIDASI!', 'rocket_launch'),
    ],
    validation: { requiredBlocks: ['resq_ulangi', 'resq_tunggu', 'resq_jika_tidak', 'resq_dan_atau', 'resq_getar_kuat', 'resq_air_bahaya', 'resq_suhu_panas', 'resq_alarm_darurat', 'resq_led', 'resq_buzzer', 'resq_motor', 'resq_hitung'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_alarm_darurat': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_motor': 'resq_program' }, codeContains: ['||', 'api.tunggu'] },
  },
];
