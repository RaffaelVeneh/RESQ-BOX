export interface MissionValidation {
  requiredComponents: string[]; // node types that must exist on canvas
  requiredConnections?: {
    fromType: string;
    fromHandle: string;
    toType: string;
    toHandle: string;
  }[];
  pinConditions?: {
    pin: string;
    state: 'HIGH' | 'LOW' | 'ANALOG';
    threshold?: number; // for analog: value must be >= threshold
  }[];
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
    scenario:
      'Desa Cikaret mengalami pemadaman listrik saat malam hari akibat badai. Kamu perlu membuat lampu darurat agar warga tidak panik.',
    objective: 'Buat program agar LED Bawaan menyala terus-menerus.',
    hint: 'Buka kategori 💡 Aksi, ambil blok "LED Bawaan Nyala", lalu taruh di dalam "Jalan Sekali" pada blok Program RESQ-BOX.',
    steps: [
      {
        title: 'Kenali Misimu! 🌟',
        description:
          'Desa Cikaret gelap gulita karena badai. Tugasmu adalah membuat lampu darurat supaya warga tidak panik!',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description:
          'Buka kategori 💡 Aksi di panel kiri, cari blok ini:\n• "LED Bawaan Nyala"\n\nBlok Program RESQ-BOX sudah ada di kanvas. Kamu tinggal menambahkan blok ke dalamnya!',
        icon: 'inventory_2',
        tip: 'Klik nama kategori di panel kiri untuk melihat semua blok yang tersedia.',
      },
      {
        title: 'Susun Blok-nya',
        description:
          'Seret blok "LED Bawaan Nyala" ke dalam kotak "Jalan Sekali" di blok Program RESQ-BOX.\n\nBlok "Jalan Sekali" dijalankan satu kali saat program dimulai — cocok untuk menyalakan lampu!',
        icon: 'extension',
        tip: 'Pastikan blok LED menempel (snap) di dalam "Jalan Sekali", bukan di luar.',
      },
      {
        title: 'Jalankan & Validasi! 🚀',
        description:
          'Klik tombol "Run" di atas untuk menjalankan program. Kalau berhasil, klik tombol "VALIDASI MISI" di bawah ini.',
        icon: 'rocket_launch',
      },
    ],
    validation: {
      requiredComponents: ['arduino', 'led'],
      requiredConnections: [
        { fromType: 'arduino', fromHandle: 'GND_1', toType: 'led', toHandle: 'cathode' },
      ],
      pinConditions: [{ pin: '13', state: 'HIGH' }],
    },
  },
  {
    id: 'mission_02',
    level: 2,
    title: 'Alarm Banjir Otomatis',
    icon: 'water_drop',
    scenario:
      'Sungai Ciliwung meluap! Kamu harus membangun sistem peringatan dini agar alarm LED menyala secara otomatis ketika level air sudah berbahaya.',
    objective:
      'Gunakan sensor air dan blok logika. Jika air berbahaya, nyalakan LED Merah.',
    hint: 'Buka kategori 📡 Sensor, pakai blok "💧 Air berbahaya?". Lalu di kategori 🔀 Logika pakai "Jika...Kalau Tidak".',
    steps: [
      {
        title: 'Kenali Bahaya Banjir! 💧',
        description:
          'Sungai Ciliwung sudah hampir meluap! Kamu harus membuat alarm otomatis yang akan menyala kalau air sudah terlalu tinggi.',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description:
          'Cari blok-blok ini di panel kiri:\n• 📡 Sensor → "💧 Air berbahaya?"\n• 💡 Aksi → "LED Merah Nyala" dan "LED Merah Mati"\n• 🔀 Logika → "Jika...Kalau Tidak"',
        icon: 'inventory_2',
        tip: 'Blok "💧 Air berbahaya?" otomatis cek apakah air sudah di level berbahaya!',
      },
      {
        title: 'Susun Blok-nya',
        description:
          'Di dalam "Berulang" pada blok Program, susun seperti ini:\n\n🔀 Jika → 💧 Air berbahaya?\n   Maka → 💡 LED Merah Nyala\nKalau Tidak → 💡 LED Merah Mati',
        icon: 'extension',
        tip: '"Berulang" terus mengecek kondisi sensor — pas banget buat alarm otomatis!',
      },
      {
        title: 'Simulasikan Banjir! 🚨',
        description:
          'Klik tombol "Sensor" di header untuk membuka panel sensor. Geser slider nilai sensor ke angka tinggi. LED harusnya menyala!\n\nKalau berhasil, klik "VALIDASI MISI" di bawah.',
        icon: 'rocket_launch',
        tip: 'Panel Sensor ada tombolnya di kanan atas workspace.',
      },
    ],
    validation: {
      requiredComponents: ['arduino', 'led', 'analogSensor'],
      pinConditions: [{ pin: '13', state: 'HIGH' }],
    },
  },
  {
    id: 'mission_03',
    level: 3,
    title: 'Detektor Gempa Bumi',
    icon: 'vibration',
    scenario:
      'Wilayah Lombok rawan gempa. Warga membutuhkan peringatan dini ketika tanah mulai bergetar agar bisa segera mengungsi.',
    objective:
      'Gunakan sensor getaran. Jika getaran kuat terdeteksi, bunyikan Buzzer.',
    hint: 'Buka 📡 Sensor, pakai blok "🔔 Getaran kuat?". Lalu di 💡 Aksi pakai "Buzzer berbunyi" dan "Buzzer berhenti".',
    steps: [
      {
        title: 'Waspadai Gempa! 🌍',
        description:
          'Lombok sering kena gempa. Kamu akan membuat detektor gempa yang otomatis membunyikan sirine (buzzer) saat tanah bergetar!',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description:
          'Cari blok-blok ini di panel kiri:\n• 📡 Sensor → "🔔 Getaran kuat?"\n• 💡 Aksi → "Buzzer berbunyi" dan "Buzzer berhenti"\n• 🔀 Logika → "Jika...Kalau Tidak"',
        icon: 'inventory_2',
        tip: 'Blok "🔔 Getaran kuat?" sudah otomatis mendeteksi kalau ada guncangan keras!',
      },
      {
        title: 'Susun Blok-nya',
        description:
          'Di dalam "Berulang" pada blok Program, susun seperti ini:\n\n🔀 Jika → 🔔 Getaran kuat?\n   Maka → Buzzer berbunyi\nKalau Tidak → Buzzer berhenti',
        icon: 'extension',
        tip: 'Coba atur angka ms di blok "Buzzer berbunyi". Semakin besar = bunyi lebih lama!',
      },
      {
        title: 'Simulasikan Gempa! 🔔',
        description:
          'Buka panel Sensor, lalu geser nilai sensor getaran ke atas untuk mensimulasikan getaran. Buzzer seharusnya berbunyi!\n\nKalau berhasil, klik "VALIDASI MISI" di bawah.',
        icon: 'rocket_launch',
      },
    ],
    validation: {
      requiredComponents: ['arduino', 'buzzer', 'analogSensor'],
      requiredConnections: [
        { fromType: 'arduino', fromHandle: 'GND_1', toType: 'buzzer', toHandle: 'cathode' },
      ],
    },
  },
  {
    id: 'mission_04',
    level: 4,
    title: 'Tombol Evakuasi Darurat',
    icon: 'emergency',
    scenario:
      'Pusat koordinasi bencana membutuhkan tombol fisik yang bisa ditekan petugas untuk mengaktifkan sirine evakuasi seluruh gedung.',
    objective:
      'Ketika Tombol 1 ditekan, LED Merah menyala DAN Buzzer berbunyi bersamaan.',
    hint: 'Buka 📡 Sensor, pakai blok "🔘 Tombol 1 ditekan?". Lalu gabungkan dengan blok LED dan Buzzer dari 💡 Aksi.',
    steps: [
      {
        title: 'Tombol Panik! 🚨',
        description:
          'Kantor BPBD butuh tombol darurat. Kalau tombol ditekan, langsung nyalakan lampu merah DAN sirine agar semua orang tahu harus evakuasi!',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description:
          'Cari blok-blok ini di panel kiri:\n• 📡 Sensor → "🔘 Tombol 1 ditekan?"\n• 💡 Aksi → "LED Merah Nyala", "LED Merah Mati"\n• 💡 Aksi → "Buzzer berbunyi", "Buzzer berhenti"\n• 🔀 Logika → "Jika...Kalau Tidak"',
        icon: 'inventory_2',
        tip: 'Kamu bisa taruh lebih dari satu blok di dalam "Maka" — blok dijalankan urut dari atas!',
      },
      {
        title: 'Susun Blok-nya',
        description:
          'Di dalam "Berulang", susun seperti ini:\n\n🔀 Jika → 🔘 Tombol 1 ditekan?\n   Maka → 💡 LED Merah Nyala\n           Buzzer berbunyi\nKalau Tidak → 💡 LED Merah Mati\n              Buzzer berhenti',
        icon: 'extension',
        tip: 'Pastikan blok LED dan Buzzer keduanya ada di dalam "Maka" biar nyala bersamaan!',
      },
      {
        title: 'Tekan Tombolnya! 🔴',
        description:
          'Klik tombol "Run" dan geser nilai Tombol 1 di panel Sensor. LED dan Buzzer harusnya aktif bersamaan!\n\nKalau berhasil, klik "VALIDASI MISI" di bawah.',
        icon: 'rocket_launch',
      },
    ],
    validation: {
      requiredComponents: ['arduino', 'led', 'buzzer', 'button'],
      pinConditions: [{ pin: '13', state: 'HIGH' }],
    },
  },
  {
    id: 'mission_05',
    level: 5,
    title: 'Sistem Kontrol Darurat Terpadu',
    icon: 'crisis_alert',
    scenario:
      'Shelter pengungsian butuh sistem pintar: LED hijau menyala jika aman, LED merah + sirine aktif jika sensor banjir kritis ATAU tombol panik ditekan.',
    objective:
      'Gabungkan sensor air, tombol, LED, dan Buzzer dalam satu logika blok. Siapkan respons berbeda untuk kondisi aman dan darurat.',
    hint: 'Di 🔀 Logika pakai blok "... ATAU ..." untuk gabungkan dua kondisi. Lalu pakai "Jika...Kalau Tidak" untuk beri respons berbeda.',
    steps: [
      {
        title: 'Sistem Pintar Shelter! 🏠',
        description:
          'Ini adalah misi tersulit! Kamu akan membuat sistem cerdas: LED Hijau = aman, LED Merah + sirine = bahaya. Bahaya terjadi kalau air naik ATAU tombol panik ditekan.',
        icon: 'auto_stories',
      },
      {
        title: 'Blok yang Kamu Butuhkan',
        description:
          'Kumpulkan semua blok ini dari panel kiri:\n• 📡 Sensor → "💧 Air berbahaya?"\n• 📡 Sensor → "🔘 Tombol 1 ditekan?"\n• 🔀 Logika → "... ATAU ..."\n• 🔀 Logika → "Jika...Kalau Tidak"\n• 💡 Aksi → LED Merah, LED Hijau, Buzzer',
        icon: 'inventory_2',
        tip: 'Ini misi terbanyak bloknya! Tenang, susun pelan-pelan satu per satu.',
      },
      {
        title: 'Susun Kondisi ATAU',
        description:
          'Pertama, buat kondisi gabungan dulu:\n\n🔀 Blok "... ATAU ..."\n  Kiri → 💧 Air berbahaya?\n  Kanan → 🔘 Tombol 1 ditekan?\n\nBlok ATAU ini yang jadi kondisi di blok "Jika".',
        icon: 'extension',
        tip: 'Blok "... ATAU ..." ada di kategori 🔀 Logika. Sambungkan dua blok sensor ke kiri dan kanannya!',
      },
      {
        title: 'Susun Logika Lengkap',
        description:
          'Di dalam "Berulang", susun:\n\n🔀 Jika → [💧 Air bahaya? ATAU 🔘 Tombol ditekan?]\n   Maka → 💡 LED Merah Nyala + Buzzer berbunyi\n           💡 LED Hijau Mati\nKalau Tidak → 💡 LED Hijau Nyala\n              💡 LED Merah Mati + Buzzer berhenti',
        icon: 'extension',
        tip: 'Blok "ATAU" dimasukkan ke dalam slot kondisi blok "Jika"!',
      },
      {
        title: 'Uji Semua Kondisi! 🎯',
        description:
          'Uji tiga kondisi:\n1. Normal: sensor rendah + tombol tidak ditekan → LED padam, sirine diam\n2. Banjir: naikkan sensor air → LED + sirine aktif\n3. Panik: tekan tombol → LED + sirine aktif\n\nKalau semua benar, klik VALIDASI MISI!',
        icon: 'rocket_launch',
        tip: 'Ini misi terakhir! Kalau berhasil, kamu sudah jadi insinyur bencana junior! 🏅',
      },
    ],
    validation: {
      requiredComponents: ['arduino', 'led', 'buzzer', 'button', 'analogSensor'],
    },
  },
];
