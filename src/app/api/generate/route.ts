import { NextRequest, NextResponse } from "next/server";
const KIE = "https://api.kie.ai";

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (!key) return NextResponse.json({ error: "API key required" }, { status: 401 });

  const { type, model, input, prompt, aspect_ratio } = await req.json();
  if (!model) return NextResponse.json({ error: "Model required" }, { status: 400 });

  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const isVeo = type === "veo" || String(model).startsWith("veo");

  try {
    let res: Response;
    if (isVeo) {
      // Veo uses its own endpoint and a flat body.
      res = await fetch(`${KIE}/api/v1/veo/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt: prompt || input?.prompt,
          model,
          aspect_ratio: aspect_ratio || input?.aspect_ratio || "16:9",
          generationType: "TEXT_2_VIDEO",
        }),
      });
    } else {
      // All market models share createTask { model, input }.
      res = await fetch(`${KIE}/api/v1/jobs/createTask`, {
        method: "POST",
        headers,
        body: JSON.stringify({ model, input }),
      });
    }

    const data = await res.json();

    // kie.ai returns code 200 on success; anything else carries an error msg.
    if (data.code && data.code !== 200) {
      return NextResponse.json({ error: data.msg || `kie.ai error ${data.code}` }, { status: 400 });
    }

    const taskId = data.data?.taskId || data.data?.task_id || data.taskId;
    if (!taskId) {
      return NextResponse.json({ error: data.msg || "No task ID returned", raw: data }, { status: 400 });
    }
    return NextResponse.json({ taskId });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
