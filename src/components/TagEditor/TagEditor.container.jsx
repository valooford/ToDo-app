import React from 'react';
import { connect } from 'react-redux';

/* eslint-disable import/no-unresolved */
import IconButtonTitled from '@components/IconButton/IconButton.titled';
/* eslint-enable import/no-unresolved */
import TagEditor from './TagEditor';

function TagEditorContainer() {
  return <TagEditor IconButton={IconButtonTitled} />;
}

export default connect(null, null)(TagEditorContainer);
