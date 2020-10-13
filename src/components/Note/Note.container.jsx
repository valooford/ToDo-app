import React, {
  /* useState, useEffect, */ useEffect,
  useRef,
  useState,
} from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { useEffectOnMouseDownOutside } from '@/utils';

import Modal from '@components/Modal/Modal.container';
import IconButtonTitled from '@components/IconButton/IconButton.titled';
import { withPopup } from '@components/Popup/Popup';
import PopupMenu from '@components/PopupMenu/PopupMenu.container';
import PopupColors from '@components/PopupColors/PopupColors.container';
import PopupReminder from '@components/PopupReminder/PopupReminder.container';

import {
  focusNote,
  blurNote,
  pinNote,
  unpinNote,
  restoreNote,
  deleteNote,
  setNoteAsArchived,
  setNoteAsRegular,
  addNewNote,
  updateNoteHeader,
  updateNoteText,
  addNoteListItem,
  updateNoteListItem,
  removeNoteListItem,
  checkNoteListItem,
  uncheckNoteListItem,
  selectNote,
  cancelNoteSelection,
} from '@store/notesReducer';
import { updateReminder } from '@store/notificationReducer';
import {
  getAddingNoteId,
  getReminderIdByNoteId,
  hasPassedReminder,
} from '@store/selectors';
/* eslint-enable import/no-unresolved */
import Note from './Note';
import style from './Note-cfg.module.scss';
import listItemStyle from './components/ListItem/ListItem-cfg.module.scss';
// ---replace--- insert in Note as tag/reminder general-purpose component
import CreationTimeTitled from './components/CreationTime/CreationTime.titled';
import Reminder from './components/Reminder/Reminder.container';

