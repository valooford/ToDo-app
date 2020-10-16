import React, { useState } from 'react';
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
  return (
    <>
      <Aside
        currentPage={currentPage}
        labels={Object.keys(labeledNotes)}
        onTagsEdit={onTagsEdit}
      />
      {currentModal === 'TagEditor' && (
        <Modal
          onClose={() => {
            setCurrentModal(null);
          }}
        >
          <TagEditor />
        </Modal>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return { labeledNotes: state.main.labeledNotes };
}

export default connect(mapStateToProps, null)(AsideContainer);
