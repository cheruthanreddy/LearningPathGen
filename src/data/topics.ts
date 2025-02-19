import { Topic } from '../types';
import { Code2, Terminal, Cpu, Braces, Brain, Database, Globe, Layout, Server, Palette } from 'lucide-react';

export const topics: Topic[] = [
  {
    id: 'java',
    name: 'Java',
    icon: 'Code2',
    description: 'Object-oriented programming with Java'
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'Terminal',
    description: 'Python programming fundamentals'
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: 'Cpu',
    description: 'Systems programming with C++'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'Braces',
    description: 'Modern JavaScript development'
  },
  {
    id: 'react',
    name: 'React',
    icon: 'Code2',
    description: 'Frontend development with React'
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    icon: 'Brain',
    description: 'AI and machine learning concepts'
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: 'Database',
    description: 'Data analysis and visualization'
  },
  {
    id: 'web-development',
    name: 'Web Development',
    icon: 'Globe',
    description: 'Full-stack web development'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: 'Server',
    description: 'Backend development with Node.js'
  },
  {
    id: 'uiux',
    name: 'UI/UX Design',
    icon: 'Palette',
    description: 'User interface and experience design'
  }
];