// src/app/api/auth/route.ts
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { firebaseAdminConfig } from '@/lib/firebase-server-config';
import { NextRequest, NextResponse } from 'next/server';

let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: {
      projectId: firebaseAdminConfig.projectId,
      clientEmail: firebaseAdminConfig.clientEmail,
      privateKey: firebaseAdminConfig.privateKey,
    },
  });
} else {
  adminApp = getApps()[0];
}

const adminAuth = getAuth(adminApp);

// This function handles creating a session cookie when a user logs in.
export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };
    
    cookies().set(options);

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}

// This function handles clearing the session cookie when a user logs out.
export async function DELETE() {
  const sessionCookieName = 'session';
  const sessionCookie = cookies().get(sessionCookieName)?.value;

  if (sessionCookie) {
    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
        await adminAuth.revokeRefreshTokens(decodedClaims.sub);
    } catch (error) {
        // Session cookie is invalid or expired.
        // No need to do anything, just clear the cookie.
    }
  }

  cookies().delete(sessionCookieName);

  return NextResponse.json({ status: 'success' }, { status: 200 });
}
