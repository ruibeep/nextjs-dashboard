import { NextResponse } from 'next/server';
import { postTweet } from '@/app/lib/xClientOAuth1';

export async function POST(req: Request) {
  try {
    const { text } = (await req.json()) as { text: string };
    const response = await postTweet(text);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}