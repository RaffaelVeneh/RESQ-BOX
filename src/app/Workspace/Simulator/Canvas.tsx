import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSimulatorStore } from '../../../store/simulatorStore';
import ArduinoNode from './components/ArduinoNode';
import LedNode from './components/LedNode';
import ButtonNode from './components/ButtonNode';
import BuzzerNode from './components/BuzzerNode';
import AnalogSensorNode from './components/AnalogSensorNode';

const nodeTypes: NodeTypes = {
  arduino: ArduinoNode,
  led: LedNode,
  button: ButtonNode,
  buzzer: BuzzerNode,
  analogSensor: AnalogSensorNode,
};

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useSimulatorStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const payloadString = event.dataTransfer.getData('application/reactflow');
      if (!payloadString) {
        return;
      }

      let payload;
      try {
        payload = JSON.parse(payloadString);
      } catch (e) {
        // Fallback for older string-only payloads if any
        payload = { type: payloadString, data: {} };
      }

      const { type, data } = payload;

      if (reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        const newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: { label: `${type} node`, ...data },
        };

        addNode(newNode);
      }
    },
    [addNode]
  );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          defaultEdgeOptions={{ type: 'step', style: { strokeWidth: 3, stroke: '#10b981' } }}
          className="bg-surface"
        >
          <Background color="#c5c6cd" gap={16} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
