// ФУНКЦИЯ ДЛЯ СОЗДАНИЯ КОНФИГУРАТОРОВ ШАБЛОНОВ
export default function setupBuilder(templateName) {
  const template = document.getElementById(templateName);
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
  return function setup(elements) {
    const nodeWrapper = template.cloneNode(true);

    Object.keys(elements).forEach((selector) => {
      const elementNode = nodeWrapper.querySelector(selector);
      const elementNodes = [elementNode];

      if (!elementNode) return;
      const {
        cut,
        clone,
        append,
        prepend,
        html,
        props,
        modificators,
        eventHandlers,
      } = elements[selector];

      if (cut) {
        elementNode.remove();
        return;
      }

      let cloneAnchor;
      if (clone && clone > 0) {
        cloneAnchor = elementNode;
        for (let i = 0; i < clone; i += 1) {
          const copy = elementNode.cloneNode(true);
          cloneAnchor.after(copy);
          elementNodes.push(copy);
          cloneAnchor = copy;
        }
      }
      let isSequence = false;
      if (elementNodes.length > 1) {
        isSequence = true;
      }

      if (append) {
        if (isSequence) {
          append.forEach((el, index) => {
            elementNodes[index].append(el);
          });
        } else if (append.forEach) {
          elementNode.append(...append);
        } else {
          elementNode.append(append);
        }
      }

      if (prepend) {
        if (isSequence) {
          prepend.forEach((el, index) => {
            elementNodes[index].prepend(el);
          });
        } else if (prepend.forEach) {
          elementNode.prepend(...prepend);
        } else {
          elementNode.prepend(prepend);
        }
      }

      if (html) {
        if (isSequence) {
          html.forEach((el, index) => {
            elementNodes[index].innerHTML = el;
          });
        } else {
          elementNode.innerHTML = html;
        }
      }

      if (props) {
        Object.keys(props).forEach((prop) => {
          elementNode[prop] = props[prop];
        });
      }

      if (modificators) {
        modificators.forEach((modificator) => {
          elementNode.classList.add(modificator);
        });
      }

      if (eventHandlers) {
        if (isSequence) {
          elementNodes.forEach((el, index) => {
            Object.keys(eventHandlers).forEach((eventName) => {
              el.addEventListener(eventName, eventHandlers[eventName][index]);
            });
          });
        } else {
          Object.keys(eventHandlers).forEach((eventName) => {
            if (!eventHandlers[eventName]) return;
            if (eventHandlers[eventName].forEach) {
              eventHandlers[eventName].forEach((handler) => {
                if (!handler) return;
                elementNode.addEventListener(eventName, handler);
              });
            } else {
              elementNode.addEventListener(eventName, eventHandlers[eventName]);
            }
          });
        }
      }
    });

    return nodeWrapper.firstElementChild;
  };
  /* return function setup({
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
      let handlers = eventHandlers[eventName];
      if (!handlers) return;
      if (!handlers.forEach) {
        handlers = [handlers];
      }
      handlers.forEach((handler) => {
        newElement.addEventListener(eventName, handler);
      });
    });
    Object.keys(elementsEventHandlers).forEach((selector) => {
      const els = newElement.querySelectorAll(selector);
      els.forEach((el, index) => {
        const element = el;
        Object.keys(elementsEventHandlers[selector]).forEach((eventName) => {
          if (elementsEventHandlers[selector][eventName].forEach) {
            if (elementsEventHandlers[selector][eventName][index]) {
              element.addEventListener(
                eventName,
                elementsEventHandlers[selector][eventName][index]
              );
            }
          } else {
            element.addEventListener(
              eventName,
              elementsEventHandlers[selector][eventName]
            );
          }
        });
      });
    });

    return newElement;
  }; */
}
