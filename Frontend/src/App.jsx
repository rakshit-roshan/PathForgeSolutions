import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Internship from './pages/Internship';
import CareerGuidance from './pages/CareerGuidance';
import JobConsultancy from './pages/JobConsultancy';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardOverview from './components/DashboardOverview';
import EmployeeList from './components/EmployeeList';
import './App.css';

const theme = createTheme();

// Layout wrapper component to conditionally render header and footer
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Define routes that should show header and footer (public pages)
  const publicRoutes = ['/', '/about', '/services', '/internship', '/career-guidance', '/job-consultancy', '/contact', '/login'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // If it's a dashboard route, don't show header and footer (let ProtectedRoute handle authentication)
  if (location.pathname.startsWith('/dashboard')) {
    return <>{children}</>;
  }

  // If user is authenticated and not on a public route, don't show header and footer
  if (isAuthenticated && !isPublicRoute) {
    return <>{children}</>;
  }

  // For public routes, show header and footer
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="App">
            <LayoutWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/internship" element={<Internship />} />
                <Route path="/career-guidance" element={<CareerGuidance />} />
                <Route path="/job-consultancy" element={<JobConsultancy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/sidebar" element={
                  <ProtectedRoute>
                    <Sidebar />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/topbar" element={
                  <ProtectedRoute>
                    <TopBar />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/overview" element={
                  <ProtectedRoute>
                    <DashboardOverview />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employees" element={
                  <ProtectedRoute>
                    <EmployeeList />
                  </ProtectedRoute>
                } />
              </Routes>
            </LayoutWrapper>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
