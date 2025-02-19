import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Download, RefreshCcw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RoadmapView } from './RoadmapView';
import { Node, Edge, MarkerType } from 'react-flow-renderer';
import { toPng } from 'html-to-image';

const genAI = new GoogleGenerativeAI('AIzaSyBEVDPfeVUIiQiOGxK1X6whjiQSZJwSbFY');

const DEFAULT_MILESTONES = [
  {
    id: 'basics',
    title: 'Fundamentals',
    description: 'Core concepts and basics',
    duration: '2-3 weeks',
    prerequisites: []
  },
  {
    id: 'intermediate',
    title: 'Intermediate Concepts',
    description: 'Building on the basics',
    duration: '3-4 weeks',
    prerequisites: ['basics']
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    description: 'Advanced concepts and best practices',
    duration: '4-6 weeks',
    prerequisites: ['intermediate']
  }
];

export const Results = () => {
  const { selectedTopic, skillLevel, questions, userAnswers, learningPath, setLearningPath, reset } = useStore();
  const [roadmapElements, setRoadmapElements] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [error, setError] = useState<string | null>(null);

  const score = userAnswers.reduce((acc, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    return acc + (question?.correctAnswer === answer.answer ? 1 : 0);
  }, 0);

  const percentage = (score / questions.length) * 100;

  const createRoadmapElements = (milestones: any[]) => {
    const nodes: Node[] = milestones.map((milestone, index) => ({
      id: milestone.id,
      type: 'default',
      position: { x: 250 * (index % 3), y: 150 * Math.floor(index / 3) },
      data: {
        label: (
          <div className="p-3 text-center">
            <div className="font-semibold">{milestone.title}</div>
            <div className="text-xs text-gray-500">{milestone.duration}</div>
          </div>
        )
      },
      style: {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '180px',
      },
    }));

    const edges: Edge[] = milestones.flatMap(milestone => 
      milestone.prerequisites.map(prereq => ({
        id: `${prereq}-${milestone.id}`,
        source: prereq,
        target: milestone.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#64748b' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#64748b',
        },
      }))
    );

    return { nodes, edges };
  };

  useEffect(() => {
    const generateLearningPath = async () => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Create a learning path for ${selectedTopic?.name} at ${skillLevel} level. The user scored ${percentage}% on the assessment. Return a JSON array of exactly 5-7 learning milestones. Each milestone should have these exact properties:
        {
          "id": "unique-string",
          "title": "short title",
          "description": "brief description",
          "duration": "estimated time",
          "prerequisites": ["array-of-previous-milestone-ids"]
        }
        Ensure the JSON is valid and properly formatted.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('Invalid response format');
        }
        
        const milestones = JSON.parse(jsonMatch[0]);
        const elements = createRoadmapElements(milestones);
        
        setRoadmapElements(elements);
        setLearningPath(JSON.stringify(milestones, null, 2));
        setError(null);
      } catch (error) {
        console.error('Error generating learning path:', error);
        // Fallback to default milestones
        const elements = createRoadmapElements(DEFAULT_MILESTONES);
        setRoadmapElements(elements);
        setLearningPath(JSON.stringify(DEFAULT_MILESTONES, null, 2));
        setError('Could not generate custom learning path. Showing default roadmap.');
      }
    };

    if (!learningPath) {
      generateLearningPath();
    }
  }, [selectedTopic, skillLevel, percentage]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Learning Journey</h1>
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 mb-4">
            <span className="text-3xl font-bold text-blue-600">{percentage}%</span>
          </div>
          <p className="text-gray-600">
            You answered {score} out of {questions.length} questions correctly
          </p>
          {error && (
            <p className="mt-2 text-amber-600 text-sm">{error}</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Personalized Roadmap</h2>
          {roadmapElements.nodes.length > 0 ? (
            <RoadmapView nodes={roadmapElements.nodes} edges={roadmapElements.edges} />
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your personalized learning path...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              const element = document.querySelector('.react-flow') as HTMLElement;
              if (element) {
                toPng(element, {
                  backgroundColor: '#fff',
                  width: element.offsetWidth * 2,
                  height: element.offsetHeight * 2,
                  style: {
                    transform: 'scale(2)',
                    transformOrigin: 'top left',
                  },
                }).then((dataUrl) => {
                  const link = document.createElement('a');
                  link.download = 'roadmap.png';
                  link.href = dataUrl;
                  link.click();
                });
              }
            }}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Roadmap
          </button>
          <button
            onClick={reset}
            className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};