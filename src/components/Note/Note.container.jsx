import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
import PopupMenu from '@components/PopupMenu/PopupMenu.container';
import Note from '@components/Note/Note';

import {
  updateNoteHeader,
  updateNoteText,
  addNoteListItem,
  updateNoteListItem,
  removeNoteListItem,
  checkNoteListItem,
  uncheckNoteListItem,
  setNotePopup,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

// функция получения массива кнопок для Note
function getNoteButtons({ index, popup, showPopup, hasMarkedItems }) {
  return [
    {
      iconSymbol: '\uf0f3',
      titleText: 'Сохранить напоминание',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue803',
      titleText: 'Соавторы',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue804',
      titleText: 'Изменить цвет',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue802',
      titleText: 'Добавить картинку',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue805',
      titleText: 'Архивировать',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue81f',
      titleText: 'Ещё',
      modificators:
        popup === 'menu'
          ? ['icon-button_smaller', 'icon-button_no-hover']
          : 'icon-button_smaller',
      onClick() {
        function popupDisappearanceHandler() {
          // const closestPopup = e.target.closest(
          //   `*:nth-of-type(${index + 1}) > .note .popup-menu`
          // );
          // if (!closestPopup) {
          showPopup(index, '');
          document.removeEventListener('click', popupDisappearanceHandler);
          // }
        }

        showPopup(index, 'menu');
        if (popup !== 'menu') {
          setTimeout(() => {
            document.addEventListener('click', popupDisappearanceHandler);
          }, 0);
        }
      },
      append: popup === 'menu' && (
        <PopupMenu index={index} hasMarkedItems={hasMarkedItems} />
      ),
    },
    {
      iconSymbol: '\ue807',
      titleText: 'Отменить',
      modificators: 'icon-button_smaller',
      // disabled: true,
    },
    {
      iconSymbol: '\ue808',
      titleText: 'Повторить',
      modificators: 'icon-button_smaller',
      // disabled: true,
    },
  ].map((params) => (
    <IconButton
      iconSymbol={params.iconSymbol}
      titleText={params.titleText}
      modificators={params.modificators}
      onClick={params.onClick}
    >
      {params.append}
    </IconButton>
  ));
}

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ NOTE
// *
function NoteContainer({
  index,
  notes,
  onClick,
  onHeaderBlur,
  onTextFieldBlur,
  onListItemAdd,
  onListItemBlur,
  onListItemRemove,
  onListItemCheck,
  onListItemUncheck,
  showPopup,
}) {
  const note = notes[index];
  const { items, popup } = note;
  let itemsCopy;
  let unmarkedItems;
  let markedItems;
  if (items) {
    // adding indexes to items and sub items
    itemsCopy = items.map((item, i) => ({ ...item, index: i }));
    itemsCopy.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.map((subItem, i) => ({ ...subItem, index: i }));
    });
    unmarkedItems = itemsCopy.filter((item) => !item.isMarked);
    unmarkedItems.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.filter((subItem) => !subItem.isMarked);
    });
    markedItems = itemsCopy.filter((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.filter((subItem) => subItem.isMarked);
      return item.isMarked || item.sub.length > 0;
    });
  }
  return (
    <Note
      noteData={{
        type: note.type,
        headerText: note.headerText,
        text: note.text,
        items: unmarkedItems,
        markedItems,
        isFocused: note.isFocused,
        creationDate: note.creationDate,
        editingDate: note.editingDate,
      }}
      buttons={getNoteButtons({
        index,
        popup,
        showPopup,
        hasMarkedItems: markedItems && !!markedItems.length,
      })}
      eventHandlers={{
        onClick,
        onHeaderBlur: ({ target: { value: headerText } }) => {
          onHeaderBlur(index, headerText);
        },
        onTextFieldBlur: ({ target: { value: text } }) => {
          onTextFieldBlur(index, text);
        },
        onListItemAdd: ({ target: { value: itemText } }) => {
          if (itemText !== '') {
            onListItemAdd(index, itemText);
          }
        },
        onListItemBlur: (itemNum, subNum) => ({
          target: { value: itemText },
        }) => {
          onListItemBlur(index, itemText, itemNum, subNum);
        },
        onListItemRemove: (itemNum) => () => {
          onListItemRemove(index, itemNum);
        },
        onListItemCheck: (itemNum) => () => {
          onListItemCheck(index, itemNum);
        },
        onListItemUncheck: (itemNum) => () => {
          onListItemUncheck(index, itemNum);
        },
      }}
    />
  );
}

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
  };
}

export default connect(mapStateToProps, {
  onHeaderBlur: updateNoteHeader,
  onTextFieldBlur: updateNoteText,
  onListItemAdd: addNoteListItem,
  onListItemBlur: updateNoteListItem,
  onListItemRemove: removeNoteListItem,
  onListItemCheck: checkNoteListItem,
  onListItemUncheck: uncheckNoteListItem,
  showPopup: setNotePopup,
})(NoteContainer);
