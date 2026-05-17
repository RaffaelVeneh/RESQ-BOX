import * as Blockly from 'blockly/core';
import { arduinoGenerator } from '../arduinoGenerator';

export function defineCoreBlocks() {
  // 1. Arduino Setup & Loop
  Blockly.Blocks['arduino_setup_loop'] = {
    init: function () {
      this.appendDummyInput().appendField('Arduino Program');
      this.appendStatementInput('SETUP').setCheck(null).appendField('Setup (Run Once)');
      this.appendStatementInput('LOOP').setCheck(null).appendField('Loop (Run Forever)');
      this.setColour('#fd761a');
      this.setTooltip('Entry point. Put pinMode in Setup, actions in Loop.');
      this.setHelpUrl('');
      this.setPreviousStatement(false);
      this.setNextStatement(false);
    },
  };

  arduinoGenerator.forBlock['arduino_setup_loop'] = function (block: Blockly.Block) {
    const setupBranch = arduinoGenerator.statementToCode(block, 'SETUP') || '';
    const loopBranch = arduinoGenerator.statementToCode(block, 'LOOP') || '';
    // Wokwi-compatible format: #include <Arduino.h> is required for Wokwi projects
    return `#include <Arduino.h>\n\nvoid setup() {\n${setupBranch}}\n\nvoid loop() {\n${loopBranch}}\n`;
  };

  // 2. Pin Mode — "Set Pin X as OUTPUT/INPUT" — goes in Setup
  Blockly.Blocks['arduino_pin_mode'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Set Pin')
        .appendField(
          new Blockly.FieldDropdown([
            ['LED (13)', 'LED_BUILTIN'],
            ['10', '10'],
            ['11', '11'],
            ['12', '12'],
            ['2 (Tombol)', '2'],
            ['3 (Tombol)', '3'],
          ]),
          'PIN'
        )
        .appendField('as')
        .appendField(
          new Blockly.FieldDropdown([
            ['OUTPUT', 'OUTPUT'],
            ['INPUT', 'INPUT'],
            ['INPUT_PULLUP', 'INPUT_PULLUP'],
          ]),
          'MODE'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fd761a');
      this.setTooltip('Configure a pin direction. Place in Setup.');
      this.setHelpUrl('');
    },
  };

  arduinoGenerator.forBlock['arduino_pin_mode'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    return `pinMode(${pin}, ${mode});\n`;
  };

  // 3. Digital Write — "Set Pin X to HIGH/LOW" — goes in Loop
  Blockly.Blocks['arduino_digital_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Set Pin')
        .appendField(
          new Blockly.FieldDropdown([
            ['LED (13)', 'LED_BUILTIN'],
            ['10', '10'],
            ['11', '11'],
            ['12', '12'],
          ]),
          'PIN'
        )
        .appendField('to')
        .appendField(
          new Blockly.FieldDropdown([
            ['HIGH (ON)', 'HIGH'],
            ['LOW (OFF)', 'LOW'],
          ]),
          'STATE'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Send HIGH or LOW to a pin. Set pinMode first in Setup.');
      this.setHelpUrl('');
    },
  };

  arduinoGenerator.forBlock['arduino_digital_write'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    return `digitalWrite(${pin}, ${state});\n`;
  };

  // 4. LED Builtin Shortcut — beginner friendly, no separate pinMode needed
  Blockly.Blocks['led_builtin_set'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Builtin LED')
        .appendField(
          new Blockly.FieldDropdown([
            ['ON', 'HIGH'],
            ['OFF', 'LOW'],
          ]),
          'STATE'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Shortcut: controls the built-in LED (pin 13). Best for beginners.');
      this.setHelpUrl('');
    },
  };

  arduinoGenerator.forBlock['led_builtin_set'] = function (block: Blockly.Block) {
    const state = block.getFieldValue('STATE');
    return `pinMode(LED_BUILTIN, OUTPUT);\ndigitalWrite(LED_BUILTIN, ${state});\n`;
  };

  // 5. Delay
  Blockly.Blocks['arduino_delay'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Delay for')
        .appendField(new Blockly.FieldNumber(1000, 0), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0D9488');
      this.setTooltip('Wait for the specified number of milliseconds.');
      this.setHelpUrl('');
    },
  };

  arduinoGenerator.forBlock['arduino_delay'] = function (block: Blockly.Block) {
    const ms = block.getFieldValue('MS');
    return `delay(${ms});\n`;
  };

  // 6. Digital Read — button / digital sensor
  Blockly.Blocks['arduino_digital_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Read Digital Pin')
        .appendField(
          new Blockly.FieldDropdown([
            ['2 (Tombol)', '2'],
            ['3 (Tombol)', '3'],
          ]),
          'PIN'
        );
      this.setOutput(true, 'Boolean');
      this.setColour('#2563EB');
      this.setTooltip('Read a digital input pin. Returns HIGH or LOW.');
    },
  };

  arduinoGenerator.forBlock['arduino_digital_read'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    return [`digitalRead(${pin}) == HIGH`, 0];
  };

  // 7. Analog Read — water sensor / vibration sensor
  Blockly.Blocks['arduino_analog_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Read Analog Pin')
        .appendField(
          new Blockly.FieldDropdown([
            ['A0 (Sensor Air)', 'A0'],
            ['A1 (Sensor Getar)', 'A1'],
          ]),
          'PIN'
        );
      this.setOutput(true, 'Number');
      this.setColour('#2563EB');
      this.setTooltip('Read an analog sensor (0-1023). A0 = Water Sensor, A1 = Vibration.');
    },
  };

  arduinoGenerator.forBlock['arduino_analog_read'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    return [`analogRead(${pin})`, 0];
  };
}
