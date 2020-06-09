// ФУНКЦИЯ ДЛЯ СОЗДАНИЯ КОНФИГУРАТОРОВ ШАБЛОНОВ
export default function setupBuilder(templateName) {
  const template = document.getElementById(templateName);

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
}
