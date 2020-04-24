import './Note-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
import setupTextarea from '@components/Textarea/Textarea';
import setupNotification from '@components/Notification/Notification';
import setupCreationTime from '@components/CreationTime/CreationTime';
import setupListItem from '@components/ListItem/ListItem';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ЗАМЕТКИ / NOTE
// *
export default function setupNote({ type = 'default' } = {}) {
  return setupBuilder('template-note')({
    insert: {
      '.note__check': {
        setup: setupIconButton,
        set: [['&#xe80b;', 'Выбрать заметку', 'icon-button_no-padding']],
      },
      '.note__cornerButtons': {
        setup: setupIconButton,
        set: [['&#xe812;', 'Закрепить заметку', 'icon-button_smaller']],
      },
      '.note__text': {
        setup: setupTextarea,
        set: [['Заметка...']],
      },
      '.note__info': {
        setup: setupNotification,
      },
      '.note__creationTime': {
        setup: setupCreationTime,
        set: [['Изменено: вчера, 20:30', 'Создано 8 апр.']],
      },
      '.note__buttons': {
        setup: setupIconButton,
        set: [
          ['&#xf0f3;', 'Сохранить напоминание', 'icon-button_smaller'],
          ['&#xe803;', 'Соавторы', 'icon-button_smaller'],
          ['&#xe804;', 'Изменить цвет', 'icon-button_smaller'],
          ['&#xe802;', 'Добавить картинку', 'icon-button_smaller'],
          ['&#xe805;', 'Архивировать', 'icon-button_smaller'],
          ['&#xe81f;', 'Ещё', 'icon-button_smaller'],
          ['&#xe807;', 'Отменить', 'icon-button_smaller', true],
          ['&#xe808;', 'Повторить', 'icon-button_smaller', true],
        ],
      },
      '.notification__close': {
        setup: setupIconButton,
        set: [['&#xe80c;', 'Удалить напоминание', 'icon-button_notification']],
      },
    },
    modificators: [type],
    cut: {
      list: ['.note__text'],
      default: ['.note__listWrapper'],
    },
    add: {
      list: {
        '.note__list': {
          setup: setupListItem,
          set: [[], [{ type: 'add' }]],
        },
        '.note__markedList .note__list': {
          setup: setupListItem,
        },
      },
    },
  });
}
