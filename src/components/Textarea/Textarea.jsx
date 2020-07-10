import './Textarea-cfg.scss';
import React, { useRef, useEffect } from 'react';

/* eslint-disable no-param-reassign */
function handleAutoResize(textarea) {
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
}
/* eslint-enable no-param-reassign */

// КОМПОНЕНТ ТЕКСТОВОГО ПОЛЯ / TEXTAREA
// *
export default function Textarea({
  placeholder = '',
  value = '',
  onInput,
  onBlur,
}) {
  const textareaRef = useRef(null);
  useEffect(() => {
    handleAutoResize(textareaRef.current);
  });
  return (
    <textarea
      className="textarea"
      rows="1"
      ref={textareaRef}
      placeholder={placeholder}
      value={value}
      // readOnly
      onInput={onInput}
      // onBlur={onBlur}
      onChange={onBlur}
    />
  );
}
