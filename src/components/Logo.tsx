import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Logo = () => {
  return (
    <Link to="/" className="flex justify-center w-full">
      <img 
        src={logo} 
        alt="You & I Logo" 
        className="w-40 h-40 object-contain hover:scale-105 transition-all duration-300 drop-shadow-2xl"
      />
    </Link>
  );
};

export default Logo;
