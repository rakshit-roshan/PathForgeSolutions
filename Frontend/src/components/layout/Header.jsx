import Navbar from './Navbar';

const Header = () => {
  return (
    <HeaderWrapper>
      <Navbar />
    </HeaderWrapper>
  );
};

// Simple functional wrapper for Next.js layout structure
const HeaderWrapper = ({ children }) => {
  return <div className="relative z-50">{children}</div>;
};

export default Header;
