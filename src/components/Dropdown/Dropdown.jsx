import React, { useState, useRef } from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';

import { useEffectOnClickOutside } from '@/utils';
/* eslint-enable import/no-unresolved */
import style from './Dropdown-cfg.module.scss';

function Dropdown(
  {
    value = '',
    placeholder,
    titleText,
    onInput,
    noInput,
    useAsSearch,
    keepChildWidth,
    component: Component,
    componentsParams = [],
    extraordinaryFocusRef,
  },
  ref
) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const onDropdownClick = useEffectOnClickOutside(() => {
    setTimeout(() => {
      setIsOptionsVisible(false);
    }, 0);
  }, [isOptionsVisible]);

  const firstOptionRef = useRef(null);
  const inputRef = ref || React.createRef();
  const optionsParams = componentsParams.map((params, i) => ({
    ...params,
    ref: i === 0 ? firstOptionRef : null,
    onClick() {
      const place = Object.values(params)
        .filter((p) => p)
        .slice(0, -1)
        .join(', ');
      inputRef.current.value = place;
      if (onInput) onInput(place);
      setIsOptionsVisible(false);
    },
    onKeyDown(e) {
      // Tab
      if (e.keyCode === 9) {
        e.preventDefault();
        // ↓ to prevent outer KeyboardTrap from handling wrong element
        e.stopPropagation();
        if (extraordinaryFocusRef) extraordinaryFocusRef.current.focus();
        setIsOptionsVisible(false);
      }
    },
  }));
  const inputHandler = ({ target: { value: place } }) => {
    if (onInput) onInput(place);
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <span
      className={cn(style.dropdown, {
        [style['dropdown_keep-width']]: keepChildWidth,
      })}
      onClick={onDropdownClick}
    >
      <input
        className={style.dropdown__input}
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={noInput}
        onChange={inputHandler}
        onFocus={() => {
          setIsOptionsVisible(true);
        }}
        onKeyDown={(e) => {
          // Tab & NOT Shift
          if (e.keyCode === 9) {
            setIsOptionsVisible(false);
            if (!e.shiftKey) {
              if (e.target.value !== '') {
                if (extraordinaryFocusRef) {
                  e.preventDefault();
                  // ↓ to prevent outer KeyboardTrap from handling wrong element
                  e.stopPropagation();
                  extraordinaryFocusRef.current.focus();
                }
              } else {
                e.preventDefault();
                e.target.focus();
              }
            }
            // down arrow
          } else if (e.keyCode === 40) {
            if (firstOptionRef) firstOptionRef.current.focus();
          }
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
          <KeyboardTrap usingArrows>
            {optionsParams.map((params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Component {...params} key={params.key} />
            ))}
          </KeyboardTrap>
        </div>
      )}
    </span>
  );
}

export default React.forwardRef(Dropdown);
