// Workflow definitions — each template is a React Flow graph (nodes + edges).
// Node kinds: "input" (prompt/image source), "model" (a kie.ai model step),
// "tool" (upscale/audio/edit), "output" (final render).

export type NodeKind = "input" | "model" | "tool" | "output";

export interface WFNodeData {
  kind: NodeKind;
  label: string;
  sublabel?: string;   // model id or short descriptor
  icon?: string;       // emoji
  gradient?: string;   // tailwind gradient for the node accent
  [key: string]: unknown; // index signature required by React Flow's Node<T>
}

export interface WFNode {
  id: string;
  type: "yasNode";
  position: { x: number; y: number };
  data: WFNodeData;
}

export interface WFEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface Workflow {
  id: string;
  title: string;
  category: string;
  description: string;
  color: string;        // gradient for the template card
  primaryModel: string; // main model id (verified against kie.ai)
  nodes: WFNode[];
  edges: WFEdge[];
}

// Helper to build a left→right pipeline quickly.
const X = (i: number) => 40 + i * 250;
const Y = 120;

export const WORKFLOWS: Workflow[] = [
  {
    id: "cinematic-hero",
    title: "Cinematic Hero",
    category: "Commercial",
    description: "30s cinematic commercial, ARRI Alexa look, graded and upscaled to 4K.",
    color: "from-amber-600 to-orange-700",
    primaryModel: "bytedance/seedance-2-5",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: Y }, data: { kind: "input", label: "Prompt", sublabel: "Cinematic brief", icon: "📝", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(1), y: Y }, data: { kind: "model", label: "Seedance 2.5", sublabel: "bytedance/seedance-2-5", icon: "🎬", gradient: "from-orange-500 to-pink-600" } },
      { id: "n3", type: "yasNode", position: { x: X(2), y: Y }, data: { kind: "tool", label: "Topaz Upscale", sublabel: "topaz/video-upscale", icon: "🔍", gradient: "from-teal-500 to-cyan-600" } },
      { id: "n4", type: "yasNode", position: { x: X(3), y: Y }, data: { kind: "output", label: "Output", sublabel: "4K · 16:9 · 30s", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ],
  },
  {
    id: "product-showcase",
    title: "Product Showcase",
    category: "E-Commerce",
    description: "Fast 360° product reveal on clean studio backdrop.",
    color: "from-violet-600 to-purple-700",
    primaryModel: "bytedance/seedance-2-fast",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: Y }, data: { kind: "input", label: "Product Image", sublabel: "Upload", icon: "🖼️", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(1), y: Y }, data: { kind: "model", label: "Seedance 2.0 Fast", sublabel: "bytedance/seedance-2-fast", icon: "⚡", gradient: "from-amber-400 to-orange-500" } },
      { id: "n3", type: "yasNode", position: { x: X(2), y: Y }, data: { kind: "output", label: "Output", sublabel: "1080p · 1:1 · 10s", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ],
  },
  {
    id: "talking-head",
    title: "AI Avatar / Talking Head",
    category: "Avatar",
    description: "Turn a photo + voice into a lip-synced talking avatar.",
    color: "from-cyan-600 to-blue-700",
    primaryModel: "kling/ai-avatar-pro",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: 60 }, data: { kind: "input", label: "Portrait", sublabel: "Photo upload", icon: "🧑", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(0), y: 200 }, data: { kind: "input", label: "Voice / Audio", sublabel: "Audio upload", icon: "🎤", gradient: "from-slate-500 to-gray-600" } },
      { id: "n3", type: "yasNode", position: { x: X(1), y: 120 }, data: { kind: "model", label: "Kling Avatar Pro", sublabel: "kling/ai-avatar-pro", icon: "👥", gradient: "from-cyan-500 to-indigo-600" } },
      { id: "n4", type: "yasNode", position: { x: X(2), y: 120 }, data: { kind: "output", label: "Output", sublabel: "1080p · 9:16", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-3", source: "n1", target: "n3", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ],
  },
  {
    id: "social-reel",
    title: "Social Media Reel",
    category: "Social",
    description: "Vertical 9:16 short optimized for TikTok / Reels.",
    color: "from-pink-600 to-rose-700",
    primaryModel: "kling-3.0/video",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: Y }, data: { kind: "input", label: "Prompt", sublabel: "Trend brief", icon: "📝", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(1), y: Y }, data: { kind: "model", label: "Kling 3.0", sublabel: "kling-3.0/video", icon: "🎭", gradient: "from-blue-500 to-violet-600" } },
      { id: "n3", type: "yasNode", position: { x: X(2), y: Y }, data: { kind: "output", label: "Output", sublabel: "1080p · 9:16 · 15s", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ],
  },
  {
    id: "multi-shot",
    title: "Multi-Shot Storyboard",
    category: "Film",
    description: "3-6 camera cuts in one clip with consistent character (Kling 3.0 Omni).",
    color: "from-emerald-600 to-teal-700",
    primaryModel: "kling-3.0/video",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: 60 }, data: { kind: "input", label: "Character Ref", sublabel: "Element image", icon: "🎯", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(0), y: 200 }, data: { kind: "input", label: "Shot List", sublabel: "Multi-prompt", icon: "📝", gradient: "from-slate-500 to-gray-600" } },
      { id: "n3", type: "yasNode", position: { x: X(1), y: 120 }, data: { kind: "model", label: "Kling 3.0", sublabel: "kling-3.0/video", icon: "👑", gradient: "from-indigo-500 to-purple-600" } },
      { id: "n4", type: "yasNode", position: { x: X(2), y: 120 }, data: { kind: "output", label: "Output", sublabel: "1080p · 16:9 · 15s", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-3", source: "n1", target: "n3", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ],
  },
  {
    id: "anime-style",
    title: "Anime / Stylized",
    category: "Creative",
    description: "Vivid animated style with dynamic camera (Wan 2.7).",
    color: "from-indigo-600 to-blue-700",
    primaryModel: "wan/2-7-text-to-video",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: Y }, data: { kind: "input", label: "Prompt", sublabel: "Anime brief", icon: "📝", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(1), y: Y }, data: { kind: "model", label: "Wan 2.7", sublabel: "wan/2-7-text-to-video", icon: "🐉", gradient: "from-yellow-500 to-amber-600" } },
      { id: "n3", type: "yasNode", position: { x: X(2), y: Y }, data: { kind: "output", label: "Output", sublabel: "720p · 16:9 · 10s", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ],
  },
  {
    id: "veo-dialogue",
    title: "Dialogue Scene",
    category: "Film",
    description: "Single-speaker synced dialogue with native audio (Veo 3.1).",
    color: "from-red-600 to-rose-700",
    primaryModel: "veo3_quality",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: Y }, data: { kind: "input", label: "Script", sublabel: "Dialogue text", icon: "📝", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(1), y: Y }, data: { kind: "model", label: "Veo 3.1 Quality", sublabel: "veo3_quality", icon: "🏆", gradient: "from-green-500 to-teal-600" } },
      { id: "n3", type: "yasNode", position: { x: X(2), y: Y }, data: { kind: "output", label: "Output", sublabel: "Native audio · 16:9", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ],
  },
  {
    id: "image-animate",
    title: "Bring Image to Life",
    category: "Animation",
    description: "Upload an image and animate it with natural motion.",
    color: "from-sky-600 to-cyan-700",
    primaryModel: "bytedance/seedance-2-fast",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: Y }, data: { kind: "input", label: "Image", sublabel: "Upload", icon: "🖼️", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(1), y: Y }, data: { kind: "model", label: "Seedance 2.0 Fast", sublabel: "bytedance/seedance-2-fast", icon: "⚡", gradient: "from-amber-400 to-orange-500" } },
      { id: "n3", type: "yasNode", position: { x: X(2), y: Y }, data: { kind: "output", label: "Output", sublabel: "720p · 16:9 · 5s", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ],
  },
  {
    id: "music-video",
    title: "AI Music + Video",
    category: "Music",
    description: "Generate a track with Suno, then a matching visual with Seedance 2.5.",
    color: "from-fuchsia-600 to-purple-700",
    primaryModel: "bytedance/seedance-2-5",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: Y }, data: { kind: "input", label: "Music Prompt", sublabel: "Style + mood", icon: "📝", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(1), y: Y }, data: { kind: "tool", label: "Suno Music", sublabel: "suno (audio)", icon: "🎵", gradient: "from-violet-500 to-fuchsia-600" } },
      { id: "n3", type: "yasNode", position: { x: X(2), y: Y }, data: { kind: "model", label: "Seedance 2.5", sublabel: "bytedance/seedance-2-5", icon: "🎬", gradient: "from-orange-500 to-pink-600" } },
      { id: "n4", type: "yasNode", position: { x: X(3), y: Y }, data: { kind: "output", label: "Output", sublabel: "1080p · 16:9 · 30s", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ],
  },
  {
    id: "real-estate",
    title: "Real Estate Tour",
    category: "Business",
    description: "Smooth interior walkthrough from a single photo.",
    color: "from-stone-600 to-zinc-700",
    primaryModel: "bytedance/seedance-2",
    nodes: [
      { id: "n1", type: "yasNode", position: { x: X(0), y: Y }, data: { kind: "input", label: "Interior Photo", sublabel: "Upload", icon: "🏠", gradient: "from-slate-500 to-gray-600" } },
      { id: "n2", type: "yasNode", position: { x: X(1), y: Y }, data: { kind: "model", label: "Seedance 2.0", sublabel: "bytedance/seedance-2", icon: "🎥", gradient: "from-orange-400 to-rose-500" } },
      { id: "n3", type: "yasNode", position: { x: X(2), y: Y }, data: { kind: "output", label: "Output", sublabel: "1080p · 16:9 · 15s", icon: "🎞️", gradient: "from-emerald-500 to-green-600" } },
    ],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ],
  },
];
