import EventEmitter from "events"
import fs from "fs"
import * as git from "isomorphic-git"
import uuid from "uuid"
import "../../__testHelpers__"

// Check clone works correctly
test.skip("clone", async () => {
  const root = "/tmp/__tempRoot__" + uuid()
  const emitter = new EventEmitter()
  emitter.on("progress", progressEvent => {
    console.log("[clone/progress]", progressEvent)
  })

  emitter.on("message", message => {
    console.log("[clone/message]", message)
  })

  const clonePromise = git.clone({
    dir: root,
    url: "https://github.com/mizchi/next-editor"
  })

  await clonePromise

  // console.log("clone done")
  await fs.promises.readdir(root)
  // console.log("readdir", ret)
})
