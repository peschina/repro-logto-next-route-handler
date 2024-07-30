import { NextResponse } from "next/server";
import { getAccessToken } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";

export async function GET() {
  try {
    const token = await getAccessToken(logtoConfig, logtoConfig.resources?.[0]);

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.error();
  }
}
