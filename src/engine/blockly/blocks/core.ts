import * as Blockly from 'blockly/core';
import { arduinoGenerator } from '../arduinoGenerator';


export function defineCoreBlocks() {

  // ══════════════════════════════════════════════
  // 1. Arduino Setup & Loop
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_setup_loop'] = {
    init: function () {
      this.appendDummyInput().appendField('Arduino Program');
      this.appendStatementInput('SETUP').setCheck(null).appendField('Setup (Run Once)');
      this.appendStatementInput('LOOP').setCheck(null).appendField('Loop (Run Forever)');
      this.setColour('#fd761a');
      this.setTooltip('Entry point. Put pinMode in Setup, actions in Loop.');
      this.setPreviousStatement(false);
      this.setNextStatement(false);
    },
  };
  arduinoGenerator.forBlock['arduino_setup_loop'] = function (block: Blockly.Block) {
    const setup = arduinoGenerator.statementToCode(block, 'SETUP') || '';
    const loop = arduinoGenerator.statementToCode(block, 'LOOP') || '';
    return `#include <Arduino.h>\n\nvoid setup() {\n  Serial.begin(9600);\n${setup}}\n\nvoid loop() {\n${loop}}\n`;
  };

  // ══════════════════════════════════════════════
  // 2. Pin Mode
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_pin_mode'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Set Pin')
        .appendField(new Blockly.FieldDropdown([
          ['LED (13)', 'LED_BUILTIN'],['5 (Buzzer)', '5'],['6 (Motor)', '6'],
          ['9 (Servo)', '9'],['10', '10'],['11', '11'],['12', '12'],
          ['2 (Tombol)', '2'],['3 (Tombol)', '3'],
        ]), 'PIN')
        .appendField('as')
        .appendField(new Blockly.FieldDropdown([
          ['OUTPUT', 'OUTPUT'],['INPUT', 'INPUT'],['INPUT_PULLUP', 'INPUT_PULLUP'],
        ]), 'MODE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Configure pin direction. Place in Setup.');
    },
  };
  arduinoGenerator.forBlock['arduino_pin_mode'] = function (block: Blockly.Block) {
    return `pinMode(${block.getFieldValue('PIN')}, ${block.getFieldValue('MODE')});\n`;
  };

  // ══════════════════════════════════════════════
  // 3. LED with Color — "Set LED [COLOR] pin [X] to [ON/OFF]"
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_led_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED')
        .appendField(new Blockly.FieldDropdown([
          ['🔴 Merah', 'Merah'],['🟢 Hijau', 'Hijau'],['🔵 Biru', 'Biru'],
          ['🟡 Kuning', 'Kuning'],['⚪ Putih', 'Putih'],['🟠 Oranye', 'Oranye'],
        ]), 'COLOR')
        .appendField('pin')
        .appendField(new Blockly.FieldDropdown([
          ['LED (13)', 'LED_BUILTIN'],['10', '10'],['11', '11'],['12', '12'],
        ]), 'PIN')
        .appendField(new Blockly.FieldDropdown([
          ['NYALA', 'HIGH'],['MATI', 'LOW'],
        ]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Turn an LED on or off with a color label.');
    },
  };
  arduinoGenerator.forBlock['arduino_led_write'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    const color = block.getFieldValue('COLOR');
    return `// LED ${color}\npinMode(${pin}, OUTPUT);\ndigitalWrite(${pin}, ${state});\n`;
  };

  // ══════════════════════════════════════════════
  // 4. Digital Write (generic)
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_digital_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Set Pin')
        .appendField(new Blockly.FieldDropdown([
          ['LED (13)', 'LED_BUILTIN'],['10', '10'],['11', '11'],['12', '12'],
        ]), 'PIN')
        .appendField('to')
        .appendField(new Blockly.FieldDropdown([
          ['HIGH (ON)', 'HIGH'],['LOW (OFF)', 'LOW'],
        ]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
    },
  };
  arduinoGenerator.forBlock['arduino_digital_write'] = function (block: Blockly.Block) {
    return `digitalWrite(${block.getFieldValue('PIN')}, ${block.getFieldValue('STATE')});\n`;
  };

  // ══════════════════════════════════════════════
  // 5. Buzzer — tone() with duration
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_buzzer'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Buzzer pin')
        .appendField(new Blockly.FieldDropdown([
          ['5', '5'],['6', '6'],['8', '8'],['9', '9'],
        ]), 'PIN')
        .appendField('berbunyi')
        .appendField(new Blockly.FieldNumber(1000, 0), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Play a tone on the buzzer for the given duration.');
    },
  };
  arduinoGenerator.forBlock['arduino_buzzer'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const ms = block.getFieldValue('MS');
    return `tone(${pin}, 1000, ${ms});\ndelay(${ms});\n`;
  };

  // ══════════════════════════════════════════════
  // 6. Buzzer Stop — noTone()
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_buzzer_stop'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Buzzer pin')
        .appendField(new Blockly.FieldDropdown([
          ['5', '5'],['6', '6'],['8', '8'],['9', '9'],
        ]), 'PIN')
        .appendField('berhenti');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
    },
  };
  arduinoGenerator.forBlock['arduino_buzzer_stop'] = function (block: Blockly.Block) {
    return `noTone(${block.getFieldValue('PIN')});\n`;
  };

  // ══════════════════════════════════════════════
  // 7. DC Motor Speed — analogWrite(pin, speed)
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_motor_speed'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Motor pin')
        .appendField(new Blockly.FieldDropdown([
          ['6', '6'],['9', '9'],['10', '10'],['11', '11'],
        ]), 'PIN')
        .appendField('kecepatan')
        .appendField(new Blockly.FieldNumber(200, 0, 255), 'SPEED')
        .appendField('(0-255)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Control a DC motor speed (0=stop, 255=full speed).');
    },
  };
  arduinoGenerator.forBlock['arduino_motor_speed'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const speed = block.getFieldValue('SPEED');
    return `analogWrite(${pin}, ${speed});\n`;
  };

  // ══════════════════════════════════════════════
  // 8. Servo Motor — servo.write(angle)
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_servo'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Servo pin')
        .appendField(new Blockly.FieldDropdown([
          ['9', '9'],['10', '10'],['11', '11'],
        ]), 'PIN')
        .appendField('sudut')
        .appendField(new Blockly.FieldNumber(90, 0, 180), 'ANGLE')
        .appendField('°');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7C3AED');
      this.setTooltip('Rotate a servo to a specific angle (0-180 degrees).');
    },
  };
  arduinoGenerator.forBlock['arduino_servo'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const angle = block.getFieldValue('ANGLE');
    (arduinoGenerator as any)._servoInclude = true;
    (arduinoGenerator as any)._servoPins = (arduinoGenerator as any)._servoPins || new Set();
    (arduinoGenerator as any)._servoPins.add(pin);
    return `servo_${pin}.write(${angle});\n`;
  };

  // ══════════════════════════════════════════════
  // 9. Delay
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_delay'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Delay')
        .appendField(new Blockly.FieldNumber(1000, 0), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
    },
  };
  arduinoGenerator.forBlock['arduino_delay'] = function (block: Blockly.Block) {
    return `delay(${block.getFieldValue('MS')});\n`;
  };

  // ══════════════════════════════════════════════
  // 10. Serial Print — log output to console
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_serial_print'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('Tampilkan');
      this.appendDummyInput().appendField('di Serial Monitor');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Print a value to the Serial Monitor / console output.');
    },
  };
  arduinoGenerator.forBlock['arduino_serial_print'] = function (block: Blockly.Block) {
    const val = arduinoGenerator.valueToCode(block, 'VALUE', 0) || '""';
    return `Serial.println(${val});\n`;
  };

  // ══════════════════════════════════════════════
  // 11. Digital Read (button)
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_digital_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Tombol pin')
        .appendField(new Blockly.FieldDropdown([
          ['2', '2'],['3', '3'],
        ]), 'PIN')
        .appendField('ditekan?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
    },
  };
  arduinoGenerator.forBlock['arduino_digital_read'] = function (block: Blockly.Block) {
    return [`digitalRead(${block.getFieldValue('PIN')}) == HIGH`, 0];
  };

  // ══════════════════════════════════════════════
  // 12. Analog Read (generic)
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_analog_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Baca Pin Analog')
        .appendField(new Blockly.FieldDropdown([
          ['A0 (Sensor Air)', 'A0'],['A1 (Sensor Getar)', 'A1'],['A2 (Suhu)', 'A2'],
        ]), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
    },
  };
  arduinoGenerator.forBlock['arduino_analog_read'] = function (block: Blockly.Block) {
    return [`analogRead(${block.getFieldValue('PIN')})`, 0];
  };

  // ══════════════════════════════════════════════
  // 13. Vibration Sensor — named shortcut for A1
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_vibration_read'] = {
    init: function () {
      this.appendDummyInput().appendField('🔔 Baca Sensor Getaran (A1)');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
      this.setTooltip('Returns vibration value 0-1023. High = strong vibration.');
    },
  };
  arduinoGenerator.forBlock['arduino_vibration_read'] = function () {
    return [`analogRead(A1)`, 0];
  };

  // ══════════════════════════════════════════════
  // 14. Water Level Sensor — named shortcut for A0
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_water_read'] = {
    init: function () {
      this.appendDummyInput().appendField('💧 Baca Sensor Air (A0)');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
      this.setTooltip('Returns water level 0-1023. High = more water detected.');
    },
  };
  arduinoGenerator.forBlock['arduino_water_read'] = function () {
    return [`analogRead(A0)`, 0];
  };

  // ══════════════════════════════════════════════
  // 15. Temperature Sensor — named shortcut for A2
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_temp_read'] = {
    init: function () {
      this.appendDummyInput().appendField('🌡️ Baca Sensor Suhu (A2)');
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
      this.setTooltip('Returns temperature in Celsius (approx from LM35).');
    },
  };
  arduinoGenerator.forBlock['arduino_temp_read'] = function () {
    return [`(analogRead(A2) * 0.4887)`, 0]; // LM35: (val/1023)*500
  };

  // ══════════════════════════════════════════════
  // 16. LED Builtin shortcut (backward compat)
  // ══════════════════════════════════════════════
  Blockly.Blocks['led_builtin_set'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED Bawaan (pin 13)')
        .appendField(new Blockly.FieldDropdown([
          ['NYALA', 'HIGH'],['MATI', 'LOW'],
        ]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
    },
  };
  arduinoGenerator.forBlock['led_builtin_set'] = function (block: Blockly.Block) {
    return `pinMode(LED_BUILTIN, OUTPUT);\ndigitalWrite(LED_BUILTIN, ${block.getFieldValue('STATE')});\n`;
  };

  // ══════════════════════════════════════════════
  // 17. Text String (for serial print input)
  // ══════════════════════════════════════════════
  Blockly.Blocks['arduino_text'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('"')
        .appendField(new Blockly.FieldTextInput('teks'), 'TEXT')
        .appendField('"');
      this.setOutput(true, 'String');
      this.setColour('#64748B');
    },
  };
  arduinoGenerator.forBlock['arduino_text'] = function (block: Blockly.Block) {
    return [`"${block.getFieldValue('TEXT')}"`, 0];
  };

  // ══════════════════════════════════════════════
  // Built-in Blockly block generators for Arduino C
  // These are needed so arduinoGenerator doesn't crash when
  // logic/math blocks are used alongside our custom blocks.
  // ══════════════════════════════════════════════

  // controls_if → if (...) { ... } [else if] [else]
  arduinoGenerator.forBlock['controls_if'] = function (block: Blockly.Block) {
    let n = 0;
    let code = '';
    while (block.getInput('IF' + n)) {
      const cond = arduinoGenerator.valueToCode(block, 'IF' + n, 0) || 'false';
      const branch = arduinoGenerator.statementToCode(block, 'DO' + n) || '';
      code += (n === 0 ? 'if' : ' else if') + ` (${cond}) {\n${branch}}`;
      n++;
    }
    if (block.getInput('ELSE')) {
      const elseBranch = arduinoGenerator.statementToCode(block, 'ELSE') || '';
      code += ` else {\n${elseBranch}}`;
    }
    return code + '\n';
  };

  // logic_compare → a == b, a > b, a < b, etc.
  arduinoGenerator.forBlock['logic_compare'] = function (block: Blockly.Block) {
    const opMap: Record<string, string> = {
      EQ: '==', NEQ: '!=', LT: '<', LTE: '<=', GT: '>', GTE: '>=',
    };
    const op = opMap[block.getFieldValue('OP')] || '==';
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || '0';
    return [`${a} ${op} ${b}`, 0];
  };

  // logic_operation → a && b, a || b
  arduinoGenerator.forBlock['logic_operation'] = function (block: Blockly.Block) {
    const op = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || 'false';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || 'false';
    return [`${a} ${op} ${b}`, 0];
  };

  // logic_negate → !a
  arduinoGenerator.forBlock['logic_negate'] = function (block: Blockly.Block) {
    const val = arduinoGenerator.valueToCode(block, 'BOOL', 0) || 'false';
    return [`!${val}`, 0];
  };

  // logic_boolean → true / false
  arduinoGenerator.forBlock['logic_boolean'] = function (block: Blockly.Block) {
    return [block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false', 0];
  };

  // math_number → raw number
  arduinoGenerator.forBlock['math_number'] = function (block: Blockly.Block) {
    return [String(block.getFieldValue('NUM') || '0'), 0];
  };

  // math_arithmetic → a + b, a - b, etc.
  arduinoGenerator.forBlock['math_arithmetic'] = function (block: Blockly.Block) {
    const opMap: Record<string, string> = {
      ADD: '+', MINUS: '-', MULTIPLY: '*', DIVIDE: '/', POWER: '',
    };
    const op = block.getFieldValue('OP');
    const a = arduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const b = arduinoGenerator.valueToCode(block, 'B', 0) || '0';
    if (op === 'POWER') return [`pow(${a}, ${b})`, 0];
    return [`${a} ${opMap[op] || '+'} ${b}`, 0];
  };

  // text (built-in) → "string"
  arduinoGenerator.forBlock['text'] = function (block: Blockly.Block) {
    return [`"${block.getFieldValue('TEXT')}"`, 0];
  };

  // controls_whileUntil → while (...) { }
  arduinoGenerator.forBlock['controls_whileUntil'] = function (block: Blockly.Block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let cond = arduinoGenerator.valueToCode(block, 'BOOL', 0) || 'false';
    if (until) cond = `!(${cond})`;
    const branch = arduinoGenerator.statementToCode(block, 'DO') || '';
    return `while (${cond}) {\n${branch}}\n`;
  };

  // controls_for → for (int i = from; i <= to; i += by)
  arduinoGenerator.forBlock['controls_for'] = function (block: Blockly.Block) {
    const varName = block.getFieldValue('VAR') || 'i';
    const from = arduinoGenerator.valueToCode(block, 'FROM', 0) || '0';
    const to = arduinoGenerator.valueToCode(block, 'TO', 0) || '10';
    const by = arduinoGenerator.valueToCode(block, 'BY', 0) || '1';
    const branch = arduinoGenerator.statementToCode(block, 'DO') || '';
    return `for (int ${varName} = ${from}; ${varName} <= ${to}; ${varName} += ${by}) {\n${branch}}\n`;
  };
}

