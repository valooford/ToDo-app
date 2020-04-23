import './Textarea-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ТЕКСТОВОГО ПОЛЯ / TEXTAREA
// *
export default function setupTextarea(placeholder = '') {
  return setupBuilder('template-textarea')({
    props: {
      placeholder,
    },
  });
}
