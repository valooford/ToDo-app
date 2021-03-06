import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setNoteTag, removeNoteTag, addNewTag } from '@store/notesReducer';
import { useEffectOnMouseDownOutside } from '@common/utils';

import PopupTag from './PopupTag.pure';

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
      isNoteHasTag={(tag) => ids.every((id) => labeledNotes[tag][id])}
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
