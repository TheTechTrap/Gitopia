import fs from "fs"
import * as git from "isomorphic-git"

export async function deleteBranch(
  projectRoot: string,
  branchName: string
): Promise<void> {
  return git.deleteBranch({ fs, dir: projectRoot, ref: branchName })
}
