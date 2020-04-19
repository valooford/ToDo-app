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
  if (!e.target.classList.contains('note__text')) {
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
  const title = newIconButton.lastElementChild.firstElementChild;
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

const noteCornerButtonsBlock = document.querySelector(
  '.note .note__cornerButtons'
);

const noteCornerButtons = [
  ['&#xe812;', 'Закрепить заметку', 'icon-button_smaller'],
];

noteCornerButtons.forEach((data) => {
  noteCornerButtonsBlock.append(setupIconButton(...data));
});

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

const noteButtonsBlock = document.querySelector('.note .note__buttons');

noteButtons.forEach((data) => {
  noteButtonsBlock.append(setupIconButton(...data));
});

setupIconButton('a', 'b');
