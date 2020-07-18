import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import Modal from '@components/Modal/Modal';

import { closeModal } from '@store/modalReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ MODAL
// *
function ModalContainer({ modalCallback, onModalClose, modalRef }) {
  return (
    <Modal
      callback={modalCallback}
      onModalClose={onModalClose}
      ref={modalRef}
    />
  );
}

function mapStateToProps(state) {
  return {
    modalCallback: state.modal.callback,
  };
}

export default connect(mapStateToProps, { onModalClose: closeModal })(
  ModalContainer
);
