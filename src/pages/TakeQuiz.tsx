import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuizStore, Answer } from '@/store/quizStore';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';

const TakeQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { getQuiz, saveAttempt } = useQuizStore();
  
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [quiz, setQuiz] = useState<ReturnType<typeof getQuiz>>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionEmoji, setReactionEmoji] = useState('');

  useEffect(() => {
    if (searchParams.get('code')) {
      handleCodeSubmit();
    }
  }, []);

  const handleCodeSubmit = () => {
    const foundQuiz = getQuiz(code);
    if (!foundQuiz) {
      toast({
        title: "Quiz not found",
        description: "Please check the code and try again",
        variant: "destructive",
      });
      return;
    }
    setQuiz(foundQuiz);
  };

  const handleChoiceSelect = (choice: 'A' | 'B') => {
    setSelectedChoice(choice);
    
    // Show reaction
    const emojis = ['❤️', '😊', '🤔', '✨', '💫'];
    setReactionEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    setShowReaction(true);

    // Save answer and move to next question
    setTimeout(() => {
      if (!quiz) return;
      
      const newAnswers = [
        ...answers,
        { questionId: quiz.questions[currentQuestionIndex].id, choice },
      ];
      setAnswers(newAnswers);
      setShowReaction(false);
      setSelectedChoice(null);

      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz completed
        saveAttempt({
          quizCode: quiz.code,
          answers: newAnswers,
          completedAt: Date.now(),
        });
        navigate(`/results?code=${quiz.code}`);
      }
    }, 1500);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showReaction || !quiz) return;
      
      if (e.key === '1') handleChoiceSelect('A');
      if (e.key === '2') handleChoiceSelect('B');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showReaction, quiz, currentQuestionIndex]);

  // Code entry screen
  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <Logo />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-lg"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-beige hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="glass-card p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-gold mx-auto mb-3 sm:mb-4 fill-gold drop-shadow-lg" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">Enter Quiz Code</h1>
              <p className="text-muted-foreground text-base sm:text-lg px-4">
                Enter the 6-character code you received
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="text-center text-2xl sm:text-3xl font-mono tracking-widest bg-background/50 h-14 sm:h-16 elegant-border touch-manipulation"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && code.length === 6) {
                    handleCodeSubmit();
                  }
                }}
              />

              <Button
                onClick={handleCodeSubmit}
                disabled={code.length !== 6}
                className="w-full smooth-hover py-6 sm:py-7 text-base sm:text-lg touch-manipulation"
                size="lg"
              >
                Start Quiz
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <Logo />
      </motion.div>
      
      <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm text-beige/70">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          >
            <Card className="glass-card p-6 sm:p-8 md:p-10 text-center space-y-6 sm:space-y-8 md:space-y-10">
              <motion.div 
                className="space-y-3 sm:space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
                  Would you rather...
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl leading-relaxed px-2">{currentQuestion.prompt}</p>
                {currentQuestion.hint && (
                  <p className="text-sm sm:text-base text-muted-foreground italic mt-4 sm:mt-6">
                    💭 {currentQuestion.hint}
                  </p>
                )}
              </motion.div>

              {/* Choices */}
              <motion.div 
                className="space-y-4 sm:space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleChoiceSelect('A')}
                  disabled={showReaction}
                  className={`w-full p-5 sm:p-6 md:p-8 rounded-xl border-2 transition-all duration-300 touch-manipulation ${
                    selectedChoice === 'A'
                      ? 'border-gold bg-gold/20 gold-glow'
                      : 'border-gold/30 bg-beige/5 hover:border-gold/50 hover:bg-beige/10 active:bg-beige/15'
                  } disabled:opacity-50`}
                >
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wide hidden sm:block">Choice A (Press 1)</div>
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide sm:hidden">A</div>
                  {currentQuestion.choiceAImage && (
                    <motion.img 
                      src={currentQuestion.choiceAImage} 
                      alt="Choice A" 
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    />
                  )}
                  <div className="text-base sm:text-lg md:text-xl font-medium">{currentQuestion.choiceA}</div>
                </motion.button>

                <div className="text-sm sm:text-base text-beige/60 font-light py-1">or</div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleChoiceSelect('B')}
                  disabled={showReaction}
                  className={`w-full p-5 sm:p-6 md:p-8 rounded-xl border-2 transition-all duration-300 touch-manipulation ${
                    selectedChoice === 'B'
                      ? 'border-gold bg-gold/20 gold-glow'
                      : 'border-gold/30 bg-beige/5 hover:border-gold/50 hover:bg-beige/10 active:bg-beige/15'
                  } disabled:opacity-50`}
                >
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wide hidden sm:block">Choice B (Press 2)</div>
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide sm:hidden">B</div>
                  {currentQuestion.choiceBImage && (
                    <motion.img 
                      src={currentQuestion.choiceBImage} 
                      alt="Choice B" 
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    />
                  )}
                  <div className="text-base sm:text-lg md:text-xl font-medium">{currentQuestion.choiceB}</div>
                </motion.button>
              </motion.div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Reaction Animation */}
        <AnimatePresence>
          {showReaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <motion.div
                animate={{ y: [-20, 0, -20] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-8xl"
              >
                {reactionEmoji}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TakeQuiz;
