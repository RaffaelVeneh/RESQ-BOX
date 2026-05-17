import { useState, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { MitigationScenario, MitigationAction } from '../../mitigation/data/scenarios';
import { DraggableActionBlock, DropSlot } from './ActionBlock';

interface PuzzleBoardProps {
  scenario: MitigationScenario;
  onBack: () => void;
}

export default function PuzzleBoard({ scenario, onBack }: PuzzleBoardProps) {
  // Slots state: array of placed actions (null = empty)
  const [slots, setSlots] = useState<(MitigationAction | null)[]>(
    Array(scenario.correctOrder.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [activeAction, setActiveAction] = useState<MitigationAction | null>(null);
  const [explanations, setExplanations] = useState<{[slotIndex: number]: string}>({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Which action IDs are already placed in a slot
  const usedActionIds = slots.filter(Boolean).map((a) => a!.id);

  // Only show correct actions + some wrong ones as decoys
  const availableActions = scenario.actions;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const action = event.active.data.current?.action as MitigationAction;
    setActiveAction(action);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveAction(null);
    const { active, over } = event;
    if (!over) return;

    const action = active.data.current?.action as MitigationAction;
    const slotIndex = over.data.current?.slotIndex as number;

    if (action === undefined || slotIndex === undefined) return;

    setSlots((prev) => {
      const next = [...prev];
      // If the action is already in another slot, clear it first
      const existingIdx = next.findIndex((a) => a?.id === action.id);
      if (existingIdx !== -1) next[existingIdx] = null;
      next[slotIndex] = action;
      return next;
    });
  }, []);

  const handleRemove = useCallback((slotIndex: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  const handleSubmit = () => {
    let correct = 0;
    const newExplanations: {[slotIndex: number]: string} = {};
    
    slots.forEach((action, i) => {
      if (!action) return;
      const expectedId = scenario.correctOrder[i];
      if (action.id === expectedId) {
        correct++;
        newExplanations[i] = action.explanation;
      } else {
        // Find the wrong action's explanation
        const wrongAction = scenario.actions.find(a => a.id === action.id);
        newExplanations[i] = wrongAction?.explanation || 'Urutan kurang tepat.';
      }
    });

    setExplanations(newExplanations);
    setScore(correct);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSlots(Array(scenario.correctOrder.length).fill(null));
    setIsSubmitted(false);
    setScore(null);
    setExplanations({});
  };

  const allSlotsFilled = slots.every(Boolean);
  const isPerfect = score === scenario.correctOrder.length;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header scenario */}
        <div className={`shrink-0 p-md border-b border-outline-variant ${scenario.color}`}>
          <div className="flex items-start gap-md">
            <button
              onClick={onBack}
              className="p-xs hover:bg-black/10 rounded-full transition-colors mt-1"
            >
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-sm mb-xs">
                <span className="material-symbols-outlined text-3xl text-on-surface">
                  {scenario.icon}
                </span>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Level {scenario.level} · Mitigasi Bencana
                  </div>
                  <h2 className="font-title-lg text-title-lg font-bold text-on-surface">
                    {scenario.title}
                  </h2>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">{scenario.description}</p>
            </div>
          </div>
        </div>

        {/* Score banner after submit */}
        {isSubmitted && score !== null && (
          <div className={`shrink-0 px-md py-sm flex items-center justify-between border-b border-outline-variant
            ${isPerfect ? 'bg-[#DCFCE7]' : score >= scenario.correctOrder.length / 2 ? 'bg-[#FEF3C7]' : 'bg-[#FEE2E2]'}`}
          >
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-2xl">
                {isPerfect ? 'emoji_events' : score >= scenario.correctOrder.length / 2 ? 'thumb_up' : 'sentiment_dissatisfied'}
              </span>
              <div>
                <div className="font-label-lg font-bold text-on-surface">
                  {isPerfect ? '🎉 Sempurna!' : `Skor: ${score} / ${scenario.correctOrder.length}`}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  {isPerfect
                    ? 'Kamu menguasai prosedur ini dengan benar!'
                    : 'Cek penjelasan di bawah dan coba lagi.'}
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-md py-xs bg-primary text-on-primary font-label-lg rounded-full shadow-sm hover:opacity-90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Main puzzle area */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Answer sequence slots */}
          <div className="flex-1 p-md overflow-y-auto flex flex-col gap-sm">
            <div className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase flex items-center gap-xs">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>format_list_numbered</span>
              Susun Urutan Tindakan Yang Benar
            </div>

            {slots.map((placedAction, i) => (
              <div key={i} className="flex flex-col gap-xs">
                <DropSlot
                  slotIndex={i}
                  placedAction={placedAction}
                  isSubmitted={isSubmitted}
                  isCorrectSlot={
                    isSubmitted && placedAction?.id === scenario.correctOrder[i]
                  }
                  onRemove={handleRemove}
                />
                {/* Explanation after submit */}
                {isSubmitted && placedAction && explanations[i] && (
                  <div className={`ml-8 px-sm py-xs rounded-lg font-body-sm text-body-sm flex items-start gap-xs
                    ${placedAction.id === scenario.correctOrder[i]
                      ? 'bg-[#DCFCE7] text-[#166534]'
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                    }`}
                  >
                    <span className="material-symbols-outlined shrink-0" style={{ fontSize: '14px' }}>
                      {placedAction.id === scenario.correctOrder[i] ? 'check' : 'info'}
                    </span>
                    {explanations[i]}
                  </div>
                )}
              </div>
            ))}

            {/* Submit button */}
            {!isSubmitted && (
              <button
                onClick={handleSubmit}
                disabled={!allSlotsFilled}
                className={`mt-md px-lg py-sm font-label-lg rounded-full shadow-sm transition-all
                  ${allSlotsFilled
                    ? 'bg-primary text-on-primary hover:opacity-90 tactile-btn'
                    : 'bg-surface-container text-on-surface-variant border border-outline-variant cursor-not-allowed'
                  }`}
              >
                {allSlotsFilled ? '✓ Cek Jawaban' : `Isi semua ${scenario.correctOrder.length} slot terlebih dahulu`}
              </button>
            )}
          </div>

          {/* RIGHT: Available action blocks */}
          <div className="w-72 shrink-0 border-l border-outline-variant p-md overflow-y-auto bg-surface-container-lowest">
            <div className="font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase flex items-center gap-xs">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>widgets</span>
              Tindakan Tersedia
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
              Seret blok ke slot di sebelah kiri. Hati-hati, ada tindakan yang <strong>salah</strong>!
            </p>
            <div className="flex flex-col gap-sm">
              {availableActions.map((action) => (
                <DraggableActionBlock
                  key={action.id}
                  action={action}
                  isUsed={usedActionIds.includes(action.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drag overlay — shows a floating copy while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeAction ? (
          <DraggableActionBlock action={activeAction} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
