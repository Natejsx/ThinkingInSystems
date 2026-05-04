import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SearchModal } from '@/components/search/SearchModal';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const DocsLayout = lazy(() =>
  import('@/components/docs/DocsLayout').then((m) => ({ default: m.DocsLayout }))
);

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <SearchModal />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/docs" element={<DocsLayout />} />
          <Route path="/docs/*" element={<DocsLayout />} />
        </Routes>
      </Suspense>
    </>
  );
}
