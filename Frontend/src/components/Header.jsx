import Navbar from './Navbar';

const Header = () => {
  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar with Contact Information */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 text-sm">
          <p className="font-medium">Trusted IT consultancy for students and professionals</p>
          <div className="hidden sm:flex items-center gap-4">
            <a 
              href="tel:+1234567890" 
              className="opacity-90 hover:opacity-100 transition-opacity" 
              aria-label="Call us"
            >
              +91 9709203002
            </a>
            <span className="hidden md:inline">|</span>
            <a 
              href="mailto:info@PathForgeSolutions.com" 
              className="opacity-90 hover:opacity-100 transition-opacity" 
              aria-label="Email us"
            >
              rakshitros1@gmail.com
            </a>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <Navbar />
    </header>
  );
};

export default Header;
