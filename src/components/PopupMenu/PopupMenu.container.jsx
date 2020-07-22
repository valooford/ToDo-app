import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import PopupMenu from '@components/PopupMenu/PopupMenu';

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

// функция получения элементов всплывающего меню
function getMenuItems({
  index,
  isFieldsFilled,
  isList,
  hasMarkedItems,
  onRemove,
  onCopy,
  onUncheckAll,
  onRemoveChecked,
  onTextToList,
  onListToText,
  setPopup,
} = {}) {
  const menuItems = [
    { text: 'Добавить ярлык', key: 'tag' },
    { text: 'Добавить рисунок', key: 'paint' },
  ];
  if (isFieldsFilled) {
    menuItems.unshift({
      text: 'Удалить заметку',
      key: 'remove',
      onClick() {
        onRemove([index]);
      },
    });
    menuItems.push({
      text: 'Создать копию',
      key: 'copy',
      onClick() {
        setPopup(index, '');
        onCopy(index);
      },
    });
  }
  if (isList) {
    if (hasMarkedItems) {
      menuItems.push(
        {
          text: 'Снять все флажки',
          key: 'uncheck',
          onClick() {
            onUncheckAll(index);
          },
        },
        {
          text: 'Удалить отмеченные пункты',
          key: 'remove checked',
          onClick() {
            onRemoveChecked(index);
          },
        }
      );
    }
    menuItems.push({
      text: 'Обычный текст',
      key: 'to text',
      onClick() {
        onListToText(index);
      },
    });
  } else {
    menuItems.push({
      text: 'В виде списка',
      key: 'to list',
      onClick() {
        onTextToList(index);
      },
    });
  }
  if (isFieldsFilled) {
    menuItems.push({ text: 'Скопировать в Google Документы', key: 'docs' });
  }

  return menuItems;
}

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ POPUP-MENU
// *
function PopupMenuContainer({
  notes,
  index,
  hasMarkedItems,
  callerRef,
  ...props
}) {
  const {
    onClose,
    onRemove,
    onCopy,
    onUncheckAll,
    onRemoveChecked,
    onTextToList,
    onListToText,
    setPopup,
  } = props;
  const keyDownHandler = (e) => {
    // Tab or Esc
    if (e.keyCode === 9 || e.keyCode === 27) {
      e.preventDefault();
      callerRef.current.focus();
      onClose();
    }
  };
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
        onRemove,
        onCopy,
        onUncheckAll,
        onRemoveChecked,
        onTextToList,
        onListToText,
        setPopup,
      })}
      onKeyDown={keyDownHandler}
    />
  );
}

function mapStateToProps(state) {
  return { notes: state.main.notes };
}

export default connect(mapStateToProps, {
  onRemove: removeNote,
  onCopy: copyNote,
  onUncheckAll: uncheckAllListItems,
  onRemoveChecked: removeCheckedListItems,
  onTextToList: textNoteToList,
  onListToText: listNoteToText,
  setPopup: setNotePopup,
})(PopupMenuContainer);
