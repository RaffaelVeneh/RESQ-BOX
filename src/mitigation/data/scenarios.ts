// ============================================================
// RESQ-BOX — Mitigasi Bencana Scenarios
// Puzzle mode: siswa menyusun urutan tindakan yang benar
// ============================================================

export interface MitigationAction {
  id: string;
  label: string;         // Tindakan yang ditampilkan
  icon: string;          // Material Symbols icon name
  isCorrect: boolean;    // false = blok pengecoh (wrong answer)
  explanation: string;   // Penjelasan kenapa benar/salah
}

export interface MitigationScenario {
  id: string;
  disaster: 'gempa' | 'banjir' | 'kebakaran' | 'tsunami' | 'evakuasi';
  level: number;
  title: string;
  subtitle: string;      // Konteks singkat situasi
  description: string;   // Narasi lengkap skenario
  icon: string;
  color: string;         // Tailwind bg color untuk card
  borderColor: string;
  correctOrder: string[];  // Array ID tindakan yang benar, dalam urutan
  actions: MitigationAction[];
}

export const MITIGATION_SCENARIOS: MitigationScenario[] = [
  // ─────────────────────────────────────────────
  // Level 1: Gempa Bumi
  // ─────────────────────────────────────────────
  {
    id: 'gempa-dalam-gedung',
    disaster: 'gempa',
    level: 1,
    title: 'Gempa di Dalam Gedung!',
    subtitle: 'Kamu sedang belajar di kelas saat gempa terjadi',
    description:
      'Tiba-tiba lantai bergetar, meja dan kursi bergoyang. Lampu berkedip-kedip. Gempa bumi sedang terjadi! Apa yang harus kamu lakukan?',
    icon: 'earthquake',
    color: 'bg-[#FEF3C7]',
    borderColor: 'border-[#F59E0B]',
    correctOrder: ['duck', 'cover', 'hold', 'evacuate', 'assembly'],
    actions: [
      {
        id: 'duck',
        label: 'Berlindung di bawah meja yang kuat',
        icon: 'table_restaurant',
        isCorrect: true,
        explanation: 'Benar! Meja melindungi kamu dari benda yang jatuh.',
      },
      {
        id: 'cover',
        label: 'Lindungi kepala dengan tangan',
        icon: 'back_hand',
        isCorrect: true,
        explanation: 'Benar! Kepala harus terlindungi dari reruntuhan.',
      },
      {
        id: 'hold',
        label: 'Tunggu hingga guncangan berhenti',
        icon: 'timer',
        isCorrect: true,
        explanation: 'Benar! Jangan berlari saat gempa masih berlangsung.',
      },
      {
        id: 'evacuate',
        label: 'Evakuasi ke luar dengan tertib',
        icon: 'directions_run',
        isCorrect: true,
        explanation: 'Benar! Setelah gempa berhenti, keluar dengan tenang melalui tangga.',
      },
      {
        id: 'assembly',
        label: 'Kumpul di titik evakuasi',
        icon: 'groups',
        isCorrect: true,
        explanation: 'Benar! Titik kumpul membuat semua orang bisa dihitung.',
      },
      {
        id: 'run-during',
        label: 'Langsung berlari keluar saat gempa',
        icon: 'sprint',
        isCorrect: false,
        explanation: 'Salah! Berlari saat gempa justru berbahaya karena kamu bisa jatuh atau terkena benda jatuh.',
      },
      {
        id: 'lift',
        label: 'Gunakan lift untuk turun',
        icon: 'elevator',
        isCorrect: false,
        explanation: 'Salah! Jangan gunakan lift saat gempa. Gunakan tangga darurat!',
      },
      {
        id: 'window',
        label: 'Berdiri dekat jendela untuk kabur',
        icon: 'window',
        isCorrect: false,
        explanation: 'Salah! Jendela bisa pecah dan melukai kamu saat gempa.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Level 2: Banjir
  // ─────────────────────────────────────────────
  {
    id: 'banjir-rumah',
    disaster: 'banjir',
    level: 2,
    title: 'Air Mulai Masuk Rumah!',
    subtitle: 'Hujan deras semalaman, air sungai meluap',
    description:
      'Pagi-pagi kamu melihat air mulai masuk dari bawah pintu. Air hujan terus turun dan sungai di dekat rumahmu meluap. Banjir akan segera tiba!',
    icon: 'flood',
    color: 'bg-[#DBEAFE]',
    borderColor: 'border-[#3B82F6]',
    correctOrder: ['alert-family', 'move-valuables', 'turn-off-electric', 'go-high', 'contact-rescue'],
    actions: [
      {
        id: 'alert-family',
        label: 'Bangunkan dan beritahu seluruh keluarga',
        icon: 'family_restroom',
        isCorrect: true,
        explanation: 'Benar! Semua anggota keluarga harus tahu dan siap mengungsi.',
      },
      {
        id: 'move-valuables',
        label: 'Pindahkan dokumen penting ke tempat tinggi',
        icon: 'folder_open',
        isCorrect: true,
        explanation: 'Benar! Dokumen seperti KTP, akta kelahiran, dan sertifikat harus diselamatkan.',
      },
      {
        id: 'turn-off-electric',
        label: 'Matikan listrik dari MCB',
        icon: 'electrical_services',
        isCorrect: true,
        explanation: 'Benar! Listrik dan air adalah kombinasi berbahaya. MCB harus dimatikan sebelum air masuk.',
      },
      {
        id: 'go-high',
        label: 'Segera pergi ke tempat yang lebih tinggi',
        icon: 'terrain',
        isCorrect: true,
        explanation: 'Benar! Evakuasi ke tempat tinggi adalah prioritas utama.',
      },
      {
        id: 'contact-rescue',
        label: 'Hubungi BPBD atau tim penyelamat',
        icon: 'phone_in_talk',
        isCorrect: true,
        explanation: 'Benar! Tim penyelamat perlu tahu posisimu untuk membantu.',
      },
      {
        id: 'stay-home',
        label: 'Tetap di rumah dan tunggu bantuan',
        icon: 'home',
        isCorrect: false,
        explanation: 'Salah! Banjir bisa naik cepat. Jangan tunggu di rumah jika air sudah masuk!',
      },
      {
        id: 'swim',
        label: 'Berenang melewati banjir ke tempat aman',
        icon: 'pool',
        isCorrect: false,
        explanation: 'Salah! Arus banjir sangat kuat. Jangan coba-coba berenang melintasinya!',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Level 3: Kebakaran
  // ─────────────────────────────────────────────
  {
    id: 'kebakaran-sekolah',
    disaster: 'kebakaran',
    level: 3,
    title: 'Asap Terlihat di Koridor Sekolah!',
    subtitle: 'Alarm kebakaran berbunyi saat jam pelajaran',
    description:
      'Alarm kebakaran tiba-tiba berbunyi keras. Kamu melihat asap tipis mengalir dari bawah pintu kelas. Bau terbakar tercium. Harus bagaimana?',
    icon: 'local_fire_department',
    color: 'bg-[#FEE2E2]',
    borderColor: 'border-[#EF4444]',
    correctOrder: ['alarm', 'low-position', 'close-door', 'evacuate-stairs', 'meeting-point'],
    actions: [
      {
        id: 'alarm',
        label: 'Aktifkan alarm kebakaran jika belum bunyi',
        icon: 'notifications_active',
        isCorrect: true,
        explanation: 'Benar! Semua orang harus tahu ada kebakaran segera.',
      },
      {
        id: 'low-position',
        label: 'Merangkak rendah agar tidak menghirup asap',
        icon: 'accessibility_new',
        isCorrect: true,
        explanation: 'Benar! Asap panas naik ke atas. Udara bersih ada di dekat lantai.',
      },
      {
        id: 'close-door',
        label: 'Tutup pintu di belakangmu (jangan dikunci)',
        icon: 'door_front',
        isCorrect: true,
        explanation: 'Benar! Pintu tertutup memperlambat penyebaran api dan asap.',
      },
      {
        id: 'evacuate-stairs',
        label: 'Evakuasi melalui tangga darurat',
        icon: 'stairs',
        isCorrect: true,
        explanation: 'Benar! Tangga darurat adalah jalur evakuasi yang aman saat kebakaran.',
      },
      {
        id: 'meeting-point',
        label: 'Berkumpul di titik kumpul sekolah',
        icon: 'location_on',
        isCorrect: true,
        explanation: 'Benar! Titik kumpul memastikan semua orang sudah aman dan bisa dihitung.',
      },
      {
        id: 'use-lift',
        label: 'Gunakan lift untuk turun lebih cepat',
        icon: 'elevator',
        isCorrect: false,
        explanation: 'Salah! Lift bisa mati saat kebakaran dan menjebakmu di dalamnya.',
      },
      {
        id: 'open-window',
        label: 'Buka jendela agar asap keluar',
        icon: 'window',
        isCorrect: false,
        explanation: 'Salah! Membuka jendela bisa memasukkan udara segar yang justru membuat api semakin besar.',
      },
      {
        id: 'hide-closet',
        label: 'Bersembunyi di dalam lemari',
        icon: 'door_sliding',
        isCorrect: false,
        explanation: 'Salah! Jangan bersembunyi! Tim penyelamat tidak akan bisa menemukanmu.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Level 4: Tsunami
  // ─────────────────────────────────────────────
  {
    id: 'tsunami-pantai',
    disaster: 'tsunami',
    level: 4,
    title: 'Tsunami! Air Laut Surut Mendadak',
    subtitle: 'Kamu sedang berwisata di pantai',
    description:
      'Kamu sedang bermain di pantai ketika tiba-tiba gempa terasa. Beberapa menit kemudian, air laut terlihat surut sangat jauh dan cepat. Ini tanda-tanda tsunami!',
    icon: 'tsunami',
    color: 'bg-[#EDE9FE]',
    borderColor: 'border-[#8B5CF6]',
    correctOrder: ['recognize', 'run-inland', 'go-high-ground', 'dont-return', 'wait-official'],
    actions: [
      {
        id: 'recognize',
        label: 'Kenali tanda: air surut, gempa, suara gemuruh',
        icon: 'warning',
        isCorrect: true,
        explanation: 'Benar! Mengenali tanda-tanda tsunami adalah langkah pertama yang penting.',
      },
      {
        id: 'run-inland',
        label: 'Lari menjauhi pantai ke arah daratan',
        icon: 'directions_run',
        isCorrect: true,
        explanation: 'Benar! Jauhi pantai sejauh dan secepat mungkin.',
      },
      {
        id: 'go-high-ground',
        label: 'Cari dan naiki tempat tinggi (bukit/gedung)',
        icon: 'landscape',
        isCorrect: true,
        explanation: 'Benar! Ketinggian adalah perlindungan terbaik dari tsunami.',
      },
      {
        id: 'dont-return',
        label: 'Jangan kembali ke pantai walau air sudah tenang',
        icon: 'block',
        isCorrect: true,
        explanation: 'Benar! Tsunami bisa datang beberapa gelombang. Gelombang kedua bisa lebih besar.',
      },
      {
        id: 'wait-official',
        label: 'Tunggu pengumuman resmi sebelum kembali',
        icon: 'campaign',
        isCorrect: true,
        explanation: 'Benar! Hanya kembali setelah pihak berwenang menyatakan aman.',
      },
      {
        id: 'watch-wave',
        label: 'Berdiri di pantai untuk melihat gelombangnya',
        icon: 'visibility',
        isCorrect: false,
        explanation: 'Salah! Jangan berhenti untuk menonton! Gelombang tsunami datang sangat cepat.',
      },
      {
        id: 'hide-behind-tree',
        label: 'Berlindung di balik pohon kelapa',
        icon: 'park',
        isCorrect: false,
        explanation: 'Salah! Pohon tidak akan melindungimu dari gelombang tsunami yang sangat kuat.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Level 5: Evakuasi Terpadu
  // ─────────────────────────────────────────────
  {
    id: 'evakuasi-komunitas',
    disaster: 'evakuasi',
    level: 5,
    title: 'Simulasi Evakuasi Komunitas',
    subtitle: 'Kamu adalah koordinator evakuasi RT',
    description:
      'Bencana akan terjadi dan kamu bertugas memimpin evakuasi warga RT-mu. Ada 50 orang yang harus dievakuasi termasuk lansia dan anak kecil. Apa yang harus kamu lakukan pertama?',
    icon: 'emergency',
    color: 'bg-[#DCFCE7]',
    borderColor: 'border-[#16A34A]',
    correctOrder: ['announce', 'priority-group', 'transport', 'route', 'headcount', 'report'],
    actions: [
      {
        id: 'announce',
        label: 'Umumkan evakuasi melalui toa/pengeras suara',
        icon: 'campaign',
        isCorrect: true,
        explanation: 'Benar! Semua warga harus mendapat informasi secepat mungkin.',
      },
      {
        id: 'priority-group',
        label: 'Dahulukan lansia, ibu hamil, dan anak kecil',
        icon: 'accessible',
        isCorrect: true,
        explanation: 'Benar! Kelompok rentan butuh bantuan dan prioritas evakuasi.',
      },
      {
        id: 'transport',
        label: 'Siapkan kendaraan evakuasi',
        icon: 'directions_bus',
        isCorrect: true,
        explanation: 'Benar! Kendaraan diperlukan untuk warga yang tidak bisa jalan jauh.',
      },
      {
        id: 'route',
        label: 'Gunakan jalur evakuasi yang sudah ditentukan',
        icon: 'route',
        isCorrect: true,
        explanation: 'Benar! Jalur evakuasi sudah direncanakan untuk menghindari area berbahaya.',
      },
      {
        id: 'headcount',
        label: 'Hitung jumlah warga di titik kumpul',
        icon: 'how_to_reg',
        isCorrect: true,
        explanation: 'Benar! Pastikan tidak ada yang tertinggal dengan melakukan penghitungan.',
      },
      {
        id: 'report',
        label: 'Laporkan kondisi ke posko utama BPBD',
        icon: 'assignment',
        isCorrect: true,
        explanation: 'Benar! Koordinasi dengan posko utama penting untuk penanganan bencana yang terorganisir.',
      },
      {
        id: 'selfie',
        label: 'Dokumentasi dulu untuk media sosial',
        icon: 'photo_camera',
        isCorrect: false,
        explanation: 'Salah! Keselamatan jiwa jauh lebih penting dari dokumentasi media sosial!',
      },
      {
        id: 'wait-order',
        label: 'Tunggu perintah dari pemerintah dulu',
        icon: 'pending',
        isCorrect: false,
        explanation: 'Salah! Dalam kondisi darurat, evakuasi mandiri bisa dimulai tanpa menunggu.',
      },
    ],
  },
];
