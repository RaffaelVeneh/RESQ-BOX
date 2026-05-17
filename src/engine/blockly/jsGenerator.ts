import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// arduino_setup_loop
javascriptGenerator.forBlock['arduino_setup_loop'] = function(block: Blockly.Block) {
  const setupBranch = javascriptGenerator.statementToCode(block, 'SETUP');
  const loopBranch = javascriptGenerator.statementToCode(block, 'LOOP');
  return `
async function setup() {
${setupBranch}
}

async function loop() {
${loopBranch}
}
`;
};

// arduino_pin_mode — no-op in JS simulation (no physical direction needed)
javascriptGenerator.forBlock['arduino_pin_mode'] = function(_block: Blockly.Block) {
  return '';
};

// arduino_digital_write — LED_BUILTIN maps to pin 13
javascriptGenerator.forBlock['arduino_digital_write'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  const state = block.getFieldValue('STATE');
  const resolvedPin = pin === 'LED_BUILTIN' ? '13' : pin;
  return `await api.digitalWrite('${resolvedPin}', '${state}');\n`;
};

// led_builtin_set — shortcut, always pin 13
javascriptGenerator.forBlock['led_builtin_set'] = function(block: Blockly.Block) {
  const state = block.getFieldValue('STATE');
  return `await api.digitalWrite('13', '${state}');\n`;
};

// arduino_delay
javascriptGenerator.forBlock['arduino_delay'] = function(block: Blockly.Block) {
  const ms = block.getFieldValue('MS');
  return `await api.delay(${ms});\n`;
};

// arduino_digital_read — dropdown pin (2, 3)
javascriptGenerator.forBlock['arduino_digital_read'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return [`(await api.digitalRead('${pin}')) === 'HIGH'`, 99];
};

// arduino_analog_read — dropdown pin (A0, A1)
javascriptGenerator.forBlock['arduino_analog_read'] = function(block: Blockly.Block) {
  const pin = block.getFieldValue('PIN');
  return [`(await api.analogRead('${pin}'))`, 99];
};

export { javascriptGenerator };
