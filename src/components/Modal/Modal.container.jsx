import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
/* eslint-disable import/no-unresolved */
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
/* eslint-enable import/no-unresolved */
import Modal from './Modal';

export const ModalContext = React.createContext();

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ MODAL
// *
export default function ModalContainer({ children, onClose }) {
  const modalRef = useContext(ModalContext);
  return ReactDOM.createPortal(
    <KeyboardTrap>
      <Modal onClose={onClose}>{children}</Modal>
    </KeyboardTrap>,
    modalRef.current
  );
}
