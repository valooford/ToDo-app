import React, { useState, useRef, useEffect } from 'react';

/* eslint-disable import/no-unresolved */
import { getDateParamsFromString } from '@/utils';

/* eslint-enable import/no-unresolved */
import MainFieldset from './PopupReminder.main';
import DateFieldset from './PopupReminder.date';
import PlaceFieldset from './PopupReminder.place';
import PeriodFieldset from './PopupReminder.period';
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
  onMouseDown,
  onClose,
  onKeyDown,
  reminderDate,
  setDate,
  reminderPlace,
  setPlace,
  reminderPeriod,
  findPlacesByQuery,
  foundPlaces = [],
  resetFoundPlaces,
}) {
  // resetting found places on mount
  useEffect(() => {
    return () => {
      resetFoundPlaces();
    };
  }, []);

  // a currentFieldset is used to show a different content inside the PopupReminder
  const [currentFieldset, setCurrentFieldset] = useState(() => {
    if (reminderDate) return 'date';
    if (reminderPlace != null) return 'place';
    return 'main';
  });

  // an Esc keydown handlers
  const switchToMainOnEsc = handleEscWith(() => setCurrentFieldset('main'));
  const switchToDateOnEsc = handleEscWith(() => setCurrentFieldset('date'));

  // autofocus on fieldset change
  const autofocusRef = useRef(null);
  useEffect(() => {
    autofocusRef.current.focus();
  }, [currentFieldset]);

  // data to add/set a reminder
  const [fieldsetData, setFieldsetData] = useState(() => {
    let date;
    if (!reminderDate) {
      // setting closest reminder date if it's undefined
      const currentDate = new Date();
      let hours = Math.ceil(currentDate.getHours()) + 1;
      if (currentDate.getMinutes() > 30) {
        hours += 1;
      }
      date = new Date(currentDate);
      date.setHours(hours, 0, 0, 0);
    } else {
      date = reminderDate;
    }
    return {
      date,
      period: reminderPeriod,
      place: reminderPlace,
      isValid: true,
    };
  });

  // implement all the stuff from here in the notificationReducer
  // refactor the PopupReminder's dumb&smart components

  // period field of fieldsetData with full information
  const [periodFieldsetData, setPeriodFieldsetData] = useState({
    every: { method: 'daily', count: 1, days: [], keep: 'date' },
    end: { type: 'never', count: 2 },
  });
  // periodFieldsetData correction
  useEffect(() => {
    const period = {
      every: { method: 'daily', count: 1, days: [], keep: 'date' },
      end: { type: 'never', count: 2 },
    };
    if (fieldsetData.period) {
      // period = { ...period, ...fieldsetData.period };
      let { every } = fieldsetData.period;
      if (typeof every === 'number') {
        every = { method: 'daily', count: period.every };
      } else if (typeof every === 'string') {
        let method;
        if (every === 'day') method = 'daily';
        else if (every === 'week') method = 'weekly';
        else if (every === 'month') method = 'monthly';
        else if (every === 'year') method = 'yearly';
        every = { method, count: 1 };
      }
      period.every = { ...period.every, ...every };
      if (fieldsetData.period.end)
        period.end = {
          ...fieldsetData.period.end,
          type: fieldsetData.period.end.count ? 'count' : 'date',
        };
    }
    if (!period.end.date) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      period.end.date = endDate;
    }
    setPeriodFieldsetData(period);
  }, [fieldsetData.period]);

  const setIsValid = (isValid) => {
    setFieldsetData((prev) => ({
      ...prev,
      isValid,
    }));
  };

  // function wrappers for specific period fields setting
  const setPeriodEveryKeep = (keep) => {
    setPeriodFieldsetData((prev) => {
      const period = { ...prev };
      period.every.keep = keep;
      return period;
    });
  };
  const setPeriodEveryCount = (count) => {
    setPeriodFieldsetData((prev) => {
      const period = { ...prev };
      period.every.count = count;
      return period;
    });
  };
  const setPeriodEndCount = (count) => {
    setPeriodFieldsetData((prev) => {
      const period = { ...prev };
      period.end.count = count;
      return period;
    });
  };
  const setPeriodEndType = (type) => {
    setPeriodFieldsetData((prev) => {
      const period = { ...prev };
      period.end.type = type;
      return period;
    });
  };

  const fieldset = {};

  // validator for a Dropdown
  const dateValidator = (date) => {
    const dateParams = getDateParamsFromString(date);
    if (dateParams && dateParams.type === 'date') {
      const { type, dateObj, ...params } = dateParams;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // past days ↓
      if (dateObj - today >= 0) {
        setFieldsetData((prev) => ({ ...prev, isValid: true }));
        return Object.values(params); // [date, month, year]
      }
    }
    setFieldsetData((prev) => ({ ...prev, isValid: false }));
    return false;
  };

  // a period fields validation
  const [isPeriodEveryCountInvalid, setIsPeriodEveryCountInvalid] = useState(
    false
  );
  const [isPeriodEndCountInvalid, setIsPeriodEndCountInvalid] = useState(false);

  // cleaning a period (removing unused periodFieldsetData fields)
  const getCleanPeriod = (period) => {
    const cleanPeriod = { every: { ...period.every }, end: { ...period.end } };
    const { method } = cleanPeriod.every;
    if (method === 'daily' || method === 'yearly') {
      delete cleanPeriod.every.days;
      delete cleanPeriod.every.keep;
    } else if (method === 'weekly') {
      delete cleanPeriod.every.keep;
    } else if (method === 'monthly') {
      delete cleanPeriod.every.days;
    }
    const { type } = cleanPeriod.end;
    delete cleanPeriod.end.type;
    if (type === 'never') {
      delete cleanPeriod.end;
    } else if (type === 'count') {
      delete cleanPeriod.end.date;
    } else if (type === 'date') {
      delete cleanPeriod.end.count;
    }
    return cleanPeriod;
  };

  // forming a content by current fieldset
  switch (currentFieldset) {
    case 'main':
      fieldset.content = (
        <MainFieldset
          setDate={(date) => setDate(date)}
          onClose={onClose}
          onChoosingDate={() => {
            setCurrentFieldset('date');
          }}
          onChoosingPlace={() => {
            setCurrentFieldset('place');
          }}
          autofocusRef={autofocusRef}
        />
      );
      fieldset.onKeyDown = onKeyDown;
      break;
    case 'date':
      fieldset.content = (
        <DateFieldset
          fieldsetData={fieldsetData}
          onDateInput={(date, month, year) => {
            setFieldsetData((prev) => {
              const { date: dateObj } = prev;
              const newDate = new Date(dateObj);
              newDate.setFullYear(year, month, date);
              return {
                ...prev,
                date: newDate,
              };
            });
          }}
          onTimeInput={(hours, minutes) => {
            setFieldsetData((prev) => {
              const { date } = prev;
              const newDate = new Date(date);
              newDate.setHours(hours, minutes);
              return {
                ...prev,
                date: newDate,
              };
            });
          }}
          onPeriodInput={(period) => {
            setFieldsetData((prev) => ({
              ...prev,
              period,
            }));
          }}
          setAsValid={() => {
            setFieldsetData((prev) => ({ ...prev, isValid: true }));
          }}
          setAsInvalid={() => {
            setFieldsetData((prev) => ({ ...prev, isValid: false }));
          }}
          dateValidator={dateValidator}
          autofocusRef={autofocusRef}
          onSave={() => {
            setDate(fieldsetData.date, fieldsetData.period);
            // setDate(fieldsetData.date, periodFieldsetData);
            onClose();
            resetFoundPlaces();
          }}
          onBack={() => {
            setCurrentFieldset('main');
          }}
          onChoosingPeriod={() => {
            setCurrentFieldset('period');
          }}
        />
      );
      fieldset.onKeyDown = switchToMainOnEsc;
      break;
    case 'place':
      fieldset.content = (
        <PlaceFieldset
          place={fieldsetData.place}
          foundPlaces={foundPlaces}
          autofocusRef={autofocusRef}
          onSave={() => {
            setPlace(fieldsetData.place);
            onClose();
            resetFoundPlaces();
          }}
          onBack={() => {
            setCurrentFieldset('main');
            resetFoundPlaces();
          }}
          onInput={(place) => {
            setFieldsetData({ place });
            findPlacesByQuery(place);
          }}
        />
      );
      fieldset.onKeyDown = switchToMainOnEsc;
      break;
    case 'period':
      fieldset.content = (
        <PeriodFieldset
          isValid={fieldsetData.isValid}
          periodFieldsetData={periodFieldsetData}
          cleanPeriod={getCleanPeriod(periodFieldsetData)}
          onEveryFieldsetUnitInput={(method) => {
            setPeriodFieldsetData((prev) => ({
              ...prev,
              every: { ...prev.every, method },
            }));
          }}
          onEndFieldsetDateInput={(date, month, year) => {
            setPeriodFieldsetData((prev) => {
              const { date: dateObj } = prev;
              const newDate = new Date(dateObj);
              newDate.setFullYear(year, month, date);
              return {
                ...prev,
                end: { ...prev.end, date: newDate },
              };
            });
          }}
          togglePeriodEveryDays={(day) => () => {
            setPeriodFieldsetData((prev) => {
              const period = { ...prev };
              period.every.days = [...period.every.days];
              const dayIndex = period.every.days.indexOf(day);
              if (dayIndex !== -1) {
                period.every.days.splice(dayIndex, 1);
              } else {
                period.every.days.push(day);
              }
              return period;
            });
          }}
          isPeriodEveryCountInvalid={isPeriodEveryCountInvalid}
          onEveryFieldsetInputChange={(count) => {
            const isInvalid =
              Number.isNaN(Number(count)) || count.trim() === '';
            setIsPeriodEveryCountInvalid(isInvalid);
            setIsValid(!isInvalid);
            if (!isInvalid) {
              setPeriodEveryCount(Number(count));
            }
          }}
          setPeriodEveryKeep={setPeriodEveryKeep}
          setPeriodEndType={setPeriodEndType}
          isPeriodEndCountInvalid={isPeriodEndCountInvalid}
          onEndFieldsetInputChange={(count) => {
            const isInvalid =
              Number.isNaN(Number(count)) || count.trim() === '';
            setIsPeriodEndCountInvalid(isInvalid);
            setIsValid(!isInvalid);
            if (!isInvalid) {
              setPeriodEndCount(Number(count));
            }
          }}
          dateValidator={dateValidator}
          autofocusRef={autofocusRef}
          onReady={() => {
            setFieldsetData((prev) => ({
              ...prev,
              period: getCleanPeriod(periodFieldsetData),
            }));
            setCurrentFieldset('date');
          }}
          onBack={() => {
            setCurrentFieldset('date');
          }}
        />
      );
      fieldset.onKeyDown = switchToDateOnEsc;
      break;
    default:
      return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <fieldset
      className={style['popup-reminder']}
      onMouseDown={onMouseDown}
      onKeyDown={fieldset.onKeyDown}
    >
      {fieldset.content}
    </fieldset>
  );
}
