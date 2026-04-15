import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    if (password?.toLowerCase() === "roatan") {
      const res = NextResponse.json({ success: true });
      res.cookies.set("roatan_access", "granted", {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        httpOnly: false,
        sameSite: "lax",
      });
      return res;
    }
    
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
