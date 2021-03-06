import React from 'react';

import IconButton from '@components/IconButton/IconButton.titled';

import style from './Search-cfg.module.scss';

function Search({ isFocused, onInput, onFocus, onClear }, ref) {
  return (
    <span className={style.search}>
      <i className={style.search__icon}>
        <IconButton
          iconSymbol="&#xe814;"
          titleText="Поиск"
          onClick={() => {
            ref.current.focus();
          }}
        />
      </i>
      <input
        type="text"
        placeholder="Поиск"
        onInput={({ target: { value } }) => {
          onInput(value);
        }}
        onFocus={onFocus}
        ref={ref}
      />
      {isFocused && (
        <i className={style.search__clean}>
          <IconButton
            iconSymbol="&#xe80c;"
            titleText="Удалить поисковый запрос"
            onClick={onClear}
          />
        </i>
      )}
    </span>
  );
}

export default React.forwardRef(Search);
