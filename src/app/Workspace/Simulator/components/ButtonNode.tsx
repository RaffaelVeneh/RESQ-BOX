import { Handle, Position } from '@xyflow/react';
import { useSimulatorStore } from '../../../../store/simulatorStore';

export default function ButtonNode({ id, data }: { id: string; data: any }) {
  const edges = useSimulatorStore((state) => state.edges);
  const setPin = useSimulatorStore((state) => state.setPin);

  // Find which Arduino pin this button is connected to
  const getConnectedPin = () => {
    const edge = edges.find((e) => e.source === id || e.target === id);
    if (!edge) return null;
    
    // If our node is the source, the target is the arduino
    if (edge.source === id) return edge.targetHandle;
    // If our node is the target, the source is the arduino
    if (edge.target === id) return edge.sourceHandle;
    
    return null;
  };

  const handlePress = (pressed: boolean) => {
    const pin = getConnectedPin();
    if (pin && !pin.startsWith('GND') && !pin.startsWith('5V')) {
      setPin(pin, pressed ? 'HIGH' : 'LOW');
    }
  };

  return (
    <div 
      className="relative pointer-events-auto flex items-center justify-center cursor-pointer"
      onPointerDown={() => handlePress(true)}
      onPointerUp={() => handlePress(false)}
      onPointerLeave={() => handlePress(false)}
    >
      {/* @ts-ignore */}
      <wokwi-pushbutton color={data.color || 'green'}></wokwi-pushbutton>
      
      {/* Signal Pin */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="signal" 
        style={{ bottom: '-5px', width: '12px', height: '12px', background: '#eab308', border: '2px solid white' }} 
        title="Signal"
      />
    </div>
  );
}