const checkboxClassname = listItemStyle.listItem__checkbox;

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ NOTE
// *
function NoteContainer({
  id,
  isAddNote,
  isSelected,
  isPinned,
  isArchived,
  isRemoved,
  isReminderPassed,
  isReminderReadyToUpdate,
  note: {
    type,
    headerText,
    text,
    items,
    itemsOrder,
    creationDate,
    editingDate,
    color,
  },
  isFocused,
  onNoteFocus,
  onNoteBlur,
  onNotePin,
  onNoteUnpin,
  onNoteRestore,
  onNoteDelete,
  onNoteArchive,
  onNoteSetRegular,
  onNoteReminderUpdate,
  onNoteAdd,
  onHeaderChange,
  onTextFieldChange,
  onListItemAdd,
  onListItemChange,
  onListItemRemove,
  onListItemCheck,
  onListItemUncheck,
  setPopup,
  clearPopup,
  // setMenuPopup,
  // setColorsPopup,
  // setReminderPopup,
  onNoteSelection,
  onCancelNoteSelection,
  noteRef = React.createRef(),
  neighbourRef,
  isSelectionMode,
}) {
  // interacting
  const [isInteracting, setIsInteracting] = useState(false);
  useEffect(() => {
    if (isFocused || isAddNote) return undefined;
    const noteElement = noteRef.current;
    const onFocusin = (e) => {
      if (e.target.classList.contains(checkboxClassname)) return;
      setIsInteracting(true);
    };
    const onFocusout = () => {
      setIsInteracting(false);
    };
    noteElement.addEventListener('focusin', onFocusin);
    noteElement.addEventListener('focusout', onFocusout);
    return () => {
      noteElement.removeEventListener('focusin', onFocusin);
      noteElement.removeEventListener('focusout', onFocusout);
    };
  }, [isFocused]);

  // focusing
  const headerRef = useRef(null);
  const textFieldRef = useRef(null);
  const listItemRef = useRef(null);
  const addListItemRef = useRef(null);
  const defaultFocusInfo = {
    fieldRef: type === 'list' ? addListItemRef : textFieldRef,
    type,
    caret: 9999,
  };
  const [focusInfo, setFocusInfo] = useState(defaultFocusInfo);
  useEffect(() => {
    if (isFocused) {
      const {
        fieldRef: { current: field },
        caret,
      } = focusInfo;
      const timerId = setTimeout(() => {
        // setting caret position to the text end
        field.focus();
        field.setSelectionRange(caret, caret);
      }, 0);
      return () => clearTimeout(timerId);
    }
    // not focused
    setFocusInfo(defaultFocusInfo);
    return undefined;
  }, [isFocused]);
  useEffect(() => {
    if (!isFocused) return undefined;
    const { current: field } = type === 'list' ? addListItemRef : textFieldRef;
    const timerId = setTimeout(() => {
      // setting caret position to the text end
      field.focus();
      field.setSelectionRange(9999, 9999);
    }, 0);
    return () => clearTimeout(timerId);
  }, [type]);

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
  let itemsWithHandlersGroups;
  if (itemsOrder) {
    itemsWithHandlersGroups = itemsOrder.reduce(
      (itemsGroups, itemId) => {
        const item = items[itemId];
        const supplementedItem = {
          ...item,
          onChange({ target: { value: itemText } }) {
            onListItemChange(itemId, itemText);
          },
          onRemove() {
            onListItemRemove(itemId);
          },
          ref: itemId === focusInfo.itemId ? listItemRef : null,
        };
        if (!isFocused) {
          supplementedItem.onFocus = ({ target }) => {
            setFocusInfo({
              fieldRef: listItemRef,
              itemId,
              caret: target.selectionStart,
            });
          };
        }
        if (item.isMarked) {
          supplementedItem.onCheck = () => {
            onListItemUncheck(item.id);
          };
          itemsGroups.marked.push(supplementedItem);
        } else {
          supplementedItem.onCheck = () => {
            onListItemCheck(item.id);
          };
          itemsGroups.unmarked.push(supplementedItem);
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

  // a PopupColors disappearance timer id
  // a mutable object is used for proper clearTimeout work
  const [colorsTimerId, setColorsTimerId] = useState({});
  const setColorsLeaveTimerId = (timerId) => {
    setColorsTimerId((prev) => {
      // eslint-disable-next-line no-param-reassign
      prev.id = timerId;
      return prev;
    });
  };

  // ---replace--- with 'Popup' components receiving refs as props
  const setMenuPopup = () => {
    setPopup(
      <PopupMenu
        id={id}
        hasMarkedItems={
          itemsWithHandlersGroups && !!itemsWithHandlersGroups.marked.length
        }
        handleClose={() => {
          clearPopup();
          moreButtonRef.current.focus();
        }}
        onRemove={() => {
          if (neighbourRef && neighbourRef.current)
            neighbourRef.current.focus();
        }}
      />,
      moreButtonRef.current.getBoundingClientRect()
    );
    setIsInteracting(true);
  };
  const setColorsPopup = () => {
    setPopup(
      <PopupColors
        id={id}
        itemToFocusRef={popupColorsItemToFocusRef}
        handleClose={(isSilent) => {
          clearPopup();
          if (!isSilent) colorsButtonRef.current.focus();
        }}
        onMouseEnter={() => {
          clearTimeout(colorsTimerId.id);
        }}
      />,
      colorsButtonRef.current.getBoundingClientRect(),
      true
    );
    setIsInteracting(true);
  };
  const setReminderPopup = () => {
    setPopup(
      <PopupReminder
        id={id}
        handleClose={() => {
          clearPopup();
          reminderButtonRef.current.focus();
        }}
      />,
      reminderButtonRef.current.getBoundingClientRect()
    );
    setIsInteracting(true);
  };

  // const noteRef = useRef(null);
  const onClose = () => {
    onNoteBlur();
    if (isAddNote) {
      onNoteAdd();
    }
    setTimeout(() => {
      if (noteRef.current) noteRef.current.focus();
    }, 0);
  };

  const eventHandlers = {
    onMouseDown,
  };

  if (isFocused) {
    eventHandlers.onClose = onClose;
  } else {
    // !isFocused
    eventHandlers.onSelection = isSelected
      ? onCancelNoteSelection
      : onNoteSelection;
    eventHandlers.onKeyDown = (e) => {
      // Enter
      if (e.target === e.currentTarget && e.keyCode === 13) {
        onNoteFocus();
      }
    };
  }

  // a click handler focusing the note
  if (!isAddNote) {
    if (isSelectionMode) {
      eventHandlers.onClick = isSelected
        ? onCancelNoteSelection
        : onNoteSelection;
    } else {
      eventHandlers.onClick = ({ target }) => {
        const nonFocusingElementsSelectors = [
          style.note__check,
          style.note__cornerButtons,
          style.note__buttons,
          style.note__info,
          checkboxClassname,
        ].map((s) => `.${s}`);
        if (nonFocusingElementsSelectors.every((s) => !target.closest(s))) {
          onNoteFocus();
        }
      };
    }
  }

  if (isRemoved) {
    eventHandlers.onRestore = onNoteRestore;
    eventHandlers.onDelete = onNoteDelete;
  } else {
    eventHandlers.onPin = isPinned ? onNoteUnpin : onNotePin;
    eventHandlers.onArchive = isArchived ? onNoteSetRegular : onNoteArchive;
    eventHandlers.onMoreButtonClick = () => {
      clearTimeout(colorsTimerId.id);
      setMenuPopup();
    };
    eventHandlers.onColorsButtonClick = () => {
      clearTimeout(colorsTimerId.id);
      setColorsPopup();
      setTimeout(() => {
        popupColorsItemToFocusRef.current.focus();
      }, 0);
    };
    eventHandlers.onColorsButtonMouseEnter = () => {
      clearTimeout(colorsTimerId.id);
      setColorsPopup();
    };
    eventHandlers.onColorsButtonMouseLeave = () => {
      const timerId = setTimeout(() => {
        clearPopup();
      }, 1000);
      setColorsLeaveTimerId(timerId);
    };

    if (isReminderReadyToUpdate) {
      eventHandlers.onReminderButtonClick = () => {
        onNoteReminderUpdate();
      };
    } else {
      eventHandlers.onReminderButtonClick = () => {
        clearTimeout(colorsTimerId.id);
        setReminderPopup();
      };
    }

    if (isFocused) {
      eventHandlers.onHeaderChange = onHeaderChange;
      eventHandlers.onTextFieldChange = onTextFieldChange;
      eventHandlers.onListItemAdd = onListItemAdd;
    } else {
      // !isFocused
      eventHandlers.onHeaderFocus = ({ target }) => {
        setFocusInfo({
          fieldRef: headerRef,
          caret: target.selectionStart,
        });
      };
      eventHandlers.onTextFieldFocus = ({ target }) => {
        setFocusInfo({
          fieldRef: textFieldRef,
          caret: target.selectionStart,
        });
      };
    }
  }

  const noteElem = (
    <Note
      isSelectionMode={isSelectionMode}
      noteData={{
        headerText,
        text,
        items: itemsOrder && itemsWithHandlersGroups.unmarked,
        markedItems: itemsOrder && itemsWithHandlersGroups.marked,
        isPinned,
        isArchived,
        isReminderPassed: isReminderReadyToUpdate,
        creationDate,
        editingDate,
        color,
        isInteracting,
        isSelected,
      }}
      eventHandlers={eventHandlers}
      IconButton={IconButtonTitled}
      CreationTime={CreationTimeTitled}
      refs={{
        moreButtonRef,
        colorsButtonRef,
        reminderButtonRef,

        headerRef,
        textFieldRef,
        addListItemRef,
      }}
      ref={noteRef}
    >
      <Reminder
        id={id}
        isPassed={isReminderPassed}
        onClick={setReminderPopup}
      />
    </Note>
  );

  if (isFocused && !isAddNote) {
    return (
      <>
        <div>FILLER FILLER FILLER FILLER FILLER</div>
        <Modal onClose={onClose}>{noteElem}</Modal>
      </>
    );
  }
  return noteElem;
}

function mapStateToProps(state, { id }) {
  const isReminderPassed = hasPassedReminder(state, id);
  return {
    note: state.main.notes[id],
    reminderId: getReminderIdByNoteId(state, id),
    isFocused: id === state.main.focusedNoteId,
    isAddNote: id === getAddingNoteId(state),
    isSelected: state.main.selectedNotes[id],
    isPinned: state.main.pinnedNotes[id],
    isArchived: state.main.archivedNotes[id],
    isRemoved: state.main.removedNotes[id],
    isReminderPassed,
    isReminderReadyToUpdate:
      isReminderPassed && state.app.page === '/reminders',
  };
}

function mapDispatchToProps(dispatch, { id, reminderId }) {
  return bindActionCreators(
    {
      onNoteFocus: () => focusNote(id),
      onNoteBlur: blurNote,
      onNotePin: () => pinNote(id),
      onNoteUnpin: () => unpinNote(id),
      onNoteRestore: () => restoreNote(id),
      onNoteDelete: () => deleteNote(id),
      onNoteArchive: () => setNoteAsArchived(id),
      onNoteSetRegular: () => setNoteAsRegular(id),
      onNoteReminderUpdate: () => updateReminder(reminderId),
      onNoteAdd: addNewNote,
      onHeaderChange: (headerText) => updateNoteHeader(id, headerText),
      onTextFieldChange: (text) => updateNoteText(id, text),
      onListItemAdd: (itemText) => addNoteListItem(id, itemText),
      onListItemChange: (itemId, itemText) =>
        updateNoteListItem(id, itemId, itemText),
      onListItemRemove: (itemId) => removeNoteListItem(id, itemId),
      onListItemCheck: (itemId) => checkNoteListItem(id, itemId),
      onListItemUncheck: (itemId) => uncheckNoteListItem(id, itemId),
      onNoteSelection: () => selectNote(id),
      onCancelNoteSelection: () => cancelNoteSelection(id),
    },
    dispatch
  );
}

export default compose(
  withPopup,
  connect(mapStateToProps),
  connect(null, mapDispatchToProps)
)(NoteContainer);
