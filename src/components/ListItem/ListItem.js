import './ListItem-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import Textarea from '@components/Textarea/Textarea';
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ЭЛЕМЕНТА СПИСКА / LIST-ITEM
// *
export default function ListItem({
  type = 'default',
  isChecked = false,
  text = '',
  onInput,
  onBlur,
  onRemove,
  onCheck,
  dragIconSymbol = '&#xe811;',
  addIconSymbol = '&#xe810;',
  checkIconSymbol = '&#xe800;',
  removeButtonParams = {
    iconSymbol: '&#xe80c;',
    titleText: 'Удалить',
    modificators: 'icon-button_tiny',
    onClick: onRemove,
  },
} = {}) {
  return setupBuilder('template-list-item')({
    '.listItem': {
      modificators: [type],
    },
    '.listItem__checkbox': {
      cut: type === 'add',
      html: isChecked && checkIconSymbol,
      eventHandlers: { click: onCheck },
    },
    '.listItem__drag': {
      cut: type === 'add',
      html: dragIconSymbol,
    },
    '.listItem__remove': {
      cut: type === 'add',
      append: type === 'default' && IconButton(removeButtonParams),
    },
    '.listItem__add': {
      cut: type === 'default',
      html: addIconSymbol,
    },
    '.listItem__text': {
      append:
        (type === 'add' &&
          Textarea({
            placeholder: 'Новый пункт',
            onInput,
          })) ||
        (type === 'default' && Textarea({ value: text, onBlur })),
    },
  });
}
