import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import Note from '@components/Note/Note';
import PopupMenu from '@components/PopupMenu/PopupMenu.container';

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

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ NOTE
// *
function NoteContainer({
  index,
  notes,
  onClick,
  onHeaderChange,
  onTextFieldChange,
  onListItemAdd,
  onListItemChange,
  onListItemRemove,
  onListItemCheck,
  onListItemUncheck,
  setPopup,
}) {
  const note = notes[index];
  const { items, popup } = note;
  let itemsCopy;
  let unmarkedItems;
  let markedItems;
  if (items) {
    // adding indexes to items and sub items
    itemsCopy = items.map((item, i) => {
      return {
        ...item,
        sub: item.sub.map((subItem, si) => ({
          ...subItem,
          index: si,
          onChange({ target: { value: itemText } }) {
            onListItemChange(index, itemText, i, si);
          },
          onRemove() {
            onListItemRemove(index, i, si);
          },
        })),
        index: i,
        onChange({ target: { value: itemText } }) {
          onListItemChange(index, itemText, i);
        },
        onRemove() {
          onListItemRemove(index, i);
        },
      };
    });
    unmarkedItems = itemsCopy
      .filter((item) => !item.isMarked)
      .map((item) => {
        const { index: i, ...pureItem } = item;
        return {
          ...pureItem,
          sub: item.sub
            .filter((subItem) => !subItem.isMarked)
            .map((subItem) => {
              const { index: si, ...pureSubItem } = subItem;
              return {
                ...pureSubItem,
                onCheck() {
                  onListItemCheck(index, i, si);
                },
              };
            }),
          onCheck() {
            onListItemCheck(index, i);
          },
        };
      });
    markedItems = itemsCopy
      .map((item) => ({
        ...item,
        sub: item.sub.filter((subItem) => subItem.isMarked),
      }))
      .filter((item) => item.isMarked || item.sub.length > 0)
      .map((item) => {
        const { index: i, ...pureItem } = item;
        return {
          ...pureItem,
          sub: item.sub.map((subItem) => {
            const { index: si, ...pureSubItem } = subItem;
            return {
              ...pureSubItem,
              onCheck() {
                onListItemUncheck(index, i, si);
              },
            };
          }),
          onCheck() {
            onListItemUncheck(index, i);
          },
        };
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
      popup={{
        menu: popup === 'menu' && (
          <PopupMenu
            index={index}
            hasMarkedItems={markedItems && !!markedItems.length}
          />
        ),
      }}
      eventHandlers={{
        onClick,
        onHeaderChange: ({ target: { value: headerText } }) => {
          onHeaderChange(index, headerText);
        },
        onTextFieldChange: ({ target: { value: text } }) => {
          onTextFieldChange(index, text);
        },
        onListItemAdd: ({ target: { value: itemText } }) => {
          if (itemText !== '') {
            onListItemAdd(index, itemText);
          }
        },
        onMoreButtonClick() {
          function popupDisappearanceHandler() {
            // const closestPopup = e.target.closest(
            //   `*:nth-of-type(${index + 1}) > .note .popup-menu`
            // );
            // if (!closestPopup) {
            setPopup(index, '');
            document.removeEventListener('click', popupDisappearanceHandler);
            // }
          }
          setPopup(index, 'menu');
          if (popup !== 'menu') {
            setTimeout(() => {
              document.addEventListener('click', popupDisappearanceHandler);
            }, 0);
          }
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
  onHeaderChange: updateNoteHeader,
  onTextFieldChange: updateNoteText,
  onListItemAdd: addNoteListItem,
  onListItemChange: updateNoteListItem,
  onListItemRemove: removeNoteListItem,
  onListItemCheck: checkNoteListItem,
  onListItemUncheck: uncheckNoteListItem,
  setPopup: setNotePopup,
})(NoteContainer);
