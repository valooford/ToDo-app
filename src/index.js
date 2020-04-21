import './styles/index.scss';
import { setupIconedMenuItem, setupIconButton, setupNote } from './templates';

// HEADER
const header = document.querySelector('.header');
const menuButton = ['&#xf0c9;', 'Главное меню', 'icon-button_bigger'];
header.prepend(setupIconButton(...menuButton));

const search = header.querySelector('.header__search *');
const searchIconBlock = search.querySelector('.search__icon');
const searchCleanBlock = search.querySelector('.search__clean');
searchIconBlock.append(setupIconButton('&#xe814;', 'Поиск'));
searchCleanBlock.append(
  setupIconButton('&#xe80c;', 'Удалить поисковый запрос')
);

const headerButtonsBlock = header.querySelector('.header__buttons');
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

// ASIDE
const aside = document.querySelector('.aside');
const asideMenu = aside.querySelector('.aside__menu');
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

// MAIN
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

// ВСТАВКА ШАБЛОНОВ

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

let lastContainerItem = document.querySelector('.container__item:last-of-type');

lastContainerItem.append(setupNote());

lastContainerItem.after(lastContainerItem.cloneNode());
lastContainerItem = document.querySelector('.container__item:last-of-type');

lastContainerItem.append(setupNote({ type: 'list' }));
