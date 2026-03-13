import { NextRequest, NextResponse } from 'next/server';

// Nodemeld GitHub OAuth — server-side code exchange
// Uses NODEMELD_GH_CLIENT_ID + NODEMELD_GH_CLIENT_SECRET env vars
// Set in Vercel → Project → Settings → Environment Variables

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(new URL('/?auth_error=no_code', req.url));
  }

  const clientId = process.env.NODEMELD_GH_CLIENT_ID;
  const clientSecret = process.env.NODEMELD_GH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?auth_error=not_configured', req.url));
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/?auth_error=token_failed', req.url));
    }

    // Get GitHub user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'NodeMeld/1.0' },
    });
    const user = await userRes.json();
    const username = user.login || '';

    // Build redirect back to main page with token + state (claim slug)
    const base = new URL('/', req.url);
    base.searchParams.set('github_token', accessToken);
    base.searchParams.set('github_user', username);
    if (state) {
      // state encodes: claim_slug=SLUG or other context
      try {
        const decoded = decodeURIComponent(state);
        decoded.split('&').forEach(pair => {
          const [k, v] = pair.split('=');
          if (k && v) base.searchParams.set(k, v);
        });
      } catch {}
    }
    return NextResponse.redirect(base);
  } catch (e) {
    return NextResponse.redirect(new URL('/?auth_error=server_error', req.url));
  }
}
