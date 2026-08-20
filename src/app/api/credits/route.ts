import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (!key) return NextResponse.json({ credits: null });
  try {
    const res = await fetch("https://api.kie.ai/api/v1/user/credits", { headers: { Authorization: `Bearer ${key}` } });
    const data = await res.json();
    return NextResponse.json({ credits: data.data?.credits ?? data.credits ?? null });
  } catch { return NextResponse.json({ credits: null }); }
}
