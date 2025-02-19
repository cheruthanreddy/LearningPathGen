import { create } from 'zustand';
import { Topic, SkillLevel, Question, UserAnswer } from '../types';

interface AppState {
  selectedTopic: Topic | null;
  skillLevel: SkillLevel | null;
  currentStep: number;
  questions: Question[];
  userAnswers: UserAnswer[];
  learningPath: string | null;
  setTopic: (topic: Topic) => void;
  setSkillLevel: (level: SkillLevel) => void;
  setQuestions: (questions: Question[]) => void;
  addAnswer: (answer: UserAnswer) => void;
  nextStep: () => void;
  previousStep: () => void;
  setLearningPath: (path: string) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  selectedTopic: null,
  skillLevel: null,
  currentStep: 0,
  questions: [],
  userAnswers: [],
  learningPath: null,

  setTopic: (topic) => set({ selectedTopic: topic }),
  setSkillLevel: (level) => set({ skillLevel: level }),
  setQuestions: (questions) => set({ questions }),
  addAnswer: (answer) =>
    set((state) => ({
      userAnswers: [...state.userAnswers, answer],
    })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setLearningPath: (path) => set({ learningPath: path }),
  reset: () =>
    set({
      selectedTopic: null,
      skillLevel: null,
      currentStep: 0,
      questions: [],
      userAnswers: [],
      learningPath: null,
    }),
}));