// ФУНКЦИЯ ДЛЯ СОЗДАНИЯ КОНФИГУРАТОРОВ ШАБЛОНОВ
function setupBuilder(templateName) {
  const template = document.getElementById(templateName).firstElementChild;
  // функция для вставки элементов с использованием других конфигураторов
  function usingSetup(el, block, insertFunctionName) {
    if (el.setup) {
      if (!el.set) {
        block[insertFunctionName](el.setup());
      } else {
        el.set.forEach((data) => {
          block[insertFunctionName](el.setup(...data));
        });
      }
      return true; // insertion success
    }
    return false; // insertion failure
  }
  // функция для вставки элементов или содержимого (текст/html)
  function insertFunc(elements, block) {
    Object.keys(elements).forEach((prop) => {
      const el = block.querySelector(prop);
      if (!usingSetup(elements[prop], el, 'append')) {
        if (elements[prop].html) {
          el.innerHTML = elements[prop].html;
        } else {
          el.textContent = elements[prop];
        }
      }
    });
  }
  return function setup({
    insert = {}, // insertions to elements
    append = [], // insertions to the start of main block
    prepend = [], // insertions to the end of main block
    modificators = [], // list of modificators
    cut = {}, // elements to cut when modificator set
    add = {}, // element insertions when modificator set
    props = {}, // properties to add to elements
  } = {}) {
    const newElement = template.cloneNode(true);

    insertFunc(insert, newElement);
    append.forEach((el) => {
      if (!usingSetup(el, newElement, 'append')) {
        newElement.append(el);
      }
    });
    prepend.forEach((el) => {
      if (!usingSetup(el, newElement, 'prepend')) {
        newElement.prepend(el);
      }
    });
    modificators.forEach((modificator) => {
      if (modificator !== 'default') {
        newElement.classList.add(modificator);
      }
      if (cut[modificator]) {
        cut[modificator].forEach((elName) => {
          const el = newElement.querySelector(elName);
          el.remove();
        });
      }
      if (add[modificator]) {
        insertFunc(add[modificator], newElement);
      }
    });
    Object.keys(props).forEach((prop) => {
      newElement[prop] = props[prop];
    });

    return newElement;
  };
}

// ПУНКТ МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
export function setupIconedMenuItem(iconSymbol, text, isSelected) {
  return setupBuilder('template-iconed-menu-item')({
    insert: {
      '.iconed-menu-item__icon': { html: iconSymbol },
    },
    append: [text],
    modificators: isSelected ? ['iconed-menu-item_selected'] : [],
  });
}

// ШАБЛОН МЕНЮ / ASIDE
// *
export function setupAside() {
  return setupBuilder('template-aside')({
    insert: {
      '.aside__menu': {
        setup: setupIconedMenuItem,
        set: [
          ['&#xe80d;', 'Заметки', true],
          ['&#xf0f3;', 'Напоминания'],
          ['&#xe81d;', '123'],
          ['&#xe80e;', 'Изменение ярлыков'],
          ['&#xe805;', 'Архив'],
          ['&#xe80f;', 'Корзина'],
        ],
      },
    },
  });
}

// ШАБЛОН ОКНА С ПОДСКАЗКОЙ / TITLE
// *
export function setupTitle(text) {
  return setupBuilder('template-title')({
    insert: {
      '.title__text': text,
    },
  });
}

// ШАБЛОН КНОПКИ С ИКОНКОЙ / ICON-BUTTON
// *
export function setupIconButton(iconSymbol, titleText, modificator, disabled) {
  return setupBuilder('template-icon-button')({
    insert: {
      '.icon-button__icon': { html: iconSymbol },
      '.icon-button__title': {
        setup: setupTitle,
        set: [[titleText]],
      },
    },
    modificators: modificator ? [modificator] : [],
    /* eslint-disable indent */
    props: !disabled
      ? {}
      : {
          disabled: true,
          tabIndex: -1,
        },
    /* eslint-enable indent */
  });
}

// ШАБЛОН ПОЛЯ ДЛЯ ПОИСКА / SEARCH
// *
export function setupSearch() {
  return setupBuilder('template-search')({
    insert: {
      '.search__icon': {
        setup: setupIconButton,
        set: [['&#xe814;', 'Поиск']],
      },
      '.search__clean': {
        setup: setupIconButton,
        set: [['&#xe80c;', 'Удалить поисковый запрос']],
      },
    },
  });
}

