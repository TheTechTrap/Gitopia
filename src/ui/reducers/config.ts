import { buildActionCreator, createReducer, Reducer } from "hard-reducer"
import v8n from "v8n"

v8n.extend({
  acceptableTheme() {
    return (value: string) => ["github", "monokai"].includes(value)
  }
})

export const rules = {
  committerName: v8n().string(),
  committerEmail: v8n().string(),
  githubApiToken: v8n().string(),
  editorFontScale: v8n().number(),
  editorFontFamily: v8n().string(),
  editorSpellCheck: v8n().boolean(),
  corsProxy: v8n().string(),
  theme: v8n()
    .string()
    .acceptableTheme(),
  isFirstVisit: v8n().boolean(),
  doneTutorial: v8n().boolean(),
  gitEasyMode: v8n().boolean()
}

const { createAction } = buildActionCreator({
  prefix: "config/"
})

export type ConfigState = {
  committerName: string
  committerEmail: string
  githubApiToken: string
  corsProxy: string
  editorSpellCheck: boolean
  editorFontFamily: string
  editorFontScale: number
  isFirstVisit: boolean
  doneTutorial: boolean
  theme: string
  gitEasyMode: boolean
}

export const setConfigValue = createAction(
  "set-config-value",
  (input: { key: string; value: number | string | boolean }) => {
    const rule = (rules as any)[input.key]
    return {
      ...input,
      valid: rule.test(input.value)
    }
  }
)

const initalState: ConfigState = {
  committerName: "",
  committerEmail: "",
  githubApiToken: "",
  editorFontScale: 1.2,
  editorFontFamily: "Inconsolata, monospace",
  editorSpellCheck: false,
  corsProxy: "https://cors-buster-zashozaqfk.now.sh",
  theme: "dark",
  isFirstVisit: true,
  doneTutorial: false,
  gitEasyMode: true
}

export const reducer: Reducer<ConfigState> = createReducer(initalState).case(
  setConfigValue,
  (state, { key, value, valid }) => {
    if (valid) {
      return {
        ...state,
        [key]: value
      } as any
    } else {
      console.warn(`You can not set ${key}: ${value}`)
      return state
    }
  }
)
