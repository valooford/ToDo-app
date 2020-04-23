import './ListItem-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupTextarea from '@components/Textarea/Textarea';
import setupIconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ЭЛЕМЕНТА СПИСКА / LIST-ITEM
// *
export default function setupListItem({ type = 'default' } = {}) {
  return setupBuilder('template-list-item')({
    modificators: [type],
    cut: {
      add: ['.listItem__drag', '.listItem__checkbox', '.listItem__remove'],
      default: ['.listItem__add'],
    },
    add: {
      add: {
        '.listItem__text': {
          setup: setupTextarea,
          set: [['Новый пункт']],
        },
      },
      default: {
        '.listItem__text': {
          setup: setupTextarea,
        },
        '.listItem__remove': {
          setup: setupIconButton,
          set: [['&#xe80c;', 'Удалить', 'icon-button_tiny']],
        },
      },
    },
  });
}
