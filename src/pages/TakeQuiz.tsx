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
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-beige hover:text-gold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="glass-card p-8 space-y-6">
            <div className="text-center space-y-2">
              <Heart className="w-16 h-16 text-gold mx-auto mb-4 fill-gold" />
              <h1 className="text-3xl font-serif font-bold">Enter Quiz Code</h1>
              <p className="text-muted-foreground">
                Enter the 6-character code you received
              </p>
            </div>

            <div className="space-y-4">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest bg-background/50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && code.length === 6) {
                    handleCodeSubmit();
                  }
                }}
              />

              <Button
                onClick={handleCodeSubmit}
                disabled={code.length !== 6}
                className="w-full"
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-8 text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold">
                  Would you rather...
                </h2>
                <p className="text-xl">{currentQuestion.prompt}</p>
                {currentQuestion.hint && (
                  <p className="text-sm text-muted-foreground italic mt-4">
                    💭 {currentQuestion.hint}
                  </p>
                )}
              </div>

              {/* Choices */}
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoiceSelect('A')}
                  disabled={showReaction}
                  className={`w-full p-6 rounded-lg border-2 transition-all duration-200 ${
                    selectedChoice === 'A'
                      ? 'border-gold bg-gold/20 gold-glow'
                      : 'border-gold/30 bg-beige/5 hover:border-gold/50'
                  } disabled:opacity-50`}
                >
                  <div className="text-xs text-muted-foreground mb-2">Choice A (Press 1)</div>
                  <div className="text-lg font-medium">{currentQuestion.choiceA}</div>
                </motion.button>

                <div className="text-sm text-beige/50">or</div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoiceSelect('B')}
                  disabled={showReaction}
                  className={`w-full p-6 rounded-lg border-2 transition-all duration-200 ${
                    selectedChoice === 'B'
                      ? 'border-gold bg-gold/20 gold-glow'
                      : 'border-gold/30 bg-beige/5 hover:border-gold/50'
                  } disabled:opacity-50`}
                >
                  <div className="text-xs text-muted-foreground mb-2">Choice B (Press 2)</div>
                  <div className="text-lg font-medium">{currentQuestion.choiceB}</div>
                </motion.button>
              </div>
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
