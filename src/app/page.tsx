"use client";
import { useState, useEffect, useCallback } from "react";
import { Film, Image as ImgIcon, Music, Settings, Play, Loader2, Download, Clock, Coins, Sparkles, Camera, Wand2, LayoutGrid, Zap, Crown, Search, ChevronRight, X, Volume2, User } from "lucide-react";
import { VIDEO_MODELS, VEO_MODELS, IMAGE_MODELS, AUDIO_MODELS, TEMPLATES, TAG_STYLES, PROVIDER_COLORS, MODEL_THUMBNAILS, DEFAULT_THUMBNAIL, type Model } from "@/lib/models";

type Tab = "video" | "image" | "audio" | "templates" | "settings";
type GenState = "idle" | "generating" | "complete" | "error";

const ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4"];
const DURATIONS = ["5", "10", "15", "30"];
const RESOLUTIONS = ["480p", "720p", "1080p"];
const ALL_VIDEO = [...VIDEO_MODELS, ...VEO_MODELS];

export default function Home() {
  const [tab, setTab] = useState<Tab>("video");
  const [apiKey, setApiKey] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [showModels, setShowModels] = useState(false);
  const [showImgModels, setShowImgModels] = useState(false);

  // Video
  const [model, setModel] = useState<string>("bytedance/seedance-2-5");
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState("16:9");
  const [dur, setDur] = useState("5");
  const [res, setRes] = useState("720p");
  const [state, setState] = useState<GenState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ url: string; model: string; prompt: string; t: string }[]>([]);

  // Image
  const [imgModel, setImgModel] = useState<string>("seedream/5-pro-text-to-image");
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgResult, setImgResult] = useState<string | null>(null);
  const [imgState, setImgState] = useState<GenState>("idle");

  useEffect(() => { const k = localStorage.getItem("yas_api_key"); if (k) setApiKey(k); }, []);
  const saveKey = (k: string) => { setApiKey(k); localStorage.setItem("yas_api_key", k); };

  const fetchCredits = useCallback(async () => {
    if (!apiKey) return;
    try { const r = await fetch("/api/credits", { headers: { "x-api-key": apiKey } }); const d = await r.json(); if (d.credits != null) setCredits(d.credits); } catch {}
  }, [apiKey]);
  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  // ── Generate ──────────────────────────────────────────────────
  const generate = async (targetModel: string, targetPrompt: string, type: "video" | "image") => {
    if (!apiKey) { setTab("settings"); return; }
    if (!targetPrompt.trim()) return;
    const setS = type === "video" ? setState : setImgState;
    const setR = type === "video" ? setResult : setImgResult;
    setS("generating"); setProgress(0); setR(null); setError("");

    try {
      const isVeo = targetModel.startsWith("veo");
      const body = isVeo
        ? { type: "veo", model: targetModel, prompt: targetPrompt, aspect_ratio: aspect }
        : { type: "market", model: targetModel, input: { prompt: targetPrompt, aspect_ratio: aspect, duration: parseInt(dur), resolution: res } };

      const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.error) throw new Error(d.error);

      for (let i = 0; i < 120; i++) {
        const sr = await fetch(`/api/status?taskId=${d.taskId}`, { headers: { "x-api-key": apiKey } });
        const s = await sr.json();
        if (s.progress) setProgress(s.progress);
        if (s.state === "success" && s.resultUrls?.length) {
          setR(s.resultUrls[0]);
          if (type === "video") setHistory(h => [{ url: s.resultUrls[0], model: targetModel, prompt: targetPrompt, t: new Date().toLocaleTimeString() }, ...h.slice(0, 19)]);
          setS("complete"); fetchCredits(); return;
        }
        if (s.state === "failed") throw new Error(s.failMsg || "Generation failed");
        await new Promise(r => setTimeout(r, 5000));
      }
      throw new Error("Timeout");
    } catch (e: unknown) { setS("error"); setError(e instanceof Error ? e.message : "Error"); }
  };

  const loadTemplate = (t: typeof TEMPLATES[0]) => {
    setModel(t.models[0]);
    setPrompt(t.prompt);
    if (t.params.duration) setDur(t.params.duration);
    if (t.params.resolution) setRes(t.params.resolution);
    if (t.params.aspect_ratio) setAspect(t.params.aspect_ratio);
    setTab("video");
  };

  const filteredVideo = search ? ALL_VIDEO.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase())) : ALL_VIDEO;
  const filteredImage = search ? IMAGE_MODELS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase())) : IMAGE_MODELS;

  const selectedModelData = ALL_VIDEO.find(m => m.id === model) || ALL_VIDEO[0];

  // ── Tag badge ─────────────────────────────────────────────────
  const Tag = ({ tag }: { tag?: string }) => tag ? <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase ${TAG_STYLES[tag] || ""}`}>{tag}</span> : null;

  const navItems: { id: Tab; icon: typeof Film; label: string }[] = [
    { id: "video", icon: Film, label: "Video" },
    { id: "image", icon: ImgIcon, label: "Image" },
    { id: "audio", icon: Music, label: "Audio" },
    { id: "templates", icon: LayoutGrid, label: "Templates" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ═══ SIDEBAR ═══ */}
      <aside className="w-14 lg:w-52 flex-shrink-0 bg-bg-card border-r border-bg-border flex flex-col">
        <div className="p-2 lg:p-4 border-b border-bg-border flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-sky flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="hidden lg:block font-display font-bold text-base tracking-tight">Yas Studio</span>
        </div>
        <nav className="flex-1 p-1.5 space-y-0.5">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all ${
                tab === id ? "bg-accent/15 text-accent-hover" : "text-gray-500 hover:bg-bg-hover hover:text-gray-300"
              }`}>
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </button>
          ))}
        </nav>
        {credits !== null && (
          <div className="p-2 lg:p-3 border-t border-bg-border">
            <div className="flex items-center gap-2 text-[11px] text-gray-500"><Coins className="w-3.5 h-3.5" /><span className="hidden lg:block">{credits.toLocaleString()} credits</span></div>
          </div>
        )}
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 overflow-y-auto">

        {/* ─── VIDEO STUDIO ─── */}
        {tab === "video" && (
          <div className="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-xl font-bold flex items-center gap-2"><Film className="w-5 h-5 text-accent" /> Video Studio</h1>
                <p className="text-gray-500 text-xs mt-0.5">{ALL_VIDEO.length} models · Seedance 2.5, Kling 3.0, Veo 3.1 and more</p>
              </div>
              <div className="relative hidden md:block">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..."
                  className="pl-8 pr-3 py-1.5 bg-bg-card border border-bg-border rounded-lg text-xs text-gray-300 w-52 outline-none focus:border-accent/40" />
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_360px] gap-5">
              {/* Preview */}
              <div className="card aspect-video flex items-center justify-center relative overflow-hidden">
                {state === "generating" && (
                  <div className="text-center space-y-3 animate-glow p-8 rounded-2xl">
                    <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
                    <p className="text-gray-400 text-xs">Generating with {selectedModelData.name}... {progress > 0 ? `${progress}%` : ""}</p>
                    <div className="w-40 h-1 bg-bg-border rounded-full overflow-hidden mx-auto">
                      <div className="h-full bg-gradient-to-r from-accent to-sky rounded-full transition-all" style={{ width: `${Math.max(progress, 5)}%` }} />
                    </div>
                  </div>
                )}
                {state === "complete" && result && (
                  <video src={result} controls autoPlay loop className="w-full h-full object-contain" />
                )}
                {state === "error" && (
                  <div className="text-center p-6"><p className="text-red-400 text-sm font-medium">Failed</p><p className="text-gray-500 text-xs mt-1">{error}</p></div>
                )}
                {state === "idle" && (
                  <div className="text-center text-gray-600 space-y-1.5"><Camera className="w-10 h-10 mx-auto opacity-20" /><p className="text-xs">Preview</p></div>
                )}
                {state === "complete" && result && (
                  <a href={result} download className="absolute top-2 right-2 p-1.5 card-sm hover:bg-bg-hover transition"><Download className="w-3.5 h-3.5" /></a>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-3">
                {/* Model — Visual Thumbnail Selector */}
                <div className="card-sm p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Model</span>
                    <button onClick={() => setShowModels(!showModels)} className="text-[10px] text-accent hover:text-accent-hover transition">
                      {showModels ? "Close" : "Browse all"}
                    </button>
                  </div>
                  {/* Selected model card */}
                  {(() => { const th = MODEL_THUMBNAILS[model] || DEFAULT_THUMBNAIL; return (
                    <button onClick={() => setShowModels(!showModels)} className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-bg border border-bg-border hover:border-accent/30 transition text-left group">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${th.gradient} flex items-center justify-center text-lg flex-shrink-0 shadow-lg`}>
                        {th.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display font-semibold truncate">{selectedModelData.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] ${PROVIDER_COLORS[selectedModelData.provider] || "text-gray-400"}`}>{selectedModelData.provider}</span>
                          <Tag tag={selectedModelData.tag} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{th.preview}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-600 transition ${showModels ? "rotate-90" : ""}`} />
                    </button>
                  );})()}

                  {/* Expandable model browser */}
                  {showModels && (
                    <div className="space-y-2 mt-1">
                      <div className="relative">
                        <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..."
                          className="w-full pl-7 pr-2 py-1.5 bg-bg border border-bg-border rounded-lg text-[11px] text-gray-300 outline-none focus:border-accent/40" />
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                        {(search ? filteredVideo : ALL_VIDEO).map(m => {
                          const th = MODEL_THUMBNAILS[m.id] || DEFAULT_THUMBNAIL;
                          const isSelected = m.id === model;
                          return (
                            <button key={m.id} onClick={() => { setModel(m.id); setShowModels(false); setSearch(""); }}
                              className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition ${
                                isSelected ? "bg-accent/10 border border-accent/20" : "hover:bg-bg-hover border border-transparent"
                              }`}>
                              <div className={`w-9 h-9 rounded-md bg-gradient-to-br ${th.gradient} flex items-center justify-center text-sm flex-shrink-0`}>
                                {th.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-medium truncate">{m.name}</p>
                                <div className="flex items-center gap-1">
                                  <span className={`text-[9px] ${PROVIDER_COLORS[m.provider] || "text-gray-500"}`}>{m.provider}</span>
                                  <Tag tag={m.tag} />
                                </div>
                              </div>
                              <span className="text-[9px] text-gray-600 flex-shrink-0">{m.type.toUpperCase()}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Prompt */}
                <div className="card-sm p-3 space-y-2">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Prompt</span>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4}
                    placeholder="Cinematic aerial shot of a futuristic city at golden hour, ARRI Alexa Mini LF, anamorphic lens..."
                    className="w-full bg-bg border border-bg-border rounded-lg px-2.5 py-2 text-xs text-gray-200 placeholder-gray-600 outline-none focus:border-accent/50 resize-none" />
                </div>

                {/* Params */}
                <div className="card-sm p-3 space-y-2">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Parameters</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[{ l: "Aspect", v: aspect, s: setAspect, o: ASPECTS }, { l: "Duration", v: dur, s: setDur, o: DURATIONS.map(d => d) }, { l: "Quality", v: res, s: setRes, o: RESOLUTIONS }].map(({ l, v, s, o }) => (
                      <div key={l}>
                        <span className="text-[9px] text-gray-600 block mb-0.5">{l}</span>
                        <select value={v} onChange={e => s(e.target.value)}
                          className="w-full bg-bg border border-bg-border rounded-lg px-2 py-1.5 text-[11px] text-gray-300 outline-none">
                          {o.map(x => <option key={x} value={x}>{l === "Duration" ? `${x}s` : x}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate */}
                <button onClick={() => generate(model, prompt, "video")} disabled={state === "generating"}
                  className="w-full py-2.5 rounded-xl font-display font-semibold text-sm bg-gradient-to-r from-accent to-sky hover:opacity-90 disabled:opacity-40 transition flex items-center justify-center gap-2">
                  {state === "generating" ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Play className="w-4 h-4" /> Generate</>}
                </button>

                {/* History */}
                {history.length > 0 && (
                  <div className="card-sm p-3 space-y-1.5">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> History</span>
                    <div className="space-y-0.5 max-h-28 overflow-y-auto">
                      {history.map((h, i) => (
                        <button key={i} onClick={() => { setResult(h.url); setState("complete"); }}
                          className="w-full text-left px-2 py-1 rounded-lg hover:bg-bg-hover text-[10px] text-gray-400 truncate transition">
                          <span className="text-gray-600">{h.t}</span> — {h.prompt.slice(0, 40)}...
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── IMAGE STUDIO ─── */}
        {tab === "image" && (
          <div className="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-5">
            <h1 className="font-display text-xl font-bold flex items-center gap-2"><ImgIcon className="w-5 h-5 text-sky" /> Image Studio</h1>
            <p className="text-gray-500 text-xs -mt-3">{IMAGE_MODELS.length} models · Seedream, Flux, Imagen, GPT Image and more</p>
            <div className="grid lg:grid-cols-[1fr_360px] gap-5">
              <div className="card aspect-square lg:aspect-video flex items-center justify-center overflow-hidden">
                {imgState === "generating" && <Loader2 className="w-8 h-8 text-sky animate-spin" />}
                {imgState === "complete" && imgResult && <img src={imgResult} alt="Generated" className="w-full h-full object-contain" />}
                {imgState === "idle" && <div className="text-center text-gray-600"><Wand2 className="w-10 h-10 mx-auto opacity-20" /><p className="text-xs mt-1">Preview</p></div>}
              </div>
              <div className="space-y-3">
                <div className="card-sm p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Model</span>
                    <button onClick={() => setShowImgModels(!showImgModels)} className="text-[10px] text-sky hover:text-sky-hover transition">
                      {showImgModels ? "Close" : "Browse all"}
                    </button>
                  </div>
                  {(() => { const sel = IMAGE_MODELS.find(m => m.id === imgModel) || IMAGE_MODELS[0]; return (
                    <button onClick={() => setShowImgModels(!showImgModels)} className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-bg border border-bg-border hover:border-sky/30 transition text-left">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky to-indigo-500 flex items-center justify-center text-lg flex-shrink-0 shadow-lg">🎨</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display font-semibold truncate">{sel.name}</p>
                        <span className={`text-[10px] ${PROVIDER_COLORS[sel.provider] || "text-gray-400"}`}>{sel.provider}</span>
                        <Tag tag={sel.tag} />
                      </div>
                    </button>
                  );})()}
                  {showImgModels && (
                    <div className="max-h-52 overflow-y-auto space-y-1 mt-1">
                      {IMAGE_MODELS.map(m => (
                        <button key={m.id} onClick={() => { setImgModel(m.id); setShowImgModels(false); }}
                          className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition ${m.id === imgModel ? "bg-sky/10 border border-sky/20" : "hover:bg-bg-hover border border-transparent"}`}>
                          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-sky/60 to-indigo-500/60 flex items-center justify-center text-xs flex-shrink-0">🎨</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium truncate">{m.name}</p>
                            <span className={`text-[9px] ${PROVIDER_COLORS[m.provider] || "text-gray-500"}`}>{m.provider}</span>
                            <Tag tag={m.tag} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="card-sm p-3 space-y-2">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Prompt</span>
                  <textarea value={imgPrompt} onChange={e => setImgPrompt(e.target.value)} rows={4}
                    placeholder="Ultra-detailed product photo of a luxury watch on dark marble surface, cinematic lighting..."
                    className="w-full bg-bg border border-bg-border rounded-lg px-2.5 py-2 text-xs text-gray-200 placeholder-gray-600 outline-none resize-none" />
                </div>
                <button onClick={() => generate(imgModel, imgPrompt, "image")} disabled={imgState === "generating"}
                  className="w-full py-2.5 rounded-xl font-display font-semibold text-sm bg-gradient-to-r from-sky to-accent hover:opacity-90 disabled:opacity-40 transition flex items-center justify-center gap-2">
                  {imgState === "generating" ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Image</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── AUDIO STUDIO ─── */}
        {tab === "audio" && (
          <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-5">
            <h1 className="font-display text-xl font-bold flex items-center gap-2"><Volume2 className="w-5 h-5 text-emerald-400" /> Audio Studio</h1>
            <p className="text-gray-500 text-xs">ElevenLabs, Gemini TTS, Suno Music and more</p>
            <div className="grid md:grid-cols-2 gap-3">
              {AUDIO_MODELS.map(m => (
                <div key={m.id} className="card-sm card-hover p-4 flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className={`text-[10px] ${PROVIDER_COLORS[m.provider] || "text-gray-500"}`}>{m.provider} · {m.type.toUpperCase()}</p>
                  </div>
                  <Tag tag={m.tag} />
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs text-center">Suno Music available via kie.ai Suno API endpoint. Full integration coming soon.</p>
          </div>
        )}

        {/* ─── TEMPLATES ─── */}
        {tab === "templates" && (
          <div className="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-5">
            <h1 className="font-display text-xl font-bold flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-amber-400" /> Templates</h1>
            <p className="text-gray-500 text-xs">Pre-built prompts and configs. Click to load into Video Studio.</p>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => loadTemplate(t)} className="card-sm card-hover p-4 text-left space-y-2 group">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                      <LayoutGrid className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-semibold truncate">{t.title}</p>
                      <p className="text-[10px] text-gray-500">{t.category}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-accent transition" />
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-600">
                    {t.models.map(m => <span key={m} className="bg-bg-hover px-1.5 py-0.5 rounded">{ALL_VIDEO.find(v => v.id === m)?.name || m}</span>)}
                    {t.params.duration && <span>· {t.params.duration}s</span>}
                    {t.params.aspect_ratio && <span>· {t.params.aspect_ratio}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {tab === "settings" && (
          <div className="max-w-xl mx-auto p-4 lg:p-6 space-y-5">
            <h1 className="font-display text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400" /> Settings</h1>
            <div className="card p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1.5">kie.ai API Key</label>
                <p className="text-[11px] text-gray-500 mb-2">Get yours at <a href="https://kie.ai" target="_blank" className="text-accent hover:underline">kie.ai</a> → API Keys. Stored locally in your browser only.</p>
                <input type="password" value={apiKey} onChange={e => saveKey(e.target.value)} placeholder="Enter API key..."
                  className="w-full bg-bg border border-bg-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-accent/50 font-mono" />
              </div>
              {credits !== null && (
                <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-bg-border">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <div><p className="text-sm font-medium">{credits.toLocaleString()} credits</p><p className="text-[10px] text-gray-500">1 credit ≈ $0.005</p></div>
                </div>
              )}
              <button onClick={fetchCredits} className="text-xs text-accent hover:underline">Refresh credits</button>
            </div>
            <div className="card p-5 space-y-2">
              <h2 className="font-display font-semibold text-sm">About Yas Studio</h2>
              <p className="text-xs text-gray-400">Open-source AI generation studio. {ALL_VIDEO.length} video models, {IMAGE_MODELS.length} image models, {AUDIO_MODELS.length} audio models.</p>
              <p className="text-xs text-gray-400">Powered by <a href="https://kie.ai" className="text-accent hover:underline" target="_blank">kie.ai</a>. MIT Licensed — modify, rebrand, resell freely.</p>
              <p className="text-[10px] text-gray-600 font-mono">v1.0.0 · MIT · 2026</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
