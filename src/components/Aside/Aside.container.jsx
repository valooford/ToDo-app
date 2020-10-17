import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import Modal from '@components/Modal/Modal.container';
import TagEditor from '@components/TagEditor/TagEditor.container';
/* eslint-enable import/no-unresolved */

import Aside from './Aside';

function AsideContainer({ currentPage, labeledNotes }) {
  const [currentModal, setCurrentModal] = useState(null);
  const onTagsEdit = () => {
    setCurrentModal('TagEditor');
  };
  const tagsEditButtonRef = useRef(null);
  const onTagEditorClose = () => {
    setCurrentModal(null);
    tagsEditButtonRef.current.focus();
  };
  return (
    <>
      <Aside
        currentPage={currentPage}
        labels={Object.keys(labeledNotes).sort(
          (l1, l2) => labeledNotes[l1].id - labeledNotes[l2].id
        )}
        onTagsEdit={onTagsEdit}
        tagsEditButtonRef={tagsEditButtonRef}
      />
      {currentModal === 'TagEditor' && (
        <Modal onClose={onTagEditorClose}>
          <TagEditor onClose={onTagEditorClose} />
        </Modal>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return { labeledNotes: state.main.labeledNotes };
}

export default connect(mapStateToProps, null)(AsideContainer);
