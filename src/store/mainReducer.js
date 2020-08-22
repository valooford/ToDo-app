// 610 -> 510
const SET_NOTE_FOCUS = 'main/set-note-focus';
const SET_NOTE_PIN = 'main/set-note-pin';
const ADD_NOTE = 'main/add-note';
const COPY_NOTE = 'main/copy-note';
const UPDATE_NOTE = 'main/update-note';
const REMOVE_NOTE = 'main/remove-note';
const ADD_NOTE_LIST_ITEM = 'main/add-note-list-item';
const REMOVE_NOTE_LIST_ITEM = 'main/remove-note-list-item';
const SET_CHECK_NOTE_LIST_ITEM = 'main/set-check-note-list-item';
const UNCHECK_ALL_LIST_ITEMS = 'main/uncheck-all-list-items';
const REMOVE_CHECKED_LIST_ITEMS = 'main/remove-checked-list-items';
const TEXT_NOTE_TO_LIST = 'main/text-note-to-list';
const LIST_NOTE_TO_TEXT = 'main/list-note-to-text';
const SET_NOTE_POPUP = 'main/set-note-popup'; //! no sense without mount
const SET_NOTE_COLOR = 'main/set-note-color';
const SET_SELECTED_NOTES = 'main/set-selected-notes';

const normalizedInitialState = {
  notes: {
    '000': {
      id: '000',
      type: 'default',
      headerText: '',
      text: '',
      color: 'default',
    },
    '111': {
      id: '111',
      type: 'default',
      headerText: 'Мой заголовок',
      text: 'Привет\nПока',
      creationDate: new Date(2020, 5, 29, 10),
      editingDate: new Date(2020, 6, 1, 1, 12),
      color: 'default',
    },
    '222': {
      id: '222',
      type: 'list',
      headerText: 'Список',
      items: {
        '222-1': {
          id: '222-1',
          text: 'first',
          sub: [],
        },
        '222-2': {
          id: '222-2',
          text: 'second',
          sub: ['222-4'],
          isMarked: true,
        },
        '222-3': {
          id: '222-3',
          text: 'third',
          sub: [],
        },
        '222-4': {
          id: '222-4',
          text: 'nested',
          sub: [],
        },
      },
      itemsOrder: ['222-1', '222-2', '222-3'],
      creationDate: new Date(2020, 5, 30, 10),
      editingDate: new Date(2020, 6, 1, 1, 12),
      color: 'blue',
    },
  },
  notesOrder: ['000', '111', '222'],
  selectedNotes: [], //-
  removedNotes: [],
};

