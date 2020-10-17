import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* eslint-disable import/no-unresolved */
import { setNoteTag, removeNoteTag, addNewTag } from '@store/notesReducer';
import { useEffectOnMouseDownOutside } from '@/utils';
/* eslint-enable import/no-unresolved */

import PopupTag from './PopupTag';

function PopupTagContainer({
  ids,
  handleClose,
  labeledNotes,
  setTag,
  removeTag,
  addTag,
}) {
  // detecting click inside popupTag
  const setIsTouched = useEffectOnMouseDownOutside(handleClose, []);
  const onKeyDown = (e) => {
    // Esc
    if (e.keyCode === 27) {
      handleClose();
    }
  };
  const labels = Object.keys(labeledNotes)
    .sort((l1, l2) => labeledNotes[l1].id - labeledNotes[l2].id)
    .map((label) => {
      const isSet = ids.every((id) => labeledNotes[label][id]);
      const isPartlySet = ids.some((id) => labeledNotes[label][id]);
      return { name: label, isSet, isPartlySet };
    });
  return (
    <PopupTag
      labels={labels}
      setTag={setTag}
      removeTag={removeTag}
      addTag={addTag}
      isTagExist={(tag) => labeledNotes[tag]}
      onMouseDown={() => {
        setIsTouched();
      }}
      onKeyDown={onKeyDown}
    />
  );
}

function mapStateToProps(state) {
  return {
    labeledNotes: state.main.labeledNotes,
  };
}

function mapDispatchToProps(dispatch, { ids }) {
  return bindActionCreators(
    {
      setTag: (tag) => setNoteTag(ids, tag),
      removeTag: (tag) => removeNoteTag(ids, tag),
      addTag: addNewTag,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupTagContainer);
