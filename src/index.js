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
  if (!e.target.classList.contains('addNote__noteField')) {
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

function setupIconButton(iconSymbol, titleText, modificator) {
  const newIconButton = templateIconButton.cloneNode(true);
  if (modificator) {
    newIconButton.classList.add(modificator);
  }
  const icon = newIconButton.firstElementChild;
  icon.textContent = iconSymbol;
  const title = newIconButton.lastElementChild.firstElementChild;
  title.textContent = titleText;

  return newIconButton;
}

setupIconButton('a', 'b');
