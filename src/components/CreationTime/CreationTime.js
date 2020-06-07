import './CreationTime-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupTitle from '@components/Title/Title';
/* eslint-enable import/no-unresolved */

export default function setupCreationTime(text, titleText) {
  return setupBuilder('template-creation-time')({
    '.creation-time': {
      prepend: text,
    },
    '.creation-time__title': {
      append: setupTitle(titleText),
    },
  });
}
