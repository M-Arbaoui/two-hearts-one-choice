import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpeg';

const Logo = () => {
  return (
    <Link to="/" className="block">
      <img 
        src={logo} 
        alt="You & I Logo" 
        className="w-24 h-24 mx-auto object-contain hover:scale-105 transition-transform duration-200"
      />
    </Link>
  );
};

export default Logo;
