
import PopoverContainer, { getStyle } from '~/modules/popover/popover.container'

function PopoverIndex () {
  return <PopoverContainer/>
}

export default PopoverIndex

const config = {
  matches: ['http://*/*', 'https://*/*', '<all_urls>']
}

export {
  getStyle,
  config
}
