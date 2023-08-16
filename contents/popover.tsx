import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"

import PopoverContainer, {
  appendStyle
} from "~/modules/popover/popover.container"

const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-emotion-cache",
  prepend: true,
  container: styleElement
})

function PopoverIndex() {
  return (
    <CacheProvider value={styleCache}>
      <PopoverContainer />
    </CacheProvider>
  )
}

export default PopoverIndex

const config = {
  matches: ["http://*/*", "https://*/*", "<all_urls>"]
}

const getStyle = appendStyle(styleElement)

export { getStyle, config }
