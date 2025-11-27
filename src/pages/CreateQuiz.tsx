import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, GripVertical, Copy, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useQuizStore, Question } from '@/store/quizStore';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createQuiz = useQuizStore((state) => state.createQuiz);
  
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', prompt: '', choiceA: '', choiceB: '', hint: '' },
  ]);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), prompt: '', choiceA: '', choiceB: '', hint: '' },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const validateQuiz = () => {
    if (questions.length < 3) {
      toast({
        title: "Need more questions",
        description: "Add at least 3 questions to create your quiz",
        variant: "destructive",
      });
      return false;
    }

    for (const q of questions) {
      if (!q.prompt.trim() || !q.choiceA.trim() || !q.choiceB.trim()) {
        toast({
          title: "Incomplete question",
          description: "All questions need a prompt and both choices",
          variant: "destructive",
        });
        return false;
      }
      if (q.prompt.length > 120 || q.choiceA.length > 120 || q.choiceB.length > 120) {
        toast({
          title: "Text too long",
          description: "Keep each field under 120 characters",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleCreate = () => {
    if (!validateQuiz()) return;

    const code = createQuiz({
      title: 'Our Quiz',
      questions,
    });

    setGeneratedCode(code);
    toast({
      title: "Quiz created! ✨",
      description: `Your quiz code is ${code}`,
    });
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      const url = `${window.location.origin}/take?code=${generatedCode}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Quiz link copied to clipboard",
      });
    }
  };

  if (generatedCode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Logo />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mt-6"
        >
          <Card className="glass-card p-8 text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">Quiz Created!</h2>
              <p className="text-muted-foreground">Share this code with your partner</p>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Quiz Code</p>
              <p className="text-4xl font-bold font-mono tracking-widest text-gold">
                {generatedCode}
              </p>
            </div>

            <Button 
              onClick={copyToClipboard} 
              className="w-full"
              size="lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Logo />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-beige hover:text-gold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

        </motion.div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-beige">
              Questions ({questions.length})
            </h2>
            <Button onClick={addQuestion} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
              >
                <Card className="glass-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">Question {index + 1}</span>
                    </div>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Would you rather...</Label>
                    <Input
                      value={question.prompt}
                      onChange={(e) =>
                        updateQuestion(question.id, 'prompt', e.target.value)
                      }
                      placeholder="e.g., explore the ocean depths or outer space?"
                      maxLength={120}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Choice A</Label>
                      <Input
                        value={question.choiceA}
                        onChange={(e) =>
                          updateQuestion(question.id, 'choiceA', e.target.value)
                        }
                        placeholder="Ocean depths"
                        maxLength={120}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Choice B</Label>
                      <Input
                        value={question.choiceB}
                        onChange={(e) =>
                          updateQuestion(question.id, 'choiceB', e.target.value)
                        }
                        placeholder="Outer space"
                        maxLength={120}
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Hint or Note (optional)</Label>
                    <Input
                      value={question.hint || ''}
                      onChange={(e) =>
                        updateQuestion(question.id, 'hint', e.target.value)
                      }
                      placeholder="A loving note or hint..."
                      maxLength={120}
                      className="bg-background/50"
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleCreate}
            size="lg"
            className="w-full gold-glow"
          >
            Create Quiz ✨
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateQuiz;
