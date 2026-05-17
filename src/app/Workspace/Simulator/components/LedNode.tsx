import { Handle, Position } from '@xyflow/react';
import { useSimulatorStore } from '../../../../store/simulatorStore';

export default function LedNode({ id, data }: { id: string; data: any }) {
  const edges = useSimulatorStore((state) => state.edges);
  const pins = useSimulatorStore((state) => state.pins);
  const isRunning = useSimulatorStore((state) => state.isRunning);

  // Trace the connection for Anode
  const anodeEdge = edges.find((e) => e.target === id && e.targetHandle === 'anode');
  const anodePinState = anodeEdge && anodeEdge.sourceHandle ? pins[anodeEdge.sourceHandle] : 'LOW';

  // Trace the connection for Cathode
  // Note: Cathode is a "source" handle, so the edge goes from Cathode to Arduino
  const cathodeEdge = edges.find((e) => e.source === id && e.sourceHandle === 'cathode');
  const cathodePinId = cathodeEdge && cathodeEdge.targetHandle ? cathodeEdge.targetHandle : null;
  // If cathode is connected to GND_1, GND_2, GND_3, or a pin that is LOW, it's grounded
  const isGrounded = cathodePinId?.startsWith('GND') || pins[cathodePinId!] === 'LOW';

  // The LED is on ONLY when simulation is running AND Anode is HIGH AND Cathode is grounded.
  // When simulation is stopped, all output components are forced OFF regardless of pin state.
  // This mirrors real Arduino behavior: no power = no output.
  const isLedOn = isRunning && anodePinState === 'HIGH' && isGrounded;

  return (
    <div className="relative pointer-events-auto flex items-center justify-center">
      {/* @ts-ignore */}
      <wokwi-led color={data.color || 'red'} value={isLedOn ? 1 : 0}></wokwi-led>
      
      {/* Anode (Kaki panjang, biasanya Positif) */}
      <Handle 
        type="target" 
        position={Position.Bottom} 
        id="anode" 
        style={{ left: '40%', bottom: '-5px', width: '12px', height: '12px', background: '#ef4444', border: '2px solid white' }} 
        title="Anode (+)"
      />
      {/* Cathode (Kaki pendek, biasanya Negatif) */}
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
