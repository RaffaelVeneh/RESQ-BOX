import { Handle, Position } from '@xyflow/react';

export default function ArduinoNode() {
  const handleStyle = { width: '12px', height: '12px', background: '#3b82f6', border: '2px solid white' };
  
  return (
    <div className="relative pointer-events-auto flex items-center justify-center min-w-[200px] min-h-[150px]">
      {/* @ts-ignore */}
      <wokwi-arduino-uno></wokwi-arduino-uno>
      
      {/* Top Header Pins (Digital Output — 10, 11, 12, 13) */}
      <Handle type="target" position={Position.Top} id="GND_1" style={{ ...handleStyle, top: '8px', right: '28%' }} title="GND" />
      <Handle type="source" position={Position.Top} id="13" style={{ ...handleStyle, top: '8px', right: '32%' }} title="Pin 13" />
      <Handle type="source" position={Position.Top} id="12" style={{ ...handleStyle, top: '8px', right: '35%' }} title="Pin 12" />
      <Handle type="source" position={Position.Top} id="11" style={{ ...handleStyle, top: '8px', right: '38%' }} title="Pin 11" />
      <Handle type="source" position={Position.Top} id="10" style={{ ...handleStyle, top: '8px', right: '41%' }} title="Pin 10" />

      {/* Left side: Digital Input pins (for Button) */}
      <Handle type="source" position={Position.Left} id="2" style={{ ...handleStyle, left: '4px', top: '35%' }} title="Pin 2 (Digital In)" />
      <Handle type="source" position={Position.Left} id="3" style={{ ...handleStyle, left: '4px', top: '55%' }} title="Pin 3 (Digital In)" />

      {/* Bottom Header Pins (Power + Analog Input) */}
      <Handle type="source" position={Position.Bottom} id="5V" style={{ ...handleStyle, bottom: '8px', left: '26%' }} title="5V" />
      <Handle type="target" position={Position.Bottom} id="GND_2" style={{ ...handleStyle, bottom: '8px', left: '30%' }} title="GND" />
      <Handle type="target" position={Position.Bottom} id="GND_3" style={{ ...handleStyle, bottom: '8px', left: '34%' }} title="GND" />
      <Handle type="target" position={Position.Bottom} id="A0" style={{ ...handleStyle, bottom: '8px', left: '52%', background: '#8b5cf6' }} title="A0 (Analog In)" />
      <Handle type="target" position={Position.Bottom} id="A1" style={{ ...handleStyle, bottom: '8px', left: '57%', background: '#8b5cf6' }} title="A1 (Analog In)" />
    </div>
  );
}


