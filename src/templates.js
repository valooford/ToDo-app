// *
// ШАБЛОН ПУНКТА МЕНЮ С ИКОНКОЙ / ICONED-MENU-ITEM
// *
const templateIconedMenuItem = document.getElementById(
  'template-iconed-menu-item'
).firstElementChild;

export function setupIconedMenuItem(iconSymbol, text, isSelected) {
  const newIconedMenuItem = templateIconedMenuItem.cloneNode(true);

  const icon = newIconedMenuItem.querySelector('.iconed-menu-item__icon');
  icon.innerHTML = iconSymbol;

  newIconedMenuItem.append(text);

  if (isSelected) {
    newIconedMenuItem.classList.add('iconed-menu-item_selected');
  }

  return newIconedMenuItem;
}

// *
// ШАБЛОН МЕНЮ / ASIDE
// *
const templateAside = document.getElementById('template-aside')
  .firstElementChild;
export function setupAside() {
  const newAside = templateAside.cloneNode(true);

  const asideMenu = newAside.querySelector('.aside__menu');
  const asideMenuButtons = [
    ['&#xe80d;', 'Заметки', true],
    ['&#xf0f3;', 'Напоминания'],
    ['&#xe81d;', '123'],
    ['&#xe80e;', 'Изменение ярлыков'],
    ['&#xe805;', 'Архив'],
    ['&#xe80f;', 'Корзина'],
  ];
  asideMenuButtons.forEach((data) => {
    asideMenu.append(setupIconedMenuItem(...data));
  });

  return newAside;
}

// *
// ШАБЛОН ОКНА С ПОДСКАЗКОЙ / TITLE
// *
const templateTitle = document.getElementById('template-title')
  .firstElementChild;
export function setupTitle(text) {
  const newTitle = templateTitle.cloneNode(true);

  const textBlock = newTitle.querySelector('.title__text');
  textBlock.textContent = text;

  return newTitle;
}

// *
// ШАБЛОН КНОПКИ С ИКОНКОЙ / ICON-BUTTON
// *
const templateIconButton = document.getElementById('template-icon-button')
  .firstElementChild;

export function setupIconButton(iconSymbol, titleText, modificator, disabled) {
  const newIconButton = templateIconButton.cloneNode(true);

  if (modificator) {
    newIconButton.classList.add(modificator);
  }
  if (disabled) {
    newIconButton.disabled = true;
    newIconButton.tabIndex = -1;
  }
  const icon = newIconButton.querySelector('.icon-button__icon');
  icon.innerHTML = iconSymbol;
  const title = newIconButton.querySelector('.icon-button__title');
  title.append(setupTitle(titleText));

  return newIconButton;
}

// *
// ШАБЛОН ПОЛЯ ДЛЯ ПОИСКА / SEARCH
// *
const templateSearch = document.getElementById('template-search')
  .firstElementChild;
export function setupSearch() {
  const newSearch = templateSearch.cloneNode(true);

  const searchIconBlock = newSearch.querySelector('.search__icon');
  const searchCleanBlock = newSearch.querySelector('.search__clean');
  searchIconBlock.append(setupIconButton('&#xe814;', 'Поиск'));
  searchCleanBlock.append(
    setupIconButton('&#xe80c;', 'Удалить поисковый запрос')
  );

  return newSearch;
}

// *
// ШАБЛОН ХЕДЕРА (ШАПКИ) / HEADER
// *
const templateHeader = document.getElementById('template-header')
  .firstElementChild;
export function setupHeader() {
  const newHeader = templateHeader.cloneNode(true);

  const menuButton = ['&#xf0c9;', 'Главное меню', 'icon-button_bigger'];
  newHeader.prepend(setupIconButton(...menuButton));

  const search = newHeader.querySelector('.header__search');
  search.append(setupSearch());

  const headerButtonsBlock = newHeader.querySelector('.header__buttons');
  const headerButtons = [
    ['&#xe815;', 'Обновить', 'icon-button_bigger'],
    ['&#xe819;', 'Сетка', 'icon-button_bigger'],
    ['&#xe818;', 'Настройки', 'icon-button_bigger'],
    ['&#xe816;', 'Приложения Google'],
    ['V', 'Аккаунт Google'],
  ];
  headerButtons.forEach((data) => {
    headerButtonsBlock.append(setupIconButton(...data));
  });

  return newHeader;
}

// *
// ШАБЛОН ТЕКСТОВОГО ПОЛЯ / TEXTAREA
// *
const templateTextarea = document.getElementById('template-textarea')
  .firstElementChild;
export function setupTextarea(placeholder = '') {
  const newTextarea = templateTextarea.cloneNode(true);

  newTextarea.placeholder = placeholder;

  return newTextarea;
}

// *
// ШАБЛОН ЭЛЕМЕНТА СПИСКА / LIST-ITEM
// *
const templateListItem = document.getElementById('template-list-item')
  .firstElementChild;

