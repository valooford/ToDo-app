import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';

import Modal from './Modal.pure';

export const ModalContext = React.createContext();

export default function ModalContainer({ children, onClose }) {
  const modalRef = useContext(ModalContext);
  return ReactDOM.createPortal(
    <KeyboardTrap>
      <Modal onClose={onClose}>{children}</Modal>
    </KeyboardTrap>,
    modalRef.current
  );
}
