import { Handle, Position } from '@xyflow/react';
import { useSimulatorStore } from '../../../../store/simulatorStore';

export default function BuzzerNode({ id }: { id: string }) {
  const edges = useSimulatorStore((state) => state.edges);
  const pins = useSimulatorStore((state) => state.pins);
  const isRunning = useSimulatorStore((state) => state.isRunning);

  // Trace Anode (Positive)
  const anodeEdge = edges.find((e) => e.target === id && e.targetHandle === 'anode');
  const anodePinState = anodeEdge && anodeEdge.sourceHandle ? pins[anodeEdge.sourceHandle] : 'LOW';

  // Trace Cathode (Negative)
  const cathodeEdge = edges.find((e) => e.source === id && e.sourceHandle === 'cathode');
  const cathodePinId = cathodeEdge && cathodeEdge.targetHandle ? cathodeEdge.targetHandle : null;
  const isGrounded = cathodePinId?.startsWith('GND') || pins[cathodePinId!] === 'LOW';

  // Buzzer fires ONLY when simulation is running AND signal is HIGH AND grounded.
  // Mirrors Arduino: no power (simulation stopped) = no buzzer, ever.
  const isBuzzerOn = isRunning && anodePinState === 'HIGH' && isGrounded;

  return (
    <div className="relative pointer-events-auto flex items-center justify-center">
      {/* @ts-ignore */}
      <wokwi-buzzer hasSignal={isBuzzerOn}></wokwi-buzzer>
      
      {/* Anode (+) */}
      <Handle 
        type="target" 
        position={Position.Bottom} 
        id="anode" 
        style={{ left: '40%', bottom: '-5px', width: '12px', height: '12px', background: '#ef4444', border: '2px solid white' }} 
        title="Anode (+)"
      />
      {/* Cathode (-) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="cathode" 
        style={{ left: '60%', bottom: '-5px', width: '12px', height: '12px', background: '#1f2937', border: '2px solid white' }} 
        title="Cathode (-)"
      />
    </div>
  );
}
