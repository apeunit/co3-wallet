import React, { Component } from 'react'
import { Text } from 'rebass'
import Modal from '../components/Modal'
import { AnimatePresence } from "framer-motion"
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toggleModal } from '../redux/actions/Modal'
class ModalContainer extends Component {

    render() {
        const { modal: { isOpen, title, body }, toggleModalVisibility } = this.props as any
        return (
            <AnimatePresence>
                {isOpen &&
                    <Modal close={() => { toggleModalVisibility() }} >
                        <Text variant="heading" textAlign='center' >
                            {title}
                        </Text>
                        <Text variant="base" textAlign='center' marginTop={4}>
                            {body}
                        </Text>
                    </Modal>
                }
            </AnimatePresence>
        )
    }
}

export default connect(
    (state: any) => ({ ...state }),
    (dispatch: any) => ({
        toggleModalVisibility: () => {
            dispatch(toggleModal())
        }
    })
)(withRouter(ModalContainer as any))