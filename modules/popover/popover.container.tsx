import { useCallback, useEffect, useState } from 'react'

import styleText from 'data-text:./popover.module.less'
import * as style from './popover.module.less'

import { useKeyPress, useRequest } from 'ahooks'
import { sendToBackground } from '@plasmohq/messaging'

import useTextSelection from '~hooks/useTextSelection'
import type { TranslateResult } from '~types/translate'
import { PhoneOutlined } from '@ant-design/icons'

function PopoverContainer () {
  const [mode, setMode] = useState<'icon' | 'panel'>('icon')
  const [isOpen, setIsOpen] = useState(false)
  const [textSelection, clearSelection] = useTextSelection()

  const defaultApiKey = process.env.PLASMO_PUBLIC_SHIP_NAME
  console.log('PLASMO_PUBLIC_SHIP_NAME', defaultApiKey)

  const { data, loading, run } = useRequest(
    async ({ text, sentence }: { text: string, sentence: string }): Promise<TranslateResult> => {
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

  console.log(data)

  useEffect(() => {
    if (textSelection) {
      setIsOpen(true)
      setMode('icon')
    }
  }, [textSelection])

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

  const handleSpeech = useCallback(
    (text: string, lang = 'en-US') => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      speechSynthesis.speak(utterance)
    },
    []
  )

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
        <div>{textSelection.text}</div>
        <div>释义: {data.explain}</div>
        <div>uk: {data.phonetic.uk} <PhoneOutlined onClick={() => handleSpeech(textSelection.text, 'en-GB')} /></div>
        <div>us: {data.phonetic.us} <PhoneOutlined onClick={() => handleSpeech(textSelection.text)} /></div>
        <div>{data.part_of_speech.map(i => <div key={i.type}>{i.type}: {i.explain}</div>)}</div>
        <p className={style.tense}>
          <div>复数形式: {data.third_person_singular}</div>
          <div>第三人称单数: {data.third_person_singular}</div>
          <div>过去式: {data.past_tense}</div>
          <div>过去分词: {data.past_participle}</div>
          <div>现在分词: {data.present_participle}</div>
        </p>
        <p>
          {data.example_sentences.map(i => (
          <div key={i.english}>
            <div><PhoneOutlined onClick={() => handleSpeech(i.english)} /> {i.english}</div>
            <div>{i.chinese}</div>
          </div>))}
        </p>
        <p>
        <div>专业术语222</div>
        {data.computer_science_definition && <div>计算机:{data.computer_science_definition}</div>}
        {data.finance_definition && <div>金融:{data.computer_science_definition}</div>}
        </p>

      </>)
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
        }}
      >
        {renderPanel()}
      </div>
      )
}

export default PopoverContainer

export const config = {
  matches: ['http://*/*', 'https://*/*', '<all_urls>']
}

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = styleText
  return style
}
