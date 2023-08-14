import { useKeyPress } from 'ahooks'
import styleText from 'data-text:./popover.module.less'
import { useCallback, useEffect, useRef, useState } from 'react'

import useTextSelection from '~hooks/useTextSelection'

import * as style from './popover.module.less'
import { WordSummary } from './word-summary-panel'
import { useClickAwayV2 } from './use-click-away'

function PopoverContainer () {
  const [mode, setMode] = useState<'icon' | 'panel'>('icon')

  const pinRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [textSelection, clearSelection] = useTextSelection()

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

  useClickAwayV2(pinRef, handleClosePanel)

  const handleClickIcon = useCallback(() => {
    console.log(pinRef.current)
    if (!textSelection) return
    setMode('panel')
  }, [textSelection])

  if (!isOpen || !textSelection) {
    return null
  }

  const position = {
    top: `${textSelection.rect.top + 30}px`,
    left: `${textSelection.rect.left}px`
  }

  return mode === 'icon'
    ? (
    <div
      ref={pinRef}
      className={style.pin}
      onClick={handleClickIcon}
      style={{
        ...position
      }}/>
      )
    : (
    <WordSummary
      onClose={handleClosePanel}
      word={textSelection.text}
      position={position}></WordSummary>
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
