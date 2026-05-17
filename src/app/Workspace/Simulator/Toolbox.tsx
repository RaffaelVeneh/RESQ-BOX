import React from 'react';

const TOOLS = [
  { id: 'arduino', type: 'arduino', label: 'Arduino Uno', icon: 'developer_board' },
  { id: 'led-red', type: 'led', label: 'LED (Red)', data: { color: 'red' }, icon: 'lightbulb' },
  { id: 'led-blue', type: 'led', label: 'LED (Blue)', data: { color: 'blue' }, icon: 'lightbulb' },
  { id: 'buzzer', type: 'buzzer', label: 'Buzzer', icon: 'volume_up' },
  { id: 'button', type: 'button', label: 'Pushbutton', icon: 'radio_button_checked' },
  { id: 'water-sensor', type: 'analogSensor', label: 'Water Sensor', data: { label: 'Water Level' }, icon: 'water_drop' },
  { id: 'vib-sensor', type: 'analogSensor', label: 'Vibration', data: { label: 'Vibration' }, icon: 'vibration' },
];

export default function Toolbox() {
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData?: any) => {
    const payload = JSON.stringify({ type: nodeType, data: nodeData });
    event.dataTransfer.setData('application/reactflow', payload);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-surface-container border-r border-outline-variant flex flex-col">
      <div className="p-sm border-b border-outline-variant">
        <h2 className="font-title-md text-title-md text-primary flex items-center gap-xs">
          <span className="material-symbols-outlined text-secondary-container">inventory_2</span>
          Komponen
        </h2>
      </div>
      <div className="flex-1 p-sm overflow-y-auto space-y-sm">
        {TOOLS.map((comp) => (
          <div
            key={comp.id}
            className="flex items-center gap-sm p-sm bg-surface-container-lowest border border-outline-variant rounded-lg tactile-card cursor-grab hover:border-secondary-container hover:shadow-sm transition-all"
            draggable
            onDragStart={(event) => onDragStart(event, comp.type, comp.data)}
          >
            <span className="material-symbols-outlined text-secondary-container">{comp.icon}</span>
            <span className="font-label-lg text-label-lg text-on-surface">{comp.label}</span>
          </div>
        ))}
      </div>
      <div className="p-sm border-t border-outline-variant bg-surface-container-lowest">
        <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">💡 TIPS</p>
        <ul className="space-y-xs text-body-sm text-on-surface-variant list-disc pl-4">
          <li className="font-body-sm text-body-sm">Tarik komponen ke kanvas</li>
          <li className="font-body-sm text-body-sm">Sambungkan pin antar komponen</li>
          <li className="font-body-sm text-body-sm">
            Tekan <kbd className="bg-surface border border-outline-variant px-1 rounded font-code-sm text-code-sm text-on-surface">Del</kbd> untuk hapus kabel
          </li>
        </ul>
      </div>
    </div>
  );
}
