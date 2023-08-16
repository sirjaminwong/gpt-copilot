import { useCallback, useEffect, useState } from "react"

import { getSentenceOfSelectedWord } from "~utils/getContext"

export const useTextSelection = () => {
  const [selection, setSelection] = useState<{
    text: string
    sentence: string
    rect: DOMRect
  } | null>(null)

  const clear = useCallback(() => {
    setSelection(null)
  }, [])

  useEffect(() => {
    function selectionFinish() {
      const selection = window.getSelection()
      if (selection) {
        const selectedText = selection.toString()
        const sentence = getSentenceOfSelectedWord(selection) ?? ""
        if (selectedText.length > 0) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          setSelection({ text: selectedText, sentence, rect })
        }
      }
    }

    document.addEventListener("mouseup", selectionFinish)

    return () => {
      document.removeEventListener("mouseup", selectionFinish)
    }
  }, [])

  return [selection, clear] as const
}

export default useTextSelection
