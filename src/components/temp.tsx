import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [generatedText, setGeneratedText] = useState('');
  const [question, setQuestion] = useState('');
  const [questionsData, setQuestionsData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Function to generate the quiz questions
  async function generateAnswer() {
    setGeneratedText('Fetching your data...');
    try {
      const response = await axios({
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDjCyTRAz29GPkwoBDBYaEDq2oEWJjkzes',
        method: 'post',
        data: {
          contents: [
            {
              parts: [
                {
                  text: Set of 5 multiple-choice questions on ${question}. Each question should include four options, labeled a), b), c), and d). Indicate the correct option with the letters a,b,c,d,
                },
              ],
            },
          ],
        },
      });

      const generatedContent = response.data.candidates[0].content.parts[0].text;
      processGeneratedText(generatedContent);
      console.log(generatedContent);
    } catch (error) {
      setGeneratedText('Error fetching data');
    }
  }

  // Parse the generated text into a structured format
  function processGeneratedText(generatedText) {
    setGeneratedText('Processing your questions...');

    const questionRegex = /\d+\.\s+([^\n]+(?:\n+[\s\S]+?)?)/g;
    const optionsRegex = /[abcd]\)\s+([^\n]+)\n/g;
    const correctAnswerRegex = /Answer:\s?(\\?[abcd]\\?|[abcd]\)|[abcd])/g;
    // const correctAnswerRegex = /Answer:\s?([abcd]) | Answer:\s?\\([abcd])\\/g;
    // const correctAnswerRegex = /Answer:\s([abcd])/g;

    const questions = [...generatedText.matchAll(questionRegex)].map(match => match[1]);
    const allOptions = [...generatedText.matchAll(optionsRegex)].map(match => match[1]);
    const correctAnswers = [...generatedText.matchAll(correctAnswerRegex)].map(match => match[1]);

    const formattedQuestions = questions.map((q, index) => {
      const options = allOptions.slice(index * 4, (index + 1) * 4);
      const correctAnswer = correctAnswers[index];
      const correctAnswerIndex = ['a', 'b', 'c', 'd'].indexOf(correctAnswer);

      return {
        question: q,
        options: options,
        correctAnswer: correctAnswerIndex,
      };
    });

    setQuestionsData(formattedQuestions);
    setGeneratedText('');
  }

  // Handle the user's selection
  const handleAnswerChange = (questionIndex, optionIndex) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: optionIndex });
  };

  // Undo the user's selection
  const handleUndo = (questionIndex) => {
    const updatedAnswers = { ...userAnswers };
    delete updatedAnswers[questionIndex]; // Remove the selected answer
    setUserAnswers(updatedAnswers);
  };

  // Evaluate the user's answers
  const handleSubmit = () => {
    let correctCount = 0;
    questionsData.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  return (
    <div className="app-container">
      <h1 className="title">AI Quiz</h1>
      <input
        className="input-box"
        type="text"
        value={question}
        placeholder="Enter topic for quiz..."
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button className="answer-button" onClick={generateAnswer}>
        Generate Quiz
      </button>

      {questionsData.length > 0 && (
        <div className="quiz-container">
          {questionsData.map((q, questionIndex) => (
            <div key={questionIndex} className="question-block">
              <h3>{q.question}</h3>
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="option">
                  <label>
                    <input
                      type="radio"
                      name={question-${questionIndex}}
                      value={optionIndex}
                      onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                      checked={userAnswers[questionIndex] === optionIndex}
                    />
                    {option}
                  </label>
                </div>
              ))}
              <button className="undo-button" onClick={() => handleUndo(questionIndex)}>
                Undo Answer
              </button>
            </div>
          ))}

          <button className="submit-button" onClick={handleSubmit}>
            Submit Quiz
          </button>

          {score !== null && (
            <div className="score-result">
              <h3>Your Score: {score} / {questionsData.length}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;