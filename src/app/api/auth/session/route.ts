import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import admin from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const idToken = authorization.split("Bearer ")[1];
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });
    const options = {
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };

    const response = NextResponse.json({ status: "success" });
    response.cookies.set(options);
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: "success" });
  response.cookies.set({ name: "session", value: "", maxAge: 0 });
  return response;
}
