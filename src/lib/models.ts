// GStudio — Complete kie.ai models catalog
// ═══════════════════════════════════════════════════════════════

export interface Model {
  id: string;
  name: string;
  provider: string;
  type: "t2v" | "i2v" | "v2v" | "t2i" | "i2i" | "upscale" | "avatar" | "lipsync" | "music" | "tts" | "edit" | "extend" | "ref2v";
  tag?: string; // "new" | "popular" | "fast" | "pro" | "4k"
}

// ── VIDEO MODELS ────────────────────────────────────────────────
export const VIDEO_MODELS: Model[] = [
  // Seedance (ByteDance)
  { id: "bytedance/seedance-2-5", name: "Seedance 2.5", provider: "ByteDance", type: "t2v", tag: "new" },
  { id: "bytedance/seedance-2", name: "Seedance 2.0", provider: "ByteDance", type: "t2v", tag: "popular" },
  { id: "bytedance/seedance-2-fast", name: "Seedance 2.0 Fast", provider: "ByteDance", type: "t2v", tag: "fast" },
  { id: "bytedance/seedance-2-mini", name: "Seedance 2.0 Mini", provider: "ByteDance", type: "t2v" },
  { id: "bytedance/seedance-1.5-pro", name: "Seedance 1.5 Pro", provider: "ByteDance", type: "t2v" },
  // Kling 3.0
  { id: "kling-3.0/video", name: "Kling 3.0", provider: "Kuaishou", type: "t2v", tag: "popular" },
  { id: "kling/v3-turbo-text-to-video", name: "Kling 3.0 Turbo T2V", provider: "Kuaishou", type: "t2v", tag: "fast" },
  { id: "kling/v3-turbo-image-to-video", name: "Kling 3.0 Turbo I2V", provider: "Kuaishou", type: "i2v", tag: "fast" },
  { id: "kling-3.0/omni-text-to-video", name: "Kling 3.0 Omni T2V", provider: "Kuaishou", type: "t2v", tag: "pro" },
  { id: "kling-3.0/omni-image-to-video", name: "Kling 3.0 Omni I2V", provider: "Kuaishou", type: "i2v", tag: "pro" },
  { id: "kling-3.0/omni-reference-to-video", name: "Kling 3.0 Omni Ref2V", provider: "Kuaishou", type: "ref2v", tag: "pro" },
  { id: "kling-3.0/omni-transformation", name: "Kling 3.0 Omni Transform", provider: "Kuaishou", type: "v2v" },
  { id: "kling-3.0/motion-control", name: "Kling 3.0 Motion Control", provider: "Kuaishou", type: "i2v" },
  // Kling 2.x
  { id: "kling-2.6/text-to-video", name: "Kling 2.6 T2V", provider: "Kuaishou", type: "t2v" },
  { id: "kling-2.6/image-to-video", name: "Kling 2.6 I2V", provider: "Kuaishou", type: "i2v" },
  { id: "kling-2.6/motion-control", name: "Kling 2.6 Motion Control", provider: "Kuaishou", type: "i2v" },
  { id: "kling/v25-turbo-text-to-video-pro", name: "Kling 2.5 Turbo T2V", provider: "Kuaishou", type: "t2v" },
  { id: "kling/v25-turbo-image-to-video-pro", name: "Kling 2.5 Turbo I2V", provider: "Kuaishou", type: "i2v" },
  { id: "kling/v2-1-master-text-to-video", name: "Kling 2.1 Master T2V", provider: "Kuaishou", type: "t2v", tag: "pro" },
  { id: "kling/v2-1-master-image-to-video", name: "Kling 2.1 Master I2V", provider: "Kuaishou", type: "i2v", tag: "pro" },
  { id: "kling/v2-1-pro", name: "Kling 2.1 Pro", provider: "Kuaishou", type: "t2v" },
  { id: "kling/v2-1-standard", name: "Kling 2.1 Standard", provider: "Kuaishou", type: "t2v" },
  // Kling Avatar
  { id: "kling/ai-avatar-standard", name: "Kling Avatar Standard", provider: "Kuaishou", type: "avatar" },
  { id: "kling/ai-avatar-pro", name: "Kling Avatar Pro", provider: "Kuaishou", type: "avatar", tag: "pro" },
  // Grok Imagine Video
  { id: "grok-imagine/text-to-video", name: "Grok Imagine T2V", provider: "xAI", type: "t2v" },
  { id: "grok-imagine/image-to-video", name: "Grok Imagine I2V", provider: "xAI", type: "i2v" },
  { id: "grok-imagine/1-5-preview", name: "Grok Imagine 1.5 Preview", provider: "xAI", type: "t2v", tag: "new" },
  { id: "grok-imagine/upscale", name: "Grok Imagine Upscale", provider: "xAI", type: "upscale" },
  { id: "grok-imagine/extend", name: "Grok Imagine Extend", provider: "xAI", type: "extend" },
  // Hailuo
  { id: "hailuo/2-3-image-to-video-pro", name: "Hailuo 2.3 Pro I2V", provider: "MiniMax", type: "i2v", tag: "new" },
  { id: "hailuo/2-3-image-to-video-standard", name: "Hailuo 2.3 Std I2V", provider: "MiniMax", type: "i2v" },
  { id: "hailuo/02-text-to-video-pro", name: "Hailuo Pro T2V", provider: "MiniMax", type: "t2v" },
  { id: "hailuo/02-image-to-video-pro", name: "Hailuo Pro I2V", provider: "MiniMax", type: "i2v" },
  { id: "hailuo/02-text-to-video-standard", name: "Hailuo Std T2V", provider: "MiniMax", type: "t2v" },
  { id: "hailuo/02-image-to-video-standard", name: "Hailuo Std I2V", provider: "MiniMax", type: "i2v" },
  // Wan
  { id: "wan/2-7-text-to-video", name: "Wan 2.7 T2V", provider: "Alibaba", type: "t2v", tag: "new" },
  { id: "wan/2-7-image-to-video", name: "Wan 2.7 I2V", provider: "Alibaba", type: "i2v", tag: "new" },
  { id: "wan/2-7-videoedit", name: "Wan 2.7 Video Edit", provider: "Alibaba", type: "edit" },
  { id: "wan/2-7-r2v", name: "Wan 2.7 Ref2V", provider: "Alibaba", type: "ref2v" },
  { id: "wan/2-6-text-to-video", name: "Wan 2.6 T2V", provider: "Alibaba", type: "t2v" },
  { id: "wan/2-6-image-to-video", name: "Wan 2.6 I2V", provider: "Alibaba", type: "i2v" },
  { id: "wan/2-6-video-to-video", name: "Wan 2.6 V2V", provider: "Alibaba", type: "v2v" },
  { id: "wan/2-6-flash-image-to-video", name: "Wan 2.6 Flash I2V", provider: "Alibaba", type: "i2v", tag: "fast" },
  { id: "wan/2-5-text-to-video", name: "Wan 2.5 T2V", provider: "Alibaba", type: "t2v" },
  { id: "wan/2-5-image-to-video", name: "Wan 2.5 I2V", provider: "Alibaba", type: "i2v" },
  { id: "wan/2-2-a14b-text-to-video-turbo", name: "Wan 2.2 T2V Turbo", provider: "Alibaba", type: "t2v", tag: "fast" },
  { id: "wan/2-2-a14b-image-to-video-turbo", name: "Wan 2.2 I2V Turbo", provider: "Alibaba", type: "i2v", tag: "fast" },
  { id: "wan/2-2-animate-move", name: "Wan Animate Move", provider: "Alibaba", type: "i2v" },
  { id: "wan/2-2-animate-replace", name: "Wan Animate Replace", provider: "Alibaba", type: "v2v" },
  // PixVerse
  { id: "pixverse/text-to-video", name: "PixVerse V6 T2V", provider: "PixVerse", type: "t2v" },
  { id: "pixverse/image-to-video", name: "PixVerse V6 I2V", provider: "PixVerse", type: "i2v" },
  { id: "pixverse/transition", name: "PixVerse V6 Transition", provider: "PixVerse", type: "i2v" },
  { id: "pixverse/extend", name: "PixVerse V6 Extend", provider: "PixVerse", type: "extend" },
  { id: "pixverse/reference-to-video", name: "PixVerse V6 Ref2V", provider: "PixVerse", type: "ref2v" },
  // MiniMax H3
  { id: "minimax-h3/text-to-video", name: "MiniMax H3 T2V", provider: "MiniMax", type: "t2v", tag: "new" },
  { id: "minimax-h3/image-to-video", name: "MiniMax H3 I2V", provider: "MiniMax", type: "i2v" },
  { id: "minimax-h3/reference-to-video", name: "MiniMax H3 Ref2V", provider: "MiniMax", type: "ref2v" },
  // HappyHorse
  { id: "happyhorse/text-to-video", name: "HappyHorse T2V", provider: "HappyHorse", type: "t2v" },
  { id: "happyhorse/image-to-video", name: "HappyHorse I2V", provider: "HappyHorse", type: "i2v" },
  { id: "happyhorse/reference-to-video", name: "HappyHorse Ref2V", provider: "HappyHorse", type: "ref2v" },
  { id: "happyhorse/video-edit", name: "HappyHorse Video Edit", provider: "HappyHorse", type: "edit" },
  { id: "happyhorse-1-1/text-to-video", name: "HappyHorse 1.1 T2V", provider: "HappyHorse", type: "t2v", tag: "new" },
  { id: "happyhorse-1-1/image-to-video", name: "HappyHorse 1.1 I2V", provider: "HappyHorse", type: "i2v" },
  // Gemini Omni
  { id: "gemini-omni-video", name: "Gemini Omni Video", provider: "Google", type: "t2v" },
  { id: "gemini-omni-character", name: "Gemini Omni Character", provider: "Google", type: "avatar" },
  // OmniHuman
  { id: "omnihuman-1-5", name: "OmniHuman 1.5", provider: "ByteDance", type: "avatar", tag: "new" },
  // Lip Sync
  { id: "volcengine/video-to-video-lip-sync", name: "Volcengine Lip Sync", provider: "ByteDance", type: "lipsync" },
  { id: "infinitalk/from-audio", name: "Infinitalk Avatar", provider: "Infinitalk", type: "avatar" },
  // Upscale
  { id: "topaz/video-upscale", name: "Topaz Video Upscale", provider: "Topaz", type: "upscale", tag: "pro" },
  // ByteDance Legacy
  { id: "bytedance/seedance-1-pro", name: "ByteDance V1 Pro T2V", provider: "ByteDance", type: "t2v" },
  { id: "bytedance/seedance-1-pro-i2v", name: "ByteDance V1 Pro I2V", provider: "ByteDance", type: "i2v" },
  { id: "bytedance/seedance-1-lite", name: "ByteDance V1 Lite T2V", provider: "ByteDance", type: "t2v" },
  { id: "bytedance/seedance-1-lite-i2v", name: "ByteDance V1 Lite I2V", provider: "ByteDance", type: "i2v" },
];

