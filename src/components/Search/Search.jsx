import React, { useState, useEffect, useRef } from 'react';
import { compose } from 'redux';
import { useHistory, useRouteMatch, withRouter } from 'react-router-dom';

import Search from './Search.pure';

export default function SearchContainer() {
  const history = useHistory();
  const { params: { text = '', filter, data } = {} } =
    useRouteMatch('/search/text":text?"/:filter?/:data?') || {};
  const [isFocused, setIsFocused] = useState(text != null || filter != null);
  const ref = useRef(null);
  useEffect(() => {
    ref.current.value = text;
  }, []);
  return (
    <Search
      isFocused={isFocused}
      onInput={(query) => {
        history.push(
          `/search/text"${query}"/${filter ? `${filter}/${data || ''}` : ''}`
        );
      }}
      onFocus={
        !isFocused
          ? () => {
              history.push('/search');
              setIsFocused(true);
            }
          : null
      }
      onClear={() => {
        if (text || filter) {
          history.push('/search');
        } else {
          history.push('/home');
          setIsFocused(false);
        }
        ref.current.value = '';
      }}
      ref={ref}
    />
  );
}

compose(withRouter)(SearchContainer);
