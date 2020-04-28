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
} = {}) {
  const Textarea = setupBuilder('template-textarea')({
    props: { placeholder, value },
  });
  // eslint-disable-next-line no-param-reassign
  refs.textarea.ref = Textarea;
  return Textarea;
}
