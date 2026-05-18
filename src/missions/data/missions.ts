export interface MissionValidation {
  requiredBlocks?: string[]; // e.g., ['resq_led', 'resq_tunggu']
  codeContains?: string[];   // substrings that must appear in the generated JS code
}

export interface MissionStep {
  title: string;       // Judul langkah singkat
  description: string; // Penjelasan langkah untuk anak-anak
  icon: string;        // Material Symbol icon name
  tip?: string;        // Tips tambahan (opsional)
}

export interface Mission {
  id: string;
  level: number;
  title: string;
  icon: string;
  scenario: string;    // Short story context
  objective: string;   // What the student must do
  hint: string;        // Help if stuck
  steps: MissionStep[];// Langkah-langkah bertahap
  validation: MissionValidation;
}

export const MISSIONS: Mission[] = [
  {
    id: 'mission_01',
    level: 1,
    title: 'Nyalakan Lampu Darurat',
    icon: 'lightbulb',
    scenario: 'Desa Cikaret mengalami pemadaman listrik saat malam hari akibat badai. Kamu perlu membuat lampu darurat agar warga tidak panik.',
    objective: 'Buat program agar LED Merah menyala terus-menerus.',
    hint: 'Buka kategori 💡 Aksi, ambil blok "LED Merah Nyala", lalu taruh di dalam "Jalan Sekali" pada blok Program RESQ-BOX.',
    steps: [
      {
        title: 'Kenali Misimu! 🌟',
        description: 'Desa Cikaret gelap gulita karena badai. Tugasmu adalah membuat lampu darurat supaya warga tidak panik!',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description: 'Buka kategori 💡 Aksi di panel kiri, cari blok ini:\n• "LED"\n\nBlok Program RESQ-BOX sudah ada di kanvas. Kamu tinggal menambahkan blok ke dalamnya!',
        icon: 'inventory_2',
        tip: 'Klik nama kategori di panel kiri untuk melihat semua blok yang tersedia.',
      },
      {
        title: 'Susun Blok-nya',
        description: 'Seret blok "LED Merah Nyala" ke dalam kotak "Jalan Sekali" di blok Program RESQ-BOX.\n\nBlok "Jalan Sekali" dijalankan satu kali saat program dimulai — cocok untuk menyalakan lampu!',
        icon: 'extension',
        tip: 'Pastikan blok LED menempel (snap) di dalam "Jalan Sekali", bukan di luar.',
      },
      {
        title: 'Jalankan & Validasi! 🚀',
        description: 'Klik tombol "Run" di atas untuk menjalankan program. Kalau berhasil, klik tombol "VALIDASI MISI" di bawah ini.',
        icon: 'rocket_launch',
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_led'],
      codeContains: ["api.setPin('10', 'HIGH')"],
    },
  },
  {
    id: 'mission_02',
    level: 2,
    title: 'Alarm Banjir Otomatis',
    icon: 'water_drop',
    scenario: 'Sungai Ciliwung meluap! Kamu harus membangun sistem peringatan dini agar alarm LED menyala secara otomatis ketika level air sudah berbahaya.',
    objective: 'Gunakan sensor air dan blok logika. Jika air berbahaya, nyalakan LED Merah.',
    hint: 'Buka kategori 📡 Sensor, pakai blok "💧 Air berbahaya?". Lalu di kategori 🔀 Logika pakai "Jika...Kalau Tidak".',
    steps: [
      {
        title: 'Kenali Bahaya Banjir! 💧',
        description: 'Sungai Ciliwung sudah hampir meluap! Kamu harus membuat alarm otomatis yang akan menyala kalau air sudah terlalu tinggi.',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description: 'Cari blok-blok ini di panel kiri:\n• 📡 Sensor → "💧 Air berbahaya?"\n• 💡 Aksi → "LED Merah Nyala" dan "LED Merah Mati"\n• 🔀 Logika → "Jika...Kalau Tidak"',
        icon: 'inventory_2',
        tip: 'Blok "💧 Air berbahaya?" otomatis cek apakah air sudah di level berbahaya (>800)!',
      },
      {
        title: 'Susun Blok-nya',
        description: 'Di dalam "Berulang" pada blok Program, susun seperti ini:\n\n🔀 Jika → 💧 Air berbahaya?\n   Maka → 💡 LED Merah Nyala\nKalau Tidak → 💡 LED Merah Mati',
        icon: 'extension',
        tip: '"Berulang" terus mengecek kondisi sensor — pas banget buat alarm otomatis!',
      },
      {
        title: 'Simulasikan Banjir! 🚨',
        description: 'Klik "Run", klik tombol "Sensor" di header untuk membuka panel sensor. Geser slider nilai sensor ke angka tinggi. LED Merah harusnya menyala!\n\nKalau berhasil, klik "VALIDASI MISI" di bawah.',
        icon: 'rocket_launch',
      },
    ],
    validation: {
      requiredBlocks: ['resq_jika_tidak', 'resq_air_bahaya', 'resq_led'],
      codeContains: ["api.getSensor('A0') > 800", "api.setPin('10', 'HIGH')", "api.setPin('10', 'LOW')"],
    },
  },
  {
    id: 'mission_03',
    level: 3,
    title: 'Detektor Gempa Bumi',
    icon: 'vibration',
    scenario: 'Wilayah Lombok rawan gempa. Warga membutuhkan peringatan dini ketika tanah mulai bergetar agar bisa segera mengungsi.',
    objective: 'Gunakan sensor getaran. Jika getaran kuat terdeteksi, bunyikan Buzzer.',
    hint: 'Buka 📡 Sensor, pakai blok "🔔 Getaran kuat?". Lalu di 💡 Aksi pakai "Buzzer berbunyi" dan "Buzzer berhenti".',
    steps: [
      {
        title: 'Waspadai Gempa! 🌍',
        description: 'Lombok sering kena gempa. Kamu akan membuat detektor gempa yang otomatis membunyikan sirine (buzzer) saat tanah bergetar!',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description: 'Cari blok-blok ini di panel kiri:\n• 📡 Sensor → "🔔 Getaran kuat?"\n• 💡 Aksi → "Buzzer berbunyi" dan "Buzzer berhenti"\n• 🔀 Logika → "Jika...Kalau Tidak"',
        icon: 'inventory_2',
        tip: 'Blok "🔔 Getaran kuat?" sudah otomatis mendeteksi kalau ada guncangan keras!',
      },
      {
        title: 'Susun Blok-nya',
        description: 'Di dalam "Berulang" pada blok Program, susun seperti ini:\n\n🔀 Jika → 🔔 Getaran kuat?\n   Maka → Buzzer berbunyi\nKalau Tidak → Buzzer berhenti',
        icon: 'extension',
      },
      {
        title: 'Simulasikan Gempa! 🔔',
        description: 'Jalankan program (Run), buka panel Sensor, lalu geser nilai sensor getaran ke atas untuk mensimulasikan getaran. Buzzer seharusnya berbunyi!\n\nKalau berhasil, klik "VALIDASI MISI" di bawah.',
        icon: 'rocket_launch',
      },
    ],
    validation: {
      requiredBlocks: ['resq_jika_tidak', 'resq_getar_kuat', 'resq_buzzer', 'resq_buzzer_stop'],
      codeContains: ["api.getSensor('A1') > 700"],
    },
  },
  {
    id: 'mission_04',
    level: 4,
    title: 'Tombol Evakuasi Darurat',
    icon: 'emergency',
    scenario: 'Pusat koordinasi bencana membutuhkan tombol fisik yang bisa ditekan petugas untuk mengaktifkan sirine evakuasi seluruh gedung.',
    objective: 'Ketika Tombol 1 ditekan, mainkan Alarm Darurat.',
    hint: 'Buka 📡 Sensor, pakai blok "🔘 Tombol 1 ditekan?". Lalu gabungkan dengan blok "🚨 Alarm Darurat" dari 💡 Aksi.',
    steps: [
      {
        title: 'Tombol Panik! 🚨',
        description: 'Kantor BPBD butuh tombol darurat. Kalau tombol ditekan, langsung jalankan "Alarm Darurat" agar semua orang tahu harus evakuasi!',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description: 'Cari blok-blok ini di panel kiri:\n• 📡 Sensor → "🔘 Tombol 1 ditekan?"\n• 💡 Aksi → "🚨 Alarm Darurat"\n• 🔀 Logika → "Jika...Maka"',
        icon: 'inventory_2',
      },
      {
        title: 'Susun Blok-nya',
        description: 'Di dalam "Berulang", susun seperti ini:\n\n🔀 Jika → 🔘 Tombol 1 ditekan?\n   Maka → 🚨 Alarm Darurat 3 kali',
        icon: 'extension',
        tip: 'Alarm Darurat sudah otomatis menyalakan LED Merah dan membunyikan sirine berkali-kali!',
      },
      {
        title: 'Tekan Tombolnya! 🔴',
        description: 'Klik tombol "Run" dan klik Tombol 1 di panel Sensor. Alarm harusnya aktif!\n\nKalau berhasil, klik "VALIDASI MISI" di bawah.',
        icon: 'rocket_launch',
      },
    ],
    validation: {
      requiredBlocks: ['resq_jika', 'resq_tombol_1', 'resq_alarm_darurat'],
      codeContains: ["api.getPin('D2')"],
    },
  },
  {
    id: 'mission_05',
    level: 5,
    title: 'Sistem Kontrol Darurat Terpadu',
    icon: 'crisis_alert',
    scenario: 'Shelter pengungsian butuh sistem pintar: sirine aktif jika air bahaya ATAU tombol darurat ditekan.',
    objective: 'Gabungkan sensor air dan tombol dalam satu kondisi Logika ATAU.',
    hint: 'Di 🔀 Logika pakai blok "DAN / ATAU" (ubah ke ATAU). Masukkan sensor air dan tombol ke dalamnya.',
    steps: [
      {
        title: 'Sistem Pintar Shelter! 🏠',
        description: 'Ini adalah misi tersulit! Kamu akan membuat sistem cerdas: Bahaya terjadi kalau air naik ATAU tombol panik ditekan.',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description: 'Kumpulkan semua blok ini dari panel kiri:\n• 📡 Sensor → "💧 Air berbahaya?" & "🔘 Tombol 1 ditekan?"\n• 🔀 Logika → "ATAU"\n• 🔀 Logika → "Jika...Kalau Tidak"\n• 💡 Aksi → Alarm Darurat, LED Hijau, Matikan Semua LED',
        icon: 'inventory_2',
      },
      {
        title: 'Susun Kondisi ATAU',
        description: 'Pertama, buat kondisi gabungan dulu:\n\n🔀 Blok "ATAU"\n  Kiri → 💧 Air berbahaya?\n  Kanan → 🔘 Tombol 1 ditekan?\n\nBlok ATAU ini yang jadi kondisi di blok "Jika".',
        icon: 'extension',
        tip: 'Ubah opsi "DAN" menjadi "ATAU" di blok logika.',
      },
      {
        title: 'Susun Logika Lengkap',
        description: 'Di dalam "Berulang", susun:\n\n🔀 Jika → [💧 Air bahaya? ATAU 🔘 Tombol ditekan?]\n   Maka → 🚨 Alarm Darurat 5 kali\nKalau Tidak → 💡 LED Hijau Nyala\n              💡 Matikan Semua LED (kecuali hijau)',
        icon: 'extension',
        tip: 'Blok "ATAU" dimasukkan ke dalam slot kondisi blok "Jika"!',
      },
      {
        title: 'Uji Semua Kondisi! 🎯',
        description: 'Klik "Run" dan uji:\n1. Aman: LED hijau nyala\n2. Banjir: naikkan sensor air → Alarm Darurat!\n3. Panik: tekan Tombol 1 → Alarm Darurat!\n\nKlik VALIDASI MISI jika sukses!',
        icon: 'rocket_launch',
      },
    ],
    validation: {
      requiredBlocks: ['resq_dan_atau', 'resq_jika_tidak', 'resq_air_bahaya', 'resq_tombol_1', 'resq_alarm_darurat'],
      codeContains: ["||"],
    },
  },
];
