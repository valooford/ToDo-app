import './Textarea-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ТЕКСТОВОГО ПОЛЯ / TEXTAREA
// *
function Textarea({ placeholder = '', value = '', onInput, onBlur } = {}) {
  const TextareaElement = setupBuilder('template-textarea')({
    '.textarea': {
      props: { placeholder, value },
      eventHandlers: {
        input: onInput,
        blur: onBlur,
      },
    },
  });

  return TextareaElement;
}

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

export default function TextareaContainer(props) {
  const { onInput, ...newProps } = props;

  const TextareaElement = Textarea({
    ...newProps,
    onInput(e) {
      if (onInput) onInput(e);
      handleAutoResize(e.target);
    },
    creationCallback: handleAutoResize,
  });

  // calculate textarea size after creation
  setTimeout(() => {
    handleAutoResize(TextareaElement);
  }, 0);
  return TextareaElement;
}
