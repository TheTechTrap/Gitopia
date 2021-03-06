import * as React from "react"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { connector } from "../../actionCreators/index"
import SponsorForm from "./SponsorForm"
export const Sponsor = connector(
  state => ({
    openedSponsorModal: state.argit.openedSponsorModal
  }),
  actions => ({
    openSponsorModal: actions.argit.openSponsorModal,
    closeSponsorModal: actions.argit.closeSponsorModal
  })
)(function SponsorImpl(props) {
  const { address, repo } = props
  return (
    <Modal isOpen={props.openedSponsorModal} toggle={props.closeSponsorModal}>
      <ModalHeader toggle={props.closeSponsorModal}>Sponsor</ModalHeader>
      <ModalBody>
        <SponsorForm
          address={props.address}
          closeSponsorModal={props.closeSponsorModal}
          repo={props.repo}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={props.closeSponsorModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
})
