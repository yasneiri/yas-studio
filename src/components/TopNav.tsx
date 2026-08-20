"use client";
import { useState, useRef, useEffect } from "react";
import { Film, Image as ImgIcon, Music, Settings, Sparkles, Search, Coins, ChevronDown, LayoutGrid, Workflow } from "lucide-react";
// Workflow icon is used for the pipeline editor nav entry.
import { ALL_VIDEO, IMAGE_MODELS, AUDIO_MODELS, TEMPLATES, MODEL_THUMBNAILS, DEFAULT_THUMBNAIL, PROVIDER_COLORS, type Model } from "@/lib/nav-data";

export type Tab = "video" | "image" | "audio" | "workflow" | "templates" | "settings";

type DropItem = { model: Model; onPick: () => void };

interface TopNavProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  search: string;
  setSearch: (s: string) => void;
  credits: number | null;
  onPickVideo: (id: string) => void;
  onPickImage: (id: string) => void;
  onPickTemplate: (id: string) => void;
}

/* One menu entry in the top bar. Opens a glass dropdown on hover/click. */
function NavMenu({
  id, label, icon: Icon, active, onActivate, children, open, setOpen,
}: {
  id: string; label: string; icon: typeof Film; active: boolean;
  onActivate: () => void; children?: React.ReactNode;
  open: boolean; setOpen: (v: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasMenu = !!children;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => hasMenu && setOpen(id)}
      onMouseLeave={() => hasMenu && setOpen(null)}
    >
      <button
        onClick={() => { onActivate(); if (hasMenu) setOpen(open ? null : id); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
          active ? "bg-accent/15 text-accent-hover" : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
        {hasMenu && <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>
      {hasMenu && open && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="glass-panel rounded-2xl p-2 w-[340px] animate-drop">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* A scrollable list of model rows inside a dropdown. */
function ModelList({ items }: { items: DropItem[] }) {
  return (
    <div className="max-h-[360px] overflow-y-auto space-y-0.5 pr-1">
      {items.map(({ model, onPick }) => {
        const th = MODEL_THUMBNAILS[model.id] || DEFAULT_THUMBNAIL;
        return (
          <button
            key={model.id}
            onClick={onPick}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 transition group"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${th.gradient} flex items-center justify-center text-base flex-shrink-0 shadow-lg`}>
              {th.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate group-hover:text-white">{model.name}</p>
              <p className={`text-[10px] ${PROVIDER_COLORS[model.provider] || "text-gray-500"}`}>{model.provider}</p>
            </div>
            {model.tag && (
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400 uppercase font-semibold flex-shrink-0">{model.tag}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function TopNav({
  tab, setTab, search, setSearch, credits, onPickVideo, onPickImage, onPickTemplate,
}: TopNavProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [searchFocus, setSearchFocus] = useState(false);

  // Close dropdowns on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const videoItems: DropItem[] = ALL_VIDEO.slice(0, 40).map(m => ({
    model: m, onPick: () => { onPickVideo(m.id); setOpen(null); },
  }));
  const imageItems: DropItem[] = IMAGE_MODELS.map(m => ({
    model: m, onPick: () => { onPickImage(m.id); setOpen(null); },
  }));
  const audioItems: DropItem[] = AUDIO_MODELS.map(m => ({
    model: m, onPick: () => { setTab("audio"); setOpen(null); },
  }));

  return (
    <header className="glass-nav sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <button onClick={() => setTab("video")} className="flex items-center gap-2 flex-shrink-0 pr-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-sky flex items-center justify-center shadow-lg shadow-accent/20">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight hidden sm:block">Yas Studio</span>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          <NavMenu id="video" label="Video" icon={Film} active={tab === "video"} onActivate={() => setTab("video")} open={open === "video"} setOpen={setOpen}>
            <div className="px-2 pt-1 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Video models</span>
              <span className="text-[10px] text-gray-600">{ALL_VIDEO.length} total</span>
            </div>
            <ModelList items={videoItems} />
          </NavMenu>

          <NavMenu id="image" label="Image" icon={ImgIcon} active={tab === "image"} onActivate={() => setTab("image")} open={open === "image"} setOpen={setOpen}>
            <div className="px-2 pt-1 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Image models</span>
              <span className="text-[10px] text-gray-600">{IMAGE_MODELS.length} total</span>
            </div>
            <ModelList items={imageItems} />
          </NavMenu>

          <NavMenu id="audio" label="Audio" icon={Music} active={tab === "audio"} onActivate={() => setTab("audio")} open={open === "audio"} setOpen={setOpen}>
            <div className="px-2 pt-1 pb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Audio models</span>
            </div>
            <ModelList items={audioItems} />
          </NavMenu>

          <NavMenu id="workflow" label="Workflow" icon={Workflow} active={tab === "workflow"} onActivate={() => setTab("workflow")} open={false} setOpen={setOpen} />

          <NavMenu id="templates" label="Templates" icon={LayoutGrid} active={tab === "templates"} onActivate={() => setTab("templates")} open={open === "templates"} setOpen={setOpen}>
            <div className="px-2 pt-1 pb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Quick start</span>
            </div>
            <div className="max-h-[360px] overflow-y-auto space-y-0.5 pr-1">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { onPickTemplate(t.id); setOpen(null); }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 transition group"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <LayoutGrid className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate group-hover:text-white">{t.title}</p>
                    <p className="text-[10px] text-gray-500">{t.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </NavMenu>
        </nav>

        {/* Search */}
        <div className="flex-1 flex justify-center px-2">
          <div className={`relative w-full max-w-sm transition-all ${searchFocus ? "scale-[1.02]" : ""}`}>
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Search models…"
              className="w-full pl-9 pr-3 py-2 glass rounded-xl text-[12px] text-gray-200 placeholder-gray-600 outline-none focus:border-accent/40"
            />
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {credits !== null && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[12px] font-medium text-gray-200">{credits.toLocaleString()}</span>
            </div>
          )}
          <button
            onClick={() => setTab("settings")}
            className={`p-2 rounded-xl transition-all ${tab === "settings" ? "bg-accent/15 text-accent-hover" : "text-gray-400 hover:text-gray-100 hover:bg-white/5"}`}
            aria-label="Settings"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
