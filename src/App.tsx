// src/App.tsx
import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { DndContext, DragOverlay, DropAnimation, defaultDropAnimationSideEffects, PointerSensor, useSensor, useSensors, rectIntersection } from '@dnd-kit/core';
import { AnimatePresence, motion, Variants } from 'framer-motion';

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
  PrimaryNavMode,
} from './data/atoms';

// Styles
import styles from './App.module.css';

// --- Slide Animation Variants ---
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

const slideTransition = { type: 'tween', duration: 0.3, ease: 'easeOut' };

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

  // Track slide direction: -1 = left (to Reference), 1 = right (to Builder)
  const prevModeRef = useRef<PrimaryNavMode>(primaryMode);
  const [slideDirection, setSlideDirection] = useState(0);

  useEffect(() => {
    if (prevModeRef.current !== primaryMode) {
      // Reference is "left" of Builder in the toggle, so:
      // Going TO reference = slide left (direction -1)
      // Going TO builder = slide right (direction 1)
      setSlideDirection(primaryMode === 'reference' ? -1 : 1);
      prevModeRef.current = primaryMode;
    }
  }, [primaryMode]);

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

  // Determine which view to show and its animation key
  const getWorkspaceView = () => {
    if (primaryMode === 'reference') {
      return {
        key: 'reference',
        content: (
          <motion.div
            key="reference"
            className={styles.fullWorkspaceContent}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={slideDirection}
            transition={slideTransition}
          >
            <ReferencesPage />
          </motion.div>
        ),
      };
    }

    if (activeNavItem === 'welcome') {
      return {
        key: 'welcome',
        content: (
          <motion.div
            key="welcome"
            className={styles.fullWorkspaceContent}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={slideDirection}
            transition={slideTransition}
          >
            <WelcomePage />
          </motion.div>
        ),
      };
    }

    // Builder mode with Lab selected: three-pane layout
    return {
      key: `builder-${activeNavItem}`,
      content: (
        <motion.div
          key={`builder-${activeNavItem}`}
          className={styles.threePaneLayout}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={slideDirection}
          transition={slideTransition}
        >
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
        </motion.div>
      ),
    };
  };

  const workspaceView = getWorkspaceView();

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
          <AnimatePresence initial={false} custom={slideDirection}>
            {workspaceView.content}
          </AnimatePresence>
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