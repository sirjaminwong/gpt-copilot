import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { mockTranslateResult } from "./mock"

const storage = new Storage()

const getTranslatePrompt = ({
  text,
  sentence
}: {
  text: string
  sentence: string
}) => {
  return `"${text}" 这个单词在以下句子中最贴切的翻译是什么?\n\n"${sentence}"`
}
const getTranslatePrompt2 = ({
  text,
  sentence
}: {
  text: string
  sentence: string
}) => {
  return `请将 "${text}" 这个单词翻译成英文`
}

const getTranslatePrompt3 = ({
  text,
  sentence
}: {
  text: string
  sentence: string
}) => {
  return `假设你是一名专业的英语老师,我是一名中国学生,请按照以下typescript类型定义以及字段对应的注释,给出"${text}"这个单词的相关信息,并以json的形式返回:

  interface TranslateResult {
    // 中文的详细释义
    explain: string;
    phonetic: {
      // 英式发音
      uk: string;
      // 美式发音
      us: string;
    }
    // 该单词的所有词性
    part_of_speech: {
      // 词性 verb noun adj adv 等
      type: string;
      // 单词在这个词性下对应的中文含义
      explain: string;
    }[];
    // 复数形式
    plural_form: string;
    // 第三人称单数
    third_person_singular: string;
    // 现在分词
    present_participle: string;
    // 过去式
    past_tense: string;
    // 过去分词
    past_participle: string;
    // 例句
    example_sentences: {
      english: string;
      chinese: string;
    }[];
    // 计算机领域定义
    computer_science_definition: string;
    // 金融领域定义
    finance_definition: string;
  }
`
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const apiKey =
    (await storage.get("api-key")) || process.env.PLASMO_PUBLIC_DEFAULT_API_KEY

  const message = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    credentials: "include",
    headers: {
      accept: "text/event-stream",
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: getTranslatePrompt3({
            text: req.body.text,
            sentence: req.body.sentence
          })
        }
      ],
      temperature: 0.7
      // stream: true
    })
  })
    .then((res) => res.json())
    .catch((err) => console.log(err))

  const content = message.choices[0]?.message?.content
  const result = JSON.parse(content)

  console.log(message)
  console.log(result)

  res.send({
    ...result
  })
}

export default handler
