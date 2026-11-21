import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";

export const LOOKS = ["mix", "playful", "swiss", "soft"] as const;
export type Look = (typeof LOOKS)[number];
export type SingleLook = Exclude<Look, "mix">;

const PARAM = "look";
const STORAGE_KEY = "bauhaus-react:look";

function isLook(value: string | null): value is Look {
  return value !== null && (LOOKS as readonly string[]).includes(value);
}

/** Precedence: URL > storage > "mix". Invalid values and throwing storage fall through. */
export function resolveInitialLook(search: string, storage: Pick<Storage, "getItem"> | null): Look {
  const fromUrl = new URLSearchParams(search).get(PARAM);
  if (isLook(fromUrl)) return fromUrl;
  try {
    const stored = storage?.getItem(STORAGE_KEY) ?? null;
    if (isLook(stored)) return stored;
  } catch {
    // Blocked storage: fall through to the default.
  }
  return "mix";
}

function safeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

type LookValue = { look: Look; setLook: (next: Look) => void };

const LookContext = createContext<LookValue | null>(null);

/** Holds the selected look; mirrors it to `?look=` and localStorage. Needs router context. */
export function LookProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const [look, setLookState] = useState<Look>(() =>
    resolveInitialLook(`?${params.toString()}`, safeStorage()),
  );

  const setLook = useCallback(
    (next: Look) => {
      setLookState(next);
      try {
        safeStorage()?.setItem(STORAGE_KEY, next);
      } catch {
        // Blocked storage: the look still works for this session.
      }
      setParams(
        (prev) => {
          const copy = new URLSearchParams(prev);
          if (next === "mix") copy.delete(PARAM);
          else copy.set(PARAM, next);
          return copy;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const value = useMemo(() => ({ look, setLook }), [look, setLook]);
  return <LookContext.Provider value={value}>{children}</LookContext.Provider>;
}

export function useLook(): LookValue {
  const ctx = useContext(LookContext);
  if (!ctx) throw new Error("useLook must be used inside <LookProvider>");
  return ctx;
}
