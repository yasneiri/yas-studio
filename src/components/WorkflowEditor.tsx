"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
  Handle, Position, MarkerType,
  type Node, type Edge, type Connection, type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { WORKFLOWS, type Workflow, type WFNodeData } from "@/lib/workflows";
import { Play, Plus, Trash2, LayoutTemplate } from "lucide-react";

/* ── Custom node ─────────────────────────────────────────────── */
function YasNode({ data, selected }: NodeProps) {
  const d = data as WFNodeData;
  const isInput = d.kind === "input";
  const isOutput = d.kind === "output";
  return (
    <div
      className={`relative w-[180px] rounded-2xl border transition-all ${
        selected ? "border-accent shadow-[0_0_24px_rgba(139,92,246,0.35)]" : "border-white/10"
      }`}
      style={{ background: "rgba(20,20,24,0.92)", backdropFilter: "blur(12px)" }}
    >
      {!isInput && (
        <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-accent !border-2 !border-bg" />
      )}
      <div className="p-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${d.gradient || "from-slate-500 to-gray-600"} flex items-center justify-center text-lg shadow-lg`}>
            {d.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-gray-100 truncate">{d.label}</p>
            {d.sublabel && <p className="text-[9px] text-gray-500 truncate font-mono">{d.sublabel}</p>}
          </div>
        </div>
      </div>
      <div className={`absolute -top-2 left-3 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
        isInput ? "bg-slate-600 text-slate-200"
        : isOutput ? "bg-emerald-600 text-emerald-50"
        : d.kind === "tool" ? "bg-cyan-600 text-cyan-50"
        : "bg-accent text-white"
      }`}>
        {d.kind}
      </div>
      {!isOutput && (
        <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-accent !border-2 !border-bg" />
      )}
    </div>
  );
}

const nodeTypes = { yasNode: YasNode };

interface WorkflowEditorProps {
  onRun?: (wf: { primaryModel: string; title: string }) => void;
  initialWorkflowId?: string;
}

export default function WorkflowEditor({ onRun, initialWorkflowId }: WorkflowEditorProps) {
  const [active, setActive] = useState<Workflow>(
    WORKFLOWS.find(w => w.id === initialWorkflowId) || WORKFLOWS[0]
  );
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(active.nodes as unknown as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(active.edges as unknown as Edge[]);

  // Load a template into the canvas
  const loadWorkflow = useCallback((wf: Workflow) => {
    setActive(wf);
    setNodes(wf.nodes as unknown as Node[]);
    setEdges(wf.edges as unknown as Edge[]);
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (initialWorkflowId) {
      const wf = WORKFLOWS.find(w => w.id === initialWorkflowId);
      if (wf) loadWorkflow(wf);
    }
  }, [initialWorkflowId, loadWorkflow]);

  const onConnect = useCallback(
    (c: Connection) => setEdges(eds => addEdge({ ...c, animated: true }, eds)),
    [setEdges]
  );

  const defaultEdgeOptions = useMemo(() => ({
    animated: true,
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
  }), []);

  // Add a blank model node
  const addNode = useCallback(() => {
    const id = `n${Date.now()}`;
    setNodes(nds => [...nds, {
      id, type: "yasNode",
      position: { x: 120 + Math.random() * 200, y: 300 + Math.random() * 80 },
      data: { kind: "model", label: "New Model", sublabel: "pick a model", icon: "✨", gradient: "from-violet-500 to-purple-600" },
    } as unknown as Node]);
  }, [setNodes]);

  const clearCanvas = useCallback(() => { setNodes([]); setEdges([]); }, [setNodes, setEdges]);

  return (
    <div className="flex gap-3 h-[calc(100vh-3.5rem)]">
      {/* Template rail */}
      <aside className="w-60 flex-shrink-0 glass-panel rounded-2xl p-3 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3 px-1">
          <LayoutTemplate className="w-4 h-4 text-accent" />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Templates</span>
        </div>
        <div className="space-y-1.5">
          {WORKFLOWS.map(wf => (
            <button
              key={wf.id}
              onClick={() => loadWorkflow(wf)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                active.id === wf.id ? "border-accent/50 bg-accent/10" : "border-transparent hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${wf.color}`} />
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-gray-100 truncate">{wf.title}</p>
                  <p className="text-[9px] text-gray-500">{wf.category} · {wf.nodes.length} nodes</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Canvas */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/8">
        {/* Toolbar */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="glass-panel rounded-xl px-3 py-2">
            <p className="text-[13px] font-semibold text-gray-100">{active.title}</p>
            <p className="text-[10px] text-gray-500">{active.description}</p>
          </div>
        </div>
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <button onClick={addNode} className="glass-panel rounded-xl px-3 py-2 flex items-center gap-1.5 text-[12px] text-gray-200 hover:text-white transition">
            <Plus className="w-3.5 h-3.5" /> Node
          </button>
          <button onClick={clearCanvas} className="glass-panel rounded-xl px-3 py-2 flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-red-300 transition">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
          <button
            onClick={() => onRun?.({ primaryModel: active.primaryModel, title: active.title })}
            className="rounded-xl px-4 py-2 flex items-center gap-1.5 text-[12px] font-semibold text-white bg-gradient-to-r from-accent to-sky hover:opacity-90 transition shadow-lg shadow-accent/20"
          >
            <Play className="w-3.5 h-3.5" /> Run pipeline
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          className="bg-transparent"
        >
          <Background color="#2a2a2e" gap={20} size={1} />
          <Controls className="!bg-bg-card !border-bg-border [&>button]:!bg-bg-card [&>button]:!border-bg-border [&>button]:!text-gray-400" />
          <MiniMap
            nodeColor={() => "#8b5cf6"}
            maskColor="rgba(0,0,0,0.6)"
            className="!bg-bg-card !border !border-bg-border !rounded-xl"
            pannable zoomable
          />
        </ReactFlow>
      </div>
    </div>
  );
}
