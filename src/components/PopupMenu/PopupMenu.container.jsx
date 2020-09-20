import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
/* eslint-disable import/no-unresolved */
import { useEffectOnMouseDownOutside, associativeArrToArr } from '@/utils';

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
      onClick: onRemove,
    });
    menuItems.push({
      text: 'Создать копию',
      key: 'copy',
      onClick: onCopy,
    });
  }
  if (isList) {
    if (hasMarkedItems) {
      menuItems.push(
        {
          text: 'Снять все флажки',
          key: 'uncheck',
          onClick: onUncheckAll,
        },
        {
          text: 'Удалить отмеченные пункты',
          key: 'remove checked',
          onClick: onRemoveChecked,
        }
      );
    }
    menuItems.push({
      text: 'Обычный текст',
      key: 'to text',
      onClick: onListToText,
    });
  } else {
    menuItems.push({
      text: 'В виде списка',
      key: 'to list',
      onClick: onTextToList,
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
      handleClose();
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
  const [noteId] = associativeArrToArr(id);
  return {
    noteType: state.main.notesData[noteId].type,
    noteHeader: state.main.notesData[noteId].headerText,
    noteText: state.main.notesData[noteId].type,
    noteItemsOrder: state.main.notesData[noteId].itemsOrder,
  };
}

function mapDispatchToProps(dispatch, { id, onRemove }) {
  return bindActionCreators(
    {
      onRemove() {
        if (onRemove) onRemove();
        return removeNote(id);
      },
      onCopy: () => copyNote(id),
      onUncheckAll: () => uncheckAllListItems(id),
      onRemoveChecked: () => removeCheckedListItems(id),
      onTextToList: () => textNoteToList(id),
      onListToText: () => listNoteToText(id),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupMenuContainer);
