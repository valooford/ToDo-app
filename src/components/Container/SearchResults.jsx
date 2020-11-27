import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory, useParams, withRouter } from 'react-router-dom';

import SearchFilters from './SearchFilters';

function SearchResults() {
  const history = useHistory();
  const { text, filter /* , data */ } = useParams();
  if (!text && !filter)
    return (
      <SearchFilters
        onSelection={(filterName, filterData) => {
          history.push(
            `/search/text"${text || ''}"/${filterName}/${filterData || ''}`
          );
        }}
      />
    );
  return (
    <div>
      Notes are filtered by {text && `text: ${text}`}
      {filter && ` and ${filter}`}!
    </div>
  );
}

export default compose(withRouter, connect(null, null))(SearchResults);
