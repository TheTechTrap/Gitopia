import React from "react"
import { connector } from "../../actionCreators"
import { RootState } from "../../reducers"
import { Config } from "../pages/Config"
import { Edit } from "../pages/Edit"
import { lifecycle } from "recompose"
import { createNewProject } from "../../reducers/project"
import {
  startProjectRootChanged,
  deleteProject
} from "../../actionCreators/editorActions"
import { RepositoryBrowser } from "../organisms/RepositoryBrowser"
import { Editor } from "../../components/argit/editor"
import { Card, CardBody, Container, Row, Col } from "reactstrap"
import { arweave } from "../../../index"
import * as git from "isomorphic-git"
import fs from "fs"
import { CloneButton } from "../argit/cloneButton"
import { Link } from "react-router-dom"
import { ReadCommitResult } from "../../../domain/types"
import { format } from "date-fns"
import { getRef } from "isomorphic-git/src/utils/arweave"
import { setTxLoading } from "../../reducers/argit"

type Project = {
  projectRoot: string
}

type StackRouterProps = {
  currentScene: string
  projectRoot: string
  address: string
  match: any
  startProjectRootChanged: typeof startProjectRootChanged
  createNewProject: typeof createNewProject
  deleteProject: typeof deleteProject
  projects: Project[]
  history: ReadCommitResult[]
  txLoading: boolean
  setTxLoading: typeof setTxLoading
}

// const selector = (state: RootState): Props => {
//   return {
//     currentScene: state.app.sceneStack[state.app.sceneStack.length - 1],
//     activeRepository: state.argit.activeRepository
//   }
// }

export const StackRouter = connector(
  state => ({
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1],
    projectRoot: state.project.projectRoot,
    address: state.argit.address,
    history: state.git.history,
    txLoading: state.argit.txLoading
  }),
  actions => ({
    updateProjectList: actions.project.updateProjectList,
    startProjectRootChanged: actions.editor.startProjectRootChanged,
    createNewProject: actions.project.createNewProject,
    deleteProject: actions.editor.deleteProject,
    setTxLoading: actions.argit.setTxLoading
  }),
  lifecycle<StackRouterProps, {}>({
    async componentDidMount() {
      const {
        match,
        startProjectRootChanged,
        address,
        setTxLoading
      } = this.props
      const newProjectRoot = `/${match.params.repo_name}`

      setTxLoading({ loading: true })

      createNewProject({ newProjectRoot })

      const url = `dgit://${address}${newProjectRoot}`
      const oid = await getRef(arweave, url, "refs/heads/master")

      if (oid !== "0000000000000000000000000000000000000000" && oid !== "") {
        await git.cloneFromArweave({
          fs,
          dir: newProjectRoot,
          url,
          ref: "master",
          arweave
        })
        console.info("clone: done")
      }

      await startProjectRootChanged({
        projectRoot: newProjectRoot
      })

      setTxLoading({ loading: false })
    },
    componentWillUnmount() {
      this.props.deleteProject({ dirpath: this.props.projectRoot })
    }
  })
)(function StackRouterImpl(props) {
  switch (props.currentScene) {
    case "main": {
      let header = ""
      if (props.history.length) {
        const lastCommit = props.history[props.history.length - 1]
        header = `Latest commit: ${lastCommit.commit.committer.name} ${
          lastCommit.commit.message
        } ${lastCommit.oid.slice(0, 7)} ${format(
          lastCommit.commit.author.timestamp * 1000,
          "MM/DD HH:mm"
        )}`
      }

      if (props.txLoading)
        return (
          <>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
            <span className="sr-only">Loading...</span>
          </>
        )

      return (
        <Container>
          {props.history.length === 0 ? (
            <></>
          ) : (
            <>
              <Row>
                <Col>
                  <div className="float-right">
                    <CloneButton />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="card-dgit">
                    <div>
                      <div>
                        &nbsp; &nbsp;
                        {header}
                        <div className="float-right">
                          <Link
                            to={`/app/main/repository/${props.address}${
                              props.projectRoot
                            }/commits`}
                          >
                            <i className="fa fa-history" aria-hidden="true" />
                            {`${props.history.length} commits`}
                            &nbsp;&nbsp;
                          </Link>
                        </div>
                      </div>
                    </div>
                    <CardBody>
                      <RepositoryBrowser />
                    </CardBody>
                  </div>
                </Col>
              </Row>
            </>
          )}
          <Row>
            <Col>
              <div className="mt-4">
                <Editor />
              </div>
            </Col>
          </Row>
        </Container>
      )
    }
    case "edit": {
      return <Edit />
    }
    case "config": {
      return <Config />
    }
    default: {
      return <span>Route Error: No {props.currentScene}</span>
    }
  }
})
