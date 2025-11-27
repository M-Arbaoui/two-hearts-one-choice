import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-beige hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-card p-12 text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Heart className="w-24 h-24 text-gold mx-auto fill-gold" />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl font-serif font-bold text-beige">
                A Secret Message
              </h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="min-h-[120px] flex items-center justify-center"
              >
                <p className="text-2xl leading-relaxed font-light text-beige/90">
                  {displayedText}
                  {!isComplete && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1 h-8 bg-gold ml-1 align-middle"
                    />
                  )}
                </p>
              </motion.div>

              {!isComplete && (
                <Button
                  onClick={handleRevealAll}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  <FastForward className="w-4 h-4 mr-2" />
                  Reveal All
                </Button>
              )}
            </div>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-8"
              >
                <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="gold-glow"
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
