import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
/* eslint-disable import/no-unresolved */
import PopupMenu from '@components/PopupMenu/PopupMenu';

import {
  removeNote,
  copyNote,
  uncheckAllListItems,
  removeCheckedListItems,
  textNoteToList,
  listNoteToText,
} from '@store/mainReducer';
import { closeModal } from '@store/modalReducer';
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
  closePopup,
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

  return menuItems.map((i) => ({
    ...i,
    onClick: (e) => {
      closePopup();
      if (i.onClick) i.onClick(e);
    },
  }));
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
    handleClose,
    onRemove,
    onCopy,
    onUncheckAll,
    onRemoveChecked,
    onTextToList,
    onListToText,
  } = props;
  const keyDownHandler = (e) => {
    // Tab or Esc
    if (e.keyCode === 9 || e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation(); // prevent a focused note from blurring
      callerRef.current.focus();
      handleClose(true);
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
        closePopup: () => {
          handleClose();
        },
      })}
      onKeyDown={keyDownHandler}
    />
  );
}

function mapStateToProps(state) {
  return { notes: state.main.notes };
}

function mapDispatchToProps(dispatch) {
  return {
    onRemove(index) {
      dispatch(removeNote(index));
      dispatch(closeModal());
    },
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, {
    onCopy: copyNote,
    onUncheckAll: uncheckAllListItems,
    onRemoveChecked: removeCheckedListItems,
    onTextToList: textNoteToList,
    onListToText: listNoteToText,
  })
)(PopupMenuContainer);