export default function mainReducer(state = normalizedInitialState, action) {
  switch (action.type) {
    case SET_NOTE_FOCUS:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            isFocused: action.isFocused,
          },
        },
      };
    case SET_NOTE_PIN:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            isPinned: action.isPinned,
          },
        },
      };
    // - unused
    case ADD_NOTE: {
      const newNoteId = Date.now();
      return {
        ...state,
        notes: {
          ...state.notes,
          [newNoteId]: {
            id: newNoteId,
            type: action.text ? 'default' : 'list',
            headerText: action.headerText,
            text: action.text,
            items: action.items
              ? action.items.reduce((items, text, i) => {
                  const itemId = `${newNoteId}-${i}`;
                  // eslint-disable-next-line no-param-reassign
                  items[itemId] = {
                    id: itemId,
                    text,
                    sub: [],
                  };
                  return items;
                })
              : null,
            creationDate: new Date(),
            editingDate: new Date(),
          },
        },
        notesOrder: [
          state.notesOrder[0],
          action.id,
          ...state.notesOrder.slice(1),
        ],
      };
    }
    case COPY_NOTE: {
      const newNoteId = Date.now();
      // first note is used for adding
      if (action.add === state.notesOrder[0]) {
        const note = state.notes[state.notesOrder[0]];
        // no headerText and no text/items or items array is empty
        if (!note.headerText && !note.text && (!note.items || !note.items[0])) {
          return state; // nothing to add
        }
        return {
          ...state,
          notes: {
            ...state.notes,
            [newNoteId]: {
              id: newNoteId,
              type: 'default',
              headerText: '',
              text: '',
              color: 'default',
              popup: null,
              creationDate: new Date(),
              editingDate: new Date(),
            },
          },
          notesOrder: [newNoteId, ...state.notesOrder],
        };
      }
      const note = state.notes[action.id];
      return {
        ...state,
        notes: {
          ...state.notes,
          [newNoteId]: {
            id: Date.now(),
            type: note.type,
            headerText: note.headerText,
            text: note.text,
            items: note.items,
            popup: null,
            creationDate: new Date(),
            editingDate: new Date(),
            color: note.color,
          },
        },
        notesOrder: [
          state.notesOrder[0],
          newNoteId,
          ...state.notesOrder.slice(1),
        ],
      };
    }
    case UPDATE_NOTE:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            headerText:
              typeof action.headerText === 'string'
                ? action.headerText
                : state.notes[action.id].headerText,
            text:
              typeof action.text === 'string'
                ? action.text
                : state.notes[action.id].text,
            items:
              action.itemId != null
                ? {
                    ...state.notes[action.id].items,
                    [action.itemId]: {
                      ...state.notes[action.id].items[action.itemId],
                      text: action.itemText,
                    },
                  }
                : state.notes[action.id].items,
            editingDate: new Date(),
          },
        },
      };
    case REMOVE_NOTE: {
      const { [action.id]: removingNote, ...notes } = state.notes;
      return {
        ...state,
        notes,
        notesOrder: state.notesOrder.filter((id) => id !== action.id),
      };
    }
    case ADD_NOTE_LIST_ITEM: {
      const newItemId = Date.now();
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            items: {
              ...state.notes[action.id].items,
              [newItemId]: {
                id: newItemId,
                text: action.text,
                sub: [],
              },
            },
            itemsOrder: [...state.notes[action.id].itemsOrder, newItemId],
            editingDate: new Date(),
          },
        },
      };
    }
    case REMOVE_NOTE_LIST_ITEM: {
      const { [action.itemId]: removingItem, ...items } = state.notes[
        action.id
      ].items;
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            items,
            itemsOrder: state.notes[action.id].itemsOrder.filter(
              (id) => id !== action.itemId
            ),
            editingDate: new Date(),
          },
        },
      };
    }
    case SET_CHECK_NOTE_LIST_ITEM:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            items: {
              ...state.notes[action.id].items,
              [action.itemId]: {
                ...state.notes[action.id].items[action.itemId],
                isMarked: action.isMarked,
              },
            },
            editingDate: new Date(),
          },
        },
      };
    case UNCHECK_ALL_LIST_ITEMS:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            items: Object.keys(state.notes[action.id].items).reduce(
              (uncheckedItems, itemId) => {
                /* eslint-disable no-param-reassign */
                const item = state.notes[action.id].items[itemId];
                if (item.isMarked)
                  uncheckedItems[itemId] = { ...item, isMarked: false };
                else uncheckedItems[itemId] = item;
                return uncheckedItems;
                /* eslint-enable no-param-reassign */
              },
              {}
            ),
            editingDate: new Date(),
          },
        },
      };
    case REMOVE_CHECKED_LIST_ITEMS:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            items: Object.keys(state.notes[action.id].items).reduce(
              (filteredItems, itemId) => {
                /* eslint-disable no-param-reassign */
                const item = state.notes[action.id].items[itemId];
                if (!item.isMarked) filteredItems[itemId] = item;
                return filteredItems;
                /* eslint-enable no-param-reassign */
              },
              {}
            ),
            itemsOrder: state.notes[action.id].itemsOrder.filter(
              (id) => !state.notes[action.id].items[id].isMarked
            ),
            editingDate: new Date(),
          },
        },
      };
    case TEXT_NOTE_TO_LIST: {
      const { text, ...note } = state.notes[action.id];
      const itemsId = Date.now();
      const items = text.split('\n').reduce((itemsFromText, itemText, i) => {
        const itemId = `${itemsId}-${i}`;
        // eslint-disable-next-line no-param-reassign
        itemsFromText[itemId] = {
          id: itemId,
          text: itemText,
          sub: [],
        };
        return itemsFromText;
      }, {});
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...note,
            items,
            itemsOrder: Object.keys(items),
            editingDate: new Date(),
          },
        },
      };
    }
    case LIST_NOTE_TO_TEXT: {
      const { items, itemsOrder, ...note } = state.notes[action.id];
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...note,
            text: itemsOrder.map((itemId) => items[itemId].text).join('\n'),
            editingDate: new Date(),
          },
        },
      };
    }
    // -
    case SET_NOTE_POPUP:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            popup: action.popup,
          },
        },
      };
    case SET_NOTE_COLOR:
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...state.notes[action.id],
            color: action.color,
          },
        },
      };
    case SET_SELECTED_NOTES: {
      let selectedNotes;
      switch (action.effect) {
        case 'add':
          selectedNotes = [action.id, ...state.selectedNotes];
          break;
        case 'remove':
          selectedNotes = state.selectedNotes.filter((id) => id !== action.id);
          break;
        case 'remove-all':
          selectedNotes = [];
          break;
        default:
          return state;
      }
      return { ...state, selectedNotes };
    }
    default:
      return state;
  }
}