export function setupListItem({ type } = {}) {
  const newListItem = templateListItem.cloneNode(true);

  const drag = newListItem.querySelector('.listItem__drag');
  const add = newListItem.querySelector('.listItem__add');
  const checkbox = newListItem.querySelector('.listItem__checkbox');
  const text = newListItem.querySelector('.listItem__text');
  const remove = newListItem.querySelector('.listItem__remove');
  const closeButton = ['&#xe80c;', 'Удалить', 'icon-button_tiny'];

  switch (type) {
    case 'add':
      drag.remove();
      checkbox.remove();
      remove.remove();
      text.append(setupTextarea('Новый пункт'));
      break;
    default:
      add.remove();
      text.append(setupTextarea());
      remove.append(setupIconButton(...closeButton));
      break;
  }

  return newListItem;
}

// *
// ШАБЛОН УВЕДОМЛЕНИЯ / NOTIFICATION
// *
const templateNotification = document.getElementById('template-notification')
  .firstElementChild;
export function setupNotification() {
  const newNotification = templateNotification.cloneNode(true);

  return newNotification;
}

// *
// ШАБЛОН ЗАМЕТКИ / NOTE
// *
const templateNote = document.getElementById('template-note').firstElementChild;

export function setupNote({ type } = {}) {
  const newNote = templateNote.cloneNode(true);

  const noteCheckBlock = newNote.querySelector('.note__check');
  const noteCheck = [['&#xe80b;', 'Выбрать заметку', 'icon-button_no-padding']];
  noteCheck.forEach((data) => {
    noteCheckBlock.append(setupIconButton(...data));
  });

  const noteCornerButtonsBlock = newNote.querySelector('.note__cornerButtons');
  const noteCornerButtons = [
    ['&#xe812;', 'Закрепить заметку', 'icon-button_smaller'],
  ];
  noteCornerButtons.forEach((data) => {
    noteCornerButtonsBlock.append(setupIconButton(...data));
  });

  const noteText = newNote.querySelector('.note__text');
  noteText.append(setupTextarea('Заметка...'));

  const noteInfo = newNote.querySelector('.note__info');
  noteInfo.append(setupNotification());

  const noteCreationTime = noteInfo.querySelector('.note__creationTime');
  noteCreationTime.append(setupTitle('Создано 8 апр.'));

  const noteButtonsBlock = newNote.querySelector('.note__buttons');
  const noteButtons = [
    ['&#xf0f3;', 'Сохранить напоминание', 'icon-button_smaller'],
    ['&#xe803;', 'Соавторы', 'icon-button_smaller'],
    ['&#xe804;', 'Изменить цвет', 'icon-button_smaller'],
    ['&#xe802;', 'Добавить картинку', 'icon-button_smaller'],
    ['&#xe805;', 'Архивировать', 'icon-button_smaller'],
    ['&#xe81f;', 'Ещё', 'icon-button_smaller'],
    ['&#xe807;', 'Отменить', 'icon-button_smaller', true],
    ['&#xe808;', 'Повторить', 'icon-button_smaller', true],
  ];
  noteButtons.forEach((data) => {
    noteButtonsBlock.append(setupIconButton(...data));
  });

  const notificationClose = newNote.querySelector('.notification__close');
  const closeButton = [
    '&#xe80c;',
    'Удалить напоминание',
    'icon-button_notification',
  ];
  notificationClose.append(setupIconButton(...closeButton));

  let list;
  let markedList;

  let listWrapper;

  switch (type) {
    case 'list':
      newNote.querySelector('.textarea').remove();

      list = newNote.querySelector('.note__list');
      list.append(setupListItem());
      list.append(setupListItem({ type: 'add' }));

      markedList = newNote
        .querySelector('.note__markedList')
        .querySelector('.note__list');
      markedList.append(setupListItem());
      break;
    default:
      listWrapper = newNote.querySelector('.note__listWrapper');
      listWrapper.remove();
      break;
  }

  return newNote;
}

// *
// ШАБЛОН БЛОКА ДОБАВЛЕНИЯ ЗАМЕТКИ / ADD-NOTE
// *
const templateAddNote = document.getElementById('template-add-note')
  .firstElementChild;
export function setupAddNote() {
  const newAddNote = templateAddNote.cloneNode(true);

  const addNoteButtonsBlock = newAddNote.querySelector('.addNote__buttons');
  const addNoteButtons = [
    ['&#xe800;', 'Создать список'],
    ['&#xf1fc;', 'Создать заметку с рисунком'],
    ['&#xe802;', 'Создать фотозаметку'],
  ];
  addNoteButtons.forEach((data) => {
    addNoteButtonsBlock.append(setupIconButton(...data));
  });

  return newAddNote;
}

// *
// ШАБЛОН КОНТЕЙНЕРА / CONTAINER
// *
const templateContainer = document.getElementById('template-container')
  .firstElementChild;
export function setupContainer() {
  const newContainer = templateContainer.cloneNode(true);

  const firstContainerItem = newContainer.querySelector(
    '.container__item:first-of-type'
  );
  firstContainerItem.append(setupAddNote());

  let lastContainerItem = newContainer.querySelector(
    '.container__item:last-of-type'
  );
  lastContainerItem.append(setupNote());

  lastContainerItem.after(lastContainerItem.cloneNode());
  lastContainerItem = newContainer.querySelector(
    '.container__item:last-of-type'
  );
  lastContainerItem.append(setupNote({ type: 'list' }));

  return newContainer;
}
