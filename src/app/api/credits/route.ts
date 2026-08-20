import { NextRequest, NextResponse } from "next/server";
const KIE = "https://api.kie.ai";

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (!key) return NextResponse.json({ credits: null });
  try {
    // Correct kie.ai endpoint: /api/v1/chat/credit
    const res = await fetch(`${KIE}/api/v1/chat/credit`, { headers: { Authorization: `Bearer ${key}` } });
    const data = await res.json();
    // data.data is the numeric balance; fall back to nested shapes just in case.
    const credits =
      typeof data.data === "number" ? data.data :
      data.data?.credits ?? data.credits ?? null;
    return NextResponse.json({ credits });
  } catch {
    return NextResponse.json({ credits: null });
  }
}
