import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChevronRight } from 'lucide-react';

export const Quiz = () => {
  const { questions, currentStep, addAnswer, nextStep } = useStore();
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

  const currentQuestion = questions[currentStep - 2];

  const handleNext = () => {
    if (selectedAnswerIndex !== null) {
      addAnswer({
        questionId: currentQuestion.id,
        answer: selectedAnswerIndex, // Store the index of the selected option
      });
      setSelectedAnswerIndex(null); // Reset selection
      nextStep();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            Question {currentStep - 1} of 5
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {currentQuestion.text}
        </h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswerIndex(index)} // Set index instead of the option string
              className={`w-full p-4 text-left rounded-lg border ${
                selectedAnswerIndex === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              } transition-colors duration-200`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        disabled={selectedAnswerIndex === null} // Check if an answer is selected
        className={`w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 ${
          selectedAnswerIndex !== null
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        } transition-colors duration-200`}
      >
        <span>Next Question</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
