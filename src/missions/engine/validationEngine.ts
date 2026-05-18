import type { Mission } from '../data/missions';

interface ValidationResult {
  passed: boolean;
  failureReason?: string;
}

export function validateMission(
  mission: Mission,
  blocks: string[],
  generatedCode: string
): ValidationResult {
  const { validation } = mission;

  // --- Check 1: Required Blocks ---
  if (validation.requiredBlocks) {
    for (const requiredType of validation.requiredBlocks) {
      if (!blocks.includes(requiredType)) {
        const labels: Record<string, string> = {
          resq_program: 'Program RESQ-BOX',
          resq_led: 'LED',
          resq_buzzer: 'Buzzer berbunyi',
          resq_buzzer_stop: 'Buzzer berhenti',
          resq_sensor_air: 'Nilai Sensor Air',
          resq_sensor_getar: 'Nilai Sensor Getaran',
          resq_sensor_suhu: 'Nilai Suhu',
          resq_tombol_1: 'Tombol 1 ditekan?',
          resq_tombol_2: 'Tombol 2 ditekan?',
          resq_jika: 'Jika...Maka',
          resq_jika_tidak: 'Jika...Maka...Kalau Tidak',
          resq_bandingkan: 'Blok Perbandingan (>, <, ==)',
          resq_dan_atau: 'Blok DAN / ATAU',
          resq_alarm_darurat: 'Alarm Darurat',
          resq_led_kedip: 'LED Kedip',
          resq_semua_led_mati: 'Matikan Semua LED',
          resq_air_bahaya: 'Air berbahaya?',
          resq_air_waspada: 'Air perlu waspada?',
          resq_getar_kuat: 'Getaran kuat?',
          resq_suhu_panas: 'Suhu panas?',
        };
        return {
          passed: false,
          failureReason: `Blok yang diperlukan belum ada di kanvas: ${labels[requiredType] ?? requiredType}`,
        };
      }
    }
  }

  // --- Check 2: Required Code Strings ---
  if (validation.codeContains) {
    for (const reqCode of validation.codeContains) {
      if (!generatedCode.includes(reqCode)) {
        return {
          passed: false,
          failureReason: `Susunan blok sepertinya belum tepat. Pastikan kamu meletakkan blok sesuai petunjuk misi. Coba cek lagi ya!`,
        };
      }
    }
  }

  return { passed: true };
}
