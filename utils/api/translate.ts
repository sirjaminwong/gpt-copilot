import { callInfoApi } from "./call-api"

export const translateApi = (words: string) => {
  return callInfoApi("completions", {
    method: "post",
    data: {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `请将 "${words}" 这个单词翻译成英文` }
      ],
      temperature: 0.7
    }
  })
}
