import React from 'react';
import { connect } from 'react-redux';
import Title from '@components/Title/Title';

function AppTitleLayer({ titleData }) {
  if (!titleData) return null;
  return (
    <Title coords={titleData.coords} key="title">
      {titleData.text}
    </Title>
  );
}

function mapStateToProps(state) {
  return { titleData: state.app.titleData };
}
export default connect(mapStateToProps, null)(AppTitleLayer);
