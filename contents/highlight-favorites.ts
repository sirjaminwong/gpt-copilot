import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const highlightedWordsClassName = "gpt-copilot-highlighted-word"

const getTextNode = (node: Node) => {
  if (
    node.nodeName === "SCRIPT" ||
    node.nodeName === "STYLE" ||
    node.nodeName === "TEXTAREA"
  ) {
    return []
  }
  if (node.nodeType === 3) {
    return [node]
  }
  const result: Node[] = []
  node.childNodes.forEach((child) => {
    result.push(...getTextNode(child))
  })
  return result
}
const splitSentenceByKeywords = (sentence, keywords) => {
  // 为保证英文按单词分词，需要在关键词两边加上\b
  const keywordsRegex = new RegExp(
    `(${keywords.map((i) => `\\b${i}\\b`).join("|")})`,
    "gi"
  )

  const parts = sentence.split(keywordsRegex)

  return parts
}

function addHighlightStyle() {
  const style = document.createElement("style")
  style.textContent = `
    :root {
      --gpt-copilot-highlight: 255, 167, 196;
    }
    .${highlightedWordsClassName} {
      text-decoration: dashed underline rgba(var(--gpt-copilot-highlight));
      text-underline-position: under;
      text-decoration-thickness: 1px;
      cursor: pointer;
    }
    .${highlightedWordsClassName}:hover {
      background-color: rgba(var(--gpt-copilot-highlight), 0.2);
    }
  `
  document.head.appendChild(style)
}

function highlight(node: Node, keywords: string[]) {
  if (keywords.length === 0) return
  const allTextNodes = getTextNode(node)

  allTextNodes.forEach((node) => {
    const sentence = node.textContent

    const words = splitSentenceByKeywords(sentence, keywords)

    const highlightedWords = words.map((word) => {
      if (keywords.includes(word)) {
        const span = document.createElement("span")
        span.className = highlightedWordsClassName
        span.textContent = word
        return span
      } else {
        return document.createTextNode(word)
      }
    })

    const fragment = document.createDocumentFragment()

    highlightedWords.forEach((word) => {
      fragment.appendChild(word)
    })

    node?.parentNode?.replaceChild(fragment, node)
  })
}

window.addEventListener("load", async () => {
  addHighlightStyle()
  const keywords: string[] = (await storage.get("favorites")) || []
  console.log(keywords)
  highlight(document.body, keywords)
})

const config = {
  matches: ["http://*/*", "https://*/*", "<all_urls>"]
}

export { config }
