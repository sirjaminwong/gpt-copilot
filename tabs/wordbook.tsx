import { createFromIconfontCN } from '@ant-design/icons'
import { useStorage } from '@plasmohq/storage/hook'

const IconFont = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
})

function TabManage () {
  const [favorites] = useStorage<string[]>('favorites', [])

  return (
    <div>
      {JSON.stringify(favorites)}
      <IconFont type="icon-tuichu" />
      <IconFont type="icon-facebook" />
      <IconFont type="icon-twitter" />
    </div>
  )
}

export default TabManage
