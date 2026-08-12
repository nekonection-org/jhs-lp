import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AdminAccessError,
  authenticateAdminRequest,
} from "@/lib/auth/cloudflare-access";

function deniedResponse(error: AdminAccessError) {
  const message =
    error.status === 401
      ? "管理画面へのアクセスには認証が必要です。"
      : error.status === 403
        ? "この管理画面を利用する権限がありません。"
        : "管理画面の認証を現在確認できません。";

  return new NextResponse(message, {
    status: error.status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function proxy(request: NextRequest) {
  try {
    await authenticateAdminRequest(request.headers);
    return NextResponse.next();
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return deniedResponse(error);
    }

    return deniedResponse(new AdminAccessError("unavailable"));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
