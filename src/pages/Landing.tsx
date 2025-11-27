import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-lg mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Logo />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-8"
        >
          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-7xl md:text-8xl font-bold text-beige tracking-tight drop-shadow-lg">
              You & I
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-beige/90 font-light tracking-wide"
            >
              Would You Rather...
            </motion.p>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-beige/80 text-lg max-w-md mx-auto leading-relaxed px-4"
          >
            A private game for the two of us, to see how our choices align.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-4 pt-6"
          >
            <Link to="/create" className="block">
              <Button 
                size="lg" 
                className="w-full smooth-hover gold-glow text-lg py-7 font-medium"
              >
                Create Quiz
              </Button>
            </Link>
            
            <Link to="/take" className="block">
              <Button 
                variant="outline"
                size="lg" 
                className="w-full elegant-border smooth-hover text-lg py-7 font-medium"
              >
                Take Quiz
              </Button>
            </Link>
          </motion.div>

          {/* Secret Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-12"
          >
            <Link 
              to="/secret" 
              className="text-beige/30 hover:text-gold/70 text-2xl transition-all duration-300 hover:scale-125 inline-block"
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
