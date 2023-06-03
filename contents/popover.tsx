import PopoverContainer, { getStyle } from '~/modules/popover/popover.container'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

const styleElement = document.createElement('style')

const styleCache = createCache({
  key: 'plasmo-emotion-cache',
  prepend: true,
  container: styleElement
})

function PopoverIndex () {
  return <CacheProvider value={styleCache}><PopoverContainer/></CacheProvider>
}

export default PopoverIndex

const config = {
  matches: ['http://*/*', 'https://*/*', '<all_urls>']
}

export {
  getStyle,
  config
}