// ── VEO MODELS (separate endpoint) ──────────────────────────────
export const VEO_MODELS: Model[] = [
  { id: "veo3_quality", name: "Veo 3.1 Quality", provider: "Google", type: "t2v", tag: "4k" },
  { id: "veo3_fast", name: "Veo 3.1 Fast", provider: "Google", type: "t2v", tag: "popular" },
  { id: "veo3_lite", name: "Veo 3.1 Lite", provider: "Google", type: "t2v", tag: "fast" },
];

// ── IMAGE MODELS ────────────────────────────────────────────────
export const IMAGE_MODELS: Model[] = [
  // Seedream
  { id: "seedream/5-pro-text-to-image", name: "Seedream 5.0 Pro", provider: "ByteDance", type: "t2i", tag: "new" },
  { id: "seedream/5-pro-image-to-image", name: "Seedream 5.0 Pro I2I", provider: "ByteDance", type: "i2i" },
  { id: "seedream/5-lite-text-to-image", name: "Seedream 5.0 Lite", provider: "ByteDance", type: "t2i" },
  { id: "seedream/4-5-text-to-image", name: "Seedream 4.5", provider: "ByteDance", type: "t2i" },
  { id: "seedream/seedream-v4-text-to-image", name: "Seedream 4.0", provider: "ByteDance", type: "t2i" },
  // Flux 2
  { id: "flux-2/pro-text-to-image", name: "Flux 2 Pro", provider: "BFL", type: "t2i", tag: "popular" },
  { id: "flux-2/pro-image-to-image", name: "Flux 2 Pro I2I", provider: "BFL", type: "i2i" },
  { id: "flux-2/flex-text-to-image", name: "Flux 2 Flex", provider: "BFL", type: "t2i" },
  { id: "flux-2/flex-image-to-image", name: "Flux 2 Flex I2I", provider: "BFL", type: "i2i" },
  // Google Imagen
  { id: "google/imagen4-ultra", name: "Imagen 4 Ultra", provider: "Google", type: "t2i", tag: "pro" },
  { id: "google/imagen4-fast", name: "Imagen 4 Fast", provider: "Google", type: "t2i", tag: "fast" },
  { id: "google/imagen4", name: "Imagen 4", provider: "Google", type: "t2i" },
  { id: "google/nano-banana", name: "Nano Banana", provider: "Google", type: "t2i" },
  { id: "google/nanobanana2", name: "Nano Banana 2", provider: "Google", type: "t2i", tag: "new" },
  { id: "google/nano-banana-edit", name: "Nano Banana Edit", provider: "Google", type: "i2i" },
  // Grok Imagine 2.0
  { id: "grok-imagine-image-2-0/text-to-image", name: "Grok Imagine 2.0", provider: "xAI", type: "t2i", tag: "new" },
  { id: "grok-imagine-image-2-0/image-edit", name: "Grok Imagine 2.0 Edit", provider: "xAI", type: "i2i" },
  { id: "grok-imagine/text-to-image", name: "Grok Imagine", provider: "xAI", type: "t2i" },
  { id: "grok-imagine/image-to-image", name: "Grok Imagine I2I", provider: "xAI", type: "i2i" },
  // GPT Image
  { id: "gpt-image-2-text-to-image", name: "GPT Image 2", provider: "OpenAI", type: "t2i", tag: "popular" },
  { id: "gpt-image-2-image-to-image", name: "GPT Image 2 I2I", provider: "OpenAI", type: "i2i" },
  { id: "gpt-image/1-5-text-to-image", name: "GPT Image 1.5", provider: "OpenAI", type: "t2i" },
  // Ideogram
  { id: "ideogram/character", name: "Ideogram Character", provider: "Ideogram", type: "t2i" },
  { id: "ideogram/v3-text-to-image", name: "Ideogram V3", provider: "Ideogram", type: "t2i" },
  { id: "ideogram/v3-edit", name: "Ideogram V3 Edit", provider: "Ideogram", type: "i2i" },
  { id: "ideogram/character-edit", name: "Ideogram Character Edit", provider: "Ideogram", type: "i2i" },
  // Qwen
  { id: "qwen3-pro/text-to-image", name: "Qwen 3 Pro", provider: "Alibaba", type: "t2i", tag: "new" },
  { id: "qwen3/text-to-image", name: "Qwen 3", provider: "Alibaba", type: "t2i" },
  { id: "qwen2/text-to-image", name: "Qwen 2", provider: "Alibaba", type: "t2i" },
  // Wan Image
  { id: "wan/2-7-image", name: "Wan 2.7 Image", provider: "Alibaba", type: "t2i" },
  { id: "wan/2-7-image-pro", name: "Wan 2.7 Image Pro", provider: "Alibaba", type: "t2i", tag: "pro" },
  // Z-Image
  { id: "z-image/z-image", name: "Z-Image", provider: "Z-Image", type: "t2i" },
  // Upscale & Tools
  { id: "topaz/image-upscale", name: "Topaz Upscale", provider: "Topaz", type: "upscale" },
  { id: "recraft/crisp-upscale", name: "Recraft Upscale", provider: "Recraft", type: "upscale" },
  { id: "recraft/remove-background", name: "Recraft Remove BG", provider: "Recraft", type: "edit" },
];

