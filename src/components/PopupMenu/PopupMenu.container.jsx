import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
/* eslint-disable import/no-unresolved */
import { useEffectOnMouseDownOutside } from '@/utils';

import PopupMenu from '@components/PopupMenu/PopupMenu';

import {
  removeNote,
  copyNote,
  uncheckAllListItems,
  removeCheckedListItems,
  textNoteToList,
  listNoteToText,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

// функция получения элементов всплывающего меню
function getMenuItems({
  id,
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
        onRemove(id);
      },
    });
    menuItems.push({
      text: 'Создать копию',
      key: 'copy',
      onClick() {
        onCopy(id);
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
            onUncheckAll(id);
          },
        },
        {
          text: 'Удалить отмеченные пункты',
          key: 'remove checked',
          onClick() {
            onRemoveChecked(id);
          },
        }
      );
    }
    menuItems.push({
      text: 'Обычный текст',
      key: 'to text',
      onClick() {
        onListToText(id);
      },
    });
  } else {
    menuItems.push({
      text: 'В виде списка',
      key: 'to list',
      onClick() {
        onTextToList(id);
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
  noteType,
  noteHeader,
  noteText,
  noteItemsOrder,
  id,
  hasMarkedItems,
  onRemove,
  onCopy,
  onUncheckAll,
  onRemoveChecked,
  onTextToList,
  onListToText,
  handleClose,
}) {
  // detecting click inside popupMenu
  const setIsTouched = useEffectOnMouseDownOutside(() => {
    handleClose();
  }, []);

  const keyDownHandler = (e) => {
    // Tab or Esc
    if (e.keyCode === 9 || e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation(); // prevent a focused note from blurring
      handleClose(/* true */); // + handle different situations
    }
  };
  let isFieldsFilled = false;
  if (
    (noteHeader && noteHeader !== '') ||
    (noteType === 'default' && noteText && noteText !== '') ||
    (noteType === 'list' && noteItemsOrder && !!noteItemsOrder.length)
  ) {
    isFieldsFilled = true;
  }
  return (
    <PopupMenu
      items={getMenuItems({
        id,
        isList: noteType === 'list',
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
      onMouseDown={() => {
        setIsTouched();
      }}
      onKeyDown={keyDownHandler}
    />
  );
}

function mapStateToProps(state, { id }) {
  return {
    noteType: state.main.notesData[id].type,
    noteHeader: state.main.notesData[id].headerText,
    noteText: state.main.notesData[id].type,
    noteItemsOrder: state.main.notesData[id].itemsOrder,
  };
}

function mapDispatchToProps(dispatch, { onRemove }) {
  return {
    onRemove(index) {
      dispatch(removeNote(index));
      onRemove();
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
