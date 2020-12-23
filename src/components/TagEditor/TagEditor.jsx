import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import IconButtonComponent from '@components/IconButton/IconButton';
import Button from '@components/Button/Button';

import style from './TagEditor.module.scss';

export default function TagEditor({
  labels,
  addNewTag,
  renameTag,
  removeTag,
  validate,
  onClose,
  IconButton = IconButtonComponent,
}) {
  const autofocusRef = useRef();
  useEffect(() => {
    autofocusRef.current.focus();
  }, []);
  const [currentItem, setCurrentItem] = useState(null);
  const isAdding = currentItem === autofocusRef;
  const [hoveredItem, setHoveredItem] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    setError(null);
  }, [currentItem]);

  const onTagAdding = () => {
    const input = autofocusRef.current;
    const label = input.value;
    const result = validate(label);
    setError(result);
    if (!result) {
      addNewTag(label);
      input.value = '';
      input.focus();
    } else {
      input.focus();
      input.setSelectionRange(0, 9999);
    }
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={style['tag-editor']}
      onKeyDown={(e) => {
        // Esc
        if (e.keyCode === 27) {
          onClose();
        }
      }}
    >
      <div className={style['tag-editor__scroll-wrapper']}>
        <div className={style['tag-editor__header']}>Изменение ярлыков</div>
        <div className={style['tag-editor__item']}>
          <span
            className={cn(
              style['tag-editor__elem-icon'],
              style['tag-editor__elem-icon_left']
            )}
          >
            <IconButton
              modificators="icon-button_label"
              iconSymbol={isAdding ? '\ue80c' : '\ue810'}
              titleText={isAdding ? 'Отмена' : 'Создать ярлык'}
              onClick={() => {
                if (isAdding) {
                  setCurrentItem(null);
                  autofocusRef.current.value = '';
                } else {
                  autofocusRef.current.focus();
                }
              }}
            />
          </span>
          <div className={style['tag-editor__input-wrapper']}>
            <input
              type="text"
              className={style['tag-editor__input']}
              placeholder="Создать ярлык"
              onFocus={() => {
                setCurrentItem(autofocusRef);
              }}
              onKeyDown={(e) => {
                // Enter
                if (e.keyCode === 13) {
                  onTagAdding();
                }
              }}
              ref={autofocusRef}
            />
          </div>
          {isAdding && (
            <span
              className={cn(
                style['tag-editor__elem-icon'],
                style['tag-editor__elem-icon_right']
              )}
            >
              <IconButton
                modificators="icon-button_label"
                iconSymbol={'\ue800'}
                titleText="Создать ярлык"
                onClick={onTagAdding}
              />
            </span>
          )}
        </div>
        {error && <div className={style['tag-editor__error']}>{error}</div>}
        {labels.map(({ name: label, id }) => {
          const isCurrentItem = currentItem === label;
          const isHovered = hoveredItem === label;
          const itemRef = React.createRef();
          return (
            <div
              className={style['tag-editor__item']}
              onMouseEnter={() => {
                setHoveredItem(label);
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
              }}
              key={id}
            >
              <span
                className={cn(
                  style['tag-editor__elem-icon'],
                  style['tag-editor__elem-icon_left']
                )}
              >
                <IconButton
                  modificators="icon-button_label"
                  iconSymbol={isCurrentItem || isHovered ? '\ue80f' : '\ue81d'}
                  titleText="Удалить ярлык"
                  onClick={() => {
                    removeTag(label);
                    setCurrentItem(null);
                  }}
                  onFocus={() => {
                    setCurrentItem(label);
                  }}
                />
              </span>
              <div className={style['tag-editor__input-wrapper']}>
                <input
                  type="text"
                  className={style['tag-editor__input']}
                  defaultValue={label}
                  placeholder="Введите название ярлыка"
                  onChange={() => {
                    const newLabel = itemRef.current.value;
                    if (newLabel) {
                      renameTag(label, newLabel);
                      setCurrentItem(newLabel);
                    }
                  }}
                  onFocus={() => {
                    setCurrentItem(label);
                  }}
                  onKeyDown={(e) => {
                    // Enter
                    if (e.keyCode === 13) {
                      itemRef.current.blur();
                      setCurrentItem(null);
                    }
                  }}
                  ref={itemRef}
                />
              </div>
              <span
                className={cn(
                  style['tag-editor__elem-icon'],
                  style['tag-editor__elem-icon_right']
                )}
              >
                <IconButton
                  modificators="icon-button_label"
                  iconSymbol={isCurrentItem ? '\ue800' : '\ue80e'}
                  titleText="Переименовать ярлык"
                  onClick={
                    isCurrentItem
                      ? () => {
                          setCurrentItem(null);
                        }
                      : () => {
                          itemRef.current.focus();
                        }
                  }
                />
              </span>
            </div>
          );
        })}
      </div>
      <div className={style['tag-editor__footer']}>
        <span className={style['tag-editor__confirm-button']}>
          <Button
            onClick={onClose}
            onFocus={() => {
              setCurrentItem(null);
            }}
          >
            Готово
          </Button>
        </span>
      </div>
    </div>
  );
}
