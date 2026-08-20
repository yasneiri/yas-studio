"use client";
import { useState, useEffect, useCallback } from "react";
import { Play, Loader2, Download, Coins, Sparkles, Wand2, Volume2 } from "lucide-react";
import {
  ALL_VIDEO, IMAGE_MODELS, AUDIO_MODELS, TEMPLATES,
  TAG_STYLES, PROVIDER_COLORS, MODEL_THUMBNAILS, DEFAULT_THUMBNAIL, type Model,
} from "@/lib/nav-data";
import TopNav, { type Tab } from "@/components/TopNav";
import WorkflowEditor from "@/components/WorkflowEditor";

type GenState = "idle" | "generating" | "complete" | "error";

const ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4"];
const DURATIONS = ["5", "10", "15", "30"];
const RESOLUTIONS = ["480p", "720p", "1080p"];

export default function Home() {
  const [tab, setTab] = useState<Tab>("video");
  const [apiKey, setApiKey] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [wfTemplateId, setWfTemplateId] = useState<string | undefined>(undefined);

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
  const [history, setHistory] = useState<{ url: string; model: string; prompt: string; t: string; kind: "video" | "image" }[]>([]);

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
        const st = (s.state || "").toLowerCase();
        if (st === "success" && s.resultUrls?.length) {
          setR(s.resultUrls[0]);
          setHistory(h => [{ url: s.resultUrls[0], model: targetModel, prompt: targetPrompt, t: new Date().toLocaleTimeString(), kind: type }, ...h.slice(0, 23)]);
          setS("complete"); fetchCredits(); return;
        }
        if (st === "fail" || st === "failed" || st === "error") throw new Error(s.failMsg || "Generation failed");
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

  const pickVideo = (id: string) => { setModel(id); setSearch(""); setTab("video"); };
  const pickImage = (id: string) => { setImgModel(id); setSearch(""); setTab("image"); };
  const pickTemplate = (id: string) => { const t = TEMPLATES.find(x => x.id === id); if (t) loadTemplate(t); };

  const runWorkflow = (wf: { primaryModel: string; title: string }) => {
    setModel(wf.primaryModel);
    if (!prompt.trim()) setPrompt(`${wf.title} — describe your scene here`);
    setTab("video");
  };

  const q = search.toLowerCase();
  const filteredVideo = search ? ALL_VIDEO.filter(m => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q)) : ALL_VIDEO;
  const filteredImage = search ? IMAGE_MODELS.filter(m => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q)) : IMAGE_MODELS;

  const Tag = ({ tag }: { tag?: string }) => tag ? <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase ${TAG_STYLES[tag] || ""}`}>{tag}</span> : null;

  const ModelCard = ({ m, active, onClick }: { m: Model; active: boolean; onClick: () => void }) => {
    const th = MODEL_THUMBNAILS[m.id] || DEFAULT_THUMBNAIL;
    return (
      <button onClick={onClick}
        className={`group text-left rounded-2xl overflow-hidden border transition-all ${active ? "border-accent shadow-[0_0_28px_rgba(139,92,246,0.25)]" : "border-white/8 hover:border-accent/40"}`}>
        <div className={`relative h-24 bg-gradient-to-br ${th.gradient} flex items-center justify-center`}>
          <span className="text-3xl drop-shadow-lg group-hover:scale-110 transition-transform">{th.icon}</span>
          {m.tag && <div className="absolute top-2 right-2"><Tag tag={m.tag} /></div>}
          <div className="absolute inset-0 group-hover:bg-black/10 transition" />
        </div>
        <div className="p-2.5 bg-bg-card">
          <p className="text-[12px] font-semibold text-gray-100 truncate">{m.name}</p>
          <p className={`text-[10px] ${PROVIDER_COLORS[m.provider] || "text-gray-500"}`}>{m.provider}</p>
          <p className="text-[9px] text-gray-600 truncate mt-0.5">{th.preview}</p>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav tab={tab} setTab={setTab} search={search} setSearch={setSearch} credits={credits}
        onPickVideo={pickVideo} onPickImage={pickImage} onPickTemplate={pickTemplate} />

      <main className="flex-1 overflow-y-auto">
        {/* VIDEO */}
        {tab === "video" && (
          <div className="max-w-[1600px] mx-auto px-4 py-5 grid lg:grid-cols-[1fr_360px] gap-5">
            <div className="space-y-4">
              <div className="card p-4 space-y-3">
                {(() => { const th = MODEL_THUMBNAILS[model] || DEFAULT_THUMBNAIL; const md = ALL_VIDEO.find(x => x.id === model); return (
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${th.gradient} flex items-center justify-center text-xl`}>{th.icon}</div>
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-2">{md?.name || model} <Tag tag={md?.tag} /></p>
                      <p className="text-[10px] text-gray-500 font-mono">{model}</p>
                    </div>
                  </div>
                ); })()}
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your video…"
                  className="w-full h-28 p-3 glass rounded-xl text-[13px] text-gray-200 placeholder-gray-600 outline-none focus:border-accent/40 resize-none" />
                <div className="flex flex-wrap gap-2">
                  <Selector label="Aspect" value={aspect} options={ASPECTS} onChange={setAspect} />
                  <Selector label="Duration" value={dur} options={DURATIONS} onChange={setDur} suffix="s" />
                  <Selector label="Resolution" value={res} options={RESOLUTIONS} onChange={setRes} />
                </div>
                <button onClick={() => generate(model, prompt, "video")} disabled={state === "generating" || !prompt.trim()}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-accent to-sky hover:opacity-90 disabled:opacity-40 transition flex items-center justify-center gap-2">
                  {state === "generating" ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating {progress > 0 && `${progress}%`}</> : <><Play className="w-4 h-4" /> Generate video</>}
                </button>
                {error && state === "error" && <p className="text-[11px] text-red-400">{error}</p>}
              </div>
              {result && (
                <div className="card p-3 space-y-2">
                  <video src={result} controls autoPlay loop className="w-full rounded-xl" />
                  <a href={result} download className="inline-flex items-center gap-1.5 text-[12px] text-accent-hover hover:underline"><Download className="w-3.5 h-3.5" /> Download</a>
                </div>
              )}
              {history.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-1">Gallery</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {history.map((h, i) => (
                      <a key={i} href={h.url} target="_blank" rel="noreferrer" className="group card-sm overflow-hidden card-hover">
                        {h.kind === "video" ? <video src={h.url} className="w-full h-28 object-cover" muted /> : <img src={h.url} alt="" className="w-full h-28 object-cover" />}
                        <div className="p-2">
                          <p className="text-[10px] text-gray-400 truncate">{h.prompt}</p>
                          <p className="text-[9px] text-gray-600">{h.t}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Video models</p>
                <span className="text-[10px] text-gray-600">{filteredVideo.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                {filteredVideo.map(m => <ModelCard key={m.id} m={m} active={m.id === model} onClick={() => setModel(m.id)} />)}
              </div>
            </div>
          </div>
        )}

        {/* IMAGE */}
        {tab === "image" && (
          <div className="max-w-[1600px] mx-auto px-4 py-5 grid lg:grid-cols-[1fr_360px] gap-5">
            <div className="space-y-4">
              <div className="card p-4 space-y-3">
                {(() => { const th = MODEL_THUMBNAILS[imgModel] || DEFAULT_THUMBNAIL; const md = IMAGE_MODELS.find(x => x.id === imgModel); return (
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${th.gradient} flex items-center justify-center text-xl`}>{th.icon}</div>
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-2">{md?.name || imgModel} <Tag tag={md?.tag} /></p>
                      <p className="text-[10px] text-gray-500 font-mono">{imgModel}</p>
                    </div>
                  </div>
                ); })()}
                <textarea value={imgPrompt} onChange={e => setImgPrompt(e.target.value)} placeholder="Describe your image…"
                  className="w-full h-28 p-3 glass rounded-xl text-[13px] text-gray-200 placeholder-gray-600 outline-none focus:border-accent/40 resize-none" />
                <div className="flex flex-wrap gap-2"><Selector label="Aspect" value={aspect} options={ASPECTS} onChange={setAspect} /></div>
                <button onClick={() => generate(imgModel, imgPrompt, "image")} disabled={imgState === "generating" || !imgPrompt.trim()}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-accent to-sky hover:opacity-90 disabled:opacity-40 transition flex items-center justify-center gap-2">
                  {imgState === "generating" ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating</> : <><Wand2 className="w-4 h-4" /> Generate image</>}
                </button>
                {error && imgState === "error" && <p className="text-[11px] text-red-400">{error}</p>}
              </div>
              {imgResult && (
                <div className="card p-3 space-y-2">
                  <img src={imgResult} alt="" className="w-full rounded-xl" />
                  <a href={imgResult} download className="inline-flex items-center gap-1.5 text-[12px] text-accent-hover hover:underline"><Download className="w-3.5 h-3.5" /> Download</a>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Image models</p>
                <span className="text-[10px] text-gray-600">{filteredImage.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                {filteredImage.map(m => <ModelCard key={m.id} m={m} active={m.id === imgModel} onClick={() => setImgModel(m.id)} />)}
              </div>
            </div>
          </div>
        )}

        {/* AUDIO */}
        {tab === "audio" && (
          <div className="max-w-[1600px] mx-auto px-4 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-accent" />
              <div>
                <h2 className="text-lg font-semibold">Audio Models</h2>
                <p className="text-gray-500 text-xs">ElevenLabs, Gemini TTS, Suno Music and more</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {AUDIO_MODELS.map(m => <ModelCard key={m.id} m={m} active={false} onClick={() => {}} />)}
            </div>
          </div>
        )}

        {/* WORKFLOW */}
        {tab === "workflow" && (
          <div className="max-w-[1600px] mx-auto px-4 py-3">
            <WorkflowEditor onRun={runWorkflow} initialWorkflowId={wfTemplateId} />
          </div>
        )}

        {/* TEMPLATES */}
        {tab === "templates" && (
          <div className="max-w-[1600px] mx-auto px-4 py-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Templates</h2>
              <p className="text-gray-500 text-xs">Pre-built pipelines — load into the studio or open in the workflow editor</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {TEMPLATES.map(t => (
                <div key={t.id} className="card overflow-hidden card-hover group">
                  <div className={`h-20 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                    <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">{t.category}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-[13px] font-semibold text-gray-100">{t.title}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-2">{t.description}</p>
                    <div className="flex gap-1.5 pt-1">
                      <button onClick={() => loadTemplate(t)} className="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-accent/15 text-accent-hover hover:bg-accent/25 transition">Load</button>
                      <button onClick={() => { setWfTemplateId(t.id); setTab("workflow"); }} className="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition">Workflow</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /> Settings</h2>
            <div className="card p-4 space-y-3">
              <label className="text-[12px] font-medium text-gray-300">kie.ai API Key</label>
              <input type="password" value={apiKey} onChange={e => saveKey(e.target.value)} placeholder="Enter your kie.ai API key"
                className="w-full p-3 glass rounded-xl text-[13px] text-gray-200 placeholder-gray-600 outline-none focus:border-accent/40" />
              <p className="text-[10px] text-gray-600">Stored locally in your browser. Get a key at kie.ai/api-key</p>
              {credits !== null && (
                <div className="flex items-center gap-2 pt-1">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-gray-200">{credits.toLocaleString()} credits</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Selector({ label, value, options, onChange, suffix }: { label: string; value: string; options: string[]; onChange: (v: string) => void; suffix?: string }) {
  return (
    <div className="flex items-center gap-1.5 glass rounded-lg px-2 py-1">
      <span className="text-[10px] text-gray-500">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent text-[11px] text-gray-200 outline-none cursor-pointer">
        {options.map(o => <option key={o} value={o} className="bg-bg-card">{o}{suffix}</option>)}
      </select>
    </div>
  );
}
