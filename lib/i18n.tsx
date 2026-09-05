"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { dict, type Dict, type Lang } from "@/data/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "lang";

/**
 * A tiny external store over localStorage, read through `useSyncExternalStore`
 * rather than `useState` + `useEffect` — the same trade `useMediaQuery` in
 * lib/media.ts makes, and for the same reason. `getServerSnapshot` always
 * returns "en", matching the prerendered static HTML (always English), so
 * hydration never has to reconcile a client render against a different
 * server one. A plain `useState(getInitialLang)` looks tempting here too —
 * read localStorage in the initializer, land on the right language in one
 * render — but that initializer runs during the hydration render as well: a
 * returning Turkish visitor's first client render came out Turkish while the
 * server HTML was English, so hydration diffed "anasayfa" against "home" and
 * React discarded the whole tree. `useSyncExternalStore` swaps in the saved
 * language right after hydration finishes, inside React's own internals —
 * not a `setState` call in a user effect body — so there is neither a
 * mismatch nor a lint violation.
 */
const listeners = new Set<() => void>();

function readLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "tr" ? saved : "en";
  } catch {
    return "en";
  }
}

function getServerSnapshot(): Lang {
  return "en";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function writeLang(l: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, l);
  } catch {
    /* ignore storage failures (private mode, etc.) */
  }
  // localStorage only fires a native "storage" event in OTHER tabs, so the
  // tab that made the change has to tell its own subscribers by hand.
  listeners.forEach((notify) => notify());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: writeLang, t: dict[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
