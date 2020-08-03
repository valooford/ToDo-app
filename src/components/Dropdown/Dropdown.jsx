import React, { useState } from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */
import style from './Dropdown-cfg.module.scss';

function Dropdown(
  {
    value,
    placeholder,
    titleText,
    onInput,
    noInput,
    useAsSearch,
    keepChildWidth,
    component: Component,
    componentsParams = [],
  },
  ref
) {
  const inputRef = ref || React.createRef();
  const optionsParams = componentsParams.map((params) => ({
    ...params,
    onClick() {
      const place = Object.values(params).join(', ');
      inputRef.current.value = place;
      if (onInput) onInput(place);
    },
  }));
  const inputHandler = ({ target: { value: place } }) => {
    if (onInput) onInput(place);
  };
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  return (
    <span
      className={cn(style.dropdown, {
        [style['dropdown_keep-width']]: keepChildWidth,
      })}
    >
      <input
        className={style.dropdown__input}
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        disabled={noInput}
        onInput={inputHandler}
        onFocus={() => {
          setIsOptionsVisible(true);
        }}
        onBlur={() => {
          setIsOptionsVisible(false);
        }}
        ref={ref}
      />
      {!useAsSearch && (
        <i className={style['dropdown__drop-button']}>
          <IconButton
            iconSymbol="&#xe81a;"
            titleText={titleText}
            modificators={['icon-button_tiny']}
          />
        </i>
      )}
      {isOptionsVisible && componentsParams.length > 0 && Component && (
        <div className={style.dropdown__options}>
          {optionsParams.map((params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Component {...params} />
          ))}
        </div>
      )}
    </span>
  );
}

export default React.forwardRef(Dropdown);
