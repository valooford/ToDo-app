import React from 'react';
import { connect } from 'react-redux';

import Label from './Label';

function LabelContainer({ text }) {
  return <Label text={text} />;
}

export default connect(null, null)(LabelContainer);
