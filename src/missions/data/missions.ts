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

export interface Mission {
  id: string;
  level: number;
  title: string;
  icon: string;
  scenario: string;    // Short story context
  objective: string;   // What the student must do
  hint: string;        // Help if stuck
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
    objective: 'Sambungkan LED ke Arduino dan buat lampu menyala terus-menerus.',
    hint: 'Pasang kabel dari Pin 13 Arduino ke Anode (+) LED, lalu GND ke Cathode (-). Di Blockly, gunakan "Set Builtin LED ON" di dalam Setup.',
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
      'Hubungkan Water Sensor ke Arduino. Jika nilai sensor > 500, nyalakan LED merah.',
    hint: 'Gunakan blok "If [Read Analog Pin A0] > [500] Do Set Builtin LED HIGH". Sensor analog terhubung ke pin A0.',
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
      'Hubungkan Vibration Sensor ke Arduino. Jika getaran terdeteksi, bunyikan Buzzer.',
    hint: 'Gunakan Sensor Getaran sebagai input digital atau analog. Jika nilai getaran cukup tinggi, nyalakan Buzzer melalui digitalWrite.',
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
      'Pasang Pushbutton. Ketika tombol ditekan, LED menyala DAN Buzzer berbunyi secara bersamaan.',
    hint: 'Gunakan blok "If [Read Digital Pin 2] Do..." untuk membaca status tombol. Sambungkan tombol ke Pin 2 Arduino.',
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
      'Gabungkan Water Sensor, Button, LED, dan Buzzer dalam satu logika kontrol. Siapkan respons berbeda untuk kondisi normal dan darurat.',
    hint: 'Gunakan blok "If...Else" bersarang. Cek sensor air DAN kondisi tombol secara bersamaan dengan blok logika "OR".',
    validation: {
      requiredComponents: ['arduino', 'led', 'buzzer', 'button', 'analogSensor'],
    },
  },
];
