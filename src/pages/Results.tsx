import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuizStore } from '@/store/quizStore';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import Logo from '@/components/Logo';

const Results = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { getQuiz, getAttempt } = useQuizStore();
  
  const code = searchParams.get('code');
  const quiz = code ? getQuiz(code) : null;
  const attempt = code ? getAttempt(code) : null;
  
  const [matchRate, setMatchRate] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!quiz || !attempt) {
      navigate('/');
      return;
    }

    // Calculate score based on correct answers
    const correctCount = attempt.answers.filter(takerAnswer => {
      const question = quiz.questions.find(q => q.id === takerAnswer.questionId);
      return question && question.expectedChoice === takerAnswer.choice;
    }).length;
    const rate = Math.round((correctCount / quiz.questions.length) * 100);
    setMatchRate(rate);

    // Show confetti for high score
    if (rate >= 70 && !showConfetti) {
      setShowConfetti(true);
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#D4AF37', '#F5E6D3', '#8B1538'],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#D4AF37', '#F5E6D3', '#8B1538'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [quiz, attempt, navigate, showConfetti]);

  const handleShare = () => {
    if (code) {
      const url = `${window.location.origin}/take?code=${code}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share this quiz with someone special",
      });
    }
  };

  if (!quiz || !attempt) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 py-6 sm:py-8 md:py-10">
      <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-0"
        >
          <Logo />
        </motion.div>
        
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-beige hover:text-gold transition-colors touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            type: "spring",
            stiffness: 100
          }}
        >
          <Card className="glass-card p-6 sm:p-8 md:p-12 text-center space-y-6 sm:space-y-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.3, 
                type: "spring", 
                stiffness: 200,
                damping: 15
              }}
            >
              <Heart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gold mx-auto fill-gold drop-shadow-xl" />
            </motion.div>

            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold px-4">Quiz Complete!</h1>
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl px-4">
                You answered all {quiz.questions.length} questions
              </p>
            </div>

            <motion.div 
              className="bg-primary/10 p-6 sm:p-8 md:p-10 rounded-xl elegant-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.7, 
                  type: "spring",
                  stiffness: 150
                }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-gold mb-2 sm:mb-3"
              >
                {matchRate}%
              </motion.div>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">
                Your Score
              </p>
            </motion.div>

            {matchRate < 60 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
                className="bg-destructive/10 p-4 sm:p-5 md:p-6 rounded-xl border border-destructive/30"
              >
                <p className="text-base sm:text-lg md:text-xl font-medium text-destructive px-2">
                  {matchRate < 30 
                    ? "😬 Yikes... Are you sure you two even know each other? Time for a serious catch-up!"
                    : matchRate < 45
                    ? "😅 Well this is awkward... Maybe you should actually talk more?"
                    : "🤔 Not quite in sync yet, but there's still hope!"
                  }
                </p>
              </motion.div>
            )}

            {matchRate >= 60 && matchRate < 80 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
                className="bg-primary/10 p-4 sm:p-5 md:p-6 rounded-xl border border-primary/30"
              >
                <p className="text-base sm:text-lg md:text-xl font-medium px-2">
                  💛 Not bad! You're getting there. Keep the connection strong!
                </p>
              </motion.div>
            )}

            {matchRate >= 80 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
                className="bg-gold/10 p-4 sm:p-5 md:p-6 rounded-xl border border-gold/30"
              >
                <p className="text-base sm:text-lg md:text-xl font-medium text-gold px-2">
                  {matchRate === 100 
                    ? "✨ Perfect match! You two are absolutely in sync! 🎉"
                    : "🌟 Amazing connection! You really know each other well!"
                  }
                </p>
              </motion.div>
            )}

            <Button 
              onClick={handleShare} 
              variant="outline" 
              className="w-full elegant-border smooth-hover py-5 sm:py-6 text-base sm:text-lg touch-manipulation"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Share Quiz
            </Button>
          </Card>
        </motion.div>

        {/* Question Breakdown */}
        <div className="space-y-5 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-beige px-2">
            Answer Breakdown
          </h2>

          {quiz.questions.map((question, index) => {
            const answer = attempt.answers.find(a => a.questionId === question.id);
            const isCorrect = answer?.choice === question.expectedChoice;

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.8 + index * 0.1,
                  duration: 0.4,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
              >
                <Card className="glass-card p-5 sm:p-6 md:p-8 space-y-4 smooth-hover">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gold/20 flex items-center justify-center text-sm sm:text-base font-bold">
                          {index + 1}
                        </div>
                        <p className="font-medium text-base sm:text-lg pt-1">{question.prompt}</p>
                      </div>
                      <div className="pl-11 sm:pl-13 md:pl-14 space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className={`p-4 rounded-lg border-2 ${answer?.choice === 'A' ? 'border-gold bg-gold/10' : 'border-border/50'}`}>
                            {question.choiceAImage && (
                              <img 
                                src={question.choiceAImage} 
                                alt="Choice A" 
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                            )}
                            <p className="text-sm font-medium">A: {question.choiceA}</p>
                          </div>
                          <div className={`p-4 rounded-lg border-2 ${answer?.choice === 'B' ? 'border-gold bg-gold/10' : 'border-border/50'}`}>
                            {question.choiceBImage && (
                              <img 
                                src={question.choiceBImage} 
                                alt="Choice B" 
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                            )}
                            <p className="text-sm font-medium">B: {question.choiceB}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Your answer:</span>
                            <span className={`text-base font-medium ${isCorrect ? 'text-green-500' : 'text-red-400'}`}>
                              {answer?.choice}: {answer?.choice === 'A' ? question.choiceA : question.choiceB}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Correct answer:</span>
                              <span className="text-base font-medium text-green-500">
                                {question.expectedChoice}: {question.expectedChoice === 'A' ? question.choiceA : question.choiceB}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl flex-shrink-0">
                      {isCorrect ? '✅' : '❌'}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Secret Message */}
        {quiz.secretMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            <Card className="glass-card p-6 sm:p-8 text-center space-y-3 sm:space-y-4 border-gold/40">
              <div className="text-3xl sm:text-4xl">✨</div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold px-4">A Special Message</h3>
              <p className="text-base sm:text-lg leading-relaxed italic px-4">
                "{quiz.secretMessage}"
              </p>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Button
            onClick={() => navigate('/create')}
            variant="outline"
            className="flex-1 elegant-border smooth-hover py-5 sm:py-6 text-base sm:text-lg touch-manipulation"
          >
            Create Your Own
          </Button>
          <Button
            onClick={() => navigate('/take')}
            className="flex-1 smooth-hover py-5 sm:py-6 text-base sm:text-lg touch-manipulation"
          >
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
