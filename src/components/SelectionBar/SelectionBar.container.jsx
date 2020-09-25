import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';

/* eslint-disable import/no-unresolved */
import PopupMenu from '@components/PopupMenu/PopupMenu.container';
import PopupColors from '@components/PopupColors/PopupColors.container';
import PopupReminder from '@components/PopupReminder/PopupReminder.container';

import {
  pinNote as pinNoteAC,
  unpinNote as unpinNoteAC,
  clearSelectedNotes as clearSelectedNotesAC,
} from '@store/notesReducer';
/* eslint-enable import/no-unresolved */
import SelectionBar from './SelectionBar';

function SelectionBarContainer({
  selectedNotes,
  pinNote,
  // unpinNote,
  clearSelectedNotes,
}) {
  const [popupName, setPopupName] = useState(null);

  const moreButtonRef = useRef(null);
  const colorsButtonRef = useRef(null);
  const popupColorsItemToFocusRef = useRef(null);
  const reminderButtonRef = useRef(null);

  let colorsButtonMouseLeaveTimerId;

  if (!selectedNotes.length) return null;

  const popup = {};
  switch (popupName) {
    case 'menu':
      popup.menu = (
        <PopupMenu
          id={selectedNotes}
          isMultiple
          // hasMarkedItems={markedItems && !!markedItems.length}
          handleClose={() => {
            setPopupName(null);
            moreButtonRef.current.focus();
          }}
        />
      );
      break;
    case 'colors':
      popup.colors = (
        <PopupColors
          id={selectedNotes}
          itemToFocusRef={popupColorsItemToFocusRef}
          handleClose={(isSilent) => {
            setPopupName(null);
            if (!isSilent) colorsButtonRef.current.focus();
          }}
          onHover={() => {
            clearTimeout(colorsButtonMouseLeaveTimerId);
          }}
        />
      );
      break;
    case 'reminder':
      popup.reminder = (
        <PopupReminder
          id={selectedNotes}
          handleClose={() => {
            setPopupName(null);
            reminderButtonRef.current.focus();
          }}
        />
      );
      break;
    default:
      break;
  }

  return (
    <SelectionBar
      selectedCount={selectedNotes.length}
      popup={popup}
      eventHandlers={{
        onClose: clearSelectedNotes,
        onMoreButtonClick() {
          clearTimeout(colorsButtonMouseLeaveTimerId);
          setPopupName('menu');
        },
        onColorsButtonClick() {
          clearTimeout(colorsButtonMouseLeaveTimerId);
          setPopupName('colors');
          setTimeout(() => {
            popupColorsItemToFocusRef.current.focus();
          }, 0);
        },
        onColorsButtonHover:
          popupName === null || popupName === 'colors'
            ? () => {
                clearTimeout(colorsButtonMouseLeaveTimerId);
                setPopupName('colors');
              }
            : null,
        onColorsButtonMouseLeave:
          popupName === 'colors'
            ? () => {
                colorsButtonMouseLeaveTimerId = setTimeout(() => {
                  setPopupName(null);
                }, 1000);
              }
            : null,
        onReminderButtonClick: () => {
          clearTimeout(colorsButtonMouseLeaveTimerId);
          setPopupName('reminder');
        },
        // onPin: 'selectedNotes.some(unpinned)'
        //   ? () => {
        //       pinNote(1);
        //     }
        //   : () => {
        //       unpinNote(1);
        //     },
        onPin: () => {
          pinNote(selectedNotes);
        },
      }}
      refs={{ moreButtonRef, colorsButtonRef, reminderButtonRef }}
    />
  );
}

function mapStateToProps(state) {
  return {
    selectedNotes: state.main.selectedNotes,
  };
}

export default connect(mapStateToProps, {
  pinNote: pinNoteAC,
  unpinNote: unpinNoteAC,
  clearSelectedNotes: clearSelectedNotesAC,
})(SelectionBarContainer);
