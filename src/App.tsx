import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { DemoProvider } from "@/hooks/useDemoMode";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataModeProvider } from "@/context/DataModeContext";
import { AppLayout } from "@/components/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Pulse from "./pages/Pulse";
import Settings from "./pages/Settings";
import Scheduled from "./pages/Scheduled";
import Offers from "./pages/Offers";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import CreditScoreInfo from "./pages/CreditScoreInfo";
import PulseInfo from "./pages/PulseInfo";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import SecurityPage from "./pages/Security";
import NotFound from "./pages/NotFound";
import AutosyncCallback from "./pages/AutosyncCallback";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/credit-score" element={<CreditScoreInfo />} />
            <Route path="/pulse-info" element={<PulseInfo />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/onboarding" element={<ProtectedRoute requireAuth={true}><Onboarding /></ProtectedRoute>} />
            <Route path="/autosync/callback" element={<ProtectedRoute requireAuth={true}><AutosyncCallback /></ProtectedRoute>} />

            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<ProtectedRoute requireAuth={true}><Onboarding /></ProtectedRoute>} />

            {/* Authenticated routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/accounts/:id" element={<Accounts />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/pulse" element={<Pulse />} />
              <Route path="/scheduled" element={<Scheduled />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Demo routes — no auth required */}
            <Route element={<DemoProvider usePrefix={true}><AppLayout /></DemoProvider>}>
              <Route path="/demo" element={<Dashboard />} />
              <Route path="/demo/dashboard" element={<Dashboard />} />
              <Route path="/demo/chat" element={<Chat />} />
              <Route path="/demo/accounts" element={<Accounts />} />
              <Route path="/demo/accounts/:id" element={<Accounts />} />
              <Route path="/demo/transactions" element={<Transactions />} />
              <Route path="/demo/budgets" element={<Budgets />} />
              <Route path="/demo/goals" element={<Goals />} />
              <Route path="/demo/pulse" element={<Pulse />} />
              <Route path="/demo/scheduled" element={<Scheduled />} />
              <Route path="/demo/offers" element={<Offers />} />
              <Route path="/demo/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </DataModeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
