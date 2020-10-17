import React from 'react';
import { connect } from 'react-redux';

/* eslint-disable import/no-unresolved */
import IconButtonTitled from '@components/IconButton/IconButton.titled';

import {
  addNewTag as addNewTagAC,
  renameTag as renameTagAC,
  removeTag as removeTagAC,
} from '@store/notesReducer';
/* eslint-enable import/no-unresolved */
import TagEditor from './TagEditor';

function TagEditorContainer({
  labeledNotes,
  addNewTag,
  renameTag,
  removeTag,
  onClose,
}) {
  const validate = (value) => {
    if (!value) return 'Введите название ярлыка';
    if (labeledNotes[value]) return 'Этот ярлык уже существует';
    return null;
  };
  return (
    <TagEditor
      labels={Object.keys(labeledNotes)
        .sort((l1, l2) => labeledNotes[l1].id - labeledNotes[l2].id)
        .map((label) => ({
          name: label,
          id: labeledNotes[label].id,
        }))}
      addNewTag={addNewTag}
      renameTag={renameTag}
      removeTag={removeTag}
      validate={validate}
      onClose={onClose}
      IconButton={IconButtonTitled}
    />
  );
}

function mapStateToProps(state) {
  return { labeledNotes: state.main.labeledNotes };
}

export default connect(mapStateToProps, {
  addNewTag: addNewTagAC,
  renameTag: renameTagAC,
  removeTag: removeTagAC,
})(TagEditorContainer);
