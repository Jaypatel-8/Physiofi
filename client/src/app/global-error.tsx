'use client'

/**
 * Root error boundary – catches errors in root layout.
 * Must define its own <html> and <body> (replaces root layout when triggered).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          background: 'linear-gradient(to bottom right, #f0fdfa, #f8fafc)',
        }}>
          <div style={{
            maxWidth: 400,
            width: '100%',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ color: '#666', marginBottom: 24 }}>
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                display: 'block',
                marginTop: 12,
                color: '#64748b',
                fontSize: 14,
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
