import React from 'react';
import { connect } from 'react-redux';

import Label from './Label';

function LabelContainer({ text, onClick }) {
  return <Label text={text} onClick={onClick} />;
}

export default connect(null, null)(LabelContainer);
