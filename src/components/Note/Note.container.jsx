import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { useEffectOnMouseDownOutside } from '@/utils';

import Note from '@components/Note/Note';
import PopupMenu from '@components/PopupMenu/PopupMenu.container';
import PopupColors from '@components/PopupColors/PopupColors.container';
import PopupReminder from '@components/PopupReminder/PopupReminder.container';
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
import { bindActionCreators } from 'redux';
/* eslint-enable import/no-unresolved */
import style from './Note-cfg.module.scss';
import listItemStyle from './components/ListItem/ListItem-cfg.module.scss';
// ---replace--- insert in Note as tag/reminder general-purpose component
import Reminder from './components/Reminder/Reminder.container';

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
  clearPopup,
  setMenuPopup,
  setColorsPopup,
  setReminderPopup,
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
            onListItemChange(itemId, itemText);
          },
          onRemove() {
            onListItemRemove(itemId);
          },
        };
        if (item.isMarked) {
          itemWithHandlers.onCheck = () => {
            onListItemUncheck(item.id);
          };
          itemsGroups.marked.push(itemWithHandlers);
        } else {
          itemWithHandlers.onCheck = () => {
            onListItemCheck(item.id);
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
          handleClose={clearPopup}
        />
      );
      break;
    case 'colors':
      popup.colors = (
        <PopupColors
          id={id}
          callerRef={colorsButtonRef}
          itemToFocusRef={popupColorsItemToFocusRef}
          handleClose={clearPopup}
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
          handleClose={clearPopup}
        />
      );
      break;
    default:
      break;
  }

  const eventHandlers = {
    onMouseDown,
    onPin: isPinned ? onNoteUnpin : onNotePin,
    onMoreButtonClick: () => {
      clearTimeout(colorsButtonMouseLeaveTimerId);
      setMenuPopup();
    },
    onColorsButtonClick: () => {
      clearTimeout(colorsButtonMouseLeaveTimerId);
      setColorsPopup();
      setTimeout(() => {
        popupColorsItemToFocusRef.current.focus();
      }, 0);
    },
    onColorsButtonHover:
      popupName === null || popupName === 'colors'
        ? () => {
            clearTimeout(colorsButtonMouseLeaveTimerId);
            setColorsPopup();
          }
        : null,
    onColorsButtonMouseLeave:
      popupName === 'colors'
        ? () => {
            colorsButtonMouseLeaveTimerId = setTimeout(() => {
              clearPopup();
            }, 1000);
          }
        : null,
    onReminderButtonClick: () => {
      clearTimeout(colorsButtonMouseLeaveTimerId);
      setReminderPopup();
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
        onNoteFocus();
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
    eventHandlers.onHeaderChange = onHeaderChange;
    eventHandlers.onTextFieldChange = onTextFieldChange;
    eventHandlers.onListItemAdd = onListItemAdd;
  } else {
    // !isFocused
    eventHandlers.onSelection = isSelected
      ? onCancelNoteSelection
      : onNoteSelection;
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

  if (isFocused && !isAddNote) {
    return (
      <>
        <div>FILLER FILLER FILLER FILLER FILLER</div>
        <Modal onClose={onNoteBlur}>{noteElem}</Modal>
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

function mapDispatchToProps(dispatch, { id }) {
  return bindActionCreators(
    {
      onNoteFocus: () => focusNote(id),
      onNoteBlur: blurNote,
      onNotePin: () => pinNote(id),
      onNoteUnpin: () => unpinNote(id),
      onNoteAdd: addNewNote,
      onHeaderChange: (headerText) => updateNoteHeader(id, headerText),
      onTextFieldChange: (text) => updateNoteText(id, text),
      onListItemAdd: (itemText) => addNoteListItem(id, itemText),
      onListItemChange: (itemId, itemText) =>
        updateNoteListItem(id, itemId, itemText),
      onListItemRemove: (itemId) => removeNoteListItem(id, itemId),
      onListItemCheck: (itemId) => checkNoteListItem(id, itemId),
      onListItemUncheck: (itemId) => uncheckNoteListItem(id, itemId),
      clearPopup: () => setNotePopup(id, null),
      setMenuPopup: () => setNotePopup(id, 'menu'),
      setColorsPopup: () => setNotePopup(id, 'colors'),
      setReminderPopup: () => setNotePopup(id, 'reminder'),
      onNoteSelection: () => selectNote(id),
      onCancelNoteSelection: () => cancelNoteSelection(id),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteContainer);
