import md5 from "md5"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const from = "en"
const to = "zh"

const endpoint = "http://api.fanyi.baidu.com/api/trans/vip/translate"

interface RequestBody {
  text: string
}

interface ResponseBody {
  from: string
  to: string
  trans_result: {
    src: string
    dst: string
  }[]
}

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  const query = req?.body?.text

  if (!query) return
  const salt = new Date().getTime()
  const secretKey = process.env.PLASMO_PUBLIC_BAIDU_SECRET
  const appid = process.env.PLASMO_PUBLIC_BAIDU_APPID
  const sign = md5(appid + query + salt + secretKey)

  const result = await fetch(
    `${endpoint}?q=${encodeURI(
      query
    )}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
    {
      method: "GET"
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err))

  res.send(result)
}

export default handler
