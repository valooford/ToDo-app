import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
/* eslint-enable import/no-unresolved */
import style from './PopupTag.module.scss';

export default function PopupTag({
  labels,
  setTag,
  removeTag,
  addTag,
  isNoteHasTag,
  isTagExist,
  onMouseDown,
  onKeyDown,
}) {
  const autofocusRef = useRef(null);
  useEffect(() => {
    autofocusRef.current.focus();
  }, []);
  const [searchStr, setSearchStr] = useState('');
  const displayedLabels = !searchStr
    ? labels
    : labels.filter(({ name: label }) =>
        new RegExp(`${searchStr}`).test(label)
      );

  const manageLabelTag = (label, isSet) => {
    if (isSet)
      return () => {
        removeTag(label);
      };
    return () => {
      setTag(label);
    };
  };
  const addNewNoteTag = () => {
    addTag(searchStr);
    setTag(searchStr);
    setSearchStr('');
    autofocusRef.current.focus();
  };

  return (
    <KeyboardTrap>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={style['popup-tag']}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
      >
        <div className={style['popup-tag__header']}>Добавить ярлык</div>
        <div className={style['popup-tag__search']}>
          <input
            type="text"
            className={style['popup-tag__input']}
            placeholder="Введите название ярлыка"
            value={searchStr}
            onChange={(e) => {
              setSearchStr(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                if (isTagExist(searchStr)) {
                  manageLabelTag(searchStr, isNoteHasTag(searchStr))();
                } else {
                  addNewNoteTag();
                }
              }
            }}
            ref={autofocusRef}
          />
          <span
            className={cn(
              style['popup-tag__icon'],
              style['popup-tag__icon_right']
            )}
          >
            &#xe814;
          </span>
        </div>
        <KeyboardTrap usingArrows>
          <ul className={style['popup-tag__scroll-wrapper']}>
            {displayedLabels.map(({ name: label, isSet, isPartlySet }) => (
              <li key={label}>
                <button
                  type="button"
                  className={style['popup-tag__label']}
                  onClick={manageLabelTag(label, isSet)}
                >
                  <span
                    className={cn(
                      style['popup-tag__icon'],
                      style['popup-tag__icon_left'],
                      style['popup-tag__checkbox']
                    )}
                  >
                    {(() => {
                      if (isSet) return '\ue800';
                      if (isPartlySet) return '-';
                      return '';
                    })()}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ul>
          {searchStr && !isTagExist(searchStr) && (
            <button
              type="button"
              className={style['popup-tag__create']}
              onClick={addNewNoteTag}
            >
              <span
                className={cn(
                  style['popup-tag__icon'],
                  style['popup-tag__icon_left']
                )}
              >
                &#xe810;
              </span>
              Создать ярлык{' '}
              <span className={style['popup-tag__label-to-create']}>
                {`"${searchStr}"`}
              </span>
            </button>
          )}
        </KeyboardTrap>
      </div>
    </KeyboardTrap>
  );
}
