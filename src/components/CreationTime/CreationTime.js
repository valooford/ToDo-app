import './CreationTime-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import Title from '@components/Title/Title';
/* eslint-enable import/no-unresolved */

export default function CreationTime(text, titleText) {
  return setupBuilder('template-creation-time')({
    '.creation-time': {
      prepend: text,
    },
    '.creation-time__title': {
      append: Title(titleText),
    },
  });
}
