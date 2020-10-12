import React from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
import IconButtonComponent from '@components/IconButton/IconButton';
import Dropdown from '@components/Dropdown/Dropdown';
import LocationOption from '@components/LocationOption/LocationOption';
import Button from '@components/Button/Button';
/* eslint-enable import/no-unresolved */
import style from './PopupReminder-cfg.module.scss';

export default function PopupReminderPlace({
  place,
  foundPlaces,
  autofocusRef,
  onSave,
  onBack,
  onInput,
  IconButton = IconButtonComponent,
}) {
  const readyButtonRef = React.createRef();
  return (
    <KeyboardTrap key="place">
      <fieldset className={style['popup-reminder__place']}>
        <legend
          className={cn(
            style['popup-reminder__legend'],
            style['popup-reminder__legend_sub']
          )}
        >
          <span className={style['popup-reminder__back-button']}>
            {' '}
            <IconButton
              iconSymbol="&#xe813;"
              titleText="Назад"
              modificators={['icon-button_tiny']}
              onClick={onBack}
            />
          </span>
          Выбрать место
        </legend>
        <div className={style['popup-reminder__fields']}>
          <Dropdown
            useAsSearch
            defaultValue={place}
            placeholder="Укажите место"
            onInput={onInput}
            ref={autofocusRef}
            component={LocationOption}
            componentsParams={foundPlaces}
            extraordinaryFocusRef={readyButtonRef}
          />
        </div>
        <span className={style['popup-reminder__ready-button']}>
          <Button disabled={!place} onClick={onSave} ref={readyButtonRef}>
            Сохранить
          </Button>
        </span>
      </fieldset>
    </KeyboardTrap>
  );
}
