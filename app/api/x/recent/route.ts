// app/api/x/recent/route.ts
import { NextResponse } from 'next/server';
import { fetchFromX } from '@/app/lib/xClient';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || 'public domain books';

  try {
    const data = await fetchFromX('/tweets/search/recent', { query });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
        {
          error: error.message || 'An unknown error occurred',
          stack: error.stack || 'No stack available'
        }, 
        { status: 500 }
      ); 
}
}