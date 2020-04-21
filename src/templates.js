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
  const icon = newIconButton.firstElementChild;
  icon.innerHTML = iconSymbol;
  const title = newIconButton.querySelector('.title').firstElementChild;
  title.textContent = titleText;

  return newIconButton;
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
      text.placeholder = 'Новый пункт';
      break;
    default:
      add.remove();
      remove.append(setupIconButton(...closeButton));
      break;
  }

  return newListItem;
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
