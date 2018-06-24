import fs from "fs"
import * as git from "isomorphic-git"
import {
  GitFileStatus,
  GitRepositoryStatus,
  GitStatusString
} from "./../../types"
import { getGitHistory } from "./getGitHistory"
import { getGitStatus } from "./getGitStatus"
import { getGitTrackingStatus } from "./getGitTrackingStatus"

export async function getProjectGitStatus(
  projectRoot: string
): Promise<GitRepositoryStatus> {
  // branching
  const currentBranch = await git.currentBranch({ fs, dir: projectRoot })
  const branches = await git.listBranches({ fs, dir: projectRoot })
  const history = await getGitHistory(projectRoot, { ref: currentBranch })

  // staging
  const trackingStatus = await getGitTrackingStatus(projectRoot)
  const { tracked, untracked } = trackingStatus

  const statusList: GitFileStatus[] = await Promise.all(
    tracked.map(async relpath => {
      const status = await getGitStatus(projectRoot, relpath)
      return { relpath, status, staged: isStaged(status) }
    })
  )

  const { staged, unstaged, unmodified } = getStagingStatus(statusList)

  return {
    rawStatusList: statusList,
    unstaged,
    staged,
    currentBranch,
    branches,
    tracked,
    untracked,
    unmodified,
    history
  }
}

export async function updateFileStatusInProject(
  projectRoot: string,
  repositoryStatus: GitRepositoryStatus,
  relpath: string,
  action: "added" | "changed" = "changed"
): Promise<GitRepositoryStatus> {
  const newChange = {
    relpath,
    staged: false,
    status: await getGitStatus(projectRoot, relpath)
  }

  const rawStatusList = [...repositoryStatus.rawStatusList]
  // let untracked = [...repositoryStatus.untracked]
  const changedIndex = rawStatusList.findIndex(c => c.relpath === relpath)
  if (changedIndex > -1) {
    // update status
    rawStatusList[changedIndex] = newChange
  }
  // else {
  //   unstaged absent => unstaged *add
  //   rawStatusList.push(newChange)
  //   untracked = untracked.filter(u => u !== relpath)
  // }

  const { staged, unstaged, unmodified } = getStagingStatus(rawStatusList)
  return {
    ...repositoryStatus,
    // untracked,
    rawStatusList,
    staged,
    unmodified,
    unstaged
  }
}

function isStaged(status: GitStatusString | "error"): boolean {
  return status[0] !== "*"
}

function getStagingStatus(
  statusList: GitFileStatus[]
): { staged: string[]; unstaged: string[]; unmodified: string[] } {
  const staged = statusList
    .filter(a => a.staged && a.status !== "unmodified")
    .map(a => a.relpath)

  const unmodified = statusList
    .filter(a => a.status === "unmodified")
    .map(a => a.relpath)

  const unstaged = statusList.filter(a => !a.staged).map(a => a.relpath)
  return { staged, unstaged, unmodified }
}
