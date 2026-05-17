import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks'; // Import default blocks
import { ResqTheme } from '../../../engine/blockly/theme';
import { arduinoGenerator } from '../../../engine/blockly/arduinoGenerator';
import { javascriptGenerator } from '../../../engine/blockly/jsGenerator';
import { defineCoreBlocks } from '../../../engine/blockly/blocks/core';
import { useWorkspaceStore } from '../../../store/workspaceStore';

// Initialize our custom blocks
defineCoreBlocks();

const INITIAL_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Arduino',
      colour: '#fd761a',
      contents: [
        { kind: 'block', type: 'arduino_setup_loop' },
        { kind: 'block', type: 'arduino_pin_mode' },   // pinMode — goes in Setup
      ],
    },
    {
      kind: 'category',
      name: 'Output',
      colour: '#0D9488',
      contents: [
        { kind: 'block', type: 'arduino_digital_write' }, // Set Pin X to HIGH/LOW — goes in Loop
        { kind: 'block', type: 'led_builtin_set' },        // Shortcut: Builtin LED (pin 13)
        { kind: 'block', type: 'arduino_delay' },
      ],
    },
    {
      kind: 'category',
      name: 'Input',
      colour: '#2563EB',
      contents: [
        { kind: 'block', type: 'arduino_digital_read' }, // Button / digital sensor
        { kind: 'block', type: 'arduino_analog_read' },  // Water / vibration sensor (0-1023)
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '#7C3AED',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'math_number' },
      ],
    },
  ],
};

export default function BlocklyComponent() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const { workspaceJson, setWorkspaceState } = useWorkspaceStore();
  const [codePreview, setCodePreview] = useState<string>('');
  
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Inject Blockly
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: INITIAL_TOOLBOX,
      theme: ResqTheme,
      renderer: 'zelos', // Use the fun Scratch-like renderer
      grid: {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      move: {
        scrollbars: {
          horizontal: true,
          vertical: true,
        },
        drag: true,
        wheel: true,
      },
      trashcan: true,
    });

    // Prevent flyout from zooming with the main workspace
    const toolbox = workspaceRef.current.getToolbox();
    if (toolbox) {
      const flyout = (toolbox as any).getFlyout();
      if (flyout) {
        // Disable auto-scaling in Blockly flyout
        flyout.autoScale_ = false;
        // Force reset scale to initial
        if (flyout.getWorkspace()) {
          flyout.getWorkspace().setScale(0.9);
        }
      }
    }

    // Load initial state if exists
    if (workspaceJson) {
      try {
        Blockly.serialization.workspaces.load(workspaceJson, workspaceRef.current);
      } catch (e) {
        console.error('Failed to load workspace state', e);
      }
    } else {
      // If empty, spawn the main setup/loop block by default
      const block = workspaceRef.current.newBlock('arduino_setup_loop');
      block.initSvg();
      block.render();
      block.moveBy(50, 50);
    }

    // Handle workspace changes to update Zustand and Code preview
    const onChange = (event: Blockly.Events.Abstract) => {
      // If the user zoomed the workspace, make sure flyout stays unzoomed
      if (event.type === Blockly.Events.VIEWPORT_CHANGE) {
        const flyout = (workspaceRef.current?.getToolbox() as any)?.getFlyout();
        if (flyout && flyout.getWorkspace()) {
          flyout.getWorkspace().setScale(0.9); // Lock scale to 0.9
        }
      }

      // Don't update on UI events (like scrolling/zooming) to save performance
      if (event.isUiEvent) return;

      if (workspaceRef.current) {
        // Generate Code
        const generatedCode = arduinoGenerator.workspaceToCode(workspaceRef.current);
        const generatedJsCode = javascriptGenerator.workspaceToCode(workspaceRef.current);
        setCodePreview(generatedCode);

        // Save State
        const state = Blockly.serialization.workspaces.save(workspaceRef.current);
        setWorkspaceState(state, generatedCode, generatedJsCode);
      }
    };

    workspaceRef.current.addChangeListener(onChange);

    // Initial code generation — run after workspace is loaded/initialized.
    // This ensures generatedJsCode in the store is always in sync with the current
    // workspace state, even before the user makes any changes (important after page refresh).
    const syncCode = () => {
      if (!workspaceRef.current) return;
      const state = Blockly.serialization.workspaces.save(workspaceRef.current);
      const initialArduinoCode = arduinoGenerator.workspaceToCode(workspaceRef.current);
      const initialJsCode = javascriptGenerator.workspaceToCode(workspaceRef.current);
      setCodePreview(initialArduinoCode);
      setWorkspaceState(state, initialArduinoCode, initialJsCode);
    };
    syncCode();

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []); // Empty dependency array to run only once on mount

  // Force resize blockly on window resize
  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-surface">
      <div className="flex justify-between items-center p-sm border-b border-outline-variant bg-surface-container-lowest">
        <h2 className="font-title-md text-title-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container">extension</span>
          Block Editor
        </h2>
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-xs px-sm py-xs bg-primary-container text-white rounded tactile-btn font-label-caps text-label-caps"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>code</span>
            {showCode ? 'HIDE CODE' : 'SHOW CODE'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative flex">
        <div 
          ref={blocklyDiv} 
          className={`absolute inset-0 ${showCode ? 'w-2/3 border-r border-outline-variant' : 'w-full'}`}
        />
        {showCode && (
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#1E1E1E] text-[#D4D4D4] p-md overflow-auto font-code-sm text-code-sm">
            <div className="flex justify-between items-center mb-sm border-b border-[#333] pb-xs">
              <span className="font-bold">Arduino C</span>
            </div>
            <pre className="whitespace-pre-wrap">{codePreview}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
