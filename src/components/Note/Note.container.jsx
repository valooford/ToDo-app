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
import Modal from '@components/Modal/Modal.container';

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
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ NOTE
// *
function NoteContainer({
  id,
  isAddNote,
  focusInfo,
  isSelected,
  onFocusInfoChange,
  note,
  isFocused,
  displayInfo: { isPinned, popupName },
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
  // // havePopupBeenClosed used to set the focus after popup's actions
  // const [havePopupBeenClosed, setHavePopupBeenClosed] = useState(false);
  // useEffect(() => {
  //   if (!havePopupBeenClosed) {
  //     setHavePopupBeenClosed(false);
  //   }
  // }, [havePopupBeenClosed]);

  const [noteFocusInfo, setNoteFocusInfo] = useState(
    focusInfo || {
      fieldName: note.type === 'list' ? 'add-list-item' : 'textfield',
    }
  );
  // informing about a new focus info
  useEffect(() => {
    if (noteFocusInfo && noteFocusInfo.fieldName && onFocusInfoChange) {
      onFocusInfoChange(noteFocusInfo);
    }
  }, [noteFocusInfo]);

  // detecting click outside focused note
  const setIsTouched = useEffectOnMouseDownOutside(() => {
    if (isFocused) {
      onNoteBlur();
      if (isAddNote) {
        onNoteAdd();
      }
    }
  }, [isFocused]);
  const onMouseDown = () => {
    setIsTouched(); // клик был осуществлен в пределах note
  };

  // separation into marked and unmarked list items
  const { items, itemsOrder } = note;
  let itemsWithHandlersGroups;
  if (itemsOrder) {
    itemsWithHandlersGroups = itemsOrder.reduce(
      (itemsGroups, itemId) => {
        const item = items[itemId];
        const itemWithHandlers = {
          ...item,
          onChange({ target: { value: itemText } }) {
            onListItemChange(id, itemId, itemText);
          },
          onRemove() {
            onListItemRemove(id, itemId);
          },
        };
        if (item.isMarked) {
          itemWithHandlers.onCheck = () => {
            onListItemUncheck(id, item.id);
          };
          itemsGroups.marked.push(itemWithHandlers);
        } else {
          itemWithHandlers.onCheck = () => {
            onListItemCheck(id, item.id);
          };
          itemsGroups.unmarked.push(itemWithHandlers);
        }
        return itemsGroups;
      },
      { unmarked: [], marked: [] }
    );
  }

  // the buttons refs for backward focusing
  const moreButtonRef = useRef(null);
  const colorsButtonRef = useRef(null);
  const popupColorsItemToFocusRef = useRef(null);
  const reminderButtonRef = useRef(null);

  let colorsButtonMouseLeaveTimerId; // a PopupColors disappearance timer id

  const popup = {};
  switch (popupName) {
    case 'menu':
      popup.menu = (
        <PopupMenu
          id={id}
          hasMarkedItems={
            itemsWithHandlersGroups && !!itemsWithHandlersGroups.marked.length
          }
          callerRef={moreButtonRef}
          handleClose={
            (/* isSilent */) => {
              setPopup(id, null);
              // if (!isSilent) {
              //   setHavePopupBeenClosed(true);
              // }
            }
          }
        />
      );
      break;
    case 'colors':
      popup.colors = (
        <PopupColors
          id={id}
          callerRef={colorsButtonRef}
          itemToFocusRef={popupColorsItemToFocusRef}
          handleClose={
            (/* isSilent */) => {
              setPopup(id, null);
              // if (!isSilent) {
              //   setHavePopupBeenClosed(true);
              // }
            }
          }
          onHover={() => {
            clearTimeout(colorsButtonMouseLeaveTimerId);
          }}
        />
      );
      break;
    case 'reminder':
      popup.reminder = (
        <PopupReminder
          index={id}
          callerRef={reminderButtonRef}
          handleClose={
            (/* isSilent */) => {
              setPopup(id, null);
              // if (!isSilent) {
              //   setHavePopupBeenClosed(true);
              // }
            }
          }
        />
      );
      break;
    default:
      break;
  }

  const eventHandlers = {
    onMouseDown,
    onPin: isPinned
      ? () => {
          onNoteUnpin(id);
        }
      : () => {
          onNotePin(id);
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
      popupName === null || popupName === 'colors'
        ? () => {
            clearTimeout(colorsButtonMouseLeaveTimerId);
            setPopup(id, 'colors');
          }
        : null,
    onColorsButtonMouseLeave:
      popupName === 'colors'
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
  };
  // a click handler focusing the note
  if (!isAddNote) {
    eventHandlers.onClick = ({ target }) => {
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
  if (isFocused) {
    eventHandlers.onClose = () => {
      if (onClose) {
        onClose();
      }
      onNoteBlur();

      if (isAddNote) {
        onNoteAdd();
      }
    };
    eventHandlers.onHeaderChange = ({ target: { value: headerText } }) => {
      onHeaderChange(id, headerText);
    };
    eventHandlers.onTextFieldChange = ({ target: { value: text } }) => {
      onTextFieldChange(id, text);
    };
    eventHandlers.onListItemAdd = ({ target: { value: itemText } }) => {
      if (itemText !== '') {
        onListItemAdd(id, itemText);
      }
    };
  } else {
    // !isFocused
    eventHandlers.onSelection = isSelected
      ? () => {
          onCancelNoteSelection(id);
        }
      : () => {
          onNoteSelection(id);
        };
    eventHandlers.onHeaderFocus = ({ target }) => {
      setNoteFocusInfo({
        fieldName: 'header',
        caret: target.selectionStart,
      });
    };
    eventHandlers.onTextFieldFocus = ({ target }) => {
      setNoteFocusInfo({
        fieldName: 'textfield',
        caret: target.selectionStart,
      });
    };
    eventHandlers.listItemMouseUpHandlerCreator = (isMarked, itemIndex) => ({
      target,
    }) => {
      setNoteFocusInfo({
        fieldName: isMarked ? 'marked-list-item' : 'unmarked-list-item',
        itemIndex,
        caret: target.selectionStart,
      });
    };
  }

  const noteElem = (
    <Note
      noteData={{
        headerText: note.headerText,
        text: note.text,
        items: itemsOrder && itemsWithHandlersGroups.unmarked,
        markedItems: itemsOrder && itemsWithHandlersGroups.marked,
        isFocused,
        isPinned,
        creationDate: note.creationDate,
        editingDate: note.editingDate,
      }}
      popup={popup}
      eventHandlers={eventHandlers}
      refs={{ moreButtonRef, colorsButtonRef, reminderButtonRef }}
      // focusInfo={
      //   havePopupBeenClosed
      //     ? // default focusInfo after popup's actions
      //       {
      //         fieldName: note.type === 'list' ? 'add-list-item' : 'textfield',
      //       }
      //     : focusInfo
      // }
      // isSelected={isSelected}
    >
      <Reminder id={id} />
    </Note>
  );

  if (isFocused) {
    return (
      <>
        <div>FILLER FILLER FILLER FILLER FILLER</div>
        <Modal
          onClose={() => {
            onNoteBlur();
          }}
        >
          {noteElem}
        </Modal>
      </>
    );
  }
  return noteElem;
}

function mapStateToProps(state, { id }) {
  return {
    note: state.main.notesData[id],
    isFocused: id === state.main.focusedNoteId,
    displayInfo: state.main.notesDisplayInformation[id],
    isAddNote: id === state.main.notesOrder[0],
    isSelected: state.main.selectedNotes[id],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNoteBlur(index) {
      dispatch(blurNote(index));
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
