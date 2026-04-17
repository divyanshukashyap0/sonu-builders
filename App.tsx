import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import FloatingActions from './components/FloatingActions';


// Lazy Load Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Estimate from './pages/Estimate';
import Gallery from './pages/Gallery';

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
const AdminEstimates = lazy(() => import('./pages/admin/Estimates'));
const AdminCallLogs = lazy(() => import('./pages/admin/CallLogs'));

import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CustomCursor from './components/luxury/CustomCursor';
import AIAssistant from './components/luxury/AIAssistant';
import { COMPANY_NAME } from './constants';
import { useCompanyData } from './hooks/useCompanyData';
import VideoLoader from './components/VideoLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PerformanceProvider } from './context/PerformanceContext';
import { db } from './lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';


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
      // If no hash, scroll to top instantly
      window.scrollTo(0, 0);
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
  const [isContentReady, setIsContentReady] = useState(false);
  const [showLoader, setShowLoader] = useState(() => {
    return sessionStorage.getItem('hasSeenLoader') !== 'true';
  });
  const { theme, toggleTheme } = useTheme();
  const { name } = useCompanyData();

  const handleLoaderComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem('hasSeenLoader', 'true');
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'master'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.siteTitle) document.title = data.siteTitle;
        if (data.themeOverride && data.themeOverride !== 'auto') {
          // Enforce theme if overridden by admin
          if (data.themeOverride !== theme) {
            toggleTheme();
          }
        }
      }
    });
    return () => unsub();
  }, [theme, toggleTheme]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'appearance'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const root = document.documentElement;

        // Map appearance data to CSS variables
        if (data.luxuryWhite) root.style.setProperty('--luxury-white', data.luxuryWhite);
        if (data.warmBeige) root.style.setProperty('--warm-beige', data.warmBeige);
        if (data.charcoal) root.style.setProperty('--charcoal', data.charcoal);
        if (data.goldAccent) root.style.setProperty('--gold-accent', data.goldAccent);
        if (data.bronze) root.style.setProperty('--bronze', data.bronze);
        if (data.obsidian) root.style.setProperty('--obsidian', data.obsidian);
        if (data.champagne) root.style.setProperty('--champagne', data.champagne);
        if (data.premiumStone) root.style.setProperty('--premium-stone', data.premiumStone);
        if (data.ivoryPearl) root.style.setProperty('--ivory-pearl', data.ivoryPearl);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      setIsContentReady(true);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safety timeout in case window.load doesn't fire or stalls
    const safetyTimer = setTimeout(() => setIsContentReady(true), 5000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (

    <div className="flex flex-col min-h-screen relative">
      {/* Global Low-Opacity Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="/images/site-bg.png" 
          className="w-full h-full object-cover opacity-[0.05] grayscale brightness-[1.2]" 
          alt="Global Architecture Background"
        />
        <div className="absolute inset-0 bg-neutral-950/20" />
      </div>

      <CustomCursor />
      <AIAssistant />
      <AnimatePresence>
        {showLoader && (
          <VideoLoader
            isLoading={!isContentReady}
            onComplete={handleLoaderComplete}
          />
        )}
      </AnimatePresence>
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
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/estimate" element={<Estimate />} />
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
                <Route path="team" element={<AdminTeam />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="chat-inquiries" element={<AdminChatInquiries />} />
                <Route path="estimates" element={<AdminEstimates />} />
                <Route path="call-logs" element={<AdminCallLogs />} />
                {/* Add other admin sub-routes here later */}
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
  );
};

const App: React.FC = () => {
  return (
    <PerformanceProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </ThemeProvider>
    </PerformanceProvider>
  );
};

export default App;
