import * as React from "react"
import { Link } from "react-router-dom"
import { connector } from "../../../actionCreators/index"
import { lifecycle } from "recompose"
import { arweave } from "../../../../index"
import {
  Repository,
  setIsAuthenticated,
  loadAddress,
  updateRepositories,
  loadNotifications,
  Notification
} from "../../../reducers/argit"
import { Root } from "../../atoms/Root"
import { GlobalHeader } from "../../organisms/GlobalHeader"
import { LayoutManager } from "../../organisms/LayoutManager"
import { Grid, GridArea } from "../../utils/Grid"
import { Button } from "@blueprintjs/core"
import { openCreateRepoModal } from "../../../reducers/app"
import { CreateRepoModal } from "../../organisms/CreateRepoModal"
import { Repositories } from "../Repositories"
import { txQuery } from "../../../../utils"
import { Row, Col, Progress, Table, Label, Input } from "reactstrap"
import s from "./DashboardNew.module.scss"
import Widget from "../Widget/Widget"
import AnimateNumber from "react-animated-number"

type ConnectedProps = {
  isAuthenticated: boolean
  repositories: Repository[]
  setIsAuthenticated: typeof setIsAuthenticated
  loadAddress: typeof loadAddress
  updateRepositories: typeof updateRepositories
  openCreateRepoModal: typeof openCreateRepoModal
  loadNotifications: typeof loadNotifications
  notifications: typeof Notification[]
}
import peopleA1 from "../images/people/a1.jpg"
import peopleA2 from "../images/people/a2.jpg"
import peopleA4 from "../images/people/a4.jpg"
import peopleA5 from "../images/people/a5.jpg"

