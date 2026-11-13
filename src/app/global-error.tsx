"use client";

// Replaces the root layout when it fails, so it stays free of dependencies.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeContent: "center",
          gap: "1.5rem",
          padding: "2rem",
          background: "#0f231b",
          color: "#f4eee1",
          fontFamily: "Georgia, serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontWeight: 400, margin: 0 }}>Something went wrong</h1>
        <p style={{ margin: 0 }}>Please try again in a moment.</p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            justifySelf: "center",
            minHeight: "44px",
            padding: "0 1.5rem",
            border: 0,
            background: "#d4b981",
            color: "#0a1712",
            font: "inherit",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
