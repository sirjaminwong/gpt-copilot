import type { PlasmoMessaging } from '@plasmohq/messaging'

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: 'Bearer ' + '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',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `请将 "${req.body?.content}" 这个单词翻译成英文` }],
      temperature: 0.7
    })
  }).then(res => res.json()).catch(err => console.log(err))

  res.send({
    message
  })
}

export default handler
