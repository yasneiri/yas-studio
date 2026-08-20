import { NextRequest, NextResponse } from "next/server";
const KIE = "https://api.kie.ai";
export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (!key) return NextResponse.json({ error: "API key required" }, { status: 401 });
  const { type, model, input, prompt, aspect_ratio } = await req.json();
  try {
    const isVeo = type === "veo" || model?.startsWith("veo");
    const url = isVeo ? `${KIE}/api/v1/veo/generate` : `${KIE}/api/v1/jobs/createTask`;
    const body = isVeo
      ? { prompt: prompt || input?.prompt, model, aspect_ratio: aspect_ratio || "16:9", generationType: "TEXT_2_VIDEO" }
      : { model, input };
    const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    const taskId = data.data?.taskId || data.data?.task_id || data.taskId;
    if (!taskId) return NextResponse.json({ error: data.msg || "Failed" }, { status: 400 });
    return NextResponse.json({ taskId });
  } catch (e: unknown) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 }); }
}
