import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import {
  removeNote,
  copyNote,
  uncheckAllListItems,
  removeCheckedListItems,
  textNoteToList,
  listNoteToText,
  setNotePopup,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */
import style from './PopupMenu-cfg.module.scss';

// КОМПОНЕНТ УВЕДОМЛЕНИЯ / NOTIFICATION
// *
function PopupMenu({ items }) {
  return (
    <ul className={style['popup-menu']}>
      {items.map((item) => (
        <li className={style['popup-menu__item']}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <span onClick={item.onClick}>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function getMenuItems({
  index,
  isFieldsFilled,
  isList,
  hasMarkedItems,
  remove,
  copy,
  uncheckAll,
  removeChecked,
  textToList,
  listToText,
  setPopup,
} = {}) {
  const menuItems = [{ text: 'Добавить ярлык' }, { text: 'Добавить рисунок' }];
  if (isFieldsFilled) {
    menuItems.unshift({
      text: 'Удалить заметку',
      onClick() {
        remove([index]);
      },
    });
    menuItems.push({
      text: 'Создать копию',
      onClick() {
        setPopup(index, '');
        copy(index);
      },
    });
  }
  if (isList) {
    if (hasMarkedItems) {
      menuItems.push(
        {
          text: 'Снять все флажки',
          onClick() {
            uncheckAll(index);
          },
        },
        {
          text: 'Удалить отмеченные пункты',
          onClick() {
            removeChecked(index);
          },
        }
      );
    }
    menuItems.push({
      text: 'Обычный текст',
      onClick() {
        listToText(index);
      },
    });
  } else {
    menuItems.push({
      text: 'В виде списка',
      onClick() {
        textToList(index);
      },
    });
  }
  if (isFieldsFilled) {
    menuItems.push({ text: 'Скопировать в Google Документы' });
  }

  return menuItems;
}

function PopupMenuContainer({ notes, index, hasMarkedItems, ...props }) {
  const {
    remove,
    copy,
    uncheckAll,
    removeChecked,
    textToList,
    listToText,
    setPopup,
  } = props;
  const { type, headerText, text, items } = notes[index];
  let isFieldsFilled = false;
  if (
    (headerText && headerText !== '') ||
    (type === 'default' && text && text !== '') ||
    (type === 'list' && items && !!items.length)
  ) {
    isFieldsFilled = true;
  }
  return (
    <PopupMenu
      items={getMenuItems({
        index,
        isList: type === 'list',
        isFieldsFilled,
        hasMarkedItems,
        remove,
        copy,
        uncheckAll,
        removeChecked,
        textToList,
        listToText,
        setPopup,
      })}
    />
  );
}

function mapStateToProps(state) {
  return { notes: state.main.notes };
}

export default connect(mapStateToProps, {
  remove: removeNote,
  copy: copyNote,
  uncheckAll: uncheckAllListItems,
  removeChecked: removeCheckedListItems,
  textToList: textNoteToList,
  listToText: listNoteToText,
  setPopup: setNotePopup,
})(PopupMenuContainer);
