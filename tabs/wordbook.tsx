import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
})

function TabManage () {
  return (
    <div>
      <IconFont type="icon-tuichu" />
      <IconFont type="icon-facebook" />
      <IconFont type="icon-twitter" />
    </div>
  )
}

export default TabManage
