import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const path = searchParams.get('path');
  const secret = searchParams.get('secret');

  const expectedSecret = process.env.REVALIDATION_SECRET || 'hk_fabric_revalidation_secret_2026';

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401, headers: corsHeaders });
  }

  try {
    if (tag) {
      revalidateTag(tag);
    }
    if (path) {
      revalidatePath(path);
    }
    // Revalidate storefront homepage and shop catalog by default
    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json({
      revalidated: true,
      tag,
      path,
      now: Date.now(),
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