// SET_NOTE_FOCUS
export function focusNote(id) {
  return { type: SET_NOTE_FOCUS, id, isFocused: true };
}
export function blurNote(id) {
  return { type: SET_NOTE_FOCUS, id, isFocused: false };
}

// SET_NOTE_PIN
export function pinNote(id) {
  return { type: SET_NOTE_PIN, id, isPinned: true };
}
export function unpinNote(id) {
  return { type: SET_NOTE_PIN, id, isPinned: false };
}

// - ADD_NOTE unused
export function addTextNote(headerText = '', text) {
  return { type: ADD_NOTE, headerText, text };
}
export function addListNote(headerText = '', items) {
  return { type: ADD_NOTE, headerText, items };
}

// COPY_NOTE
export function addNewNote() {
  return { type: COPY_NOTE, add: true };
}
export function copyNote(id) {
  return { type: COPY_NOTE, id };
}

// UPDATE_NOTE
export function updateNoteHeader(id, headerText) {
  return { type: UPDATE_NOTE, id, headerText };
}
export function updateNoteText(id, text) {
  return { type: UPDATE_NOTE, id, text };
}
export function updateNoteListItem(id, itemId, itemText) {
  return { type: UPDATE_NOTE, id, itemId, itemText };
}

// REMOVE_NOTE
export function removeNote(id) {
  return { type: REMOVE_NOTE, id };
}

// LIST ITEM ACTION CREATORS
export function addNoteListItem(id, text) {
  return { type: ADD_NOTE_LIST_ITEM, id, text };
}
export function removeNoteListItem(id, itemId) {
  return { type: REMOVE_NOTE_LIST_ITEM, id, itemId };
}
export function checkNoteListItem(id, itemId) {
  return { type: SET_CHECK_NOTE_LIST_ITEM, id, itemId, isMarked: true };
}
export function uncheckNoteListItem(id, itemId) {
  return { type: SET_CHECK_NOTE_LIST_ITEM, id, itemId, isMarked: false };
}
export function uncheckAllListItems(id) {
  return { type: UNCHECK_ALL_LIST_ITEMS, id };
}
export function removeCheckedListItems(id) {
  return { type: REMOVE_CHECKED_LIST_ITEMS, id };
}

// TEXT_NOTE_TO_LIST
export function textNoteToList(id) {
  return { type: TEXT_NOTE_TO_LIST, id };
}
// LIST_NOTE_TO_TEXT
export function listNoteToText(id) {
  return { type: LIST_NOTE_TO_TEXT, id };
}

// - SET_NOTE_POPUP
export function setNotePopup(id, popup = null) {
  return { type: SET_NOTE_POPUP, id, popup };
}

// SET_NOTE_COLOR
export function setNoteColor(id, color) {
  return { type: SET_NOTE_COLOR, id, color };
}

// SET_SELECTED_NOTES
export function selectNote(id) {
  return { type: SET_SELECTED_NOTES, effect: 'add', id };
}
export function cancelNoteSelection(id) {
  return { type: SET_SELECTED_NOTES, effect: 'remove', id };
}
export function clearSelectedNotes() {
  return { type: SET_SELECTED_NOTES, effect: 'remove-all' };
}
