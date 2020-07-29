import React from 'react';
import cn from 'classnames';

/* eslint-disable import/no-unresolved */
import Button from '@components/Button/Button';
import IconButton from '@components/IconButton/IconButton';
import Option from '@components/Option/Option';
import LocationOption from '@components/LocationOption/LocationOption';
import Dropdown from '@components/Dropdown/Dropdown';
import Calendar from '@components/Calendar/Calendar';
/* eslint-enable import/no-unresolved */
import style from './PopupReminder-cfg.module.scss';

// КОМПОНЕНТ ВСПЛЫВАЮЩЕГО МЕНЮ НАСТРОЙКИ НАПОМИНАНИЙ / POPUP-REMINDER
// *
export default function PopupReminder() {
  return (
    <form className={style['popup-reminder']}>
      <fieldset className={style['popup-reminder__main']}>
        <legend className={cn(style['popup-reminder__legend'])}>
          Напоминание:
        </legend>
        <div className={style['popup-reminder__fields']}>
          <Option details="20:00">Сегодня</Option>
          <Option details="08:00">Завтра</Option>
          <Option details="пн, 08.00">На следующей неделе</Option>
          <Option iconSymbol="&#xe809;">Выбрать дату и время</Option>
          <Option iconSymbol="&#xe80a;">Выбрать место</Option>
        </div>
      </fieldset>
    </form>
  );
}

// MAIN
// *
/* <fieldset className={style['popup-reminder__main']}>
  <legend className={cn(style['popup-reminder__legend'])}>
    Напоминание:
  </legend>
  <div className={style['popup-reminder__fields']}>
    <Option details="20:00">Сегодня</Option>
    <Option details="08:00">Завтра</Option>
    <Option details="пн, 08.00">На следующей неделе</Option>
    <Option iconSymbol="&#xe809;">Выбрать дату и время</Option>
    <Option iconSymbol="&#xe80a;">Выбрать место</Option>
  </div>
</fieldset> */

// DATE
// *
/* <fieldset className={style['popup-reminder__date']}>
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
      />
    </span>
    Выбрать дату и время
  </legend>
  <div className={style['popup-reminder__fields']}>
    <Dropdown
      value="28 июл. 2020 г."
      titleText="Выбрать дату"
      keepChildWidth
    >
      <Calendar />
    </Dropdown>
    <Dropdown value="18:00" titleText="Выбрать время">
      <Option details="08:00" disabled>
        Утро
      </Option>
      <Option details="13:00" disabled>
        День
      </Option>
      <Option details="18:00">Вечер</Option>
      <Option details="20:00">Ночь</Option>
      <Option>Другое</Option>
    </Dropdown>
    <Dropdown noInput value="Не повторять" titleText="Выбрать частоту">
      <Option>Не повторять</Option>
      <Option>Каждый день</Option>
      <Option>Каждую неделю</Option>
      <Option>Каждый месяц</Option>
      <Option>Каждый год</Option>
      <Option>Другое</Option>
    </Dropdown>
  </div>
  <span className={style['popup-reminder__ready-button']}>
    <Button disabled>Сохранить</Button>
  </span>
</fieldset> */

// PLACE
// *
/* <fieldset className={style['popup-reminder__place']}>
  <legend
    className={cn(
      style['popup-reminder__legend'],
      style['popup-reminder__legend_sub']
    )}
  >
    <span className={style['popup-reminder__back-button']}>
      {' '}
      <IconButton iconSymbol="&#xe813;" modificators={['icon-button_tiny']} />
    </span>
    Выбрать место
  </legend>
  <div className={style['popup-reminder__fields']}>
    <Dropdown useAsSearch placeholder="Укажите место">
      <LocationOption
        postcode={1}
        street="Апл-Парк-уэй"
        region="Купертино, Калифорния, США"
      />
      <LocationOption
        postcode={124}
        street="Conch Street"
        region="Холден Бич, Северная Каролина, США"
      />
      <LocationOption
        postcode={1600}
        street="Пенсильвания-авеню Северо-Запад"
        region="Вашингтон, округ Колумбия, США"
      />
      <LocationOption
        postcode={1261}
        street="West 79th Street"
        region="Лос-Анджелес, Калифорния, США"
      />
      <LocationOption
        postcode={1750}
        street="Вайн-стрит"
        region="Лос-Анджелес, Калифорния, США"
      />
    </Dropdown>
  </div>
  <span className={style['popup-reminder__ready-button']}>
    <Button>Сохранить</Button>
  </span>
</fieldset> */

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
