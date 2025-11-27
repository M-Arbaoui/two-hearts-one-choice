import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
      <div className="w-full max-w-lg mx-auto space-y-8 sm:space-y-10 md:space-y-12">
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
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-beige tracking-tight drop-shadow-lg">
              You & I
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl md:text-3xl text-beige/90 font-light tracking-wide"
            >
              Would You Rather...
            </motion.p>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-beige/80 text-base sm:text-lg md:text-xl max-w-md mx-auto leading-relaxed px-4"
          >
            A private game for the two of us, to see how our choices align.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-3 sm:space-y-4 pt-4 sm:pt-6"
          >
            <Link to="/create" className="block">
              <Button 
                size="lg" 
                className="w-full smooth-hover gold-glow text-base sm:text-lg py-6 sm:py-7 font-medium touch-manipulation"
              >
                Create Quiz
              </Button>
            </Link>
            
            <Link to="/take" className="block">
              <Button 
                variant="outline"
                size="lg" 
                className="w-full elegant-border smooth-hover text-base sm:text-lg py-6 sm:py-7 font-medium touch-manipulation"
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
            className="pt-8 sm:pt-10 md:pt-12"
          >
            <Link 
              to="/secret" 
              className="text-beige/30 hover:text-gold/70 text-xl sm:text-2xl transition-all duration-300 hover:scale-125 inline-block touch-manipulation"
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
