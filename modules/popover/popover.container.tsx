import {
  LeftOutlined,
  PhoneOutlined,
  RightOutlined,
  StarOutlined
} from '@ant-design/icons'
import styled from '@emotion/styled'
import { useKeyPress, useRequest } from 'ahooks'
import { Input } from 'antd'
import styleText from 'data-text:./popover.module.less'
import { useCallback, useEffect, useState } from 'react'

import { sendToBackground } from '@plasmohq/messaging'
import { useStorage } from '@plasmohq/storage/hook'

import useTextSelection from '~hooks/useTextSelection'
import type { WordBaseInfo } from '~types/translate'

import * as style from './popover.module.less'

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

function PopoverContainer () {
  const [mode, setMode] = useState<'icon' | 'panel'>('icon')

  const [inputValue, setInputValue] = useState<string | undefined>()

  const [favorites, setFavorites] = useStorage<string[]>('favorites', [])

  const [isOpen, setIsOpen] = useState(false)
  const [textSelection, clearSelection] = useTextSelection()

  const { data, loading, run } = useRequest(
    async ({
      text,
      sentence
    }: {
      text: string
      sentence?: string
    }): Promise<WordBaseInfo> => {
      const result = await sendToBackground({
        name: 'youdao',
        body: {
          text,
          sentence
        }
      })
      return result
    },
    { manual: true }
  )

  useEffect(() => {
    if (textSelection) {
      setIsOpen(true)
      setMode('icon')
    }
  }, [textSelection])

  useEffect(() => {
    setInputValue(textSelection?.text)
  }, [textSelection?.text])

  const handleClosePanel = useCallback(() => {
    setIsOpen(false)
    clearSelection()
    setMode('icon')
  }, [clearSelection])

  useKeyPress('esc', () => {
    handleClosePanel()
  })

  const handleClickIcon = useCallback(() => {
    if (!textSelection) return
    setMode('panel')
    run({ text: textSelection.text, sentence: textSelection.sentence })
  }, [run, textSelection])

  const handleSearch = useCallback(() => {
    if (!inputValue) return
    run({ text: inputValue })
  }, [inputValue, run])

  const handleSpeech = useCallback((text: string, lang = 'en-US') => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    speechSynthesis.speak(utterance)
  }, [])

  const handleToggleFavorites = useCallback(() => {
    if (!textSelection) return
    if (favorites.includes(textSelection?.text)) {
      setFavorites(favorites.filter((i) => i !== textSelection?.text))
    } else {
      setFavorites([...favorites, textSelection?.text])
    }
  }, [favorites, setFavorites, textSelection])

  if (!isOpen || !textSelection) {
    return null
  }

  const position = {
    top: `${textSelection.rect.top + 30}px`,
    left: `${textSelection.rect.left}px`
  }

  const renderPanel = () => {
    if (loading) {
      return 'loading......'
    }
    if (data) {
      return (
        <>
          <StyledHeader>
            <StyledHeaderLeft>
              <div>
                <LeftOutlined />
                <RightOutlined />
              </div>
              <Input.Search
                value={inputValue}
                onSearch={handleSearch}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </StyledHeaderLeft>
            <div>
              <StyledStarOutlined
                isFavorite={
                  textSelection?.text && favorites.includes(textSelection.text)
                }
                onClick={handleToggleFavorites}
              />
            </div>
          </StyledHeader>
          <StyledContent>
            <div style={{ display: 'flex', gap: '20px' }}>
              {phoneticConfig.map((i) => (
                <div key={i.type}>
                  {phoneticConfig.length > 1 && i.type}/
                  {data.phonetic[i.type]}/
                  <PhoneOutlined onClick={() => handleSpeech(textSelection.text, i.lang)} />
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
            <p className={style.tense}>
              {data.forms.map((i) => (
                <div key={i.name}>
                  {i.name}: {i.value}
                </div>
              ))}
            </p>
            <p>
              {data.exampleSentences.map((i) => (
                <div key={i.sentence}>
                  <div>
                    <PhoneOutlined onClick={() => handleSpeech(i.sentence)} />
                    {i.sentence}
                  </div>
                  <div>{i.translation}</div>
                </div>
              ))}
            </p>
          </StyledContent>
        </>
      )
    }
  }

  return mode === 'icon'
    ? (
    <div
      className={style.pin}
      onClick={handleClickIcon}
      style={{
        ...position
      }}
    />
      )
    : (
    <div
      className={style.panel}
      style={{
        ...position
      }}>
      {renderPanel()}
    </div>
      )
}

export default PopoverContainer

export const config = {
  matches: ['http://*/*', 'https://*/*', '<all_urls>']
}

export const appendStyle = (style: HTMLStyleElement) => () => {
  style.textContent = style.textContent + styleText
  return style
}
