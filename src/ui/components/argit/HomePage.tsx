import * as React from "react"
import { Link } from "react-router-dom"
import { connector } from "../../actionCreators/index"
import { lifecycle } from "recompose"
import { arweave } from "../../../index"
import "./HomePage.css"
import { Login } from "grommet-icons"

import {
  Repository,
  setIsAuthenticated,
  loadAddress,
  updateRepositories
} from "../../reducers/argit"
// import { Button } from "@blueprintjs/core"
import { Button, Box, Text } from "grommet"

export const HomePage = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal
  })
)(function HomePageImpl(props) {
  return (
    <React.Fragment>
      <header className="jumbotron jumbotron-fluid">
        <div className="container-fluid text-center">
          <h1 className="display-3">ArgitHub</h1>
          <p className="lead pb-4">
            Permanent Private Versioning for your Code
          </p>
          <p>
            <Button
              onClick={() => props.openLoginModal({})}
              icon={<Login />}
              label="Logindlf"
            >
              <Box
                round="xlarge"
                background="accent-1"
                pad={{ vertical: "small", horizontal: "medium" }}
              >
                <Text
                  size="small"
                  color="white"
                  weight="bold"
                  textAlign="center"
                >
                  Login
                </Text>
              </Box>
            </Button>
            {/* className="bp3-outlined bp3-large bp3-minimal"
            icon="log-in"
            onClick={() => props.openLoginModal({})} */}
          </p>
        </div>
      </header>
    </React.Fragment>
  )
})
