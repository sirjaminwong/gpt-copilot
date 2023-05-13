import { useStorage } from '@plasmohq/storage/hook'

function IndexOptions () {
  const [apiKey, setApiKey] = useStorage<string| undefined>('api-key', undefined)

  return (
    <div>
      <p>API Key</p>
      <input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      </div>
  )
}
export default IndexOptions
