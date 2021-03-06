import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';

import IconButton from '@components/IconButton/IconButton.titled';
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';

import { useEffectOnMouseDownOutside } from '@common/utils';

import style from './Dropdown-cfg.module.scss';

function Dropdown(
  {
    defaultValue = '',
    placeholder,
    titleText,
    validate,
    initialValidationDependencies = [],
    onFocus,
    onInput,
    noInput,
    useAsSearch,
    keepChildWidth,
    component: Component,
    componentsParams = [],
    componentActionPropertyName = 'onClick',
    componentActionValueParser,
    extraordinaryFocusRef,
  },
  ref
) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const onDropdownMouseDown = useEffectOnMouseDownOutside(() => {
    setTimeout(() => {
      setIsOptionsVisible(false);
    }, 0);
  }, [isOptionsVisible]);

  const [isInvalid, setInvalid] = useState(false);

  const firstOptionRef = useRef(null);
  const inputRef = (!noInput && ref) || React.createRef();
  const substituteOfInputRef = useRef(null);

  useEffect(() => {
    if (validate && !validate(inputRef.current.value)) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, initialValidationDependencies);

  const optionsParams = componentsParams.map((params, i) => {
    const { focusOnClick, ...onwParams } = params;
    return {
      ref: i === 0 ? firstOptionRef : null,
      [componentActionPropertyName]: focusOnClick
        ? () => {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(9999, 9999);
            setIsOptionsVisible(false);
          }
        : (optionValue, keepOptionsVisible) => {
            if (validate) {
              const validationOutput = validate(optionValue);
              if (validationOutput) {
                const value = componentActionValueParser
                  ? componentActionValueParser(optionValue)
                  : optionValue;
                if (noInput) {
                  substituteOfInputRef.current.innerText = value;
                } else {
                  inputRef.current.value = value;
                }
                if (onInput) onInput(...validationOutput);
                setInvalid(false);
              } else {
                setInvalid(true);
                const value = componentActionValueParser
                  ? componentActionValueParser(optionValue)
                  : optionValue;
                if (noInput) {
                  substituteOfInputRef.current.innerText = value;
                } else {
                  inputRef.current.value = value;
                }
              }
            } else {
              const value = componentActionValueParser
                ? componentActionValueParser(optionValue)
                : optionValue;
              if (noInput) {
                substituteOfInputRef.current.innerText = value;
              } else {
                inputRef.current.value = value;
              }
              if (onInput) onInput(optionValue);
              setInvalid(false);
            }
            setIsOptionsVisible(keepOptionsVisible);
          },
      ...onwParams,
    };
  });
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <span
      className={cn(style.dropdown, {
        [style['dropdown_keep-width']]: keepChildWidth,
      })}
      onMouseDown={onDropdownMouseDown}
      onClick={
        noInput
          ? () => {
              setIsOptionsVisible(!isOptionsVisible);
            }
          : null
      }
    >
      {noInput ? (
        <div
          className={style['dropdown__substitute-of-input']}
          ref={substituteOfInputRef}
        >
          {defaultValue}
        </div>
      ) : (
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
          onFocus={() => {
            if (onFocus) onFocus();
            if (useAsSearch && !isOptionsVisible) {
              setIsOptionsVisible(true);
            }
          }}
          onKeyDown={(e) => {
            // Tab & NOT Shift
            if (useAsSearch && e.keyCode === 9) {
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
            } else if (isOptionsVisible && e.keyCode === 40) {
              if (firstOptionRef) firstOptionRef.current.focus();
            }
          }}
          ref={inputRef}
        />
      )}
      {!useAsSearch && (
        <i className={style['dropdown__drop-button']}>
          <IconButton
            iconSymbol="&#xe81a;"
            titleText={titleText}
            modificators={['icon-button_tiny']}
            onClick={(e) => {
              e.stopPropagation(); // to prevent from triggerring on dropdown-level
              setIsOptionsVisible(!isOptionsVisible);
              if (!noInput) {
                inputRef.current.focus();
              } else if (firstOptionRef && !isOptionsVisible) {
                //! ?
                setTimeout(() => {
                  firstOptionRef.current.focus();
                }, 0);
              }
            }}
            ref={noInput ? ref : null}
          />
        </i>
      )}
      {isOptionsVisible && componentsParams.length > 0 && Component && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={style.dropdown__options}
          onKeyDown={(e) => {
            // Tab or Esc
            if (e.keyCode === 9 || e.keyCode === 27) {
              e.preventDefault();
              // ↓ to prevent outer KeyboardTrap from handling wrong element
              e.stopPropagation();
              if (extraordinaryFocusRef) extraordinaryFocusRef.current.focus();

              setIsOptionsVisible(false);
            }
          }}
        >
          <KeyboardTrap usingArrows>
            {optionsParams.map((params) => {
              const { key, ...ownParams } = params;
              return (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <Component {...ownParams} key={key} />
              );
            })}
          </KeyboardTrap>
        </div>
      )}
    </span>
  );
}

export default React.forwardRef(Dropdown);
