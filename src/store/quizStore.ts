import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  id: string;
  prompt: string;
  choiceA: string;
  choiceB: string;
  hint?: string;
  expectedChoice?: 'A' | 'B';
}

export interface Quiz {
  code: string;
  title: string;
  description?: string;
  questions: Question[];
  secretMessage?: string;
  createdAt: number;
}

export interface Answer {
  questionId: string;
  choice: 'A' | 'B';
}

export interface QuizAttempt {
  quizCode: string;
  answers: Answer[];
  completedAt: number;
}

interface QuizState {
  quizzes: Record<string, Quiz>;
  attempts: QuizAttempt[];
  
  // Quiz creation
  createQuiz: (quiz: Omit<Quiz, 'code' | 'createdAt'>) => string;
  getQuiz: (code: string) => Quiz | undefined;
  
  // Quiz taking
  saveAttempt: (attempt: QuizAttempt) => void;
  getAttempt: (quizCode: string) => QuizAttempt | undefined;
  
  // Utilities
  generateCode: () => string;
  deleteQuiz: (code: string) => void;
}

// Generate a 6-character alphanumeric code
const generateUniqueCode = (existingCodes: string[]): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous characters
  let code: string;
  do {
    code = Array.from({ length: 6 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  } while (existingCodes.includes(code));
  return code;
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizzes: {},
      attempts: [],
      
      createQuiz: (quiz) => {
        const code = generateUniqueCode(Object.keys(get().quizzes));
        const newQuiz: Quiz = {
          ...quiz,
          code,
          createdAt: Date.now(),
        };
        
        set((state) => ({
          quizzes: {
            ...state.quizzes,
            [code]: newQuiz,
          },
        }));
        
        return code;
      },
      
      getQuiz: (code) => {
        return get().quizzes[code.toUpperCase()];
      },
      
      saveAttempt: (attempt) => {
        set((state) => ({
          attempts: [
            ...state.attempts.filter(a => a.quizCode !== attempt.quizCode),
            attempt,
          ],
        }));
      },
      
      getAttempt: (quizCode) => {
        return get().attempts.find(a => a.quizCode === quizCode);
      },
      
      generateCode: () => {
        return generateUniqueCode(Object.keys(get().quizzes));
      },
      
      deleteQuiz: (code) => {
        set((state) => {
          const { [code]: _, ...rest } = state.quizzes;
          return { quizzes: rest };
        });
      },
    }),
    {
      name: 'youandi-storage',
    }
  )
);
