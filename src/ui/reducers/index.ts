import { combineReducers } from "redux"
import * as app from "./app"
import * as argit from "./argit"
import * as buffer from "./buffer"
import * as config from "./config"
import * as git from "./git"
import * as navigation from "./navigation"
import * as project from "./project"
import * as repository from "./repository"
export type RootState = {
  app: app.AppState
  repository: repository.RepositoryState
  project: project.ProjectState
  buffer: buffer.BufferState
  git: git.GitState
  config: config.ConfigState
  argit: argit.ArgitState
  navigation: navigation.NavigationState
}

export const rootReducer: (
  state: RootState,
  action: any
) => RootState = combineReducers({
  app: app.reducer,
  project: project.reducer,
  buffer: buffer.reducer,
  repository: repository.reducer,
  git: git.reducer,
  config: config.reducer,
  argit: argit.reducer,
  navigation: navigation.reducer
} as any)
