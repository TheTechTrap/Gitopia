import * as git from "isomorphic-git"
import { CommitDescription } from "../../types"
import { browserFS as fs } from "../../../runApp"

export async function getHistory(
  projectRoot: string,
  { depth, ref = "master" }: { depth?: number; ref?: string }
): Promise<CommitDescription[]> {
  return git.log({ fs, dir: projectRoot, depth, ref })
}
