import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory, useParams, withRouter } from 'react-router-dom';

import Note from '@components/Note/Note.container';

import { searchNotes } from '@store/notesReducer';
import { getAddingNoteId } from '@store/selectors';

import SearchFilters from './SearchFilters';
import Container from './Container.container';

function SearchResults({
  foundNotes,
  hasNotesWithReminders,
  hasLists,
  hasImages,
  labels,
  colors,
  searchForNotes,

  isSelectionMode,
  onClickOutsideOfElements,
}) {
  const history = useHistory();
  const { text, filter, data } = useParams();
  useEffect(() => {
    const params = {};
    if (text) params.query = text;
    switch (filter) {
      case 'reminder':
        params.hasReminder = true;
        break;
      case 'list':
        params.noteType = 'list';
        break;
      case 'image':
        params.hasImage = true;
        break;
      case 'tags':
        params.label = data;
        break;
      case 'color':
        params.color = data;
        break;
      default:
        if (!text) return;
    }
    searchForNotes(params);
  }, [text, filter]);
  if (!text && !filter)
    return (
      <SearchFilters
        hasNotesWithReminders={hasNotesWithReminders}
        hasLists={hasLists}
        hasImages={hasImages}
        labels={labels}
        colors={colors}
        onSelection={(filterName, filterData) => {
          history.push(
            `/search/text"${text || ''}"/${filterName}/${filterData || ''}`
          );
        }}
      />
    );
  return (
    <Container
      elements={foundNotes}
      groups={{
        removed: {
          test: () => true,
          component: Note,
          refPropName: 'noteRef',
          extraProps: { isSelectionMode },
        },
      }}
      onClickOutsideOfElements={onClickOutsideOfElements}
    />
  );
}

function mapStateToProps(state) {
  const addingNoteId = getAddingNoteId(state);
  return {
    //! wrong, causes rendering every time because of immutability
    foundNotes: state.main.foundNotes.filter((id) => id !== addingNoteId),
    hasNotesWithReminders: !!Object.keys(state.main.reminiscentNotes).length,
    hasLists: Object.values(state.main.notes).some(
      ({ type }) => type === 'list'
    ),
    // hasImages: ...,
    //! wrong, causes rendering every time because of immutability
    labels: Object.keys(state.main.labeledNotes).filter(
      // label objects have ids so checking for > 1 values
      (label) => Object.values(state.main.labeledNotes[label]).length > 1
    ),
    //! wrong, causes rendering every time because of immutability
    colors: Array.from(
      new Set(
        Object.values(state.main.notes)
          .filter(({ id }) => id !== addingNoteId)
          .map((note) => note.color)
      )
    ),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, { searchForNotes: searchNotes })
)(SearchResults);
