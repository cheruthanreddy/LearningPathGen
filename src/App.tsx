import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { TopicSelection } from './components/TopicSelection';
import { SkillLevel } from './components/SkillLevel';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';

// Sample questions - in a real app, these would be generated based on topic and skill level
const sampleQuestions = [
  {
    id: '1',
    text: 'Which of these is not a programming paradigm?',
    options: [
      'Object-oriented programming',
      'Functional programming',
      'Visual programming',
      'Sequential programming'
    ],
    correctAnswer: 'Sequential programming'
  },
  {
    id: '2',
    text: 'What is the primary purpose of version control systems?',
    options: [
      'To track changes in source code',
      'To compile code faster',
      'To debug applications',
      'To deploy applications'
    ],
    correctAnswer: 'To track changes in source code'
  },
  
  {
    id: '3',
    text: 'What is the purpose of a constructor in OOP?',
    options: [
      'To destroy objects',
      'To initialize object properties',
      'To define class methods',
      'To handle exceptions'
    ],
    correctAnswer: 'To initialize object properties'
  },
  {
    id: '4',
    text: 'Which data structure follows the LIFO principle?',
    options: [
      'Queue',
      'Stack',
      'Array',
      'Linked List'
    ],
    correctAnswer: 'Stack'
  },
  {
    id: '5',
    text: 'What is the time complexity of binary search?',
    options: [
      'O(n)',
      'O(log n)',
      'O(n²)',
      'O(1)'
    ],
    correctAnswer: 'O(log n)'
  }
];

function App() {
  const { currentStep, setQuestions } = useStore();

  useEffect(() => {
    setQuestions(sampleQuestions);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TopicSelection />;
      case 1:
        return <SkillLevel />;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return <Quiz />;
      case 7:
        return <Results />;
      default:
        return <TopicSelection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Learning Path Generator</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-8">
        {renderStep()}
      </main>
    </div>
  );
}

export default App;