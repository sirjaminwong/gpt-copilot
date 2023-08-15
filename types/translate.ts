export interface TranslateResult {
  phonetic: {
    // 英式发音
    uk: string
    // 美式发音
    us: string
  }
  // 中文的详细释义
  explain: string
  // 该单词的所有词性
  part_of_speech: {
    // 词性 verb noun adj adv 等
    type: string
    // 单词在这个词性下对应的中文含义
    explain: string
  }[]
  // 复数形式
  plural_form: string
  // 第三人称单数
  third_person_singular: string
  // 现在分词
  present_participle: string
  // 过去式
  past_tense: string
  // 过去分词
  past_participle: string
  // 例句
  example_sentences: {
    english: string
    chinese: string
  }[]
  // 计算机领域定义
  computer_science_definition: string
  // 金融领域定义
  finance_definition: string
}

export interface WordBaseInfo {
  phonetic: {
    // 英式发音
    uk: string
    // 美式发音
    us: string
  }
  // 不同词性下的反应
  trs: {
    // 词性 verb noun adj adv 等
    partOfSpeech: string
    // 单词在这个词性下对应的中文含义
    explain: string
  }[]
  forms: {
    name: string
    value: string
  }[]
  exampleSentences: {
    sentence: string
    translation: string
    source: string
  }[]
}

export interface YoudaoV2 {
  exam_type: string[]
  source: {
    name: string
    url: string
  }
  word: {
    usphone: string
    ukphone: string
    ukspeech: string
    trs: { tr: [{ l: { i: string } }] }[]
    wfs: {
      wf: {
        name: string
        value: string
      }
    }[]
    usspeech: string
  }[]
}
