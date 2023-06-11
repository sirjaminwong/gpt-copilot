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
import type { TranslateResult } from '~types/translate'

import * as style from './popover.module.less'

const StyledHeader = styled.div`
  display: flex;
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
`

function PopoverContainer () {
  const [mode, setMode] = useState<'icon' | 'panel'>('icon')

  const [inputValue, setInputValue] = useState<string| undefined>()

  const [favorites, setFavorites] = useStorage<string[]>('favorites', [])

  const [isOpen, setIsOpen] = useState(false)
  const [textSelection, clearSelection] = useTextSelection()

  const { data, loading, run } = useRequest(
    async ({
      text,
      sentence
    }: {
      text: string
      sentence: string
    }): Promise<TranslateResult> => {
      const result = await sendToBackground({
        name: 'translate',
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
            <div>
              <div>
                <LeftOutlined rev={undefined} />
                <RightOutlined rev={undefined} />
              </div>
              <Input.Search value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </div>
            <div>
              <StyledStarOutlined
                isFavorite={
                  textSelection?.text && favorites.includes(textSelection.text)
                }
                rev={''}
                onClick={handleToggleFavorites}
              />
            </div>
          </StyledHeader>
          <StyledContent>
            <div>{textSelection.text}</div>
            <div>释义: {data.explain}</div>
            <div>
              uk: {data.phonetic.uk}{' '}
              <PhoneOutlined
                rev={''}
                onClick={() => handleSpeech(textSelection.text, 'en-GB')}
              />
            </div>
            <div>
              us: {data.phonetic.us}{' '}
              <PhoneOutlined
                rev={''}
                onClick={() => handleSpeech(textSelection.text)}
              />
            </div>
            <div>
              {data.part_of_speech.map((i) => (
                <div key={i.type}>
                  {i.type}: {i.explain}
                </div>
              ))}
            </div>
            <p className={style.tense}>
              <div>复数形式: {data.third_person_singular}</div>
              <div>第三人称单数: {data.third_person_singular}</div>
              <div>过去式: {data.past_tense}</div>
              <div>过去分词: {data.past_participle}</div>
              <div>现在分词: {data.present_participle}</div>
            </p>
            <p>
              {data.example_sentences.map((i) => (
                <div key={i.english}>
                  <div>
                    <PhoneOutlined
                      onClick={() => handleSpeech(i.english)}
                      rev={undefined}
                    />{' '}
                    {i.english}
                  </div>
                  <div>{i.chinese}</div>
                </div>
              ))}
            </p>
            <p>
              <div>专业术语</div>
              {data.computer_science_definition && (
                <div>计算机:{data.computer_science_definition}</div>
              )}
              {data.finance_definition && (
                <div>金融:{data.computer_science_definition}</div>
              )}
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
