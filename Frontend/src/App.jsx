import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
