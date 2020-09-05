import { Card } from "@blueprintjs/core"
import React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../actionCreators"

export const ProjectManager = connector(
  state => {
    return {
      project: state.project,
      corsProxy: state.config.corsProxy,
      repository: state.repository,
      projectRoot: state.project.projectRoot,
      address: state.argit.address
    }
  },
  actions => {
    return {
      openCreateRepoModal: actions.app.openCreateRepoModal,
      openCloneRepoModal: actions.app.openCloneRepoModal,
      loadProjectList: actions.project.loadProjectList,
      startProjectRootChanged: actions.editor.startProjectRootChanged,
      deleteProject: actions.editor.deleteProject
    }
  },
  lifecycle({
    componentDidMount() {
      // ;(this as any).props.loadProjectList()
    }
  })
)(props => {
  return (
    <ProjectManagerImpl
      projectRoot={props.repository.currentProjectRoot}
      projects={props.project.projects}
      corsProxy={props.corsProxy}
      onClickNewProject={() => {
        props.openCreateRepoModal({})
      }}
      onClickCloneProject={() => {
        props.openCloneRepoModal({})
      }}
      onCloneEnd={projectRoot => {
        props.startProjectRootChanged({ projectRoot })
      }}
      onChangeProject={projectRoot => {
        props.startProjectRootChanged({ projectRoot })
      }}
      onDeleteProject={async projectRoot => {
        // TODO: Use domain directly
        props.deleteProject({
          dirpath: projectRoot
        })
        await new Promise(r => setTimeout(r, 300))
        props.startProjectRootChanged({
          projectRoot: "/playground"
        })
      }}
    />
  )
})

class ProjectManagerImpl extends React.Component<{
  projectRoot: string
  projects: Array<{ projectRoot: string }>
  corsProxy: string
  onChangeProject: (projectRoot: string) => void
  onCloneEnd: (projectRoot: string) => void
  onDeleteProject: (projectRoot: string) => void
  onClickNewProject: () => void
  onClickCloneProject: () => void
  onClickPushToArweave: () => void
  onClickFetckFromArweave: () => void
}> {
  render() {
    const {
      corsProxy,
      projects,
      onClickNewProject,
      onChangeProject,
      onCloneEnd,
      onClickCloneProject,
      onClickPushToArweave,
      projectRoot,
      onDeleteProject,
      onClickFetchFromArweave
    } = this.props

    return (
      <Card style={{ height: "100%", borderRadius: 0 }}>
        {/* <div>
          <div className="bp3-select .modifier">
            <select
              value={projectRoot}
              onChange={ev => {
                const nextProjectRoot = ev.target.value
                onChangeProject(nextProjectRoot)
              }}
            >
              {projects.map((p, index) => {
                return (
                  <option value={p.projectRoot} key={index}>
                    {p.projectRoot}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <div style={{ height: "5px" }} /> */}
        {/* <ButtonGroup>
          <Button
            disabled={projectRoot === "/playground"}
            icon="trash"
            onClick={async () => {
              const confirmed = window.confirm(`Delete ${projectRoot}`)
              if (confirmed) {
                onDeleteProject(projectRoot)
              }
            }}
          /> */}

        {/* <Button
            text="Add"
            icon="add"
            onClick={() => {
              onClickNewProject()
            }}
          /> */}
        {/* <Button
            text="Clone"
            icon="git-repo"
            onClick={() => {
              onClickCloneProject()
            }}
          /> */}
        {/* <Button
            text="Push To Arweave"
            icon="git-push"
            onClick={() => {
              onClickPushToArweave()
            }}
          />
          <Button
            text="Fetch"
            icon="git-pull"
            onClick={() => {
              onClickFetchFromArweave()
            }}
          /> */}
        {/* </ButtonGroup> */}
      </Card>
    )
  }
}
