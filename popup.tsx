import { useStorage } from '@plasmohq/storage/hook'
import { tabManageUrl } from '~constants'

function IndexPopup () {
  const [apiKey, setApiKey] = useStorage<string| undefined>('api-key', undefined)

  return (
    <div>
      <p>API Key</p>
      <a target='_blank' href={tabManageUrl} rel="noreferrer">我的收藏</a>
      <input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      </div>
  )
}

export default IndexPopup
