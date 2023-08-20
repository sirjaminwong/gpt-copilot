import { Icon } from "@iconify/react"
import { useRequest } from "ahooks"
import classNames from "classnames"
import React, { useCallback, useRef } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import type { WordBaseInfo } from "~types/translate"

import * as style from "../../popover.module.less"
import { useClickAwayV2 } from "../../use-click-away"
import { StyledContent } from "./styled"

const phoneticConfig = [
  { type: "uk", lang: "en-GB" },
  { type: "us", lang: "en-US" }
] as const

interface WordSummaryProps {
  word: string
  onClose: () => void
  position: {
    top: React.CSSProperties["top"]
    left: React.CSSProperties["top"]
  }
}

export const WordSummary = ({ word, position, onClose }: WordSummaryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [favorites, setFavorites] = useStorage<string[]>("favorites", [])

  const { data, loading } = useRequest(async (): Promise<WordBaseInfo> => {
    const result = await sendToBackground({
      name: "youdao",
      body: {
        text: word
      }
    })
    return result
  })

  useClickAwayV2(containerRef, onClose)

  const handleSpeech = useCallback((text: string, lang = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    speechSynthesis.speak(utterance)
  }, [])

  const handleToggleFavorites = useCallback(() => {
    if (favorites.includes(word)) {
      setFavorites(favorites.filter((i) => i !== word))
    } else {
      setFavorites([...favorites, word])
    }
  }, [favorites, setFavorites, word])

  const renderContent = () => {
    if (loading) return "loading..."
    if (!data) return null
    return (
      <StyledContent>
        <div style={{ display: "flex", gap: "20px" }}>
          {phoneticConfig.map((i) => (
            <div className="flex items-center" key={i.type}>
              <Icon
                className="mr-1 cursor-pointer"
                icon="akar-icons:sound-on"
                onClick={() => handleSpeech(word, i.lang)}
              />
              {phoneticConfig.length > 1 && i.type}/{data.phonetic[i.type]}/
            </div>
          ))}
        </div>
        <div>
          {data.trs.map((i) => (
            <div key={i.partOfSpeech}>
              {i.partOfSpeech}: {i.explain}
            </div>
          ))}
        </div>
        <div className={style.tense}>
          {data.forms.map((i) => (
            <div key={i.name}>
              {i.name}: {i.value}
            </div>
          ))}
        </div>
        <div>
          {data.exampleSentences.map((i) => (
            <div key={i.sentence}>
              <div className="flex items-baseline">
                <Icon
                  className="mr-1 cursor-pointer"
                  icon="akar-icons:sound-on"
                  onClick={() => handleSpeech(i.sentence)}
                />
                {i.sentence}
              </div>
              <div>{i.translation}</div>
            </div>
          ))}
        </div>
      </StyledContent>
    )
  }

  const isFavorite = favorites.includes(word)

  return (
    <div
      ref={containerRef}
      className={style.panel}
      style={{
        ...position
      }}>
      <div className="flex justify-between items-center bg-indigo-500 p-2">
        <div className="text-lg text-gray-100">{word}</div>
        <div>
          <Icon
            className={`cursor-pointer text-lg ${classNames({
              "text-amber-500": isFavorite,
              "text-gray-100": !isFavorite
            })}`}
            onClick={handleToggleFavorites}
            icon={
              isFavorite ? "ant-design:star-filled" : "ant-design:star-outlined"
            }
          />
        </div>
      </div>
      {renderContent()}
    </div>
  )
}
