import fs from "fs"
import * as git from "isomorphic-git"

export function addFile(projectRoot: string, relpath: string): Promise<any> {
  return git.add({ fs, dir: projectRoot, filepath: relpath })
}
