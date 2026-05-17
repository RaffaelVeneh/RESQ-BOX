import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// ── arduino_setup_loop ──────────────────────────────────────────
javascriptGenerator.forBlock['arduino_setup_loop'] = function(block: Blockly.Block) {
  const setup = javascriptGenerator.statementToCode(block, 'SETUP');
  const loop = javascriptGenerator.statementToCode(block, 'LOOP');
  return `
async function setup() {
  await api.print('🚀 Program dimulai', 'system');
${setup}
}

async function loop() {
${loop}
}
`;
};

// ── arduino_pin_mode — no-op in JS (handled by hardware sim) ───
javascriptGenerator.forBlock['arduino_pin_mode'] = function() { return ''; };

// ── arduino_led_write ───────────────────────────────────────────
javascriptGenerator.forBlock['arduino_led_write'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN') === 'LED_BUILTIN' ? '13' : block.getFieldValue('PIN');
  const state = block.getFieldValue('STATE');
  const color = block.getFieldValue('COLOR');
  const label = state === 'HIGH' ? 'nyala 💡' : 'mati';
  return `await api.setPin('${pin}', '${state}');\nawait api.print('LED ${color} ${label}', 'success');\n`;
};

// ── arduino_digital_write ───────────────────────────────────────
javascriptGenerator.forBlock['arduino_digital_write'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN') === 'LED_BUILTIN' ? '13' : block.getFieldValue('PIN');
  const state = block.getFieldValue('STATE');
  return `await api.setPin('${pin}', '${state}');\n`;
};

// ── led_builtin_set ─────────────────────────────────────────────
javascriptGenerator.forBlock['led_builtin_set'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  const label = state === 'HIGH' ? 'nyala 💡' : 'mati';
  return `await api.setPin('13', '${state}');\nawait api.print('LED Bawaan ${label}', 'success');\n`;
};

// ── arduino_buzzer ──────────────────────────────────────────────
javascriptGenerator.forBlock['arduino_buzzer'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  const ms = block.getFieldValue('MS');
  return `await api.print('🔊 Buzzer (pin ${pin}) berbunyi selama ${ms}ms', 'info');\nawait api.delay(${ms});\n`;
};

// ── arduino_buzzer_stop ─────────────────────────────────────────
javascriptGenerator.forBlock['arduino_buzzer_stop'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return `await api.print('🔇 Buzzer (pin ${pin}) berhenti', 'warn');\n`;
};

// ── arduino_motor_speed ─────────────────────────────────────────
javascriptGenerator.forBlock['arduino_motor_speed'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  const speed = block.getFieldValue('SPEED');
  const pct = Math.round((parseInt(speed) / 255) * 100);
  return `await api.print('⚙️ Motor (pin ${pin}) kecepatan ${speed}/255 (${pct}%)', 'info');\n`;
};

// ── arduino_servo ───────────────────────────────────────────────
javascriptGenerator.forBlock['arduino_servo'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  const angle = block.getFieldValue('ANGLE');
  return `await api.print('🔄 Servo (pin ${pin}) berputar ke ${angle}°', 'info');\n`;
};

// ── arduino_delay ───────────────────────────────────────────────
javascriptGenerator.forBlock['arduino_delay'] = function(block: Blockly.Block) {
  return `await api.delay(${block.getFieldValue('MS')});\n`;
};

// ── arduino_serial_print ────────────────────────────────────────
javascriptGenerator.forBlock['arduino_serial_print'] = function(block: Blockly.Block) {
  const val = javascriptGenerator.valueToCode(block, 'VALUE', 0) || '""';
  return `await api.print(String(${val}), 'info');\n`;
};

// ── arduino_digital_read ────────────────────────────────────────
javascriptGenerator.forBlock['arduino_digital_read'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return [`api.getPin('D${pin}') === true`, 99];
};

// ── arduino_analog_read ─────────────────────────────────────────
javascriptGenerator.forBlock['arduino_analog_read'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return [`api.getSensor('${pin}')`, 99];
};

// ── arduino_vibration_read ──────────────────────────────────────
javascriptGenerator.forBlock['arduino_vibration_read'] = function() {
  return [`api.getSensor('A1')`, 99];
};

// ── arduino_water_read ──────────────────────────────────────────
javascriptGenerator.forBlock['arduino_water_read'] = function() {
  return [`api.getSensor('A0')`, 99];
};

// ── arduino_temp_read ───────────────────────────────────────────
javascriptGenerator.forBlock['arduino_temp_read'] = function() {
  return [`(api.getSensor('A2') * 0.4887)`, 99];
};

// ── arduino_text ────────────────────────────────────────────────
javascriptGenerator.forBlock['arduino_text'] = function(block: Blockly.Block) {
  return [`"${block.getFieldValue('TEXT')}"`, 0];
};

export { javascriptGenerator };
