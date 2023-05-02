import React, { useCallback, useEffect, useState } from 'react'

import styleText from 'data-text:./popover.module.less'
import * as style from './popover.module.less'

import { useKeyPress, useRequest } from 'ahooks'
import { sendToBackground } from '@plasmohq/messaging'

import useTextSelection from '~hooks/useTextSelection'
import type { GptResult } from '~types/gpt'

function PopoverIndex () {
  const [mode, setMode] = useState<'icon' | 'panel'>('icon')
  const [isOpen, setIsOpen] = useState(false)
  const [textSelection, clearSelection] = useTextSelection()

  const { data, loading, run } = useRequest(
    async (text: string): Promise<GptResult> => {
      const result = await sendToBackground({
        name: 'translate',
        body: {
          content: text
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
    run(textSelection.text)
  }, [run, textSelection])

  if (!isOpen || !textSelection) {
    return null
  }

  const position = {
    top: `${textSelection.rect.top + 30}px`,
    left: `${textSelection.rect.left}px`
  }

  const value = data?.choices[0]?.message?.content || 'No translation found'

  const renderPanel = () => {
    if (loading) {
      return 'loading...'
    }
    return value
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

export default PopoverIndex

export const config = {
  matches: ['http://*/*', 'https://*/*', '<all_urls>']
}

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = styleText
  return style
}
