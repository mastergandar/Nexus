
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AccountComparison from "./pages/AccountComparison";
import Statistics from "./pages/Statistics";
import Listings from "./pages/Listings";
import FileVacancies from "./pages/FileVacancies";
import Balance from "./pages/Balance";
import AITools from "./pages/AITools";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Reports from "@/pages/Reports.tsx";
import ReportView from "@/pages/ReportView.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <ComparisonProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
                        <Routes>
                            <Route path="/reports/preview/:id" element={<ReportView />} />
                            <Route path="/*" element={
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/accounts" element={<Accounts />} />
                                        <Route path="/listings" element={<Listings />} />
                                        <Route path="/statistics" element={<Statistics />} />
                                        <Route path="/reports" element={<Reports />} />
                                        <Route path="/balance" element={<Balance />} />
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="/ai-tools" element={<AITools />} />
                                        <Route path="/listings/file/:cabinetId" element={<FileVacancies />} />
                                        <Route path="/account-comparison" element={<AccountComparison />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </Layout>
                            } />
                        </Routes>
                        <Toaster />
                    </div>
                </BrowserRouter>
            </ComparisonProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;