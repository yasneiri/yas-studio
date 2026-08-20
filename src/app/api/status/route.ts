import { NextRequest, NextResponse } from "next/server";
const KIE = "https://api.kie.ai";
export async function GET(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!key || !taskId) return NextResponse.json({ error: "Missing params" }, { status: 400 });
  try {
    const res = await fetch(`${KIE}/api/v1/jobs/recordInfo?taskId=${taskId}`, { headers: { Authorization: `Bearer ${key}` } });
    const { data: t } = await res.json();
    if (!t) {
      const v = await fetch(`${KIE}/api/v1/veo/record-info?taskId=${taskId}`, { headers: { Authorization: `Bearer ${key}` } });
      const { data: vt } = await v.json();
      if (!vt) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ state: vt.state || vt.status, progress: vt.progress || 0, resultUrls: vt.videoUrl ? [vt.videoUrl] : [], failMsg: vt.failMsg });
    }
    let urls: string[] = [];
    if (t.resultJson) { try { const p = JSON.parse(t.resultJson); urls = p.resultUrls || (p.video_url ? [p.video_url] : p.image_url ? [p.image_url] : []); } catch {} }
    return NextResponse.json({ state: t.state, progress: t.progress || 0, resultUrls: urls, failMsg: t.failMsg, credits: t.creditsConsumed });
  } catch (e: unknown) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 }); }
}
