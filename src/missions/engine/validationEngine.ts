import type { Mission } from '../data/missions';

interface Node {
  id: string;
  type?: string;
}

interface Edge {
  source: string;
  sourceHandle?: string | null;
  target: string;
  targetHandle?: string | null;
}

interface ValidationResult {
  passed: boolean;
  failureReason?: string;
}

export function validateMission(
  mission: Mission,
  nodes: Node[],
  edges: Edge[],
  pins: Record<string, any>
): ValidationResult {
  const { validation } = mission;

  // --- Check 1: Required Components ---
  for (const requiredType of validation.requiredComponents) {
    const found = nodes.some((n) => n.type === requiredType);
    if (!found) {
      const labels: Record<string, string> = {
        arduino: 'Arduino Uno',
        led: 'LED',
        buzzer: 'Buzzer',
        button: 'Pushbutton',
        analogSensor: 'Sensor Analog (Water/Vibration)',
      };
      return {
        passed: false,
        failureReason: `Komponen yang diperlukan belum ada di kanvas: ${labels[requiredType] ?? requiredType}`,
      };
    }
  }

  // --- Check 2: Required Connections ---
  if (validation.requiredConnections) {
    for (const req of validation.requiredConnections) {
      const fromNode = nodes.find((n) => n.type === req.fromType);
      const toNode = nodes.find((n) => n.type === req.toType);

      if (!fromNode || !toNode) continue; // Already caught by check 1

      const connectionExists = edges.some(
        (e) =>
          (e.source === fromNode.id &&
            e.sourceHandle === req.fromHandle &&
            e.target === toNode.id &&
            e.targetHandle === req.toHandle) ||
          // Also check reverse direction for bidirectional handles
          (e.source === toNode.id &&
            e.sourceHandle === req.toHandle &&
            e.target === fromNode.id &&
            e.targetHandle === req.fromHandle)
      );

      if (!connectionExists) {
        return {
          passed: false,
          failureReason: `Koneksi kabel belum benar. Pastikan ${req.fromType} (${req.fromHandle}) sudah terhubung ke ${req.toType} (${req.toHandle}).`,
        };
      }
    }
  }

  // --- Check 3: Pin State Conditions ---
  if (validation.pinConditions) {
    for (const condition of validation.pinConditions) {
      const pinValue = pins[condition.pin];

      if (condition.state === 'ANALOG') {
        const threshold = condition.threshold ?? 500;
        if (typeof pinValue !== 'number' || pinValue < threshold) {
          return {
            passed: false,
            failureReason: `Pin ${condition.pin} belum mencapai nilai yang dibutuhkan. Coba jalankan simulasi terlebih dahulu, lalu atur sensor analog ke nilai yang tepat.`,
          };
        }
      } else {
        if (pinValue !== condition.state) {
          return {
            passed: false,
            failureReason: `Simulasi harus dijalankan dan Pin ${condition.pin} harus dalam kondisi ${condition.state}. Tekan "Run Simulation" terlebih dahulu.`,
          };
        }
      }
    }
  }

  return { passed: true };
}
