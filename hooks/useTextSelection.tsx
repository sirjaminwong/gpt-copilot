import { useState, useEffect, useCallback } from 'react'

export const useTextSelection = () => {
  const [selection, setSelection] = useState<{ text: string, rect: DOMRect } | null>(null)

  const clear = useCallback(() => {
    setSelection(null)
  }, [])

  useEffect(() => {
    function selectionFinish () {
      const selection = window.getSelection()
      if (selection) {
        const selectedText = selection.toString()
        if (selectedText.length > 0) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          setSelection({ text: selectedText, rect })
        }
      }
    }

    document.addEventListener('mouseup', selectionFinish)
    document.addEventListener('keyup', selectionFinish)

    return () => {
      document.removeEventListener('mouseup', selectionFinish)
      document.removeEventListener('mouseup', selectionFinish)
    }
  }, [])

  return [selection, clear] as const
}

export default useTextSelection
