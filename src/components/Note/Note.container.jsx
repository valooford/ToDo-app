import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
/* eslint-disable import/no-unresolved */
import Note, { style } from '@components/Note/Note';
import PopupMenu from '@components/PopupMenu/PopupMenu.container';

import {
  focusNote,
  blurNote,
  addNewNote,
  updateNoteHeader,
  updateNoteText,
  addNoteListItem,
  updateNoteListItem,
  removeNoteListItem,
  checkNoteListItem,
  uncheckNoteListItem,
  setNotePopup,
} from '@store/mainReducer';
import { closeModal } from '@store/modalReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ NOTE
// *
function NoteContainer({
  index,
  focusInfo = {},
  isSelected,
  onFocusInfoChange,
  notes,
  onNoteFocus,
  onNoteBlur,
  onNoteAdd,
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

  const [noteFocusInfo, setNoteFocusInfo] = useState(focusInfo);
  useEffect(() => {
    if (noteFocusInfo && noteFocusInfo.fieldName && onFocusInfoChange) {
      onFocusInfoChange(noteFocusInfo);
    }
    // console.log(noteFocusInfo);
  }, [noteFocusInfo]);

  // logic below are used to detect click inside note[0]
  // popup is a part of note, but when clicked it is removed and
  // not considered as a part of note anymore
  // *
  // click inside note
  const [isTouched, setIsTouched] = useState(false);
  // handled by global handler
  const [globalClick, setGlobalClick] = useState(null);

  const globalClickListener = () => {
    setGlobalClick((prev) => !prev);
  };
  useEffect(() => {
    if (globalClick === null) return;
    if (!isTouched) {
      onNoteBlur(index);
      if (index === 0) {
        onNoteAdd();
      }
      document.removeEventListener('click', globalClickListener);
    } else {
      setIsTouched(false);
    }
  }, [globalClick]);
  useEffect(() => {
    if (index !== 0 || !note.isFocused) return undefined;
    document.addEventListener('click', globalClickListener);
    return () => {
      document.removeEventListener('click', globalClickListener);
    };
  }, [note.isFocused]);
  // *

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

  let onClick = null;
  if (index === 0) {
    onClick = () => {
      setIsTouched(true); // клик был осуществлен в пределах note
    };
  } else {
    onClick = ({ target }) => {
      const nonFocusingElementsSelectors = [
        style.note__check,
        style.note__cornerButtons,
        style.note__buttons,
        style.note__info,
      ].map((s) => `.${s}`);
      if (nonFocusingElementsSelectors.every((s) => !target.closest(s))) {
        onNoteFocus(index);
      } else {
        setNoteFocusInfo({
          fieldName: note.type === 'list' ? 'add-list-item' : 'textfield',
        });
      }
    };
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
        onClose: () => {
          onNoteBlur(index);
          if (index === 0) {
            onNoteAdd();
          }
        },
        onHeaderChange: ({ target: { value: headerText } }) => {
          onHeaderChange(index, headerText);
        },
        onHeaderFocus: () => {
          setNoteFocusInfo({ fieldName: 'header' });
        },
        onTextFieldChange: ({ target: { value: text } }) => {
          onTextFieldChange(index, text);
        },
        onTextFieldFocus: () => {
          setNoteFocusInfo({ fieldName: 'textfield' });
        },
        onListItemAdd: ({ target: { value: itemText } }) => {
          if (itemText !== '') {
            onListItemAdd(index, itemText);
          }
        },
        listItemFocusHandlerCreator: (isMarked, itemIndex) => () => {
          setNoteFocusInfo({
            fieldName: isMarked ? 'marked-list-item' : 'unmarked-list-item',
            itemIndex,
          });
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
      focusInfo={focusInfo}
      isSelected={isSelected}
    />
  );
}

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNoteBlur(index) {
      dispatch(blurNote(index));
      dispatch(closeModal());
    },
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, {
    onNoteFocus: focusNote,
    onNoteAdd: addNewNote,
    onHeaderChange: updateNoteHeader,
    onTextFieldChange: updateNoteText,
    onListItemAdd: addNoteListItem,
    onListItemChange: updateNoteListItem,
    onListItemRemove: removeNoteListItem,
    onListItemCheck: checkNoteListItem,
    onListItemUncheck: uncheckNoteListItem,
    setPopup: setNotePopup,
  })
)(NoteContainer);
