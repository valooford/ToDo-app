import './Container-cfg.scss';
import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/AddNote/AddNote';
import Note from '@components/Note/Note';

import { focusNote, blurNote, addNewNote } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */

// КОМПОНЕНТ КОНТЕЙНЕРА / CONTAINER
// *
function Container({ elements = [], focusedNoteIndex }) {
  return (
    <div className="container" id="container">
      {elements.map((element, i) => {
        const modificator =
          i === focusedNoteIndex ? ' container__item_focused' : '';
        return <div className={`container__item${modificator}`}>{element}</div>;
      })}
    </div>
  );
}

// функция для создания обработчиков расфокусировки заметок
function handleNoteBlur(index, actions = []) {
  function onNoteBlur(e) {
    const possibleContainerItem = e.target.closest(
      `.container__item:nth-of-type(${index + 1})`
    );
    if (!possibleContainerItem) {
      actions.forEach((action) => {
        action(index);
      });
      document.removeEventListener('click', onNoteBlur);
    }
  }
  return onNoteBlur;
}

function ContainerContainer({ notes, onNoteFocus, onNoteBlur, onNoteAdd }) {
  const add = notes[0].isFocused ? (
    <Note index={0} />
  ) : (
    <AddNote
      onClick={() => {
        const handleBlurFunc = handleNoteBlur(0, [onNoteAdd, onNoteBlur]);
        onNoteFocus(0, handleBlurFunc);
        // во избежание перехвата во время всплытия текущего события
        setTimeout(() => {
          document.addEventListener('click', handleBlurFunc);
        }, 0);
      }}
    />
  );
  let focusedNoteIndex;
  const noteElements = notes
    .map((note, index) => {
      if (note.isFocused) {
        focusedNoteIndex = index;
      }
      return (
        <Note
          index={index}
          onClick={
            note.isFocused
              ? null
              : () => {
                  const handleBlurFunc = handleNoteBlur(index, [onNoteBlur]);
                  onNoteFocus(index, handleBlurFunc);
                  setTimeout(() => {
                    document.addEventListener('click', handleBlurFunc);
                  }, 0);
                }
          }
        />
      );
    })
    .slice(1);
  return (
    <Container
      elements={[add, ...noteElements]}
      focusedNoteIndex={focusedNoteIndex}
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
  onNoteAdd: addNewNote,
})(ContainerContainer);
