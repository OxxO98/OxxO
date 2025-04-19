import { createContext } from 'react'

export const ServerContext = createContext<string>('http://localhost:5000');

export const MediaQueryContext = createContext<MediaQueryContextInterface>({
  pc : "(min-width:1024px)",
  tablet : "(min-width:758px) and (max-width:1023px)",
  mobile : "(max-width:757px)"
})

//사실상 hiragana는 한자가 아닌 모두
export const UnicodeContext = createContext<UnicodeContextInterface>({
  kanji : /[\u3400-\u9fff\u3005]+/g,
  kanjiStart : /^[\u3400-\u9fff\u3005]+/g,
  hiragana : /[^\u3400-\u9fff\u3005]+/g,
  okuri : /(?<any>.*)(?<kanji>[\u3400-\u9fff]+)(?<okuri>[^\u3400-\u9fff]+)$/
})

export const UnicodeRangeContext = createContext<UnicodeRangeContextInterface>({
  kanji : '\\u3400-\\u9fff\u3005',
  hiragana : '\\3040-\\u309f',
  katakana : '\\u30a0-\\u30ff'
})
