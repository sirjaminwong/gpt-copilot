export const mockTranslateResult = {
  id: "chatcmpl-7NJtxATTAItfcsEgYijkfdttjLuvN",
  object: "chat.completion",
  created: 1685792401,
  model: "gpt-3.5-turbo-0301",
  usage: {
    prompt_tokens: 340,
    completion_tokens: 201,
    total_tokens: 541
  },
  choices: [
    {
      message: {
        role: "assistant",
        content:
          '{\n  "explain": "音标",\n  "phonetic": {\n    "uk": "fəˈnetɪk",\n    "us": "fəˈnɛtɪk"\n  },\n  "part_of_speech": [\n    {\n      "type": "noun",\n      "explain": "音标学"\n    }\n  ],\n  "plural_form": "phonetics",\n  "third_person_singular": "phonetics",\n  "present_participle": "phoneticizing",\n  "past_tense": "phoneticized",\n  "past_participle": "phoneticized",\n  "example_sentences": [\n    {\n      "english": "The international phonetic alphabet is used to represent the sounds of all languages.",\n      "chinese": "国际音标用于表示所有语言的声音。"\n    }\n  ],\n  "computer_science_definition": "",\n  "finance_definition": ""\n}'
      },
      finish_reason: "stop",
      index: 0
    }
  ]
}
