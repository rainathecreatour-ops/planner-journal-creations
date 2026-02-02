 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app/api/access/route.ts b/app/api/access/route.ts
new file mode 100644
index 0000000000000000000000000000000000000000..ef1ba7e2b4bc23b53f3fc057fee3106309d3200b
--- /dev/null
+++ b/app/api/access/route.ts
@@ -0,0 +1,32 @@
+import { NextResponse } from 'next/server';
+import { validateAccessCode } from '@/lib/accessCodes';
+import { createAccessToken, setAccessCookie } from '@/lib/auth';
+import { rateLimit } from '@/lib/rateLimit';
+
+export const runtime = 'nodejs';
+
+export async function POST(request: Request) {
+  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
+  const rate = rateLimit(ip, { windowMs: 60_000, max: 5 });
+  if (!rate.allowed) {
+    return NextResponse.json(
+      { error: 'Too many attempts. Please wait a minute and try again.' },
+      { status: 429 }
+    );
+  }
+
+  const body = (await request.json()) as { code?: string };
+  if (!body.code) {
+    return NextResponse.json({ error: 'Access code is required.' }, { status: 400 });
+  }
+
+  const result = validateAccessCode(body.code);
+  if (!result.valid) {
+    return NextResponse.json({ error: result.reason }, { status: 401 });
+  }
+
+  const token = createAccessToken(body.code);
+  setAccessCookie(token);
+
+  return NextResponse.json({ ok: true });
+}
 
EOF
)