export const DashboardNew = connector(
  state => ({
    repositories: state.argit.repositories,
    address: state.argit.address,
    isAuthenticated: state.argit.isAuthenticated,
    notifications: state.argit.notifications
  }),
  actions => ({
    loadAddress: actions.argit.loadAddress,
    updateRepositories: actions.argit.updateRepositories,
    openCreateRepoModal: actions.app.openCreateRepoModal,
    loadNotifications: actions.argit.loadNotifications
  }),
  lifecycle<ConnectedProps, {}>({
    async componentDidMount() {
      // UI Boot
      // await delay(150)

      const { isAuthenticated, repositories, ...actions } = this.props

      if (isAuthenticated) {
        const address = await arweave.wallets.jwkToAddress(
          JSON.parse(String(sessionStorage.getItem("keyfile")))
        )
        actions.loadAddress({ address })

        const txids = await arweave.arql(txQuery(address, "create-repo"))
        let notifications: Notification[] = []
        const repositories = await Promise.all(
          txids.map(async txid => {
            let repository = {} as Repository
            const data: any = await arweave.transactions.getData(txid, {
              decode: true,
              string: true
            })
            try {
              const decoded: any = JSON.parse(data)
              repository = {
                name: decoded.name,
                description: decoded.description
              }
            } catch (error) {
              repository = {
                name: txid,
                description: "Pending confirmation"
              }
              notifications.push({
                type: "pending",
                action: "create-repo",
                txid: txid
              })
            }

            if (!repository) {
              repository = {
                name: txid,
                description: "null"
              }
            }

            return repository
          })
        )
        console.log("not", notifications)
        actions.loadNotifications({ notifications })
        actions.updateRepositories({ repositories })
      }
    }
  })
)(function DashboardNew(props) {
  return (
    <div className={s.root}>
      <h1 className="page-title">
        Dashboard &nbsp;
        <small>
          <small>The Lucky One</small>
        </small>
      </h1>

      <Row>
        <Col lg={7}>
          <Widget className="bg-transparent">{/* <Map /> */}</Widget>
        </Col>
        <Col lg={1} />

        <Col lg={4}>
          <Widget
            className="bg-transparent"
            title={
              <h5>
                {" "}
                Map
                <span className="fw-semi-bold">&nbsp;Statistics</span>
              </h5>
            }
            settings
            refresh
            close
          >
            <p>
              Status: <strong>Live</strong>
            </p>
            <p>
              <span className="circle bg-default text-white">
                <i className="fa fa-map-marker" />
              </span>{" "}
              &nbsp; 146 Countries, 2759 Cities
            </p>
            <div className="row progress-stats">
              <div className="col-md-9 col-12">
                <h6 className="name fw-semi-bold">Foreign Visits</h6>
                <p className="description deemphasize mb-xs text-white">
                  Some Cool Text
                </p>
                <Progress
                  color="primary"
                  value="60"
                  className="bg-custom-dark progress-xs"
                />
              </div>
              <div className="col-md-3 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={75} />%
                  </small>
                </span>
              </div>
            </div>
            <div className="row progress-stats">
              <div className="col-md-9 col-12">
                <h6 className="name fw-semi-bold">Local Visits</h6>
                <p className="description deemphasize mb-xs text-white">
                  P. to C. Conversion
                </p>
                <Progress
                  color="danger"
                  value="39"
                  className="bg-custom-dark progress-xs"
                />
              </div>
              <div className="col-md-3 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={84} />%
                  </small>
                </span>
              </div>
            </div>
            <div className="row progress-stats">
              <div className="col-md-9 col-12">
                <h6 className="name fw-semi-bold">Sound Frequencies</h6>
                <p className="description deemphasize mb-xs text-white">
                  Average Bitrate
                </p>
                <Progress
                  color="success"
                  value="80"
                  className="bg-custom-dark progress-xs"
                />
              </div>
              <div className="col-md-3 col-12 text-center">
                <span className="status rounded rounded-lg bg-default text-light">
                  <small>
                    <AnimateNumber value={92} />%
                  </small>
                </span>
              </div>
            </div>
            <h6 className="fw-semi-bold mt">Map Distributions</h6>
            <p>
              Tracking: <strong>Active</strong>
            </p>
            <p>
              <span className="circle bg-default text-white">
                <i className="fa fa-cog" />
              </span>
              &nbsp; 391 elements installed, 84 sets
            </p>
            <div className="input-group mt">
              <input
                type="text"
                className="form-control bg-custom-dark border-0"
                placeholder="Search Map"
              />
              <span className="input-group-btn">
                <button
                  type="submit"
                  className={`btn btn-subtle-blue ${s.searchBtn}`}
                >
                  <i className="fa fa-search text-light" />
                </button>
              </span>
            </div>
          </Widget>
        </Col>
      </Row>

      <Row>
        <Col lg={4} xs={12}>
          <Widget title={<h6> USERBASE GROWTH </h6>} close settings>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Overall Growth</h6>
                <p className="value">76.38%</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Montly</h6>
                <p className="value">10.38%</p>
              </div>
              <div className="stat-item">
                <h6 className="name">24h</h6>
                <p className="value">3.38%</p>
              </div>
            </div>
            <Progress
              color="success"
              value="60"
              className="bg-custom-dark progress-xs"
            />
            <p>
              <small>
                <span className="circle bg-default text-white">
                  <i className="fa fa-chevron-up" />
                </span>
              </small>
              <span className="fw-semi-bold">&nbsp;17% higher</span>
              &nbsp;than last month
            </p>
          </Widget>
        </Col>
        <Col lg={4} xs={12}>
          <Widget title={<h6> TRAFFIC VALUES </h6>} close settings>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name">Overall Values</h6>
                <p className="value">17 567 318</p>
              </div>
              <div className="stat-item">
                <h6 className="name">Montly</h6>
                <p className="value">55 120</p>
              </div>
              <div className="stat-item">
                <h6 className="name">24h</h6>
                <p className="value">9 695</p>
              </div>
            </div>
            <Progress
              color="danger"
              value="60"
              className="bg-custom-dark progress-xs"
            />
            <p>
              <small>
                <span className="circle bg-default text-white">
                  <i className="fa fa-chevron-down" />
                </span>
              </small>
              <span className="fw-semi-bold">&nbsp;8% lower</span>
              &nbsp;than last month
            </p>
          </Widget>
        </Col>
        <Col lg={4} xs={12}>
          <Widget title={<h6> RANDOM VALUES </h6>} close settings>
            <div className="stats-row">
              <div className="stat-item">
                <h6 className="name fs-sm">Overcome T.</h6>
                <p className="value">104.85%</p>
              </div>
              <div className="stat-item">
                <h6 className="name fs-sm">Takeoff Angle</h6>
                <p className="value">14.29&deg;</p>
              </div>
              <div className="stat-item">
                <h6 className="name fs-sm">World Pop.</h6>
                <p className="value">7,211M</p>
              </div>
            </div>
            <Progress
              color="bg-primary"
              value="60"
              className="bg-custom-dark progress-xs"
            />
            <p>
              <small>
                <span className="circle bg-default text-white">
                  <i className="fa fa-plus" />
                </span>
              </small>
              <span className="fw-semi-bold">&nbsp;8 734 higher</span>
              &nbsp;than last month
            </p>
          </Widget>
        </Col>
      </Row>

      <Row>
        <Col lg={4} xs={12}>
          <Widget
            title={
              <h6>
                <span className="badge badge-success">New</span> Messages
              </h6>
            }
            refresh
            close
          >
            <div className="widget-body undo_padding">
              <div className="list-group list-group-lg">
                <button className="list-group-item text-left">
                  <span className="thumb-sm float-left mr">
                    <img className="rounded-circle" src={peopleA2} alt="..." />
                    <i className="status status-bottom bg-success" />
                  </span>
                  <div>
                    <h6 className="m-0">Chris Gray</h6>
                    <p className="help-block text-ellipsis m-0">
                      Hey! What&apos;s up? So many times since we
                    </p>
                  </div>
                </button>
                <button className="list-group-item text-left">
                  <span className="thumb-sm float-left mr">
                    <img className="rounded-circle" src={peopleA4} alt="..." />
                    <i className="status status-bottom bg-success" />
                  </span>
                  <div>
                    <h6 className="m-0">Jamey Brownlow</h6>
                    <p className="help-block text-ellipsis m-0">
                      Good news coming tonight. Seems they agreed to proceed
                    </p>
                  </div>
                </button>
                <button className="list-group-item text-left">
                  <span className="thumb-sm float-left mr">
                    <img className="rounded-circle" src={peopleA1} alt="..." />
                    <i className="status status-bottom bg-default" />
                  </span>
                  <div>
                    <h6 className="m-0">Livia Walsh</h6>
                    <p className="help-block text-ellipsis m-0">
                      Check my latest email plz!
                    </p>
                  </div>
                </button>
                <button className="list-group-item text-left">
                  <span className="thumb-sm float-left mr">
                    <img className="rounded-circle" src={peopleA5} alt="..." />
                    <i className="status status-bottom bg-danger" />
                  </span>
                  <div>
                    <h6 className="m-0">Jaron Fitzroy</h6>
                    <p className="help-block text-ellipsis m-0">
                      What about summer break?
                    </p>
                  </div>
                </button>
              </div>
            </div>
            <footer className="bg-widget-transparent mt">
              <input
                type="search"
                className="form-control form-control-sm bg-custom-dark border-0"
                placeholder="Search"
              />
            </footer>
          </Widget>
        </Col>

        <Col lg={4} xs={12}>
          <Widget
            title={
              <h6>
                {" "}
                Market <span className="fw-semi-bold">Stats</span>
              </h6>
            }
            close
          >
            <div className="widget-body">
              <h3>$720 Earned</h3>
              <p className="fs-mini text-muted mb mt-sm">
                Target <span className="fw-semi-bold">$820</span> day earnings
                is <span className="fw-semi-bold">96%</span> reached.
              </p>
            </div>
            <div className={`widget-table-overflow ${s.table}`}>
              <Table striped size="sm">
                <thead className="no-bd">
                  <tr>
                    <th>
                      <div className="checkbox abc-checkbox">
                        <Input
                          className="mt-0"
                          id="checkbox210"
                          type="checkbox"
                          onClick={() => this.checkTable(0)}
                          // checked={this.state.checkedArr[0]}
                          readOnly
                        />{" "}
                        <Label for="checkbox210" />
                      </div>
                    </th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="checkbox abc-checkbox">
                        <Input
                          className="mt-0"
                          id="checkbox212"
                          type="checkbox"
                          onClick={() => this.checkTable(1)}
                          // checked={this.state.checkedArr[1]}
                          readOnly
                        />{" "}
                        <Label for="checkbox212" />
                      </div>
                    </td>
                    <td>HP Core i7</td>
                    <td className="text-align-right fw-semi-bold">$346.1</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="checkbox abc-checkbox">
                        <Input
                          className="mt-0"
                          id="checkbox214"
                          onClick={() => this.checkTable(2)}
                          type="checkbox"
                          // checked={this.state.checkedArr[2]}
                          readOnly
                        />{" "}
                        <Label for="checkbox214" />
                      </div>
                    </td>
                    <td>Air Pro</td>
                    <td className="text-align-right fw-semi-bold">$533.1</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            <div
              className="widget-body mt-xlg chart-overflow-bottom"
              style={{ height: "100px" }}
            >
              {/* <Rickshaw height={100} /> */}
            </div>
          </Widget>
        </Col>

        <Col lg={4} xs={12}>
          <Widget
            title={<h6>Calendar</h6>}
            settings
            close
            bodyClass={"pt-2 px-0 py-0"}
          >
            {/* <Calendar /> */}
            <div className="list-group fs-mini">
              <button className="list-group-item text-ellipsis">
                <span className="badge badge-pill badge-primary float-right">
                  6:45
                </span>
                Weed out the flower bed
              </button>
              <button className="list-group-item text-ellipsis">
                <span className="badge badge-pill badge-success float-right">
                  9:41
                </span>
                Stop world water pollution
              </button>
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  )
})
