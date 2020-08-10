import * as git from "isomorphic-git"
import { ReadCommitResult } from "../../types"
import fs from "fs"

export async function getHistory(
  projectRoot: string,
  { depth, ref = "master" }: { depth?: number; ref?: string }
): Promise<ReadCommitResult[]> {
  return git.log({ fs, dir: projectRoot, depth, ref })
}
