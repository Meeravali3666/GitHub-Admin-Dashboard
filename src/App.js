import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Pages
import Dashboard from './pages/Dashboard';
import PRManagement from './pages/PRManagement';
import ForksBranches from './pages/ForksBranches';
import RepoInsights from './pages/RepoInsights';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Theme
import theme from './styles/theme';

const App = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar open by default

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen); // Toggle the sidebar
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Router>
                    {/* Header */}
                    <Header onMenuClick={toggleSidebar} />

                    {/* Layout with Sidebar and Main Content */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 64px)' }}>
                        {/* Sidebar */}
                        <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />

                        {/* Main Content */}
                        <Box
                            component="main"
                            sx={{
                                flex: 1,
                                padding: '20px',
                                marginLeft: isSidebarOpen ? '250px' : '0',
                                transition: 'margin-left 0.3s ease',
                                overflowY: 'auto',
                            }}
                        >
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/pr-management" element={<PRManagement />} />
                                <Route path="/forks-branches" element={<ForksBranches />} />
                                <Route path="/repo-insights" element={<RepoInsights />} />
                            </Routes>
                        </Box>
                    </Box>
                </Router>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default App;
