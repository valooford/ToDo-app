import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import Button from '@components/Button/Button';
import IconButton from '@components/IconButton/IconButton';
import Option from '@components/Option/Option';
import LocationOption from '@components/LocationOption/LocationOption';
import Dropdown from '@components/Dropdown/Dropdown';
import KeyboardTrap from '@components/KeyboardTrap/KeyboardTrap';
// import Calendar from '@components/Calendar/Calendar';
/* eslint-enable import/no-unresolved */
import style from './PopupReminder-cfg.module.scss';

function handleEscWith(cb) {
  return (e) => {
    e.stopPropagation(); // prevent other event listeners from triggering
    if (e.keyCode === 27) cb();
  };
}

// КОМПОНЕНТ ВСПЛЫВАЮЩЕГО МЕНЮ НАСТРОЙКИ НАПОМИНАНИЙ / POPUP-REMINDER
// *
export default function PopupReminder({
  onClick,
  onClose,
  onKeyDown,
  // reminderDate,
  setDate,
  reminderPlace,
  setPlace,
  getPlacesByQuery,
  foundPlaces = [],
  resetFoundPlaces,
}) {
  const [currentFieldset, setCurrentFieldset] = useState('main');

  const switchToMainOnEsc = handleEscWith(() => setCurrentFieldset('main'));
  // autofocus
  // *
  const autofocusRef = useRef(null);
  useEffect(() => {
    if (autofocusRef.current) {
      autofocusRef.current.focus();
    }
  }, [currentFieldset]);
  // *

  const [fieldsetData, setFieldsetData] = useState({
    // date: reminderDate,
    place: reminderPlace,
  });

  const now = new Date();
  let optionParams;
  const fieldset = {};
  const readyButtonRef = useRef(null);

  switch (currentFieldset) {
    case 'main':
      optionParams = [
        {
          details: '20:00',
          text: 'Сегодня',
          disabled: now.getHours() >= 20,
          onClick() {
            const today = new Date();
            const date = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              20
            );
            setDate(date);
            onClose();
          },
        },
        {
          details: '08:00',
          text: 'Завтра',
          onClick() {
            const today = new Date();
            const date = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + 1,
              8
            );
            setDate(date);
            onClose();
          },
        },
        // monday of the next week
        {
          details: 'пн, 08:00',
          text: 'На следующей неделе',
          onClick() {
            const today = new Date();
            let day = today.getDay() - 1;
            if (day === -1) day = 6;
            // now 0 - monday, 6 - sunday
            const date = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + 7 - day,
              8
            );
            setDate(date);
            onClose();
          },
        },
        {
          iconSymbol: '\ue809',
          text: 'Выбрать дату и время',
          onClick() {
            setCurrentFieldset('date');
          },
        },
        {
          iconSymbol: '\ue80a',
          text: 'Выбрать место',
          onClick() {
            setCurrentFieldset('place');
          },
        },
      ];
      fieldset.content = (
        <KeyboardTrap autofocus usingArrows key="main">
          <fieldset className={style['popup-reminder__main']}>
            <legend className={cn(style['popup-reminder__legend'])}>
              Напоминание:
            </legend>
            <div className={style['popup-reminder__fields']}>
              {optionParams.map((params) => (
                <Option
                  details={params.details}
                  iconSymbol={params.iconSymbol}
                  disabled={params.disabled}
                  onClick={params.onClick}
                  key={params.text}
                >
                  {params.text}
                </Option>
              ))}
            </div>
          </fieldset>
        </KeyboardTrap>
      );
      fieldset.onKeyDown = onKeyDown;
      break;
    case 'date':
      fieldset.content = (
        <KeyboardTrap key="date">
          <fieldset className={style['popup-reminder__date']}>
            <legend
              className={cn(
                style['popup-reminder__legend'],
                style['popup-reminder__legend_sub']
              )}
            >
              <span className={style['popup-reminder__back-button']}>
                <IconButton
                  iconSymbol="&#xe813;"
                  titleText="Назад"
                  modificators={['icon-button_tiny']}
                  onClick={() => {
                    setCurrentFieldset('main');
                  }}
                />
              </span>
              Выбрать дату и время
            </legend>
            <div className={style['popup-reminder__fields']}>
              <Dropdown
                value="28 июл. 2020 г."
                titleText="Выбрать дату"
                keepChildWidth
                ref={autofocusRef}
              >
                {/* <Calendar /> */}
              </Dropdown>
              <Dropdown value="18:00" titleText="Выбрать время">
                {/* <Option details="08:00" disabled>
                Утро
              </Option>
              <Option details="13:00" disabled>
                День
              </Option>
              <Option details="18:00">Вечер</Option>
              <Option details="20:00">Ночь</Option>
              <Option>Другое</Option> */}
              </Dropdown>
              <Dropdown
                noInput
                value="Не повторять"
                titleText="Выбрать частоту"
              >
                {/* <Option>Не повторять</Option>
              <Option>Каждый день</Option>
              <Option>Каждую неделю</Option>
              <Option>Каждый месяц</Option>
              <Option>Каждый год</Option>
              <Option>Другое</Option> */}
              </Dropdown>
            </div>
            <span className={style['popup-reminder__ready-button']}>
              <Button disabled>Сохранить</Button>
            </span>
          </fieldset>
        </KeyboardTrap>
      );
      fieldset.onKeyDown = switchToMainOnEsc;
      break;
    case 'place':
      fieldset.content = (
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
                  modificators={['icon-button_tiny']}
                  onClick={() => {
                    setCurrentFieldset('main');
                    resetFoundPlaces();
                  }}
                />
              </span>
              Выбрать место
            </legend>
            <div className={style['popup-reminder__fields']}>
              <Dropdown
                useAsSearch
                value={fieldsetData.place}
                placeholder="Укажите место"
                onInput={(place) => {
                  setFieldsetData({ place });
                  getPlacesByQuery(place);
                }}
                ref={autofocusRef}
                component={LocationOption}
                componentsParams={foundPlaces}
                extraordinaryFocusRef={readyButtonRef}
              />
            </div>
            <span className={style['popup-reminder__ready-button']}>
              <Button
                disabled={
                  fieldsetData.place == null || fieldsetData.place === ''
                }
                onClick={() => {
                  setPlace(fieldsetData.place);
                  onClose();
                  resetFoundPlaces();
                }}
                ref={readyButtonRef}
              >
                Сохранить
              </Button>
            </span>
          </fieldset>
        </KeyboardTrap>
      );
      fieldset.onKeyDown = switchToMainOnEsc;
      break;
    default:
      return null;
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <fieldset
      className={style['popup-reminder']}
      onClick={onClick}
      onKeyDown={fieldset.onKeyDown}
    >
      {fieldset.content}
    </fieldset>
  );
}

