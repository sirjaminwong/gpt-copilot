import { useStorage } from "@plasmohq/storage/hook"

function TabManage() {
  const [favorites] = useStorage<string[]>("favorites", [])

  return <div>{JSON.stringify(favorites)}</div>
}

export default TabManage
