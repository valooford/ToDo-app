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
    defaultValue = '',
    placeholder,
    titleText,
    validate,
    onInput,
    noInput,
    useAsSearch,
    keepChildWidth,
    component: Component,
    componentsParams = [],
    componentActionPropertyName = 'onClick',
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

  const [isInvalid, setInvalid] = useState(false);

  const firstOptionRef = useRef(null);
  const inputRef = ref || React.createRef();
  const optionsParams = componentsParams.map((params, i) => ({
    ...params,
    ref: i === 0 ? firstOptionRef : null,
    [componentActionPropertyName](optionValue) {
      inputRef.current.value = optionValue;
      const validationOutput = (validate && validate(optionValue)) || [
        optionValue,
      ];
      if (onInput) onInput(...validationOutput);
      setInvalid(false);
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
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <span
      className={cn(style.dropdown, {
        [style['dropdown_keep-width']]: keepChildWidth,
      })}
      onClick={onDropdownClick}
    >
      <input
        className={cn(style.dropdown__input, {
          [style.dropdown__input_invalid]: isInvalid,
        })}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={noInput}
        onChange={(e) => {
          if (!validate) {
            onInput(e.target.value);
            return;
          }
          const validationOutput = validate(e.target.value);
          if (!validationOutput) {
            setInvalid(true);
            return;
          }
          setInvalid(false);
          if (onInput) onInput(...validationOutput);
        }}
        onFocus={
          useAsSearch
            ? () => {
                setIsOptionsVisible(true);
              }
            : null
        }
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
        ref={inputRef}
      />
      {!useAsSearch && (
        <i className={style['dropdown__drop-button']}>
          <IconButton
            iconSymbol="&#xe81a;"
            titleText={titleText}
            modificators={['icon-button_tiny']}
            onClick={() => {
              setIsOptionsVisible(!isOptionsVisible);
              inputRef.current.focus();
            }}
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
