import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, GripVertical, Copy, Check, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useQuizStore, Question } from '@/store/quizStore';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createQuiz = useQuizStore((state) => state.createQuiz);
  
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', prompt: '', choiceA: '', choiceB: '', hint: '', expectedChoice: undefined },
  ]);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), prompt: '', choiceA: '', choiceB: '', hint: '', expectedChoice: undefined },
    ]);
  };

  const handleImageUpload = async (questionId: string, choice: 'A' | 'B', file: File) => {
    const uploadKey = `${questionId}-${choice}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('quiz-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('quiz-images')
        .getPublicUrl(filePath);

      setQuestions(questions.map(q => 
        q.id === questionId 
          ? { ...q, [choice === 'A' ? 'choiceAImage' : 'choiceBImage']: publicUrl }
          : q
      ));

      toast({
        title: "Image uploaded!",
        description: "Your image has been added to the quiz",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Could not upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const removeImage = (questionId: string, choice: 'A' | 'B') => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, [choice === 'A' ? 'choiceAImage' : 'choiceBImage']: undefined }
        : q
    ));
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
      if (!q.expectedChoice) {
        toast({
          title: "Mark correct answers",
          description: "Select the correct answer for each question",
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="w-full max-w-lg"
        >
          <Card className="glass-card p-6 sm:p-8 md:p-10 text-center space-y-6 sm:space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-5xl sm:text-6xl md:text-7xl"
            >
              🎉
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-2 sm:mb-3">Quiz Created!</h2>
              <p className="text-muted-foreground text-base sm:text-lg px-4">Share this code with your partner</p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-primary/10 p-6 sm:p-8 rounded-xl elegant-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Quiz Code</p>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono tracking-widest text-gold">
                {generatedCode}
              </p>
            </motion.div>

            <Button 
              onClick={copyToClipboard} 
              className="w-full smooth-hover py-6 sm:py-7 text-base sm:text-lg touch-manipulation"
              size="lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Copy Link
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full elegant-border smooth-hover py-5 sm:py-6 touch-manipulation"
            >
              Back to Home
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 py-6 sm:py-8 md:py-10">
      <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-beige hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <div className="space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-beige">
              Questions ({questions.length})
            </h2>
            <Button onClick={addQuestion} size="sm" variant="outline" className="elegant-border touch-manipulation w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -50 }}
                transition={{
                  duration: 0.4,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                layout
              >
                <Card className="glass-card p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 smooth-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-gold">{index + 1}</span>
                      </div>
                      <span className="font-semibold text-base sm:text-lg">Question {index + 1}</span>
                    </div>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-destructive hover:text-destructive transition-colors touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Would you rather...</Label>
                    <Input
                      value={question.prompt}
                      onChange={(e) =>
                        updateQuestion(question.id, 'prompt', e.target.value)
                      }
                      placeholder="e.g., explore the ocean depths or outer space?"
                      maxLength={120}
                      className="bg-background/50 touch-manipulation"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base">Choice A</Label>
                      <Input
                        value={question.choiceA}
                        onChange={(e) =>
                          updateQuestion(question.id, 'choiceA', e.target.value)
                        }
                        placeholder="Ocean depths"
                        maxLength={120}
                        className="bg-background/50 touch-manipulation"
                      />
                      <div className="space-y-2">
                        {question.choiceAImage ? (
                          <div className="relative">
                            <motion.img 
                              src={question.choiceAImage} 
                              alt="Choice A" 
                              className="w-full h-28 sm:h-32 object-cover rounded-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 touch-manipulation"
                              onClick={() => removeImage(question.id, 'A')}
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(question.id, 'A', file);
                              }}
                              className="hidden"
                              id={`image-a-${question.id}`}
                            />
                            <Label
                              htmlFor={`image-a-${question.id}`}
                              className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors touch-manipulation"
                            >
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-xs sm:text-sm">Add image</span>
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base">Choice B</Label>
                      <Input
                        value={question.choiceB}
                        onChange={(e) =>
                          updateQuestion(question.id, 'choiceB', e.target.value)
                        }
                        placeholder="Outer space"
                        maxLength={120}
                        className="bg-background/50 touch-manipulation"
                      />
                      <div className="space-y-2">
                        {question.choiceBImage ? (
                          <div className="relative">
                            <motion.img 
                              src={question.choiceBImage} 
                              alt="Choice B" 
                              className="w-full h-28 sm:h-32 object-cover rounded-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 touch-manipulation"
                              onClick={() => removeImage(question.id, 'B')}
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(question.id, 'B', file);
                              }}
                              className="hidden"
                              id={`image-b-${question.id}`}
                            />
                            <Label
                              htmlFor={`image-b-${question.id}`}
                              className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors touch-manipulation"
                            >
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-xs sm:text-sm">Add image</span>
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Hint or Note (optional)</Label>
                    <Input
                      value={question.hint || ''}
                      onChange={(e) =>
                        updateQuestion(question.id, 'hint', e.target.value)
                      }
                      placeholder="A loving note or hint..."
                      maxLength={120}
                      className="bg-background/50 touch-manipulation"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gold text-sm sm:text-base">Correct Answer ⭐</Label>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Button
                        type="button"
                        variant={question.expectedChoice === 'A' ? 'default' : 'outline'}
                        onClick={() => updateQuestion(question.id, 'expectedChoice', 'A')}
                        className="elegant-border smooth-hover py-5 sm:py-6 touch-manipulation text-sm sm:text-base"
                      >
                        A is correct
                      </Button>
                      <Button
                        type="button"
                        variant={question.expectedChoice === 'B' ? 'default' : 'outline'}
                        onClick={() => updateQuestion(question.id, 'expectedChoice', 'B')}
                        className="elegant-border smooth-hover py-5 sm:py-6 touch-manipulation text-sm sm:text-base"
                      >
                        B is correct
                      </Button>
                    </div>
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
            className="w-full gold-glow smooth-hover py-6 sm:py-7 text-base sm:text-lg font-medium touch-manipulation"
          >
            Create Quiz ✨
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateQuiz;
