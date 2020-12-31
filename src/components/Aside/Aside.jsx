import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';

import Modal from '@components/Modal/Modal';
import TagEditor from '@components/TagEditor/TagEditor';

import { getCurrentPage } from '@store/selectors';

import Aside from './Aside.pure';

function AsideContainer({ isExpanded, currentPage, labeledNotes }) {
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
        isExpanded={isExpanded}
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

const mapStateToProps = (state) => ({
  labeledNotes: state.main.labeledNotes,
  currentPage: getCurrentPage(state),
});
export default connect(mapStateToProps, null)(AsideContainer);
