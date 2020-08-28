import React, { useEffect, useRef } from 'react';
import style from './Modal.module.scss';

export default function Modal({ children, onClose }) {
  const modalRef = useRef(null);
  // handle modal size
  useEffect(() => {
    function handleResize() {
      modalRef.current.style.width = `${document.documentElement.clientWidth}px`;
      modalRef.current.style.height = `${document.documentElement.clientHeight}px`;
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={style.modal}
      ref={modalRef}
      onClick={({ target, currentTarget }) => {
        if (target === currentTarget) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}
