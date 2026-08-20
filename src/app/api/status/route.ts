import { NextRequest, NextResponse } from "next/server";
const KIE = "https://api.kie.ai";

// Extract result URLs from the various shapes kie.ai returns.
function extractUrls(t: Record<string, unknown>): string[] {
  const out: string[] = [];
  const rj = t.resultJson;
  if (typeof rj === "string" && rj.trim()) {
    try {
      const p = JSON.parse(rj);
      if (Array.isArray(p.resultUrls)) out.push(...p.resultUrls);
      if (p.video_url) out.push(p.video_url);
      if (p.image_url) out.push(p.image_url);
      if (Array.isArray(p.videos)) out.push(...p.videos.map((v: { url?: string }) => v?.url).filter(Boolean));
      if (Array.isArray(p.images)) out.push(...p.images.map((v: { url?: string }) => v?.url).filter(Boolean));
    } catch { /* ignore malformed json */ }
  }
  if (Array.isArray(t.resultUrls)) out.push(...(t.resultUrls as string[]));
  if (typeof t.videoUrl === "string") out.push(t.videoUrl);
  if (typeof t.resultUrl === "string") out.push(t.resultUrl);
  return [...new Set(out.filter(Boolean))];
}

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!key || !taskId) return NextResponse.json({ error: "Missing params" }, { status: 400 });
  const headers = { Authorization: `Bearer ${key}` };
  try {
    // Market task first
    const res = await fetch(`${KIE}/api/v1/jobs/recordInfo?taskId=${taskId}`, { headers });
    const j = await res.json();
    const t = j?.data;
    if (t && (t.state || t.status)) {
      return NextResponse.json({
        state: t.state || t.status,
        progress: t.progress || 0,
        resultUrls: extractUrls(t),
        failMsg: t.failMsg || t.failCode || "",
        credits: t.creditsConsumed,
      });
    }
    // Fallback: Veo task
    const v = await fetch(`${KIE}/api/v1/veo/record-info?taskId=${taskId}`, { headers });
    const vj = await v.json();
    const vt = vj?.data;
    if (vt) {
      const info = vt.response || vt;
      const urls: string[] = info.resultUrls || (info.videoUrl ? [info.videoUrl] : []);
      // Veo successFlag: 0=generating, 1=success, 2/3=fail
      const flag = vt.successFlag;
      const state = flag === 1 ? "success" : (flag === 2 || flag === 3) ? "fail" : (vt.state || vt.status || "generating");
      return NextResponse.json({ state, progress: vt.progress || 0, resultUrls: urls, failMsg: vt.errorMessage || vt.failMsg || "" });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
