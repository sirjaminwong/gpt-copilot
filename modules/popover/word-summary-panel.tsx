import {
  PhoneOutlined,
  StarOutlined
} from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import React, { useCallback, useRef } from 'react'

import { sendToBackground } from '@plasmohq/messaging'
import { useStorage } from '@plasmohq/storage/hook'

import type { WordBaseInfo } from '~types/translate'

import * as style from './popover.module.less'
import { useClickAwayV2 } from './use-click-away'

const phoneticConfig = [
  { type: 'uk', lang: 'en-GB' },
  { type: 'us', lang: 'en-US' }
] as const

const StyledHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`

const StyledHeader = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0 10px;
  height: 30px;
  width: 100%;
  background-color: green;
  align-items: center;
  justify-content: space-between;
`

const StyledStarOutlined = styled(StarOutlined)<{ isFavorite }>`
  color: ${(props) => (props.isFavorite ? 'red' : 'white')};
  font-size: 16px;
`

const StyledContent = styled.div`
  padding: 10px;
  max-height: 300px;
  overflow: auto;
`

interface WordSummaryProps {
  word: string
  onClose: () => void
  position: {
    top: React.CSSProperties['top']
    left: React.CSSProperties['top']
  }
}

export const WordSummary = ({ word, position, onClose }: WordSummaryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [favorites, setFavorites] = useStorage<string[]>('favorites', [])

  const { data, loading } = useRequest(
    async (): Promise<WordBaseInfo> => {
      const result = await sendToBackground({
        name: 'youdao',
        body: {
          text: word
        }
      })
      return result
    }
  )

  useClickAwayV2(containerRef, onClose)

  const handleSpeech = useCallback((text: string, lang = 'en-US') => {
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
    if (loading) return 'loading...'
    if (!data) return null
    return (
      <StyledContent>
        <div style={{ display: 'flex', gap: '20px' }}>
          {phoneticConfig.map((i) => (
            <div key={i.type}>
              {phoneticConfig.length > 1 && i.type}/{data.phonetic[i.type]}/
              <PhoneOutlined onClick={() => handleSpeech(word, i.lang)} />
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
              <div>
                <PhoneOutlined onClick={() => handleSpeech(i.sentence)} />
                {i.sentence}
              </div>
              <div>{i.translation}</div>
            </div>
          ))}
        </div>
      </StyledContent>
    )
  }

  return (
    <div
      ref={containerRef}
      className={style.panel}
      style={{
        ...position
      }}>
      <StyledHeader>
        <StyledHeaderLeft>
          <div>
            {word}
          </div>
        </StyledHeaderLeft>
        <div>
          <StyledStarOutlined
            isFavorite={word && favorites.includes(word)}
            onClick={handleToggleFavorites}
          />
        </div>
      </StyledHeader>
      {renderContent()}
    </div>
  )
}
