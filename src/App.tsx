// src/App.tsx
import { useAtomValue } from 'jotai';
import { DndContext, DragOverlay, DropAnimation, defaultDropAnimationSideEffects, PointerSensor, useSensor, useSensors, rectIntersection } from '@dnd-kit/core';

// Features
import { Sidebar } from './features/Sidebar/Sidebar';
import { GeneralComponentsBrowser } from './features/ComponentBrowser/GeneralComponentsBrowser';
import { PlaceholderPanel } from './features/ComponentBrowser/PlaceholderPanel';
import { EditorCanvas } from './features/EditorCanvas/EditorCanvas';
import { OutputPanel } from './features/OutputPanel/OutputPanel';
import { DndDragOverlay } from './features/EditorCanvas/DndDragOverlay';
import { ReferencesPage } from './features/References/ReferencesPage';
import { WelcomePage } from './features/Welcome/WelcomePage';

// Generic Components
import { ResizablePanel } from './components/ResizablePanel';
import { ToastContainer } from './components/ToastContainer';

// Data and Hooks
import { useCanvasDnd } from './data/useCanvasDnd';
import { useEditorHotkeys } from './data/useEditorHotkeys';
import {
  primaryNavModeAtom,
  sidebarNavItemAtom,
  shouldShowPanelsAtom,
  activeDndIdAtom,
  SidebarNavItem,
} from './data/atoms';

// Styles
import styles from './App.module.css';

const dropAnimation: DropAnimation = {
  duration: 0,
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0',
      },
    },
  }),
};

const INITIAL_PANEL_WIDTH = 320;
const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 600;

function App() {
  const primaryMode = useAtomValue(primaryNavModeAtom);
  const activeNavItem = useAtomValue(sidebarNavItemAtom);
  const shouldShowPanels = useAtomValue(shouldShowPanelsAtom);
  const activeDndId = useAtomValue(activeDndIdAtom);

  const { activeDndItem, handleDragStart, handleDragOver, handleDragEnd } = useCanvasDnd();

  // Centralized hotkey management
  useEditorHotkeys();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Map sidebar nav item to lab ID for component browser
  const getLabId = (navItem: SidebarNavItem): string => {
    if (navItem === 'welcome') return 'lab-1'; // fallback
    return navItem;
  };

  const renderLeftPanelContent = () => {
    const labId = getLabId(activeNavItem);
    // Labs 1, 2, and 3 use the component browser with filtered content
    if (labId === 'lab-1' || labId === 'lab-2' || labId === 'lab-3') {
      return <GeneralComponentsBrowser labId={labId} />;
    }
    return <PlaceholderPanel title={labId} />;
  };

  const renderWorkspaceContent = () => {
    // Reference mode: show references page
    if (primaryMode === 'reference') {
      return (
        <div className={styles.fullWorkspaceContent}>
          <ReferencesPage />
        </div>
      );
    }

    // Welcome: show welcome page (no panels)
    if (activeNavItem === 'welcome') {
      return (
        <div className={styles.fullWorkspaceContent}>
          <WelcomePage />
        </div>
      );
    }

    // Builder mode with Lab selected: three-pane layout
    return (
      <div className={styles.threePaneLayout}>
        <ResizablePanel
          initialWidth={INITIAL_PANEL_WIDTH}
          minWidth={MIN_PANEL_WIDTH}
          maxWidth={MAX_PANEL_WIDTH}
          position="left"
          isAnimatedVisible={shouldShowPanels}
        >
          {renderLeftPanelContent()}
        </ResizablePanel>
        <div className={styles.centerPane}>
          <EditorCanvas />
        </div>
        <ResizablePanel
          initialWidth={400}
          minWidth={320}
          maxWidth={800}
          position="right"
          isAnimatedVisible={shouldShowPanels}
        >
          <OutputPanel />
        </ResizablePanel>
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      autoScroll={true}
      collisionDetection={rectIntersection}
    >
      <div className={styles.appContainer}>
        <Sidebar />
        <div className={styles.workspaceContainer}>
          {renderWorkspaceContent()}
        </div>
        <ToastContainer />
      </div>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeDndId ? <DndDragOverlay activeItem={activeDndItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;