// ШАБЛОН ХЕДЕРА (ШАПКИ) / HEADER
// *
export function setupHeader() {
  return setupBuilder('template-header')({
    prepend: [
      {
        setup: setupIconButton,
        set: [['&#xf0c9;', 'Главное меню', 'icon-button_bigger']],
      },
    ],
    insert: {
      '.header__search': {
        setup: setupSearch,
      },
      '.header__buttons': {
        setup: setupIconButton,
        set: [
          ['&#xe815;', 'Обновить', 'icon-button_bigger'],
          ['&#xe819;', 'Сетка', 'icon-button_bigger'],
          ['&#xe818;', 'Настройки', 'icon-button_bigger'],
          ['&#xe816;', 'Приложения Google'],
          ['V', 'Аккаунт Google'],
        ],
      },
    },
  });
}

// ШАБЛОН ТЕКСТОВОГО ПОЛЯ / TEXTAREA
// *
export function setupTextarea(placeholder = '') {
  return setupBuilder('template-textarea')({
    props: {
      placeholder,
    },
  });
}

// ШАБЛОН ЭЛЕМЕНТА СПИСКА / LIST-ITEM
// *
export function setupListItem({ type = 'default' } = {}) {
  return setupBuilder('template-list-item')({
    modificators: [type],
    cut: {
      add: ['.listItem__drag', '.listItem__checkbox', '.listItem__remove'],
      default: ['.listItem__add'],
    },
    add: {
      add: {
        '.listItem__text': {
          setup: setupTextarea,
          set: [['Новый пункт']],
        },
      },
      default: {
        '.listItem__text': {
          setup: setupTextarea,
        },
        '.listItem__remove': {
          setup: setupIconButton,
          set: [['&#xe80c;', 'Удалить', 'icon-button_tiny']],
        },
      },
    },
  });
}

// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
export function setupNotification() {
  return setupBuilder('template-notification')();
}

// ШАБЛОН ЗАМЕТКИ / NOTE
// *
export function setupNote({ type = 'default' } = {}) {
  return setupBuilder('template-note')({
    insert: {
      '.note__check': {
        setup: setupIconButton,
        set: [['&#xe80b;', 'Выбрать заметку', 'icon-button_no-padding']],
      },
      '.note__cornerButtons': {
        setup: setupIconButton,
        set: [['&#xe812;', 'Закрепить заметку', 'icon-button_smaller']],
      },
      '.note__text': {
        setup: setupTextarea,
        set: [['Заметка...']],
      },
      '.note__info': {
        setup: setupNotification,
      },
      '.note__creationTime': {
        setup: setupTitle,
        set: [['Создано 8 апр.']],
      },
      '.note__buttons': {
        setup: setupIconButton,
        set: [
          ['&#xf0f3;', 'Сохранить напоминание', 'icon-button_smaller'],
          ['&#xe803;', 'Соавторы', 'icon-button_smaller'],
          ['&#xe804;', 'Изменить цвет', 'icon-button_smaller'],
          ['&#xe802;', 'Добавить картинку', 'icon-button_smaller'],
          ['&#xe805;', 'Архивировать', 'icon-button_smaller'],
          ['&#xe81f;', 'Ещё', 'icon-button_smaller'],
          ['&#xe807;', 'Отменить', 'icon-button_smaller', true],
          ['&#xe808;', 'Повторить', 'icon-button_smaller', true],
        ],
      },
      '.notification__close': {
        setup: setupIconButton,
        set: [['&#xe80c;', 'Удалить напоминание', 'icon-button_notification']],
      },
    },
    modificators: [type],
    cut: {
      list: ['.note__text'],
      default: ['.note__listWrapper'],
    },
    add: {
      list: {
        '.note__list': {
          setup: setupListItem,
          set: [[], [{ type: 'add' }]],
        },
        '.note__markedList .note__list': {
          setup: setupListItem,
        },
      },
    },
  });
}

// ШАБЛОН БЛОКА ДОБАВЛЕНИЯ ЗАМЕТКИ / ADD-NOTE
// *
export function setupAddNote() {
  return setupBuilder('template-add-note')({
    insert: {
      '.addNote__buttons': {
        setup: setupIconButton,
        set: [
          ['&#xe800;', 'Создать список'],
          ['&#xf1fc;', 'Создать заметку с рисунком'],
          ['&#xe802;', 'Создать фотозаметку'],
        ],
      },
    },
  });
}

// ШАБЛОН КОНТЕЙНЕРА / CONTAINER
// *
export function setupContainer() {
  return setupBuilder('template-container')({
    insert: {
      '.container__item:first-of-type': {
        setup: setupAddNote,
      },
      '.container__item:nth-of-type(2)': {
        setup: setupNote,
      },
      '.container__item:last-of-type': {
        setup: setupNote,
        set: [[{ type: 'list' }]],
      },
    },
  });
}
