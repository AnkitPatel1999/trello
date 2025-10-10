import { lazy, Suspense } from 'react';

// Lazy load modals
export const LazyTaskModal = lazy(() => import('../taskmodal/TaskModal'));
export const LazyProjectModal = lazy(() => import('../projectmodal/ProjectModal'));

// Loading component for modals
const ModalLoader = () => (
  <div className="modal-loader">
    <div className="spinner"></div>
    <span>Loading...</span>
  </div>
);

// Wrapper components with Suspense
export const TaskModalWithSuspense = (props: any) => (
  <Suspense fallback={<ModalLoader />}>
    <LazyTaskModal {...props} />
  </Suspense>
);

export const ProjectModalWithSuspense = (props: any) => (
  <Suspense fallback={<ModalLoader />}>
    <LazyProjectModal {...props} />
  </Suspense>
);
