"use client";

import { useState } from "react";
import { buttonClasses } from "@/components/ui/button";

/** Nothing is requested from Google until the visitor asks for the map. */
export function MapFacade({ embedUrl, title }: { embedUrl: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] bg-forest-900">
      {loaded ? (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="max-w-[34ch] text-sm">Viewing the map loads content from Google.</p>
          <button type="button" className={buttonClasses("line")} onClick={() => setLoaded(true)}>
            Show the map
          </button>
        </div>
      )}
    </div>
  );
}
