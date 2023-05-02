import React, { useCallback, useState } from 'react'

import styleText from 'data-text:./popover.module.less'
import * as style from './popover.module.less'

import { useRequest } from 'ahooks'
import { sendToBackground } from '@plasmohq/messaging'

import useTextSelection from '~hooks/useTextSelection'

function PopoverIndex () {
  const [mode, setMode] = useState<'icon' | 'panel'>('icon')

  const [textSelection, clearSelection] = useTextSelection()

  const { data, loading, run } = useRequest(
    async (text: string) => {
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

  const handleClickIcon = useCallback(() => {
    if (!textSelection) return
    setMode('panel')
    run(textSelection.text)
  }, [run, textSelection])

  const handleClosePanel = useCallback(() => {
    clearSelection()
    setMode('icon')
  }, [clearSelection])

  if (!textSelection) {
    return null
  }

  const position = {
    top: `${textSelection.rect.top + 30}px`,
    left: `${textSelection.rect.left}px`
  }

  const value = data?.message?.choices[0].message?.content || 'No translation found'

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
      onClick={handleClosePanel}
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
