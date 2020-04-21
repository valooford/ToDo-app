import './styles/index.scss';

const containerElement = document.getElementById('container');

let focusedContainerItem;
function handleContainerFocus(e) {
  const newFocusedContainerItem = e.target.closest('.container__item');
  if (newFocusedContainerItem) {
    e.stopPropagation();
    if (newFocusedContainerItem === focusedContainerItem) return;
    if (focusedContainerItem) {
      focusedContainerItem.classList.remove('container__item_focused');
    }
    newFocusedContainerItem.classList.add('container__item_focused');
    focusedContainerItem = newFocusedContainerItem;
  }
}
function unfocusContainerItem() {
  if (focusedContainerItem) {
    focusedContainerItem.classList.remove('container__item_focused');
    focusedContainerItem = null;
  }
}

containerElement.addEventListener('click', handleContainerFocus);
document.addEventListener('click', unfocusContainerItem);

function handleNoteFieldInput(e) {
  if (!e.target.classList.contains('textarea')) {
    return;
  }
  if (e.target.value === '') {
    e.target.style.fontWeight = 'bold';
  } else {
    e.target.style.fontWeight = 'normal';
  }
  e.target.style.height = 'auto';
  e.target.style.height = `${e.target.scrollHeight}px`;
  const computedStyle = getComputedStyle(e.target);
  if (e.target.scrollHeight >= parseInt(computedStyle.maxHeight, 10)) {
    e.target.style.overflowY = 'scroll';
  } else {
    e.target.style.overflowY = 'hidden';
  }
}

containerElement.addEventListener('input', handleNoteFieldInput, false);

// TEMPLATES / ШАБЛОНЫ

// ШАБЛОН КНОПКИ С ИКОНКОЙ / ICON-BUTTON
const templateIconButton = document.getElementById('template-icon-button')
  .firstElementChild;

function setupIconButton(iconSymbol, titleText, modificator, disabled) {
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

const addNoteButtonsBlock = document.querySelector(
  '.addNote .addNote__buttons'
);
const addNoteButtons = [
  ['&#xe800;', 'Создать список'],
  ['&#xf1fc;', 'Создать заметку с рисунком'],
  ['&#xe802;', 'Создать фотозаметку'],
];
addNoteButtons.forEach((data) => {
  addNoteButtonsBlock.append(setupIconButton(...data));
});

// ШАБЛОН ЭЛЕМЕНТА СПИСКА / LIST-ITEM

const templateListItem = document.getElementById('template-list-item')
  .firstElementChild;

function setupListItem({ type } = {}) {
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

// ШАБЛОН ЗАМЕТКИ / NOTE

const templateNote = document.getElementById('template-note').firstElementChild;

function setupNote({ type } = {}) {
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

let lastContainerItem = document.querySelector('.container__item:last-of-type');

lastContainerItem.append(setupNote());

lastContainerItem.after(lastContainerItem.cloneNode());
lastContainerItem = document.querySelector('.container__item:last-of-type');

lastContainerItem.append(setupNote({ type: 'list' }));
