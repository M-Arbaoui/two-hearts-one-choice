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

    // Calculate match rate (for now, just show completion)
    // In future, could compare with creator's expected answers
    const rate = 100; // Placeholder
    setMatchRate(rate);

    // Show confetti for high match rate
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
    <div className="min-h-screen p-6 py-10">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo />
        </motion.div>
        
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-beige hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Card className="glass-card p-12 text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Heart className="w-24 h-24 text-gold mx-auto fill-gold drop-shadow-xl" />
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-5xl font-serif font-bold">Quiz Complete!</h1>
              <p className="text-muted-foreground text-xl">
                You answered all {quiz.questions.length} questions
              </p>
            </div>

            <motion.div 
              className="bg-primary/10 p-10 rounded-xl elegant-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-7xl font-bold text-gold mb-3"
              >
                {matchRate}%
              </motion.div>
              <p className="text-base text-muted-foreground font-medium">
                Connection Score
              </p>
            </motion.div>

            <Button onClick={handleShare} variant="outline" className="w-full elegant-border smooth-hover py-6 text-lg">
              <Share2 className="w-5 h-5 mr-2" />
              Share Quiz
            </Button>
          </Card>
        </motion.div>

        {/* Question Breakdown */}
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold text-beige">
            Your Answers
          </h2>

          {quiz.questions.map((question, index) => {
            const answer = attempt.answers.find(a => a.questionId === question.id);
            const choice = answer?.choice === 'A' ? question.choiceA : question.choiceB;

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="glass-card p-8 space-y-4 smooth-hover">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-base font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="font-medium text-lg">{question.prompt}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">You chose:</span>
                        <span className="text-base font-medium text-gold">
                          {answer?.choice}: {choice}
                        </span>
                      </div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Card className="glass-card p-8 text-center space-y-4 border-gold/40">
              <div className="text-4xl">✨</div>
              <h3 className="text-2xl font-serif font-bold">A Special Message</h3>
              <p className="text-lg leading-relaxed italic">
                "{quiz.secretMessage}"
              </p>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-6">
          <Button
            onClick={() => navigate('/create')}
            variant="outline"
            className="flex-1 elegant-border smooth-hover py-6 text-lg"
          >
            Create Your Own
          </Button>
          <Button
            onClick={() => navigate('/take')}
            className="flex-1 smooth-hover py-6 text-lg"
          >
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
