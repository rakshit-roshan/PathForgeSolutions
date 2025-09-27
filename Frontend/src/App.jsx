import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header';
import Footer from './components/Footer';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/internship" element={<Internship />} />
              <Route path="/career-guidance" element={<CareerGuidance />} />
              <Route path="/job-consultancy" element={<JobConsultancy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/sidebar" element={<Sidebar />} />
              <Route path="/dashboard/topbar" element={<TopBar />} />
              <Route path="/dashboard/overview" element={<DashboardOverview />} />
              <Route path="/dashboard/employees" element={<EmployeeList />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
