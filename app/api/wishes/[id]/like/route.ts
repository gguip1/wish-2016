import { NextRequest, NextResponse } from 'next/server';
import { likeWish } from '@/lib/db';

// POST: 좋아요 추가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wishId = parseInt(id, 10);

    if (isNaN(wishId)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID입니다' },
        { status: 400 }
      );
    }

    const wish = likeWish(wishId);

    if (!wish) {
      return NextResponse.json(
        { error: '소원을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, wish });
  } catch (error) {
    console.error('Failed to like wish:', error);
    return NextResponse.json(
      { error: '좋아요 추가에 실패했습니다' },
      { status: 500 }
    );
  }
}
