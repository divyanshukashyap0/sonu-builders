import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import FloatingActions from './components/FloatingActions';
import Breadcrumbs from './components/Breadcrumbs';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import AITools from './pages/AITools';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLeads from './pages/admin/Leads';
import AdminLeadDetails from './pages/admin/LeadDetails';
import AdminProjects from './pages/admin/Projects';
import AdminProjectForm from './pages/admin/ProjectForm';
import AdminFinancials from './pages/admin/Financials';
import AdminContent from './pages/admin/Content';
import AdminTeam from './pages/admin/Team';
import AdminSettings from './pages/admin/Settings';
import AdminLayout from './layouts/AdminLayout';
import ComingSoon from './components/admin/ComingSoon';
import AdminBootstrap from './pages/admin/AdminBootstrap';
import CaseStudy from './pages/CaseStudy';
import ProtectedRoute from './components/ProtectedRoute';
import CustomCursor from './components/luxury/CustomCursor';
import AIAssistant from './components/luxury/AIAssistant';
import { COMPANY_NAME } from './constants';
import { useCompanyData } from './hooks/useCompanyData';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { name } = useCompanyData();

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
      // Ensure minimum display time for branding but clear asap after
      setTimeout(() => setLoading(false), 2000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safety timeout in case window.load doesn't fire or stalls
    const safetyTimer = setTimeout(() => setLoading(false), 5000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      <AIAssistant />
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="app-loader flex flex-col items-center justify-center bg-luxury-obsidian"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-24 h-24 border-[1px] border-luxury-gold/20 rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-t border-luxury-gold rounded-full animate-spin" />
              </div>
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-luxury-gold tracking-[0.3em] text-sm uppercase font-light"
            >
              {name}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <Breadcrumbs />}
      <main className="flex-grow">
        <div key={location.pathname} className="page-transition">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/case-study/:id" element={<CaseStudy />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/contact" element={<Contact />} />


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
              <Route path="team" element={<AdminTeam />} />
              <Route path="settings" element={<AdminSettings />} />
              {/* Add other admin sub-routes here later */}
            </Route>

            {/* Legacy Routes - Redirect */}
            <Route path="/admin-portal" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
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
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
