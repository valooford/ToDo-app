import React from 'react';
import cn from 'classnames';
/* eslint-disable import/no-unresolved */
import IconButtonComponent from '@components/IconButton/IconButton';
import Button from '@components/Button/Button';
/* eslint-enable import/no-unresolved */

import style from './TagEditor.module.scss';

export default function TagEditor({
  labels = ['123'],
  IconButton = IconButtonComponent,
}) {
  return (
    <div className={style['tag-editor']}>
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
            iconSymbol={'\ue810'}
            titleText="Создать ярлык"
          />
        </span>
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
          />
        </span>
        <div className={style['tag-editor__input-wrapper']}>
          <input
            type="text"
            className={style['tag-editor__input']}
            placeholder="Создать ярлык"
          />
        </div>
      </div>
      {labels.map((label) => (
        <div className={style['tag-editor__item']} key={label}>
          <span
            className={cn(
              style['tag-editor__elem-icon'],
              style['tag-editor__elem-icon_left']
            )}
          >
            <IconButton
              modificators="icon-button_label"
              iconSymbol={'\ue81d'}
              titleText="Удалить ярлык"
            />
          </span>
          <span
            className={cn(
              style['tag-editor__elem-icon'],
              style['tag-editor__elem-icon_right']
            )}
          >
            <IconButton
              modificators="icon-button_label"
              iconSymbol={'\ue80e'}
              titleText="Переименовать ярлык"
            />
          </span>
          <div className={style['tag-editor__input-wrapper']}>
            <input
              type="text"
              className={style['tag-editor__input']}
              defaultValue={label}
            />
          </div>
        </div>
      ))}
      <div className={style['tag-editor__footer']}>
        <span className={style['tag-editor__confirm-button']}>
          <Button>Готово</Button>
        </span>
      </div>
    </div>
  );
}
