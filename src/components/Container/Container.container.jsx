import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/AddNote/AddNote.container';
import Note from '@components/Note/Note.container';

import { focusNote, blurNote } from '@store/mainReducer';
import { readyModal } from '@store/modalReducer';
/* eslint-enable import/no-unresolved */
import Container from './Container';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ CONTAINER
// *
function ContainerContainer({
  notes,
  modalRef,
  onModalReady,
  onNoteFocus,
  onNoteBlur,
}) {
  const [containerFocusInfo, setContainerFocusInfo] = useState({});
  // index of a currently focused container item
  const [focusedItemIndex, setFocusedItemIndex] = useState(null);
  // index of a container item that is needed to be focused
  const [itemToFocusIndex, setItemToFocusIndex] = useState(null);
  // checking modal for being closed
  const [haveModalBeenClosed, setHaveModalBeenClosed] = useState(false);
  useEffect(() => {
    if (haveModalBeenClosed) {
      setContainerFocusInfo((prevFocusInfo) => ({
        ...prevFocusInfo,
        noteFocusInfo: {},
      }));
      setItemToFocusIndex(containerFocusInfo.noteIndex);
      setHaveModalBeenClosed(false);
    } else {
      setItemToFocusIndex(null);
    }
  }, [haveModalBeenClosed]);

  const add = {
    key: 'add',
    color: notes[0].isFocused && notes[0].color,
    node: notes[0].isFocused ? (
      <Note
        index={0}
        focusInfo={{
          fieldName: notes[0].type === 'list' ? 'add-list-item' : 'textfield',
        }}
      />
    ) : (
      <AddNote />
    ),
    isItemFocused: true, // always focused
  };
  let focusedNoteIndex;
  // заметка с индексом 0 используется для добавления
  // контейнеру может передаваться только индекс в пределах [1,...)
  // в модальном окне могут редактироваться только уже добавленные заметки
  const noteElements = notes.slice(1).map((note, i) => {
    const index = i + 1;
    if (note.isFocused) {
      focusedNoteIndex = index;
    }
    return {
      // assume that creationDate is unique for every note
      key: note.creationDate.getTime(),
      color: note.color,
      isFiller: focusedNoteIndex === index,
      node: (
        <Note
          index={index}
          isFiller={focusedNoteIndex === index}
          onFocusInfoChange={(noteFocusInfo) => {
            setContainerFocusInfo({
              noteIndex: index,
              noteFocusInfo,
            });
          }}
          isSelected={!focusedNoteIndex && index === focusedItemIndex}
        />
      ),
      isFocusable: true,
      isItemFocusNeeded: index === itemToFocusIndex,
      onItemFocus: (e) => {
        // triggers for an unknown reason when something get focus inside
        // seems like bubbling
        if (e.target !== e.currentTarget) return;
        setFocusedItemIndex(index);
      },
      onItemBlur: (e) => {
        // triggers for an unknown reason when something lose focus inside
        // seems like bubbling
        if (e.target !== e.currentTarget) return;
        setFocusedItemIndex(null);
      },
      onItemKeyDown:
        index === focusedItemIndex
          ? (e) => {
              // Enter
              if (e.keyCode === 13) {
                onNoteFocus(index);
              }
            }
          : null,
    };
  });
  const pinnedNotes = noteElements.filter((v, i) => notes[i + 1].isPinned);
  const unpinnedNotes = noteElements.filter((v, i) => !notes[i + 1].isPinned);
  return (
    <Container
      elementGroups={[
        [add],
        { name: 'Закрепленные', elements: pinnedNotes },
        {
          name: pinnedNotes.length ? 'Другие заметки' : null,
          elements: unpinnedNotes,
        },
      ]}
      portal={[
        {
          node: focusedNoteIndex && (
            <Note
              index={focusedNoteIndex}
              onClose={() => {
                setHaveModalBeenClosed(true);
              }}
              focusInfo={
                // fallback to default focusInfo if field wasn't specified
                {
                  fieldName:
                    notes[focusedNoteIndex].type === 'list'
                      ? 'add-list-item'
                      : 'textfield',
                  ...containerFocusInfo.noteFocusInfo,
                }
              }
            />
          ),
          color: focusedNoteIndex && notes[focusedNoteIndex].color,
        },
        () => {
          onModalReady(() => {
            onNoteBlur(focusedNoteIndex);
            setHaveModalBeenClosed(true);
          });
        },
        modalRef.current,
      ]}
    />
  );
}

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
  };
}

export default connect(mapStateToProps, {
  onNoteFocus: focusNote,
  onNoteBlur: blurNote,
  onModalReady: readyModal,
})(ContainerContainer);
