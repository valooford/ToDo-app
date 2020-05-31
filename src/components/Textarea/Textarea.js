import './Textarea-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

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

// ШАБЛОН ТЕКСТОВОГО ПОЛЯ / TEXTAREA
// *
export default function setupTextarea({
  placeholder = '',
  value = '',
  refs = { textarea: {} },
  onInput = [],
  onBlur = [],
} = {}) {
  const Textarea = setupBuilder('template-textarea')({
    props: { placeholder, value },
    eventHandlers: {
      input: [
        onInput,
        (e) => {
          handleAutoResize(e.target);
        },
      ],
      blur: onBlur,
    },
  });
  // eslint-disable-next-line no-param-reassign
  refs.textarea.ref = Textarea;
  setTimeout(() => {
    handleAutoResize(refs.textarea.ref);
  }, 0);

  return Textarea;
}
