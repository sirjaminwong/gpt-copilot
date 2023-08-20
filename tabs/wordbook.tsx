import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { api } from "~serivices/api"

function TabManage() {
  const [favorites] = useStorage<string[]>("favorites", [])

  useEffect(() => {
    const hhh = async () => {
      console.log("---------")
      const users = await api.word.hello.query({ text: "from tRPC" })
      console.log(users, "hello")
    }
    hhh()
  }, [])

  return (
    <div>
      wrwqetq
      {JSON.stringify(favorites)}
    </div>
  )
}

export default TabManage
