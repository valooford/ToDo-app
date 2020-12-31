import React, { useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withPopup } from '@components/Popup/Popup';
import PopupMenu from '@components/PopupMenu/PopupMenu';
import PopupColors from '@components/PopupColors/PopupColors';
import PopupReminder from '@components/PopupReminder/PopupReminder';
import PopupTag from '@components/PopupTag/PopupTag';

import {
  pinNote as pinNoteAC,
  unpinNote as unpinNoteAC,
  clearSelectedNotes as clearSelectedNotesAC,
} from '@store/notesReducer';

import SelectionBar from './SelectionBar.pure';

function SelectionBarContainer({
  selectedNotes,
  labeledNotes,
  pinNote,
  // unpinNote,
  setPopup,
  clearPopup,
  clearSelectedNotes,
}) {
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

  if (!selectedNotes.length) return null;

  const selectedNotesNoLength = { ...selectedNotes };
  delete selectedNotesNoLength.length;
  const selectedNotesArr = Object.keys(selectedNotesNoLength);
  const setTagPopup = () => {
    setPopup(
      <PopupTag
        ids={selectedNotesArr}
        handleClose={() => {
          clearPopup();
          moreButtonRef.current.focus();
        }}
      />,
      moreButtonRef.current.getBoundingClientRect()
    );
  };
  const setMenuPopup = () => {
    setPopup(
      <PopupMenu
        id={selectedNotes}
        isMultiple
        // hasMarkedItems={markedItems && !!markedItems.length}
        handleClose={() => {
          clearPopup();
          moreButtonRef.current.focus();
        }}
        onTagsEdit={setTagPopup}
        hasTags={selectedNotesArr.some((noteId) =>
          Object.values(labeledNotes).some((label) => label[noteId])
        )}
      />,
      moreButtonRef.current.getBoundingClientRect()
    );
  };
  const setColorsPopup = () => {
    setPopup(
      <PopupColors
        id={selectedNotes}
        itemToFocusRef={popupColorsItemToFocusRef}
        handleClose={(isSilent) => {
          clearPopup();
          if (!isSilent) colorsButtonRef.current.focus();
        }}
        onHover={() => {
          clearTimeout(colorsTimerId.id);
        }}
      />,
      colorsButtonRef.current.getBoundingClientRect(),
      true
    );
  };
  const setReminderPopup = () => {
    setPopup(
      <PopupReminder
        id={selectedNotes}
        handleClose={() => {
          clearPopup();
          reminderButtonRef.current.focus();
        }}
      />,
      reminderButtonRef.current.getBoundingClientRect()
    );
  };

  return (
    <SelectionBar
      selectedCount={selectedNotes.length}
      eventHandlers={{
        onClose: clearSelectedNotes,
        onMoreButtonClick() {
          clearTimeout(colorsTimerId.id);
          setMenuPopup();
        },
        onColorsButtonClick() {
          clearTimeout(colorsTimerId.id);
          setColorsPopup();
          setTimeout(() => {
            popupColorsItemToFocusRef.current.focus();
          }, 0);
        },
        onColorsButtonMouseEnter: () => {
          clearTimeout(colorsTimerId.id);
          setColorsPopup();
        },
        onColorsButtonMouseLeave: () => {
          const timerId = setTimeout(() => {
            clearPopup();
          }, 1000);
          setColorsLeaveTimerId(timerId);
        },
        onReminderButtonClick: () => {
          clearTimeout(colorsTimerId.id);
          setReminderPopup();
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
    labeledNotes: state.main.labeledNotes,
  };
}

export default compose(
  withPopup,
  connect(mapStateToProps, {
    pinNote: pinNoteAC,
    unpinNote: unpinNoteAC,
    clearSelectedNotes: clearSelectedNotesAC,
  })
)(SelectionBarContainer);

function SelectionCleaner({ children, onClick }) {
  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      onDirectClick: onClick,
    })
  );
}

const SelectionCleanerWrapper = connect(null, {
  onClick: clearSelectedNotesAC,
})(SelectionCleaner);

export function withSelectionClearing(Component) {
  return () => (
    <SelectionCleanerWrapper>
      <Component />
    </SelectionCleanerWrapper>
  );
}
