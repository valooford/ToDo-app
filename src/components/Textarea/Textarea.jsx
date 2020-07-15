import React, { useRef, useEffect } from 'react';
import style from './Textarea-cfg.module.scss';

// функция автоматического изменения высоты Textarea
/* eslint-disable no-param-reassign */
function handleAutoResize(textarea) {
  // async execution because of glitch when rendering through portal
  // (glitch: height might be 0 or less than expected)
  setTimeout(() => {
    if (textarea.value === '') {
      textarea.style.fontWeight = 'bold';
    } else {
      textarea.style.fontWeight = 'normal';
    }
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    const computedStyle = getComputedStyle(textarea);
    if (textarea.scrollHeight >= parseInt(computedStyle.maxHeight, 10)) {
      textarea.style.overflowY = 'scroll';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }, 0);
}
/* eslint-enable no-param-reassign */

// КОМПОНЕНТ ТЕКСТОВОГО ПОЛЯ / TEXTAREA
// *
export default function Textarea({ placeholder = '', value = '', onChange }) {
  const textareaRef = useRef(null);
  useEffect(() => {
    handleAutoResize(textareaRef.current);
  });
  return (
    <textarea
      className={style.textarea}
      rows="1"
      ref={textareaRef}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
