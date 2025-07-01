"use client";

import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  addEdge, 
  Connection, 
  useNodesState, 
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Position,
  Handle,
  NodeProps,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Türkçe Akış Adımı Tipleri
interface FlowStep {
  id: string;
  text: string;
  type: 'start' | 'end' | 'io' | 'process' | 'decision' | 'branch-label' | 'comment' | 'parallel' | 'loop';
  indentLevel: number;
}

// React Flow Node Tipleri
interface CustomNodeData {
  label: string;
  stepType: FlowStep['type'];
}

// Özel Node Bileşenleri
const StartNode = ({ data }: NodeProps<CustomNodeData>) => (
  <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-6 py-3 rounded-full shadow-lg border-2 border-emerald-600 min-w-[120px] text-center font-semibold">
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    🚀 {data.label}
  </div>
);

const EndNode = ({ data }: NodeProps<CustomNodeData>) => (
  <div className="bg-gradient-to-r from-red-400 to-rose-500 text-white px-6 py-3 rounded-full shadow-lg border-2 border-red-600 min-w-[120px] text-center font-semibold">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    🏁 {data.label}
  </div>
);

const ProcessNode = ({ data }: NodeProps<CustomNodeData>) => (
  <div className="bg-gradient-to-r from-violet-100 to-purple-200 text-violet-800 px-6 py-4 rounded-lg shadow-lg border-2 border-violet-500 min-w-[180px] text-center font-medium">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <div className="flex items-center justify-center gap-2">
      ⚙️ <span>{data.label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

const DecisionNode = ({ data }: NodeProps<CustomNodeData>) => (
  <div className="bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 p-4 rounded-lg shadow-lg border-2 border-amber-500 min-w-[160px] min-h-[120px] flex items-center justify-center font-medium transform rotate-45 relative">
    <Handle type="target" position={Position.Top} className="w-3 h-3" style={{ top: '10px' }} />
    <div className="transform -rotate-45 text-center text-sm">
      <div className="mb-1">🤔</div>
      <div>{data.label}</div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3" style={{ right: '10px' }} />
    <Handle type="source" position={Position.Left} className="w-3 h-3" style={{ left: '10px' }} />
  </div>
);

const IONode = ({ data }: NodeProps<CustomNodeData>) => (
  <div className="bg-gradient-to-r from-sky-100 to-blue-200 text-sky-800 px-6 py-4 shadow-lg border-2 border-sky-500 min-w-[180px] text-center font-medium transform -skew-x-12">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <div className="transform skew-x-12 flex items-center justify-center gap-2">
      📋 <span>{data.label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

const ParallelNode = ({ data }: NodeProps<CustomNodeData>) => (
  <div className="bg-gradient-to-r from-cyan-100 to-teal-200 text-cyan-800 px-6 py-4 rounded-lg shadow-lg border-2 border-cyan-500 border-dashed min-w-[180px] text-center font-medium">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <div className="flex items-center justify-center gap-2">
      🔀 <span>{data.label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

const LoopNode = ({ data }: NodeProps<CustomNodeData>) => (
  <div className="bg-gradient-to-r from-indigo-100 to-purple-200 text-indigo-800 px-6 py-4 rounded-lg shadow-lg border-2 border-indigo-500 border-dotted min-w-[180px] text-center font-medium">
    <Handle type="target" position={Position.Top} className="w-3 h-3" />
    <div className="flex items-center justify-center gap-2">
      🔄 <span>{data.label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

const CommentNode = ({ data }: NodeProps<CustomNodeData>) => (
  <div className="bg-gradient-to-r from-slate-50 to-gray-100 text-slate-700 px-4 py-3 rounded-lg shadow-md border-2 border-slate-300 border-dashed max-w-[200px] text-center text-sm italic">
    💭 {data.label}
  </div>
);

// Node tipleri
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  decision: DecisionNode,
  io: IONode,
  parallel: ParallelNode,
  loop: LoopNode,
  comment: CommentNode,
};

interface ReactFlowDiagramProps {
  steps: FlowStep[];
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

// Steps'i React Flow nodes ve edges'e dönüştürme
const convertStepsToFlow = (steps: FlowStep[]): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  let yPosition = 50;
  const xCenter = 400;
  const verticalSpacing = 120;
  const horizontalSpacing = 250;

  steps.forEach((step, index) => {
    if (step.type === 'branch-label' || step.text.trim() === '') return;

    const xPosition = xCenter + (step.indentLevel * horizontalSpacing);
    
    // Node oluştur
    const node: Node = {
      id: step.id,
      type: step.type === 'start' || step.type === 'end' || step.type === 'process' || 
            step.type === 'decision' || step.type === 'io' || step.type === 'parallel' || 
            step.type === 'loop' || step.type === 'comment' ? step.type : 'process',
      position: { x: xPosition, y: yPosition },
      data: { 
        label: step.text,
        stepType: step.type,
      },
    };

    nodes.push(node);

    // Önceki node ile bağlantı
    if (index > 0) {
      const prevStepIndex = index - 1;
      const prevNode = nodes.find(n => n.id === `step-${prevStepIndex}`);
      if (prevNode) {
        edges.push({
          id: `edge-${index}`,
          source: prevNode.id,
          target: step.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 },
        });
      }
    }

    yPosition += verticalSpacing;
  });

  return { nodes, edges };
};

export function ReactFlowDiagram({ steps, isFullscreen = false, onToggleFullscreen }: ReactFlowDiagramProps) {
  const { toast } = useToast();
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => 
    convertStepsToFlow(steps), [steps]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const exportDiagram = useCallback(() => {
    toast({
      title: "Export Hazırlanıyor",
      description: "Diyagram export özelliği geliştiriliyor...",
      duration: 3000,
    });
  }, [toast]);

  const resetView = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    toast({
      title: "Diyagram Sıfırlandı",
      description: "Diyagram orijinal haline döndürüldü.",
      duration: 2000,
    });
  }, [initialNodes, initialEdges, setNodes, setEdges, toast]);

  if (steps.length === 0) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">React Flow Diyagramı</h3>
          <p>Diyagram adımları yüklendiğinde burası interaktif görselleştirme olacak</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "w-full shadow-xl border-2",
      isFullscreen && "fixed inset-4 z-50 bg-background"
    )}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-100">
              <div className="text-2xl">🌐</div>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-blue-900">
                React Flow İnteraktif Diyagram
              </CardTitle>
              <CardDescription>
                Sürüklenebilir, zoom yapılabilir, interaktif akış diyagramı
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-700">
              {nodes.length} düğüm
            </Badge>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Sıfırla
            </Button>
            <Button variant="outline" size="sm" onClick={exportDiagram}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            {onToggleFullscreen && (
              <Button variant="outline" size="sm" onClick={onToggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className={cn(
          "relative",
          isFullscreen ? "h-[calc(100vh-200px)]" : "h-[700px]"
        )}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            className="bg-gradient-to-br from-slate-50 to-blue-50"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
            <Controls 
              className="bg-white shadow-lg rounded-lg border border-gray-200"
              showInteractive={false}
            />
            <Panel position="top-right" className="bg-white/90 rounded-lg p-2 shadow-lg">
              <div className="text-xs text-gray-600">
                💡 Düğümleri sürükleyebilir, zoom yapabilirsiniz
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}

// Metin parse fonksiyonu
export const parseFlowDescriptionToSteps = (description: string): FlowStep[] => {
  if (!description) return [];
  const lines = description.split('\n');
  const steps: FlowStep[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    let text = trimmedLine;
    let type: FlowStep['type'] = 'process';
    let indentLevel = 0;

    const leadingSpaces = line.match(/^(\s*)/)?.[0].length || 0;

    // Tip belirleme
    const normalizedText = text.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').toUpperCase();

    if (normalizedText.startsWith('BAŞLANGIÇ')) {
      type = 'start';
      text = 'BAŞLANGIÇ';
    } else if (normalizedText.startsWith('BİTİŞ')) {
      type = 'end';
      text = 'BİTİŞ';
    } else if (normalizedText.startsWith('GİRİŞ:')) {
      type = 'io';
      text = text.replace(/^\d+\.\s*/, '').replace(/^GİRİŞ:\s*/i, '');
    } else if (normalizedText.startsWith('ÇIKIŞ:')) {
      type = 'io';
      text = text.replace(/^\d+\.\s*/, '').replace(/^ÇIKIŞ:\s*/i, '');
    } else if (normalizedText.startsWith('İŞLEM:')) {
      type = 'process';
      text = text.replace(/^\d+\.\s*/, '').replace(/^İŞLEM:\s*/i, '');
    } else if (normalizedText.startsWith('KARAR:')) {
      type = 'decision';
      text = text.replace(/^\d+\.\s*/, '').replace(/^KARAR:\s*/i, '');
    } else if (normalizedText.includes('PARALEL')) {
      type = 'parallel';
      text = text.replace(/^\d+\.\s*/, '').replace(/^.*?PARALEL:\s*/i, '');
    } else if (normalizedText.includes('DÖNGÜ')) {
      type = 'loop';
      text = text.replace(/^\d+\.\s*/, '').replace(/^.*?DÖNGÜ:\s*/i, '');
    } else if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
      type = 'comment';
      text = trimmedLine.substring(1, trimmedLine.length - 1);
    } else {
      text = text.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
    }

    // Girinti seviyesi
    if (leadingSpaces >= 6) indentLevel = 2;
    else if (leadingSpaces >= 2) indentLevel = 1;
    else indentLevel = 0;

    steps.push({ 
      id: `step-${index}`, 
      text: text.trim(), 
      type, 
      indentLevel 
    });
  });

  return steps.filter(step => step.text.length > 0);
};
