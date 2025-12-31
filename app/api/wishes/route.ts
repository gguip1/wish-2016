import { NextRequest, NextResponse } from 'next/server';
import { getWishes, createWish } from '@/lib/db';

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// GET: 최신 소원 50개 조회
export async function GET() {
  try {
    const wishes = getWishes(50);
    return NextResponse.json({ wishes });
  } catch (error) {
    console.error('Failed to get wishes:', error);
    return NextResponse.json(
      { error: 'Failed to get wishes' },
      { status: 500 }
    );
  }
}

// POST: 새 소원 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    // 유효성 검사
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '소원을 입력해주세요' },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { error: '소원을 입력해주세요' },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 100) {
      return NextResponse.json(
        { error: '소원은 100자 이내로 작성해주세요' },
        { status: 400 }
      );
    }

    // XSS 방지
    const safeContent = escapeHtml(trimmedContent);

    const wish = createWish(safeContent);

    return NextResponse.json({ success: true, wish });
  } catch (error) {
    console.error('Failed to create wish:', error);
    return NextResponse.json(
      { error: 'Failed to create wish' },
      { status: 500 }
    );
  }
}