// PERIOD
// *
/* <fieldset className={style['popup-reminder__period']}>
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
            />
          </span>
          Повторять
        </legend>
        <fieldset className={style['popup-reminder__every']}>
          <legend>Кажд.</legend>
          <div className={style['popup-reminder__fields']}>
            <input
              className={style['popup-reminder__input']}
              type="text"
              defaultValue={1}
            />
            <Dropdown
              noInput
              value="дн."
              titleText="Выбрать единицу измерения частоты"
            >
              <Option>дн.</Option>
              <Option>нед.</Option>
              <Option>мес.</Option>
              <Option>г.</Option>
            </Dropdown>
          </div>
        </fieldset>
        <fieldset className={style['popup-reminder__end']}>
          <legend>Окончание</legend>
          <div className={style['popup-reminder__fields']}>
            <label htmlFor="end-never">
              <input type="radio" id="end-never" name="end-period" />
              Никогда
            </label>
            <label htmlFor="end-count">
              <input type="radio" id="end-count" name="end-period" />
              После
              <input
                className={style['popup-reminder__input']}
                type="text"
                defaultValue={2}
              />
              повт.
            </label>
            <label htmlFor="end-date">
              <input type="radio" id="end-date" name="end-period" />
              Дата
              <Dropdown
                value="29 июл. 2021 г."
                titleText="Выбрать дату окончания"
                keepChildWidth
              >
                <Calendar />
              </Dropdown>
            </label>
          </div>
        </fieldset>
        <div className={style['popup-reminder__description']}>
          Повторяется каждый день
        </div>
        <span className={style['popup-reminder__ready-button']}>
          <Button>Готово</Button>
        </span>
      </fieldset> */
