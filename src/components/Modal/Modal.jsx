import React, { useEffect } from 'react';
import style from './Modal.module.scss';

function Modal({ callback, closeModal }, ref) {
  const modalRef = ref;
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
  useEffect(() => {
    if (ref.current.children.length === 0) {
      modalRef.current.style.display = 'none';
    } else {
      modalRef.current.style.display = 'block';
    }
  }, [callback]);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={style.modal}
      ref={modalRef}
      onClick={({ target, currentTarget }) => {
        if (target === currentTarget) {
          callback();
          closeModal();
        }
      }}
    />
  );
}

export default React.forwardRef(Modal);