// ── AUDIO MODELS ────────────────────────────────────────────────
export const AUDIO_MODELS: Model[] = [
  { id: "elevenlabs/text-to-speech-turbo-2-5", name: "ElevenLabs Turbo 2.5", provider: "ElevenLabs", type: "tts", tag: "popular" },
  { id: "elevenlabs/text-to-speech-multilingual-v2", name: "ElevenLabs Multilingual", provider: "ElevenLabs", type: "tts" },
  { id: "elevenlabs/text-to-dialogue-v3", name: "ElevenLabs Dialogue V3", provider: "ElevenLabs", type: "tts", tag: "new" },
  { id: "elevenlabs/audio-isolation", name: "ElevenLabs Audio Isolation", provider: "ElevenLabs", type: "edit" },
  { id: "google/gemini-3-1-flash-tts", name: "Gemini 3.1 Flash TTS", provider: "Google", type: "tts" },
  { id: "gemini-omni-audio", name: "Gemini Omni Audio", provider: "Google", type: "tts" },
];

// ── TEMPLATES ───────────────────────────────────────────────────
export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  models: string[];
  prompt: string;
  params: Record<string, string>;
  color: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "cinematic-hero",
    title: "Cinematic Hero Shot",
    description: "30s cinematic commercial with locked color grading, ARRI Alexa Mini LF look",
    category: "Commercial",
    models: ["bytedance/seedance-2-5"],
    prompt: "Cinematic hero shot, ARRI Alexa Mini LF, 35mm anamorphic lens, warm golden hour lighting, shallow depth of field, slow dolly push-in, professional color grading with teal and orange tones, 4K quality, film grain",
    params: { duration: "30", resolution: "1080p", aspect_ratio: "16:9" },
    color: "from-amber-600 to-orange-700",
  },
  {
    id: "product-showcase",
    title: "Product Showcase",
    description: "Elegant product reveal with rotating camera and studio lighting",
    category: "E-Commerce",
    models: ["bytedance/seedance-2-fast"],
    prompt: "Professional product showcase, smooth 360-degree orbit camera movement, clean white studio backdrop, soft key lighting with rim light, product floating and rotating, premium commercial feel, 4K",
    params: { duration: "10", resolution: "1080p", aspect_ratio: "1:1" },
    color: "from-violet-600 to-purple-700",
  },
  {
    id: "talking-head",
    title: "AI Avatar / Talking Head",
    description: "Generate a talking avatar from a photo + audio with lip sync",
    category: "Avatar",
    models: ["kling/ai-avatar-pro"],
    prompt: "Professional talking head video, natural lip sync, subtle head movements, clean background, professional lighting",
    params: { duration: "15", resolution: "1080p", aspect_ratio: "9:16" },
    color: "from-cyan-600 to-blue-700",
  },
  {
    id: "social-reel",
    title: "Social Media Reel",
    description: "Vertical 9:16 short-form video optimized for TikTok/Reels",
    category: "Social",
    models: ["kling-3.0/video"],
    prompt: "Dynamic vertical video, trendy transitions, vibrant colors, fast-paced editing feel, social media aesthetic, engaging movement, modern look",
    params: { duration: "15", resolution: "1080p", aspect_ratio: "9:16" },
    color: "from-pink-600 to-rose-700",
  },
  {
    id: "multi-shot",
    title: "Multi-Shot Storyboard",
    description: "3-6 camera cuts in one clip with consistent character using Kling 3.0",
    category: "Film",
    models: ["kling-3.0/video"],
    prompt: "Multi-shot cinematic sequence: Shot 1 (0-3s) wide establishing shot, Shot 2 (3-6s) medium close-up, Shot 3 (6-10s) tracking shot following subject, consistent character appearance throughout, cinematic color grading",
    params: { duration: "15", resolution: "1080p", aspect_ratio: "16:9" },
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "anime-style",
    title: "Anime / Stylized",
    description: "Animated style video with vivid colors and dynamic camera",
    category: "Creative",
    models: ["wan/2-7-text-to-video"],
    prompt: "Anime style animation, vibrant saturated colors, dynamic camera angles, dramatic lighting, detailed character design, smooth fluid motion, Studio Ghibli inspired atmosphere",
    params: { duration: "10", resolution: "720p", aspect_ratio: "16:9" },
    color: "from-indigo-600 to-blue-700",
  },
  {
    id: "veo-dialogue",
    title: "Dialogue Scene (Veo 3.1)",
    description: "Single-speaker synchronized dialogue with native audio",
    category: "Film",
    models: ["veo3_quality"],
    prompt: "A person speaks directly to camera in a cozy cafe setting, natural conversational tone, warm ambient lighting, shallow depth of field, synchronized lip movement with clear speech, ambient cafe sounds in background",
    params: { duration: "10", aspect_ratio: "16:9" },
    color: "from-red-600 to-rose-700",
  },
  {
    id: "image-animate",
    title: "Bring Image to Life",
    description: "Upload an image and animate it with natural motion",
    category: "Animation",
    models: ["bytedance/seedance-2-fast"],
    prompt: "Gentle natural motion, subtle wind in hair, blinking eyes, slight body movement, atmospheric particles, cinematic depth of field, photorealistic",
    params: { duration: "5", resolution: "720p", aspect_ratio: "16:9" },
    color: "from-sky-600 to-cyan-700",
  },
  {
    id: "music-video",
    title: "AI Music + Video",
    description: "Generate music with Suno then create a matching visual",
    category: "Music",
    models: ["bytedance/seedance-2-5"],
    prompt: "Abstract visual journey synchronized to music, flowing colors and shapes, dreamlike transitions, cinematic atmosphere, rhythmic camera movements matching musical beats",
    params: { duration: "30", resolution: "1080p", aspect_ratio: "16:9" },
    color: "from-fuchsia-600 to-purple-700",
  },
  {
    id: "real-estate",
    title: "Real Estate Tour",
    description: "Smooth interior walkthrough from a single photo",
    category: "Business",
    models: ["bytedance/seedance-2"],
    prompt: "Smooth interior walkthrough, steady camera glide through modern apartment, natural window light, warm tones, real estate showcase, professional staging, wide angle lens",
    params: { duration: "15", resolution: "1080p", aspect_ratio: "16:9" },
    color: "from-stone-600 to-zinc-700",
  },
];

