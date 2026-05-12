import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import FloatingActions from './components/FloatingActions';
import { DynamicBackground } from './components/DynamicBackground';


// Lazy Load Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Gallery from './pages/DesignInspirationsPage';

// Lazy Load Pages (Lower priority/Utility)
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const AITools = lazy(() => import('./pages/AITools'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminBootstrap = lazy(() => import('./pages/admin/AdminBootstrap'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLeads = lazy(() => import('./pages/admin/Leads'));
const AdminLeadDetails = lazy(() => import('./pages/admin/LeadDetails'));
const AdminProjects = lazy(() => import('./pages/admin/Projects'));
const AdminProjectForm = lazy(() => import('./pages/admin/ProjectForm'));
const AdminFinancials = lazy(() => import('./pages/admin/Financials'));
const AdminContent = lazy(() => import('./pages/admin/Content'));
const AdminTeam = lazy(() => import('./pages/admin/Team'));
const AdminServices = lazy(() => import('./pages/admin/Services'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminChatInquiries = lazy(() => import('./pages/admin/ChatInquiries'));
const AdminCallLogs = lazy(() => import('./pages/admin/CallLogs'));
const AdminMediaLibrary = lazy(() => import('./pages/admin/MediaLibrary'));
const AppearanceSettings = lazy(() => import('./pages/admin/AppearanceSettings'));
const AdminInspirations = lazy(() => import('./pages/admin/InspirationManager'));
const InspirationDetail = lazy(() => import('./pages/InspirationDetail'));
const GalleryMediaDetail = lazy(() => import('./pages/GalleryMediaDetail'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CustomCursor from './components/luxury/CustomCursor';
import AIAssistant from './components/luxury/AIAssistant';
import PremiumLoader from './components/luxury/PremiumLoader';

import { COMPANY_NAME } from './constants';
import { useCompanyData } from './hooks/useCompanyData';
import { motion, AnimatePresence } from 'framer-motion';
import { SmoothScroll } from './components/luxury/SmoothScroll';
import GlobalScrollEffects from './components/luxury/GlobalScrollEffects';
import CinematicOverlay from './components/luxury/CinematicOverlay';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PerformanceProvider } from './context/PerformanceContext';
import { ToastProvider } from './context/ToastContext';
import { db } from './lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';


// Listen for chunk load errors and force a refresh
const ChunkErrorListener = ({ children }: { children: React.SuspenseProps['children'] }) => {
  useEffect(() => {
    const handleError = (error: ErrorEvent | PromiseRejectionEvent) => {
      const message = 'message' in error ? error.message : (error as any).reason?.message;
      if (
        message?.includes('Failed to fetch dynamically imported module') ||
        message?.includes('error loading dynamically imported module') ||
        message?.includes('Importing a module script failed')
      ) {
        console.warn('Chunk loading failed. Forcing a hard reload to sync with new deployment...');
        window.location.reload();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  return <>{children}</>;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Check if there is a hash (anchor) in the URL
    if (hash) {
      // Use a small timeout to ensure content is rendered before scrolling
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // If no hash, scroll to top instantly (bypass smooth-scroll CSS)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

// Loading Component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
    <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
  </div>
);


const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isInitialLoading, setIsInitialLoading] = useState(() => {
    // Check if this is the first time the user is visiting in this session
    return !sessionStorage.getItem('sonu_builders_loaded');
  });
  const { name } = useCompanyData();
 
  useEffect(() => {
    if (isInitialLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isInitialLoading]);

  const handleLoadingComplete = () => {
    setIsInitialLoading(false);
    sessionStorage.setItem('sonu_builders_loaded', 'true');
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'master'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.siteTitle) document.title = data.siteTitle;
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      <AnimatePresence>
        {isInitialLoading && (
          <PremiumLoader onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>
      <div className="flex flex-col min-h-screen relative">
      <DynamicBackground />

      <CustomCursor />
      <AIAssistant />
      <GlobalScrollEffects />
      {!isAdminRoute && <CinematicOverlay />}
      {!isAdminRoute && <Header />}

      <main className="flex-grow overflow-x-hidden">
        <div key={location.pathname} className="page-transition">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:category" element={<Gallery />} />
              <Route path="/gallery/item/:itemId" element={<InspirationDetail />} />
              <Route path="/gallery/media" element={<GalleryMediaDetail />} />
              <Route path="/case-study/:id" element={<CaseStudy />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/sitemap" element={<Sitemap />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/bootstrap" element={<AdminBootstrap />} />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<Navigate to="/admin" replace />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="leads/:id" element={<AdminLeadDetails />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/new" element={<AdminProjectForm />} />
                <Route path="projects/edit/:id" element={<AdminProjectForm />} />
                <Route path="financials" element={<AdminFinancials />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="services/:id" element={<AdminServices />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="chat-inquiries" element={<AdminChatInquiries />} />
                <Route path="appearance" element={<AppearanceSettings />} />
                <Route path="call-logs" element={<AdminCallLogs />} />
                <Route path="media" element={<AdminMediaLibrary />} />
                <Route path="inspirations" element={<AdminInspirations />} />
              </Route>

              {/* Legacy Routes - Redirect */}
              <Route path="/admin-portal" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      {!isAdminRoute && <FloatingActions />}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BottomNav />}
    </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <PerformanceProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <SmoothScroll>
              <ChunkErrorListener>
                <AppContent />
              </ChunkErrorListener>
            </SmoothScroll>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </PerformanceProvider>
  );
};

export default App;
