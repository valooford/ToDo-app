// ФУНКЦИЯ ДЛЯ СОЗДАНИЯ КОНФИГУРАТОРОВ ШАБЛОНОВ
export default function setupBuilder(templateName) {
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
    eventHandlers = {},
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
    Object.keys(eventHandlers).forEach((eventName) => {
      newElement.addEventListener(eventName, eventHandlers[eventName]);
    });

    return newElement;
  };
}
