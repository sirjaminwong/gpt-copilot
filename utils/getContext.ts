export function getSentenceOfSelectedWord(
  selection: Selection
): string | undefined {
  if (!selection || !selection.rangeCount) return undefined

  const range = selection.getRangeAt(0)
  const selectedText = range.toString().trim()

  if (selectedText.split(" ").length > 1) return undefined

  const textContent = range.startContainer.parentNode?.textContent

  if (!textContent) return undefined

  const sentences = textContent.split(".")
  const index = sentences.findIndex((sentence) =>
    sentence.includes(selectedText)
  )

  if (index === -1) return undefined

  const fullSentence = sentences[index].trim()
  return fullSentence
}
