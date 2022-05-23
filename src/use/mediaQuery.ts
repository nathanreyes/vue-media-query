import { ref, watch } from 'vue';
import { MediaQueryCallback, MediaQueryOptions } from 'types';

export const isClient = typeof window !== 'undefined';
export const defaultWindow = isClient ? window : undefined;

export function useMediaQuery(
  query: string, // "(min-width: 300px)",
  callback: MediaQueryCallback,
  options: MediaQueryOptions = {}
) {
  const { window = defaultWindow } = options;
  let mediaQuery: MediaQueryList | undefined;
  const isSupported = window && 'matchMedia' in window;
  const matches = ref(false);

  const _callback = (ev: MediaQueryListEvent) => {
    if (callback) callback(ev);
    matches.value = ev.matches;
  };

  const cleanup = () => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', _callback);
      mediaQuery = undefined;
    }
  };

  cleanup();
  if (isSupported && query) {
    mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', _callback);
    matches.value = mediaQuery.matches;
  }

  watch(
    () => matches.value,
    (val) => {
      if (val === undefined) cleanup();
    }
  );

  return matches;
}
