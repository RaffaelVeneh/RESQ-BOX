import { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useSimulatorStore } from '../../../../store/simulatorStore';

export default function AnalogSensorNode({ id, data }: { id: string; data: any }) {
  const [value, setValue] = useState(0);
  const edges = useSimulatorStore((state) => state.edges);
  const setPin = useSimulatorStore((state) => state.setPin);

  // Find which Arduino pin this sensor is connected to
  const getConnectedPin = () => {
    const edge = edges.find((e) => e.source === id || e.target === id);
    if (!edge) return null;
    if (edge.source === id) return edge.targetHandle;
    if (edge.target === id) return edge.sourceHandle;
    return null;
  };

  // Update pin state whenever the slider changes
  useEffect(() => {
    const pin = getConnectedPin();
    if (pin && !pin.startsWith('GND') && !pin.startsWith('5V')) {
      setPin(pin, value);
    }
  }, [value, edges, setPin]);

  return (
    <div className="relative pointer-events-auto flex flex-col items-center justify-center bg-surface-container-lowest shadow-md border border-outline-variant p-sm rounded-xl w-36">
      {/* Label */}
      <div className="font-label-caps text-label-caps text-secondary-container mb-xs w-full text-center">
        {data.label || 'Analog Sensor'}
      </div>
      
      {/* Slider */}
      <div className="w-full flex items-center justify-between gap-1 mb-xs">
        <span className="font-code-sm text-code-sm text-on-surface-variant">0</span>
        <input 
          type="range" 
          min="0" 
          max="1023" 
          value={value} 
          onChange={(e) => setValue(Number(e.target.value))}
          className="flex-1 w-full cursor-pointer"
        />
        <span className="font-code-sm text-code-sm text-on-surface-variant">1023</span>
      </div>
      
      {/* Value Display */}
      <div className="font-code-sm text-code-sm text-on-surface bg-surface-container-high px-sm py-xs rounded-md w-full text-center border border-outline-variant">
        {value}
      </div>

      {/* Signal Pin Handle */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="signal" 
        style={{ bottom: '-5px', width: '12px', height: '12px', background: '#3b82f6', border: '2px solid white' }} 
        title="Analog Signal"
      />
    </div>
  );
}
