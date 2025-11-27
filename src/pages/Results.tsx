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
    <div className="min-h-screen p-4 py-8">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Logo />
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-beige hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Heart className="w-20 h-20 text-gold mx-auto fill-gold" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-4xl font-serif font-bold">Quiz Complete!</h1>
              <p className="text-muted-foreground text-lg">
                You answered all {quiz.questions.length} questions
              </p>
            </div>

            <div className="bg-primary/10 p-6 rounded-lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-6xl font-bold text-gold mb-2"
              >
                {matchRate}%
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Connection Score
              </p>
            </div>

            <Button onClick={handleShare} variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Quiz
            </Button>
          </Card>
        </motion.div>

        {/* Question Breakdown */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-beige">
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
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="glass-card p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-medium">{question.prompt}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">You chose:</span>
                        <span className="text-sm font-medium text-gold">
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
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/create')}
            variant="outline"
            className="flex-1"
          >
            Create Your Own
          </Button>
          <Button
            onClick={() => navigate('/take')}
            className="flex-1"
          >
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