// ── PROVIDER COLORS ─────────────────────────────────────────────
// ── MODEL THUMBNAILS — gradient + preview text ─────────────────
export const MODEL_THUMBNAILS: Record<string, { gradient: string; preview: string; icon: string }> = {
  // Seedance
  "bytedance/seedance-2-5": { gradient: "from-orange-500 via-red-500 to-pink-600", preview: "30s cinematic, 4K, omni-ref", icon: "🎬" },
  "bytedance/seedance-2": { gradient: "from-orange-400 to-rose-500", preview: "15s high quality, audio sync", icon: "🎥" },
  "bytedance/seedance-2-fast": { gradient: "from-amber-400 to-orange-500", preview: "Fast drafts, 480-720p", icon: "⚡" },
  "bytedance/seedance-2-mini": { gradient: "from-yellow-400 to-amber-500", preview: "Quick lightweight clips", icon: "📱" },
  "bytedance/seedance-1.5-pro": { gradient: "from-orange-300 to-red-400", preview: "Audio + lip-sync native", icon: "🎤" },
  // Kling 3.0
  "kling-3.0/video": { gradient: "from-blue-500 via-indigo-500 to-violet-600", preview: "Multi-shot, Elements, 15s", icon: "🎭" },
  "kling/v3-turbo-text-to-video": { gradient: "from-blue-400 to-indigo-500", preview: "Fast Kling 3.0 text-to-video", icon: "⚡" },
  "kling/v3-turbo-image-to-video": { gradient: "from-sky-400 to-blue-500", preview: "Fast image animation", icon: "🖼️" },
  "kling-3.0/omni-text-to-video": { gradient: "from-indigo-500 to-purple-600", preview: "Omni: text+img+video+audio", icon: "👑" },
  "kling-3.0/omni-image-to-video": { gradient: "from-violet-500 to-purple-600", preview: "Omni image-to-video", icon: "✨" },
  "kling-3.0/omni-reference-to-video": { gradient: "from-purple-500 to-fuchsia-600", preview: "Multi-ref consistency", icon: "🎯" },
  "kling-3.0/omni-transformation": { gradient: "from-fuchsia-500 to-pink-600", preview: "Video style transform", icon: "🔄" },
  "kling-3.0/motion-control": { gradient: "from-blue-500 to-cyan-500", preview: "Motion transfer from ref", icon: "🕹️" },
  // Kling 2.x
  "kling-2.6/text-to-video": { gradient: "from-blue-400 to-sky-500", preview: "Audio + speech native", icon: "🗣️" },
  "kling-2.6/image-to-video": { gradient: "from-sky-400 to-cyan-500", preview: "Animate images v2.6", icon: "🖼️" },
  "kling/v2-1-master-text-to-video": { gradient: "from-indigo-400 to-blue-500", preview: "Cinema quality master", icon: "🎬" },
  "kling/v2-1-master-image-to-video": { gradient: "from-blue-300 to-indigo-400", preview: "Master I2V quality", icon: "💎" },
  "kling/ai-avatar-standard": { gradient: "from-cyan-400 to-blue-500", preview: "Talking avatar from photo", icon: "👤" },
  "kling/ai-avatar-pro": { gradient: "from-cyan-500 to-indigo-600", preview: "Pro avatar + voice clone", icon: "👥" },
  // Veo
  "veo3_quality": { gradient: "from-green-500 via-emerald-500 to-teal-600", preview: "4K native audio, dialogue", icon: "🏆" },
  "veo3_fast": { gradient: "from-emerald-400 to-green-500", preview: "Fast 1080p with audio", icon: "⚡" },
  "veo3_lite": { gradient: "from-teal-400 to-emerald-500", preview: "Budget high-volume tier", icon: "💰" },
  // Grok Imagine
  "grok-imagine/text-to-video": { gradient: "from-gray-400 to-zinc-600", preview: "xAI text-to-video", icon: "🤖" },
  "grok-imagine/image-to-video": { gradient: "from-zinc-400 to-gray-500", preview: "xAI image animation", icon: "🖼️" },
  "grok-imagine/1-5-preview": { gradient: "from-gray-500 to-slate-600", preview: "Next-gen xAI preview", icon: "🔮" },
  // Hailuo
  "hailuo/2-3-image-to-video-pro": { gradient: "from-cyan-500 to-sky-600", preview: "Hailuo 2.3 Pro quality", icon: "🌊" },
  "hailuo/02-text-to-video-pro": { gradient: "from-sky-500 to-blue-600", preview: "Pro text-to-video", icon: "📝" },
  // Wan
  "wan/2-7-text-to-video": { gradient: "from-yellow-500 to-amber-600", preview: "Multi-char, voice clone", icon: "🐉" },
  "wan/2-7-image-to-video": { gradient: "from-amber-500 to-yellow-600", preview: "Wan 2.7 image animate", icon: "✨" },
  "wan/2-7-videoedit": { gradient: "from-yellow-400 to-orange-500", preview: "Edit existing videos", icon: "✂️" },
  "wan/2-6-text-to-video": { gradient: "from-yellow-400 to-amber-500", preview: "Cinematic Wan 2.6", icon: "🎥" },
  // PixVerse
  "pixverse/text-to-video": { gradient: "from-pink-500 to-rose-600", preview: "Stylized effects & VFX", icon: "🎨" },
  "pixverse/image-to-video": { gradient: "from-rose-400 to-pink-500", preview: "PixVerse image animate", icon: "🖌️" },
  // MiniMax H3
  "minimax-h3/text-to-video": { gradient: "from-cyan-500 to-teal-600", preview: "Open-weight multimodal", icon: "🧊" },
  // HappyHorse
  "happyhorse/text-to-video": { gradient: "from-emerald-500 to-lime-600", preview: "7-lang lip-sync native", icon: "🐴" },
  "happyhorse-1-1/text-to-video": { gradient: "from-lime-500 to-green-600", preview: "HappyHorse 1.1 upgraded", icon: "🐎" },
  // Gemini
  "gemini-omni-video": { gradient: "from-green-400 to-emerald-500", preview: "Google multimodal video", icon: "💫" },
  "gemini-omni-character": { gradient: "from-emerald-400 to-teal-500", preview: "Consistent character gen", icon: "👤" },
  // OmniHuman
  "omnihuman-1-5": { gradient: "from-violet-500 to-indigo-600", preview: "Audio-driven human video", icon: "🧑" },
  // Tools
  "topaz/video-upscale": { gradient: "from-teal-500 to-cyan-600", preview: "AI upscale to 4K", icon: "🔍" },
  "volcengine/video-to-video-lip-sync": { gradient: "from-red-400 to-orange-500", preview: "Lip sync any video", icon: "👄" },
};

// Default thumbnail for models not in the map
export const DEFAULT_THUMBNAIL = { gradient: "from-slate-500 to-gray-600", preview: "AI generation", icon: "🎯" };

export const PROVIDER_COLORS: Record<string, string> = {
  ByteDance: "text-orange-400",
  Kuaishou: "text-blue-400",
  Google: "text-green-400",
  xAI: "text-gray-300",
  MiniMax: "text-cyan-400",
  Alibaba: "text-yellow-400",
  PixVerse: "text-pink-400",
  HappyHorse: "text-emerald-400",
  Ideogram: "text-purple-400",
  OpenAI: "text-green-300",
  BFL: "text-amber-400",
  Recraft: "text-indigo-400",
  Topaz: "text-teal-400",
  ElevenLabs: "text-violet-400",
  Infinitalk: "text-rose-400",
  "Z-Image": "text-lime-400",
};

export const TAG_STYLES: Record<string, string> = {
  new: "bg-emerald-500/20 text-emerald-300",
  popular: "bg-amber-500/20 text-amber-300",
  fast: "bg-sky-500/20 text-sky-300",
  pro: "bg-violet-500/20 text-violet-300",
  "4k": "bg-rose-500/20 text-rose-300",
};
