import { prisma } from "@/app/lib/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const signedToken = searchParams.get("signed-token");

    const user = await prisma.user.findFirst({
      where: {
        signedToken,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Not exist token.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { account, email, signedToken } = body;

    const user = await prisma.user.upsert({
      where: { account },
      update: {
        signedToken,
      },
      create: {
        account,
        email,
        signedToken,
      },
      select: {
        account: true,
        email: true,
        nickname: true,
        signedToken: true,
      },
    });

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error(error);
  }
};