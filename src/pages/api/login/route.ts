import { NextResponse } from 'next/server';

export async function POST(req:Request) {
  const body = await req.json();
  const { email, password } = body;

  if (email === 'admin@test.com' && password === 'admin@test.com') {
    
    return NextResponse.json({ token: 'fake-jwt-token' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}