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
  function insertFunc(elems, block) {
    const elements = { ...elems };
    Object.keys(elements).forEach((selector) => {
      const els = block.querySelectorAll(selector);
      if (!elements[selector].forEach) {
        elements[selector] = [elements[selector]];
      }
      els.forEach((el, index) => {
        if (!usingSetup(elements[selector][index], el, 'append')) {
          /* eslint-disable no-param-reassign */
          if (elements[selector][index].html) {
            el.innerHTML = elements[selector][index].html;
          } else {
            el.textContent = elements[selector][index];
          }
          /* eslint-enable no-param-reassign */
        }
      });
    });
  }
  return function setup({
    clone = {}, // elements to duplicate
    insert = {}, // insertions to elements
    append = [], // insertions to the start of main block
    prepend = [], // insertions to the end of main block
    modificators = [], // list of modificators
    cut = {}, // elements to cut when modificator set
    add = {}, // element insertions when modificator set
    props = {}, // properties to add to main block
    elementsProps = {}, // properties to add to elements
    eventHandlers = {},
    elementsEventHandlers = {},
    refs = {},
  } = {}) {
    const newElement = template.cloneNode(true);

    Object.keys(clone).forEach((selector) => {
      const el = newElement.querySelector(selector);
      for (let i = 0; i < clone[selector]; i += 1) {
        const copy = el.cloneNode(true);
        el.after(copy);
      }
    });
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
    Object.keys(elementsProps).forEach((selector) => {
      const els = newElement.querySelectorAll(selector);
      els.forEach((el) => {
        const element = el;
        Object.keys(elementsProps[selector]).forEach((prop) => {
          element[prop] = elementsProps[selector][prop];
        });
      });
    });
    Object.keys(eventHandlers).forEach((eventName) => {
      newElement.addEventListener(eventName, eventHandlers[eventName]);
    });
    Object.keys(elementsEventHandlers).forEach((selector) => {
      const els = newElement.querySelectorAll(selector);
      els.forEach((el) => {
        const element = el;
        Object.keys(elementsEventHandlers[selector]).forEach((eventName) => {
          element.addEventListener(
            eventName,
            elementsEventHandlers[selector][eventName]
          );
        });
      });
    });
    Object.keys(refs).forEach((selector) => {
      const el = newElement.querySelector(selector);
      // eslint-disable-next-line no-param-reassign
      refs[selector].ref = el; // mutation
    });

    return newElement;
  };
}
