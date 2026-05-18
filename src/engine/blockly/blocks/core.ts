import * as Blockly from 'blockly/core';
import { arduinoGenerator } from '../arduinoGenerator';

// LED color → pin mapping (hidden from user)
const LED_PIN: Record<string, string> = {
  Merah: '10', Hijau: '11', Biru: '12', Bawaan: 'LED_BUILTIN',
};

export function defineCoreBlocks() {

  // ── 1. Program Utama ─────────────────────────────────────────
  Blockly.Blocks['resq_program'] = {
    init() {
      this.appendDummyInput().appendField('Program RESQ-BOX');
      this.appendStatementInput('SETUP').setCheck(null).appendField('Jalan Sekali');
      this.appendStatementInput('LOOP').setCheck(null).appendField('Berulang');
      this.setColour('#fd761a');
      this.setPreviousStatement(false);
      this.setNextStatement(false);
      this.setTooltip('"Jalan Sekali" dijalankan saat program mulai. "Berulang" diulang terus-menerus.');
    },
  };
  arduinoGenerator.forBlock['resq_program'] = function (block: Blockly.Block) {
    const setup = arduinoGenerator.statementToCode(block, 'SETUP') || '';
    const loop = arduinoGenerator.statementToCode(block, 'LOOP') || '';
    return `#include <Arduino.h>\n\nvoid setup() {\n  Serial.begin(9600);\n${setup}}\n\nvoid loop() {\n${loop}}\n`;
  };

  // ── 2. LED ───────────────────────────────────────────────────
  Blockly.Blocks['resq_led'] = {
    init() {
      this.appendDummyInput()
        .appendField('LED')
        .appendField(new Blockly.FieldDropdown([
          ['Merah', 'Merah'], ['Hijau', 'Hijau'], ['Biru', 'Biru'], ['Bawaan', 'Bawaan'],
        ]), 'COLOR')
        .appendField(new Blockly.FieldDropdown([
          ['Nyala', 'HIGH'], ['Mati', 'LOW'],
        ]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
    },
  };
  arduinoGenerator.forBlock['resq_led'] = function (block: Blockly.Block) {
    const color = block.getFieldValue('COLOR');
    const pin = LED_PIN[color] || '13';
    const state = block.getFieldValue('STATE');
    return `pinMode(${pin}, OUTPUT);\ndigitalWrite(${pin}, ${state}); // LED ${color}\n`;
  };

  // ── 3. Buzzer Berbunyi ───────────────────────────────────────
  Blockly.Blocks['resq_buzzer'] = {
    init() {
      this.appendDummyInput()
        .appendField('Buzzer berbunyi')
        .appendField(new Blockly.FieldNumber(1000, 100), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
    },
  };
  arduinoGenerator.forBlock['resq_buzzer'] = function (block: Blockly.Block) {
    const ms = block.getFieldValue('MS');
    return `tone(5, 1000, ${ms});\ndelay(${ms});\n`;
  };

  // ── 4. Buzzer Berhenti ──────────────────────────────────────
  Blockly.Blocks['resq_buzzer_stop'] = {
    init() {
      this.appendDummyInput().appendField('Buzzer berhenti');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
    },
  };
  arduinoGenerator.forBlock['resq_buzzer_stop'] = function () {
    return `noTone(5);\n`;
  };

  // ── 5. Motor ─────────────────────────────────────────────────
  Blockly.Blocks['resq_motor'] = {
    init() {
      this.appendDummyInput()
        .appendField('Motor')
        .appendField(new Blockly.FieldDropdown([
          ['Berhenti', '0'], ['Pelan', '85'], ['Sedang', '170'], ['Cepat', '255'],
        ]), 'SPEED');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
    },
  };
  arduinoGenerator.forBlock['resq_motor'] = function (block: Blockly.Block) {
    return `analogWrite(6, ${block.getFieldValue('SPEED')});\n`;
  };

  // ── 6. Servo / Pintu ─────────────────────────────────────────
  Blockly.Blocks['resq_servo'] = {
    init() {
      this.appendDummyInput()
        .appendField('Pintu')
        .appendField(new Blockly.FieldDropdown([
          ['Tutup', '0'], ['Setengah', '90'], ['Buka', '180'],
        ]), 'POS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
    },
  };
  arduinoGenerator.forBlock['resq_servo'] = function (block: Blockly.Block) {
    return `// Servo (pin 9)\nservo_9.write(${block.getFieldValue('POS')});\n`;
  };

  // ── 7. Tunggu ────────────────────────────────────────────────
  Blockly.Blocks['resq_tunggu'] = {
    init() {
      this.appendDummyInput()
        .appendField('Tunggu')
        .appendField(new Blockly.FieldNumber(1000, 0), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
    },
  };
  arduinoGenerator.forBlock['resq_tunggu'] = function (block: Blockly.Block) {
    return `delay(${block.getFieldValue('MS')});\n`;
  };

  // ── 8. Tampilkan ─────────────────────────────────────────────
  Blockly.Blocks['resq_tampil'] = {
    init() {
      this.appendValueInput('VALUE').setCheck(null).appendField('Tampilkan');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
    },
  };
  arduinoGenerator.forBlock['resq_tampil'] = function (block: Blockly.Block) {
    const val = arduinoGenerator.valueToCode(block, 'VALUE', 0) || '""';
    return `Serial.println(${val});\n`;
  };

  // ── 9. Sensor Air ────────────────────────────────────────────
  Blockly.Blocks['resq_sensor_air'] = {
    init() {
      this.appendDummyInput().appendField('💧 Nilai Sensor Air');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
      this.setTooltip('Nilai 0-1023. Semakin tinggi = air semakin banyak.');
    },
  };
  arduinoGenerator.forBlock['resq_sensor_air'] = function () {
    return [`analogRead(A0)`, 0];
  };

  // ── 10. Sensor Getaran ───────────────────────────────────────
  Blockly.Blocks['resq_sensor_getar'] = {
    init() {
      this.appendDummyInput().appendField('🔔 Nilai Sensor Getaran');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
      this.setTooltip('Nilai 0-1023. Semakin tinggi = getaran semakin kuat.');
    },
  };
  arduinoGenerator.forBlock['resq_sensor_getar'] = function () {
    return [`analogRead(A1)`, 0];
  };

  // ── 11. Sensor Suhu ──────────────────────────────────────────
  Blockly.Blocks['resq_sensor_suhu'] = {
    init() {
      this.appendDummyInput().appendField('🌡️ Nilai Suhu (°C)');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
    },
  };
  arduinoGenerator.forBlock['resq_sensor_suhu'] = function () {
    return [`(analogRead(A2) * 0.4887)`, 0];
  };

  // ── 12. Tombol 1 ─────────────────────────────────────────────
  Blockly.Blocks['resq_tombol_1'] = {
    init() {
      this.appendDummyInput().appendField('🔘 Tombol 1 ditekan?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
    },
  };
  arduinoGenerator.forBlock['resq_tombol_1'] = function () {
    return [`digitalRead(2) == HIGH`, 0];
  };

  // ── 13. Tombol 2 ─────────────────────────────────────────────
  Blockly.Blocks['resq_tombol_2'] = {
    init() {
      this.appendDummyInput().appendField('🔘 Tombol 2 ditekan?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
    },
  };
  arduinoGenerator.forBlock['resq_tombol_2'] = function () {
    return [`digitalRead(3) == HIGH`, 0];
  };

  // ── 14. Jika...Maka ──────────────────────────────────────────
  Blockly.Blocks['resq_jika'] = {
    init() {
      this.appendValueInput('KONDISI').setCheck(null).appendField('Jika');
      this.appendStatementInput('MAKA').setCheck(null).appendField('Maka');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DB2777');
      this.setTooltip('Lakukan sesuatu HANYA JIKA kondisi terpenuhi.');
    },
  };
  arduinoGenerator.forBlock['resq_jika'] = function (block: Blockly.Block) {
    const cond = arduinoGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
    const maka = arduinoGenerator.statementToCode(block, 'MAKA') || '';
    return `if (${cond}) {\n${maka}}\n`;
  };

  // ── 15. Jika...Maka...Kalau Tidak ────────────────────────────
  Blockly.Blocks['resq_jika_tidak'] = {
    init() {
      this.appendValueInput('KONDISI').setCheck(null).appendField('Jika');
      this.appendStatementInput('MAKA').setCheck(null).appendField('Maka');
      this.appendStatementInput('TIDAK').setCheck(null).appendField('Kalau Tidak');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#DB2777');
      this.setTooltip('Pilih satu dari dua kemungkinan tindakan.');
    },
  };
  arduinoGenerator.forBlock['resq_jika_tidak'] = function (block: Blockly.Block) {
    const cond = arduinoGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
    const maka = arduinoGenerator.statementToCode(block, 'MAKA') || '';
    const tidak = arduinoGenerator.statementToCode(block, 'TIDAK') || '';
    return `if (${cond}) {\n${maka}} else {\n${tidak}}\n`;
  };

  // ── 16. Perbandingan ─────────────────────────────────────────
  Blockly.Blocks['resq_bandingkan'] = {
    init() {
      this.appendValueInput('A').setCheck('Number');
      this.appendDummyInput().appendField(new Blockly.FieldDropdown([
        ['lebih dari', '>'], ['kurang dari', '<'],
        ['sama dengan', '=='], ['tidak sama dengan', '!='],
        ['lebih dari atau sama', '>='], ['kurang dari atau sama', '<='],
      ]), 'OP');
      this.appendValueInput('B').setCheck('Number');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour('#DB2777');
    },
  };
  arduinoGenerator.forBlock['resq_bandingkan'] = function (block: Blockly.Block) {
    const op = block.getFieldValue('OP');
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || '0';
    return [`${a} ${op} ${b}`, 0];
  };

  // ── 17. DAN / ATAU ───────────────────────────────────────────
  Blockly.Blocks['resq_dan_atau'] = {
    init() {
      this.appendValueInput('A').setCheck('Boolean');
      this.appendDummyInput().appendField(new Blockly.FieldDropdown([
        ['DAN', 'AND'], ['ATAU', 'OR'],
      ]), 'OP');
      this.appendValueInput('B').setCheck('Boolean');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour('#DB2777');
    },
  };
  arduinoGenerator.forBlock['resq_dan_atau'] = function (block: Blockly.Block) {
    const op = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || 'false';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || 'false';
    return [`${a} ${op} ${b}`, 0];
  };

  // ── 18. Angka ────────────────────────────────────────────────
  arduinoGenerator.forBlock['math_number'] = function (block: Blockly.Block) {
    return [String(block.getFieldValue('NUM') || '0'), 0];
  };

  // ── 19. Teks ─────────────────────────────────────────────────
  Blockly.Blocks['resq_teks'] = {
    init() {
      this.appendDummyInput()
        .appendField('"')
        .appendField(new Blockly.FieldTextInput('halo'), 'TEXT')
        .appendField('"');
      this.setOutput(true, 'String');
      this.setColour('#64748B');
    },
  };
  arduinoGenerator.forBlock['resq_teks'] = function (block: Blockly.Block) {
    return [`"${block.getFieldValue('TEXT')}"`, 0];
  };

  // ── 20. Ulangi N Kali ────────────────────────────────────────
  Blockly.Blocks['resq_ulangi'] = {
    init() {
      this.appendDummyInput()
        .appendField('Ulangi')
        .appendField(new Blockly.FieldNumber(3, 1, 100), 'KALI')
        .appendField('kali');
      this.appendStatementInput('DO').setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Lakukan sesuatu beberapa kali berulang.');
    },
  };
  arduinoGenerator.forBlock['resq_ulangi'] = function (block: Blockly.Block) {
    const n = block.getFieldValue('KALI');
    const body = arduinoGenerator.statementToCode(block, 'DO') || '';
    return `for (int _i = 0; _i < ${n}; _i++) {\n${body}}\n`;
  };

  // ── 21. Bukan (NOT) ──────────────────────────────────────────
  Blockly.Blocks['resq_bukan'] = {
    init() {
      this.appendValueInput('KONDISI').setCheck('Boolean').appendField('Bukan');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour('#DB2777');
      this.setTooltip('Membalikkan kondisi: Bukan Benar = Salah, Bukan Salah = Benar.');
    },
  };
  arduinoGenerator.forBlock['resq_bukan'] = function (block: Blockly.Block) {
    const val = arduinoGenerator.valueToCode(block, 'KONDISI', 0) || 'false';
    return [`!(${val})`, 0];
  };

  // ── 22. Hitung (Math) ────────────────────────────────────────
  Blockly.Blocks['resq_hitung'] = {
    init() {
      this.appendValueInput('A').setCheck('Number');
      this.appendDummyInput().appendField(new Blockly.FieldDropdown([
        ['tambah (+)', '+'], ['kurang (-)', '-'],
        ['kali (×)', '*'],  ['bagi (÷)', '/'],
      ]), 'OP');
      this.appendValueInput('B').setCheck('Number');
      this.setInputsInline(true);
      this.setOutput(true, 'Number');
      this.setColour('#64748B');
      this.setTooltip('Operasi matematika sederhana antara dua angka.');
    },
  };
  arduinoGenerator.forBlock['resq_hitung'] = function (block: Blockly.Block) {
    const op = block.getFieldValue('OP');
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || '0';
    return [`(${a} ${op} ${b})`, 0];
  };

  // ── 23. Alarm Darurat ────────────────────────────────────────
  Blockly.Blocks['resq_alarm_darurat'] = {
    init() {
      this.appendDummyInput()
        .appendField('🚨 Alarm Darurat')
        .appendField(new Blockly.FieldNumber(3, 1, 10), 'KALI')
        .appendField('kali');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#EF4444');
      this.setTooltip('LED merah berkedip + buzzer berbunyi beberapa kali sebagai tanda bahaya!');
    },
  };
  arduinoGenerator.forBlock['resq_alarm_darurat'] = function (block: Blockly.Block) {
    const n = block.getFieldValue('KALI');
    return `// Alarm Darurat ${n}x\nfor (int _a = 0; _a < ${n}; _a++) {\n  digitalWrite(10, HIGH);\n  tone(5, 2000, 300);\n  delay(300);\n  digitalWrite(10, LOW);\n  noTone(5);\n  delay(200);\n}\n`;
  };

  // ── 24. LED Kedip ────────────────────────────────────────────
  Blockly.Blocks['resq_led_kedip'] = {
    init() {
      this.appendDummyInput()
        .appendField('LED')
        .appendField(new Blockly.FieldDropdown([
          ['Merah', 'Merah'], ['Hijau', 'Hijau'], ['Biru', 'Biru'], ['Bawaan', 'Bawaan'],
        ]), 'COLOR')
        .appendField('kedip')
        .appendField(new Blockly.FieldNumber(3, 1, 20), 'KALI')
        .appendField('kali');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Membuat LED berkedip beberapa kali.');
    },
  };
  arduinoGenerator.forBlock['resq_led_kedip'] = function (block: Blockly.Block) {
    const color = block.getFieldValue('COLOR');
    const pin = LED_PIN[color] || '13';
    const n = block.getFieldValue('KALI');
    return `// LED ${color} kedip ${n}x\npinMode(${pin}, OUTPUT);\nfor (int _k = 0; _k < ${n}; _k++) {\n  digitalWrite(${pin}, HIGH);\n  delay(400);\n  digitalWrite(${pin}, LOW);\n  delay(400);\n}\n`;
  };

  // ── 25. Matikan Semua LED ────────────────────────────────────
  Blockly.Blocks['resq_semua_led_mati'] = {
    init() {
      this.appendDummyInput().appendField('💡 Matikan Semua LED');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
    },
  };
  arduinoGenerator.forBlock['resq_semua_led_mati'] = function () {
    return `digitalWrite(10, LOW); // Merah\ndigitalWrite(11, LOW); // Hijau\ndigitalWrite(12, LOW); // Biru\ndigitalWrite(LED_BUILTIN, LOW);\n`;
  };

  // ── 26. Buzzer Nada ──────────────────────────────────────────
  Blockly.Blocks['resq_buzzer_nada'] = {
    init() {
      this.appendDummyInput()
        .appendField('Buzzer nada')
        .appendField(new Blockly.FieldDropdown([
          ['Tinggi', '3000'], ['Sedang', '1500'], ['Rendah', '500'],
        ]), 'FREQ')
        .appendField('selama')
        .appendField(new Blockly.FieldNumber(500, 100), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Mainkan nada dengan pitch tertentu.');
    },
  };
  arduinoGenerator.forBlock['resq_buzzer_nada'] = function (block: Blockly.Block) {
    const freq = block.getFieldValue('FREQ');
    const ms = block.getFieldValue('MS');
    return `tone(5, ${freq}, ${ms});\ndelay(${ms});\n`;
  };

  // ── 27. Air Bahaya? ──────────────────────────────────────────
  Blockly.Blocks['resq_air_bahaya'] = {
    init() {
      this.appendDummyInput().appendField('💧 Air berbahaya?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Benar jika sensor air menunjukkan level BERBAHAYA (>800/1023).');
    },
  };
  arduinoGenerator.forBlock['resq_air_bahaya'] = function () {
    return [`analogRead(A0) > 800`, 0];
  };

  // ── 28. Air Waspada? ─────────────────────────────────────────
  Blockly.Blocks['resq_air_waspada'] = {
    init() {
      this.appendDummyInput().appendField('💧 Air perlu waspada?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Benar jika sensor air menunjukkan level WASPADA (>400/1023).');
    },
  };
  arduinoGenerator.forBlock['resq_air_waspada'] = function () {
    return [`analogRead(A0) > 400`, 0];
  };

  // ── 29. Getaran Kuat? ────────────────────────────────────────
  Blockly.Blocks['resq_getar_kuat'] = {
    init() {
      this.appendDummyInput().appendField('🔔 Getaran kuat?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Benar jika sensor getaran mendeteksi guncangan KUAT (>700/1023).');
    },
  };
  arduinoGenerator.forBlock['resq_getar_kuat'] = function () {
    return [`analogRead(A1) > 700`, 0];
  };

  // ── 30. Suhu Panas? ──────────────────────────────────────────
  Blockly.Blocks['resq_suhu_panas'] = {
    init() {
      this.appendDummyInput().appendField('🌡️ Suhu panas? (>35°C)');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Benar jika suhu di atas 35 derajat Celsius.');
    },
  };
  arduinoGenerator.forBlock['resq_suhu_panas'] = function () {
    return [`(analogRead(A2) * 0.4887) > 35.0`, 0];
  };
}

