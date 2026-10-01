import { createHashRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import Settings from './pages/Settings';
import { RoadmapPage, GlossaryPage } from './pages/DocsPages';

const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'learn/:id', element: <LessonPage /> },
      { path: 'roadmap', element: <RoadmapPage /> },
      { path: 'glossary', element: <GlossaryPage /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
