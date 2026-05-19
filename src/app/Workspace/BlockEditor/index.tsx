import BlocklyComponent from './BlocklyComponent';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import { useSearchParams } from 'react-router-dom';

import { MISSIONS } from '../../../missions/data/missions';

export default function BlockEditor() {
  const [searchParams] = useSearchParams();
  const { activeContextId } = useWorkspaceStore();
  
  const missionParam = searchParams.get('mission');
  const targetContextId = missionParam
    ? (MISSIONS.find(m => m.id === missionParam)?.id ?? 'free_workspace')
    : (searchParams.get('project') ?? 'free_workspace');

  // Wait until the store has caught up with the URL parameter (handled by Workspace useEffect)
  if (activeContextId !== targetContextId) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-surface-container">
        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <BlocklyComponent key={activeContextId} contextId={activeContextId} />
    </div>
  );
}
