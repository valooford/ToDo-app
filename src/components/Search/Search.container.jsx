import React, { useState } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import Search from './Search';

function SearchContainer({ history, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Search
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      isFocused={isFocused}
      onFocus={() => {
        history.push('/search');
        setIsFocused(true);
      }}
      onClear={() => {
        history.push('/home');
        setIsFocused(false);
      }}
    />
  );
}

export default compose(withRouter)(SearchContainer);
