interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

interface Message {
  role: string
  content: string
}

interface Choice {
  message: Message
  finish_reason: string
  index: number
}

export interface GptResult {
  id: string
  object: string
  created: number
  model: string
  usage: Usage
  choices: Choice[]
}
