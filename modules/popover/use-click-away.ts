import React, { useEffect } from "react"

type ClickAwayHandler = (event: MouseEvent) => void

export const useClickAway = (
  ref: React.RefObject<HTMLElement>,
  onClickAway: ClickAwayHandler
) => {
  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway(event)
      }
    }
    document.addEventListener("click", handleClickAway)
    return () => {
      document.removeEventListener("click", handleClickAway)
    }
  }, [ref, onClickAway])
}

export const useClickAwayV2 = (
  ref: React.RefObject<HTMLElement>,
  onClickAway: ClickAwayHandler
) => {
  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const clickedX = event.clientX
        const clickedY = event.clientY
        if (
          clickedX < rect.left ||
          clickedX > rect.right ||
          clickedY < rect.top ||
          clickedY > rect.bottom
        ) {
          onClickAway(event)
        }
      }
    }
    document.addEventListener("click", handleClickAway)
    return () => {
      document.removeEventListener("click", handleClickAway)
    }
  }, [ref, onClickAway])
}
