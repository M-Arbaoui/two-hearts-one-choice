import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Logo from '@/components/Logo';

const SecretMessage = () => {
  const navigate = useNavigate();
  const message = "In a world full of choices, you'll always be my favorite answer. ❤️";
  
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Typewriter speed

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, message]);

  const handleRevealAll = () => {
    setDisplayedText(message);
    setCurrentIndex(message.length);
    setIsComplete(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo />
      </motion.div>
      
      <div className="w-full max-w-3xl space-y-8 mt-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-beige hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="glass-card p-16 text-center space-y-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <Heart className="w-28 h-28 text-gold mx-auto fill-gold drop-shadow-2xl" />
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-5xl font-serif font-bold text-beige">
                A Secret Message
              </h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="min-h-[140px] flex items-center justify-center px-4"
              >
                <p className="text-3xl leading-relaxed font-light text-beige/95">
                  {displayedText}
                  {!isComplete && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1 h-10 bg-gold ml-2 align-middle"
                    />
                  )}
                </p>
              </motion.div>

              {!isComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button
                    onClick={handleRevealAll}
                    variant="outline"
                    size="sm"
                    className="mt-6 elegant-border"
                  >
                    <FastForward className="w-4 h-4 mr-2" />
                    Reveal All
                  </Button>
                </motion.div>
              )}
            </div>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-8"
              >
                <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="gold-glow smooth-hover py-7 text-lg"
                >
                  Return Home
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SecretMessage;
