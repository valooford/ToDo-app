import './CreationTime-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupTitle from '@components/Title/Title';
/* eslint-enable import/no-unresolved */

export default function setupCreationTime(text, titleText) {
  return setupBuilder('template-creation-time')({
    prepend: [text],
    insert: {
      '.creation-time__title': {
        setup: setupTitle,
        set: [[titleText]],
      },
    },
  });
}
