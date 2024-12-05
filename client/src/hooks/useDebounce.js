import { useRef } from "react"

export function useDebounce(originalFunction) {
  const currentTimer = useRef();

  const fn = () => {
    clearTimeout(currentTimer.current);
    currentTimer.current = setTimeout(originalFunction, 400)
  }

  return fn;
}