import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
    { status: 200 }
  );
}
