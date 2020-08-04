import * as React from "react"

import { Button, Navbar, Alignment } from "@blueprintjs/core"

export interface LandingNewProps {}

const LandingNew: React.SFC<LandingNewProps> = () => {
  return (
    <React.Fragment>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>ArgitHub</Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="home" text="Home" />
          <Button className="bp3-minimal" icon="document" text="Files" />
        </Navbar.Group>
      </Navbar>
    </React.Fragment>
  )
}

export default LandingNew
