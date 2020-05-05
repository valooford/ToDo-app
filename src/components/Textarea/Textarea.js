import './Textarea-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ТЕКСТОВОГО ПОЛЯ / TEXTAREA
// *
export default function setupTextarea({
  placeholder = '',
  value = '',
  refs = { textarea: {} },
  onInput,
} = {}) {
  const Textarea = setupBuilder('template-textarea')({
    props: { placeholder, value },
    eventHandlers: {
      input: (e) => {
        // IE 11 fires input event when placeholder is set
        if (onInput && e.target.value !== '') {
          onInput();
        }
      },
    },
  });
  // eslint-disable-next-line no-param-reassign
  refs.textarea.ref = Textarea;
  return Textarea;
}
