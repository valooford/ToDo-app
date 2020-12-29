import React from 'react';
import { connect } from 'react-redux';

import Popup from '@components/Popup/Popup';

function AppPopupLayer({ popupData }) {
  if (!popupData) return null;
  return (
    <Popup coords={popupData.coords} isTopPreferred={popupData.isTopPreferred}>
      {popupData.popupElement}
    </Popup>
  );
}

function mapStateToProps(state) {
  return { popupData: state.app.popupData };
}
export default connect(mapStateToProps, null)(AppPopupLayer);
