import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  ConnectionMode,
  MarkerType,
} from 'react-flow-renderer';
import { toPng } from 'html-to-image';

interface RoadmapViewProps {
  nodes: Node[];
  edges: Edge[];
}

export const RoadmapView = ({ nodes, edges }: RoadmapViewProps) => {
  const downloadImage = useCallback(() => {
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
        link.download = 'learning-roadmap.png';
        link.href = dataUrl;
        link.click();
      });
    }
  }, []);

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-lg p-4">
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          connectionMode={ConnectionMode.Straight}
          fitView
          attributionPosition="bottom-right"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <button
        onClick={downloadImage}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Download Roadmap
      </button>
    </div>
  );
};