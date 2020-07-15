import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import App from '@components/App/App';

import { closeModal } from '@store/modalReducer';
/* eslint-enable import/no-unresolved */

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ APP
// * используется для маппинга action creator'ов из modalReducer
// * и последующей передачи в компонент Modal
// * контейнер для самого Modal невозможен т.к. используется React.forwardRef
// *

function mapStateToProps(state) {
  return {
    modalCallback: state.modal.callback,
  };
}

export default connect(mapStateToProps, { closeModal })(App);
