import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const formData = new URLSearchParams()
  formData.append("le", "en")
  formData.append("q", req.body.text)

  const requestOptions = {
    method: "POST",
    body: formData, // 将URLSearchParams对象作为请求体
    headers: {
      "Content-Type": "application/x-www-form-urlencoded" // 设置Content-Type
    }
  }
  const message = await fetch(
    "https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=3",
    requestOptions
  )
    .then((res) => res.json())
    .catch((err) => console.log(err))

  console.log(message)

  res.send({
    message
  })
}

export default handler
