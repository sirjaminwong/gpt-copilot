import { Storage } from '@plasmohq/storage'

const storage = new Storage()

const getTextNode = (node: Node) => {
  if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'TEXTAREA') {
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
  const keywordsRegex = new RegExp(`(${keywords.map(i => `\\b${i}\\b`).join('|')})`, 'gi')

  const parts = sentence.split(keywordsRegex)

  return parts
}

function highlight (node: Node, keywords: string[]) {
  if (keywords.length === 0) return
  const allTextNodes = getTextNode(node)

  allTextNodes.forEach((node) => {
    const sentence = node.textContent

    const words = splitSentenceByKeywords(sentence, keywords)

    const highlightedWords = words.map((word) => {
      if (keywords.includes(word)) {
        const span = document.createElement('span')
        span.style.backgroundColor = 'yellow'
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

window.addEventListener('load', async () => {
  const keywords: string[] = await storage.get('favorites') || []
  console.log(keywords)
  highlight(document.body, keywords)
})

const config = {
  matches: ['http://*/*', 'https://*/*', '<all_urls>']
}

export {
  config
}
