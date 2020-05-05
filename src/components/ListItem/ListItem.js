import './ListItem-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupTextarea from '@components/Textarea/Textarea';
import setupIconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ЭЛЕМЕНТА СПИСКА / LIST-ITEM
// *
export default function setupListItem({
  type = 'default',
  isChecked = false,
  text = '',
  onInput,
  onRemove,
  onCheck,
} = {}) {
  const textarea = {};
  function handleInput() {
    onInput(textarea.ref.value);
  }
  return setupBuilder('template-list-item')({
    insert: {
      '.listItem__checkbox': isChecked ? { html: '&#xe800;' } : '',
    },
    modificators: [type],
    cut: {
      add: ['.listItem__drag', '.listItem__checkbox', '.listItem__remove'],
      default: ['.listItem__add'],
    },
    add: {
      add: {
        '.listItem__text': {
          setup: setupTextarea,
          set: [
            [
              {
                placeholder: 'Новый пункт',
                refs: { textarea },
                onInput: handleInput,
              },
            ],
          ],
        },
      },
      default: {
        '.listItem__text': {
          setup: setupTextarea,
          set: [[{ value: text }]],
        },
        '.listItem__remove': {
          setup: setupIconButton,
          set: [
            [
              {
                iconSymbol: '&#xe80c;',
                titleText: 'Удалить',
                modificator: 'icon-button_tiny',
                onClick: onRemove,
              },
            ],
          ],
        },
      },
    },
    elementsEventHandlers: {
      '.listItem__checkbox': {
        click: [onCheck],
      },
    },
  });
}
