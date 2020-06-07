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
  onBlur,
  onRemove,
  onCheck,
} = {}) {
  return setupBuilder('template-list-item')({
    '.listItem': {
      modificators: [type],
    },
    '.listItem__checkbox': {
      cut: type === 'add',
      html: isChecked && '&#xe800;',
      eventHandlers: { click: onCheck },
    },
    '.listItem__drag': {
      cut: type === 'add',
    },
    '.listItem__remove': {
      cut: type === 'add',
      append:
        type === 'default' &&
        setupIconButton({
          iconSymbol: '&#xe80c;',
          titleText: 'Удалить',
          modificator: 'icon-button_tiny',
          onClick: onRemove,
        }),
    },
    '.listItem__add': {
      cut: type === 'default',
    },
    '.listItem__text': {
      append:
        (type === 'add' &&
          setupTextarea({
            placeholder: 'Новый пункт',
            onInput,
          })) ||
        (type === 'default' && setupTextarea({ value: text, onBlur })),
    },
  });
}
