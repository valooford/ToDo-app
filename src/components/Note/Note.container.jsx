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
  pinNote,
  unpinNote,
  addNewNote,
  updateNoteHeader,
  updateNoteText,
  addNoteListItem,
  updateNoteListItem,
  removeNoteListItem,
  checkNoteListItem,
  uncheckNoteListItem,
  setNotePopup,
  selectNote,
  cancelNoteSelection,
} from '@store/mainReducer';
import { closeModal } from '@store/modalReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ NOTE
// *
function NoteContainer({
  id,
  isAddNote,
  isFiller,
  focusInfo,
  isSelected,
  onFocusInfoChange,
  note,
  isFocused,
  isPinned,
  popup,
  onClose,
  onNoteFocus,
  onNoteBlur,
  onNotePin,
  onNoteUnpin,
  onNoteAdd,
  onHeaderChange,
  onTextFieldChange,
  onListItemAdd,
  onListItemChange,
  onListItemRemove,
  onListItemCheck,
  onListItemUncheck,
  setPopup,
  onNoteSelection,
  onCancelNoteSelection,
}) {
  const { items, itemsOrder } = note;

  // havePopupBeenClosed used to set the focus after popup's actions
  const [havePopupBeenClosed, setHavePopupBeenClosed] = useState(false);
  useEffect(() => {
    if (!havePopupBeenClosed) {
      setHavePopupBeenClosed(false);
    }
  }, [havePopupBeenClosed]);

  const [noteFocusInfo, setNoteFocusInfo] = useState(
    focusInfo || {
      fieldName: note.type === 'list' ? 'add-list-item' : 'textfield',
    }
  );
  useEffect(() => {
    if (noteFocusInfo && noteFocusInfo.fieldName && onFocusInfoChange) {
      onFocusInfoChange(noteFocusInfo);
    }
  }, [noteFocusInfo]);

  // detecting click inside note[0]
  const setIsTouched = useEffectOnMouseDownOutside(() => {
    onNoteBlur(id);
    if (isAddNote) {
      onNoteAdd();
    }
  }, [isAddNote && isFocused]);

  let unmarkedItems;
  let markedItems;
  if (items) {
    const itemsWithHandlers = itemsOrder.map((itemId) => {
      const item = items[itemId];
      return {
        ...item,
        onChange({ target: { value: itemText } }) {
          onListItemChange(id, itemId, itemText);
        },
        onRemove() {
          onListItemRemove(id, itemId);
        },
      };
    });
    unmarkedItems = itemsWithHandlers
      .filter((item) => !item.isMarked)
      .map((item) => {
        return {
          ...item,
          onCheck() {
            onListItemCheck(id, item.id);
          },
        };
      });
    markedItems = itemsWithHandlers
      .map((item) => ({
        ...item,
        sub: item.sub.filter((subItem) => subItem.isMarked),
      }))
      .filter((item) => item.isMarked || item.sub.length > 0)
      .map((item) => {
        return {
          ...item,
          onCheck() {
            onListItemUncheck(id, item.id);
          },
        };
      });
  }

  let onClick = null;
  let onMouseDown = null;
  if (isAddNote) {
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
        onNoteFocus(id);
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
        type: note.type,
        headerText: note.headerText,
        text: note.text,
        items: unmarkedItems,
        markedItems,
        isFocused,
        isPinned,
        creationDate: note.creationDate,
        editingDate: note.editingDate,
      }}
      popup={
        !isFiller && {
          menu: popup === 'menu' && (
            <PopupMenu
              id={id}
              hasMarkedItems={markedItems && !!markedItems.length}
              callerRef={moreButtonRef}
              handleClose={(isSilent) => {
                setPopup(id, null);
                if (!isSilent) {
                  setHavePopupBeenClosed(true);
                }
              }}
            />
          ),
          colors: popup === 'colors' && (
            <PopupColors
              id={id}
              callerRef={colorsButtonRef}
              itemToFocusRef={popupColorsItemToFocusRef}
              handleClose={(isSilent) => {
                setPopup(id, null);
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
              index={id}
              callerRef={reminderButtonRef}
              handleClose={(isSilent) => {
                setPopup(id, null);
                if (!isSilent) {
                  setHavePopupBeenClosed(true);
                }
              }}
            />
          ),
        }
      }
      extra={<Reminder id={id} />}
      refs={{
        moreButton: moreButtonRef,
        colorsButton: colorsButtonRef,
        reminderButton: reminderButtonRef,
      }}
      eventHandlers={{
        onClick,
        onMouseDown,
        onClose: () => {
          if (onClose && isFocused) {
            onClose();
          }
          onNoteBlur(id);

          if (isAddNote) {
            onNoteAdd();
          }
        },
        onSelection: isSelected
          ? () => {
              onCancelNoteSelection(id);
            }
          : () => {
              onNoteSelection(id);
            },
        onPin: isPinned
          ? () => {
              onNoteUnpin(id);
            }
          : () => {
              onNotePin(id);
            },
        onHeaderChange: ({ target: { value: headerText } }) => {
          onHeaderChange(id, headerText);
        },
        onHeaderFocus: ({ target }) => {
          setNoteFocusInfo({
            fieldName: 'header',
            caret: target.selectionStart,
          });
        },
        onTextFieldChange: ({ target: { value: text } }) => {
          onTextFieldChange(id, text);
        },
        onTextFieldFocus: ({ target }) => {
          setNoteFocusInfo({
            fieldName: 'textfield',
            caret: target.selectionStart,
          });
        },
        onListItemAdd: ({ target: { value: itemText } }) => {
          if (itemText !== '') {
            onListItemAdd(id, itemText);
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
          setPopup(id, 'menu');
        },
        onColorsButtonClick: () => {
          clearTimeout(colorsButtonMouseLeaveTimerId);
          setPopup(id, 'colors');
          setTimeout(() => {
            popupColorsItemToFocusRef.current.focus();
          }, 0);
        },
        onColorsButtonHover:
          popup === null || popup === 'colors'
            ? () => {
                clearTimeout(colorsButtonMouseLeaveTimerId);
                setPopup(id, 'colors');
              }
            : null,
        onColorsButtonMouseLeave:
          popup === 'colors'
            ? () => {
                colorsButtonMouseLeaveTimerId = setTimeout(() => {
                  setPopup(id, null);
                }, 1000);
              }
            : null,
        onReminderButtonClick: () => {
          clearTimeout(colorsButtonMouseLeaveTimerId);
          setPopup(id, 'reminder');
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

function mapStateToProps(state, { id }) {
  return {
    note: state.main.notesData[id],
    isFocused: state.main.notesDisplayInformation[id].isFocused,
    isPinned: state.main.notesDisplayInformation[id].isPinned,
    popup: state.main.notesDisplayInformation[id].popup,
    isAddNote: id === state.main.notesOrder[0],
    isSelected: state.main.selectedNotes[id],
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
    onNotePin: pinNote,
    onNoteUnpin: unpinNote,
    onNoteAdd: addNewNote,
    onHeaderChange: updateNoteHeader,
    onTextFieldChange: updateNoteText,
    onListItemAdd: addNoteListItem,
    onListItemChange: updateNoteListItem,
    onListItemRemove: removeNoteListItem,
    onListItemCheck: checkNoteListItem,
    onListItemUncheck: uncheckNoteListItem,
    setPopup: setNotePopup,
    onNoteSelection: selectNote,
    onCancelNoteSelection: cancelNoteSelection,
  }),
  React.memo
)(NoteContainer);
