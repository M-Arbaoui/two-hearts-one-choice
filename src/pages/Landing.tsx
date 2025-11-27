import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md mx-auto space-y-8">
        <Logo />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="relative">
              <Heart className="w-20 h-20 text-gold fill-gold" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-8 h-8 text-gold" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-beige tracking-tight">
              You & I
            </h1>
            <p className="text-xl text-beige/80 font-light">
              Would You Rather...
            </p>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-beige/70 text-lg max-w-sm mx-auto leading-relaxed"
          >
            A private, intimate game to discover how well you know each other
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 pt-4"
          >
            <Link to="/create" className="block">
              <Button 
                size="lg" 
                className="w-full glass-card hover:gold-glow transition-all duration-200 hover:scale-105 text-lg py-6"
              >
                Create Quiz
              </Button>
            </Link>
            
            <Link to="/take" className="block">
              <Button 
                variant="outline"
                size="lg" 
                className="w-full glass-card border-gold/30 hover:border-gold/50 hover:bg-beige/10 transition-all duration-200 hover:scale-105 text-lg py-6"
              >
                Take Quiz
              </Button>
            </Link>
          </motion.div>

          {/* Secret Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8"
          >
            <Link 
              to="/secret" 
              className="text-beige/40 hover:text-gold/60 text-sm transition-colors duration-200"
            >
              ✨
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
