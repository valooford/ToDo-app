import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
/* eslint-disable import/no-unresolved */
import { useEffectOnMouseDownOutside } from '@/utils';

import Note, { style, listItemStyle } from '@components/Note/Note';
import PopupMenu from '@components/PopupMenu/PopupMenu.container';
import PopupColors from '@components/PopupColors/PopupColors.container';
import PopupReminder from '@components/PopupReminder/PopupReminder.container';
import Reminder from '@components/Reminder/Reminder.container';

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
  isFiller,
  focusInfo = {},
  isSelected,
  onFocusInfoChange,
  notes,
  onClose,
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

  // havePopupBeenClosed used to set the focus after popup's actions
  const [havePopupBeenClosed, setHavePopupBeenClosed] = useState(false);
  useEffect(() => {
    if (!havePopupBeenClosed) {
      setHavePopupBeenClosed(false);
    }
  }, [havePopupBeenClosed]);

  const [noteFocusInfo, setNoteFocusInfo] = useState(focusInfo);
  useEffect(() => {
    if (noteFocusInfo && noteFocusInfo.fieldName && onFocusInfoChange) {
      onFocusInfoChange(noteFocusInfo);
    }
  }, [noteFocusInfo]);

  // detecting click inside note[0]
  const setIsTouched = useEffectOnMouseDownOutside(() => {
    onNoteBlur(index);
    if (index === 0) {
      onNoteAdd();
    }
  }, [index === 0 && note.isFocused]);

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
  let onMouseDown = null;
  if (index === 0) {
    onMouseDown = () => {
      setIsTouched(); // клик был осуществлен в пределах note
    };
  } else {
    onClick = ({ target }) => {
      const nonFocusingElementsSelectors = [
        style.note__check,
        style.note__cornerButtons,
        style.note__buttons,
        style.note__info,
        listItemStyle.listItem__checkbox,
      ].map((s) => `.${s}`);
      if (nonFocusingElementsSelectors.every((s) => !target.closest(s))) {
        onNoteFocus(index);
      }
    };
  }

  const moreButtonRef = useRef(null);
  const colorsButtonRef = useRef(null);
  const popupColorsItemToFocusRef = useRef(null);
  const reminderButtonRef = useRef(null);

  let colorsButtonMouseLeaveTimerId;

  return (
    <Note
      noteData={{
        isAdd: index === 0, //-
        type: note.type,
        headerText: note.headerText,
        text: note.text,
        items: unmarkedItems,
        markedItems,
        isFocused: note.isFocused,
        creationDate: note.creationDate,
        editingDate: note.editingDate,
      }}
      popup={
        !isFiller && {
          menu: popup === 'menu' && (
            <PopupMenu
              index={index}
              hasMarkedItems={markedItems && !!markedItems.length}
              callerRef={moreButtonRef}
              handleClose={(isSilent) => {
                setPopup(index, null);
                if (!isSilent) {
                  setHavePopupBeenClosed(true);
                }
              }}
            />
          ),
          colors: popup === 'colors' && (
            <PopupColors
              index={index}
              callerRef={colorsButtonRef}
              itemToFocusRef={popupColorsItemToFocusRef}
              handleClose={(isSilent) => {
                setPopup(index, null);
                if (!isSilent) {
                  setHavePopupBeenClosed(true);
                }
              }}
              onHover={() => {
                clearTimeout(colorsButtonMouseLeaveTimerId);
              }}
            />
          ),
          reminder: popup === 'reminder' && (
            <PopupReminder
              index={index}
              callerRef={reminderButtonRef}
              handleClose={(isSilent) => {
                setPopup(index, null);
                if (!isSilent) {
                  setHavePopupBeenClosed(true);
                }
              }}
            />
          ),
        }
      }
      extra={index !== 0 ? <Reminder index={index} /> : null}
      refs={{
        moreButton: moreButtonRef,
        colorsButton: colorsButtonRef,
        reminderButton: reminderButtonRef,
      }}
      eventHandlers={{
        onClick,
        onMouseDown,
        onClose: () => {
          if (onClose && note.isFocused) {
            onClose();
          }
          onNoteBlur(index);

          if (index === 0) {
            onNoteAdd();
          }
        },
        onHeaderChange: ({ target: { value: headerText } }) => {
          onHeaderChange(index, headerText);
        },
        onHeaderFocus: ({ target }) => {
          setNoteFocusInfo({
            fieldName: 'header',
            caret: target.selectionStart,
          });
        },
        onTextFieldChange: ({ target: { value: text } }) => {
          onTextFieldChange(index, text);
        },
        onTextFieldFocus: ({ target }) => {
          setNoteFocusInfo({
            fieldName: 'textfield',
            caret: target.selectionStart,
          });
        },
        onListItemAdd: ({ target: { value: itemText } }) => {
          if (itemText !== '') {
            onListItemAdd(index, itemText);
          }
        },
        listItemMouseUpHandlerCreator: (isMarked, itemIndex) => ({
          target,
        }) => {
          setNoteFocusInfo({
            fieldName: isMarked ? 'marked-list-item' : 'unmarked-list-item',
            itemIndex,
            caret: target.selectionStart,
          });
        },
        onMoreButtonClick: () => {
          clearTimeout(colorsButtonMouseLeaveTimerId);
          setPopup(index, 'menu');
        },
        onColorsButtonClick: () => {
          clearTimeout(colorsButtonMouseLeaveTimerId);
          setPopup(index, 'colors');
          setTimeout(() => {
            popupColorsItemToFocusRef.current.focus();
          }, 0);
        },
        onColorsButtonHover:
          popup === null || popup === 'colors'
            ? () => {
                clearTimeout(colorsButtonMouseLeaveTimerId);
                setPopup(index, 'colors');
              }
            : null,
        onColorsButtonMouseLeave:
          popup === 'colors'
            ? () => {
                colorsButtonMouseLeaveTimerId = setTimeout(() => {
                  setPopup(index, null);
                }, 1000);
              }
            : null,
        onReminderButtonClick: () => {
          clearTimeout(colorsButtonMouseLeaveTimerId);
          setPopup(index, 'reminder');
        },
      }}
      focusInfo={
        havePopupBeenClosed
          ? // default focusInfo after popup's actions
            {
              fieldName: note.type === 'list' ? 'add-list-item' : 'textfield',
            }
          : focusInfo
      }
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
  }),
  React.memo
)(NoteContainer);
