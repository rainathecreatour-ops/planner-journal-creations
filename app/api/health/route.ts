 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app/api/health/route.ts b/app/api/health/route.ts
new file mode 100644
index 0000000000000000000000000000000000000000..7d0c63e3cc6d9e5c621b020e53a324dfcc3ad444
--- /dev/null
+++ b/app/api/health/route.ts
@@ -0,0 +1,7 @@
+import { NextResponse } from 'next/server';
+
+export const runtime = 'nodejs';
+
+export async function GET() {
+  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
+}
 
EOF
)
