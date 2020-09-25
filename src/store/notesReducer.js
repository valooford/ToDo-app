/* eslint-disable import/no-unresolved */
import { associativeArrToArr } from '@/utils';
/* eslint-enable import/no-unresolved */
import {
  SET_FOCUSED_NOTE,
  SET_NOTE_PIN,
  ADD_NOTE,
  COPY_NOTE,
  UPDATE_NOTE,
  REMOVE_NOTE,
  ADD_NOTE_LIST_ITEM,
  REMOVE_NOTE_LIST_ITEM,
  SET_CHECK_NOTE_LIST_ITEM,
  UNCHECK_ALL_LIST_ITEMS,
  REMOVE_CHECKED_LIST_ITEMS,
  TEXT_NOTE_TO_LIST,
  LIST_NOTE_TO_TEXT,
  SET_NOTE_POPUP,
  SET_NOTE_COLOR,
  SET_SELECTED_NOTES,
} from './actionsTypes';

const handlers = {
  // ---unused---
  [ADD_NOTE]: (state, { headerText, text, itemsArr }) => {
    const newNoteId = Date.now();
    return {
      ...state,
      notes: {
        ...state.notes,
        [newNoteId]: {
          id: newNoteId,
          type: text ? 'default' : 'list',
          headerText,
          text,
          items: itemsArr
            ? itemsArr.reduce((items, itemText, i) => {
                const itemId = `${newNoteId}-${i}`;
                // eslint-disable-next-line no-param-reassign
                items[itemId] = {
                  id: itemId,
                  text: itemText,
                  sub: [],
                };
                return items;
              })
            : null,
          creationDate: new Date(),
          editingDate: new Date(),
          color: 'default',
        },
      },
      regularNotesOrder: [
        state.regularNotesOrder[0],
        newNoteId,
        ...state.regularNotesOrder.slice(1),
      ],
    };
  },
  [COPY_NOTE]: (state, { add, ids }) => {
    const newNoteId = Date.now();
    // first note is used for adding
    if (add) {
      const note = state.notes[state.regularNotesOrder[0]];
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
            popup: null,
            creationDate: new Date(),
            editingDate: new Date(),
            color: 'default',
          },
        },
        regularNotesOrder: [newNoteId, ...state.regularNotesOrder],
      };
    }
    const noteCopies = ids.reduce(
      (copies, id, i) => {
        const note = state.notes[id];
        const noteId = `${newNoteId}-${i}`;
        /* eslint-disable no-param-reassign */
        copies.notes[noteId] = {
          id: noteId,
          type: note.type,
          headerText: note.headerText,
          text: note.text,
          items:
            note.items &&
            Object.keys(note.items).reduce((items, itemId) => {
              const { text, sub, isMarked } = note.items[itemId];
              items[itemId] = {
                id: itemId,
                text,
                sub: [...sub],
                isMarked,
              };
              return items;
            }, {}),
          itemsOrder: note.itemsOrder && [...note.itemsOrder],
          creationDate: new Date(),
          editingDate: new Date(),
          color: note.color,
        };
        /* eslint-enable no-param-reassign */
        copies.regularNotesOrder.push(noteId);
        return copies;
      },
      { notes: {}, regularNotesOrder: [] }
    );
    return {
      ...state,
      notes: {
        ...state.notes,
        ...noteCopies.notes,
      },
      regularNotesOrder: [
        state.regularNotesOrder[0],
        ...noteCopies.regularNotesOrder,
        ...state.regularNotesOrder.slice(1),
      ],
    };
  },
  [UPDATE_NOTE]: (state, { id, headerText, text, itemId, itemText }) => {
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          headerText:
            typeof headerText === 'string'
              ? headerText
              : state.notes[id].headerText,
          text: typeof text === 'string' ? text : state.notes[id].text,
          items:
            itemId != null
              ? {
                  ...state.notes[id].items,
                  [itemId]: {
                    ...state.notes[id].items[itemId],
                    text: itemText,
                  },
                }
              : state.notes[id].items,
          editingDate: new Date(),
        },
      },
    };
  },
  [REMOVE_NOTE]: (state, { ids }) => {
    const notes = { ...state.notes };
    const selectedNotes = { ...state.selectedNotes };
    ids.forEach((id) => {
      delete notes[id];
      if (selectedNotes[id]) {
        delete selectedNotes[id];
        selectedNotes.length -= 1;
      }
    });
    return {
      ...state,
      notes,
      regularNotesOrder: state.regularNotesOrder.filter((id) => notes[id]),
      selectedNotes:
        selectedNotes.length === state.selectedNotes.length
          ? state.selectedNotes
          : selectedNotes,
    };
  },
  [ADD_NOTE_LIST_ITEM]: (state, { id, text }) => {
    const newItemId = Date.now();
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          items: {
            ...state.notes[id].items,
            [newItemId]: {
              id: newItemId,
              text,
              sub: [],
            },
          },
          itemsOrder: [...state.notes[id].itemsOrder, newItemId],
          editingDate: new Date(),
        },
      },
    };
  },
  [REMOVE_NOTE_LIST_ITEM]: (state, { id, itemId }) => {
    const { [itemId]: removingItem, ...items } = state.notes[id].items;
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          items,
          itemsOrder: state.notes[id].itemsOrder.filter(
            (iId) => iId !== itemId
          ),
          editingDate: new Date(),
        },
      },
    };
  },
  [SET_CHECK_NOTE_LIST_ITEM]: (state, { id, itemId, isMarked }) => {
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          items: {
            ...state.notes[id].items,
            [itemId]: {
              ...state.notes[id].items[itemId],
              isMarked,
            },
          },
          editingDate: new Date(),
        },
      },
    };
  },
  [UNCHECK_ALL_LIST_ITEMS]: (state, { id }) => {
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          items: Object.keys(state.notes[id].items).reduce(
            (uncheckedItems, itemId) => {
              /* eslint-disable no-param-reassign */
              const item = state.notes[id].items[itemId];
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
  },
  [REMOVE_CHECKED_LIST_ITEMS]: (state, { id }) => {
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          items: Object.keys(state.notes[id].items).reduce(
            (filteredItems, itemId) => {
              /* eslint-disable no-param-reassign */
              const item = state.notes[id].items[itemId];
              if (!item.isMarked) filteredItems[itemId] = item;
              return filteredItems;
              /* eslint-enable no-param-reassign */
            },
            {}
          ),
          itemsOrder: state.notes[id].itemsOrder.filter(
            (itemId) => !state.notes[id].items[itemId].isMarked
          ),
          editingDate: new Date(),
        },
      },
    };
  },
  [TEXT_NOTE_TO_LIST]: (state, { id }) => {
    const { text, ...note } = state.notes[id];
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
        [id]: {
          ...note,
          type: 'list',
          items,
          itemsOrder: Object.keys(items),
          editingDate: new Date(),
        },
      },
    };
  },
  [LIST_NOTE_TO_TEXT]: (state, { id }) => {
    const { items, itemsOrder, ...note } = state.notes[id];
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: {
          ...note,
          type: 'default',
          text: itemsOrder.map((itemId) => items[itemId].text).join('\n'),
          editingDate: new Date(),
        },
      },
    };
  },
  [SET_FOCUSED_NOTE]: (state, { focusedId }) => {
    const newState = {
      ...state,
      focusedNoteId: focusedId,
    };
    if (focusedId === state.regularNotesOrder[0]) {
      const date = new Date();
      newState.notes[focusedId].creationDate = date;
      newState.notes[focusedId].editingDate = date;
    }
    return newState;
  },
  [SET_NOTE_PIN]: (state, { ids, isPinned }) => {
    const pinnedNotes = { ...state.pinnedNotes };
    ids.forEach((id) => {
      if (isPinned) {
        pinnedNotes[id] = true;
      } else {
        delete pinnedNotes[id];
      }
    });
    return { ...state, pinnedNotes };
  },
  // ---unnecessary---
  [SET_NOTE_POPUP]: (state, { id, popupName }) => {
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          popupName,
        },
      },
    };
  },
  [SET_NOTE_COLOR]: (state, { ids, color }) => {
    const coloredNotes = ids.reduce((notes, id) => {
      // eslint-disable-next-line no-param-reassign
      notes[id] = {
        ...state.notes[id],
        color,
      };
      return notes;
    }, {});
    return {
      ...state,
      notes: {
        ...state.notes,
        ...coloredNotes,
      },
    };
  },
  [SET_SELECTED_NOTES]: (state, { effect, id }) => {
    let selectedNotes;
    switch (effect) {
      case 'add':
        if (state.selectedNotes[id]) return state;
        selectedNotes = {
          ...state.selectedNotes,
          [id]: true,
          length: state.selectedNotes.length + 1,
        };
        break;
      case 'remove':
        if (!state.selectedNotes[id]) return state;
        selectedNotes = {
          ...state.selectedNotes,
          length: state.selectedNotes.length - 1,
        };
        delete selectedNotes[id];
        break;
      case 'remove-all':
        if (!state.selectedNotes.length) return state;
        selectedNotes = { length: 0 };
        break;
      default:
        return state;
    }
    return { ...state, selectedNotes };
  },
};

const normalizedInitialState = {
  notes: {
    '000': {
      id: '000',
      type: 'default',
      headerText: '',
      text: '',
      color: 'default',
      // popupName: null, // ---unnecessary---
    },
    111: {
      id: '111',
      type: 'default',
      headerText: 'Мой заголовок',
      text: 'Привет\nПока',
      creationDate: new Date(2020, 5, 29, 10),
      editingDate: new Date(2020, 6, 1, 1, 12),
      color: 'default',
    },
    222: {
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
  pinnedNotes: {
    // '222': true,
  },
  regularNotesOrder: ['000', '111', '222'],
  archivedNotes: {
    // '111': true,
  },
  archivedNotesOrder: [],
  removedNotes: {
    // '111': true,
  },
  removedNotesOrder: [],
  focusedNoteId: null,
  selectedNotes: {
    // '111': true,
    length: 0,
  },
};

export default function notesReducer(state = normalizedInitialState, action) {
  if (handlers[action.type]) return handlers[action.type](state, action);
  return state;
}

/* SET_FOCUSED_NOTE
 * id: actual id only
 */
export function focusNote(id) {
  return { type: SET_FOCUSED_NOTE, focusedId: id };
}
export function blurNote() {
  return { type: SET_FOCUSED_NOTE, focusedId: null };
}

/* SET_NOTE_PIN
 * id: actual id / array of ids
 */
export function pinNote(id) {
  const ids = associativeArrToArr(id);
  return { type: SET_NOTE_PIN, ids, isPinned: true };
}
export function unpinNote(id) {
  const ids = associativeArrToArr(id);
  return { type: SET_NOTE_PIN, ids, isPinned: false };
}

// ---unused--- ADD_NOTE
export function addTextNote(headerText = '', text) {
  return { type: ADD_NOTE, headerText, text };
}
export function addListNote(headerText = '', itemsArr) {
  return { type: ADD_NOTE, headerText, itemsArr };
}

/* COPY_NOTE
 * id: actual id / array of ids
 */
export function addNewNote() {
  return { type: COPY_NOTE, add: true };
}
export function copyNote(id) {
  const ids = associativeArrToArr(id);
  return { type: COPY_NOTE, ids };
}

/* UPDATE_NOTE
 * id: actual id only
 */
export function updateNoteHeader(id, headerText) {
  return { type: UPDATE_NOTE, id, headerText };
}
export function updateNoteText(id, text) {
  return { type: UPDATE_NOTE, id, text };
}
export function updateNoteListItem(id, itemId, itemText) {
  return { type: UPDATE_NOTE, id, itemId, itemText };
}

/* REMOVE_NOTE
 * id: actual id / array of ids
 */
export function removeNote(id) {
  const ids = associativeArrToArr(id);
  return { type: REMOVE_NOTE, ids };
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

/* TEXT_NOTE_TO_LIST
 * id: actual id only
 */
export function textNoteToList(id) {
  return { type: TEXT_NOTE_TO_LIST, id };
}
/* LIST_NOTE_TO_TEXT
 * id: actual id only
 */
export function listNoteToText(id) {
  return { type: LIST_NOTE_TO_TEXT, id };
}

/* ---unnecessary--- SET_NOTE_POPUP
 * id: actual id only
 */
export function setNotePopup(id, popupName = null) {
  return { type: SET_NOTE_POPUP, id, popupName };
}

/* SET_NOTE_COLOR
 * id: actual id / array of ids
 */
export function setNoteColor(id, color) {
  const ids = associativeArrToArr(id);
  return { type: SET_NOTE_COLOR, ids, color };
}

/* SET_SELECTED_NOTES
 * id: actual id only
 */
export function selectNote(id) {
  return { type: SET_SELECTED_NOTES, effect: 'add', id };
}
export function cancelNoteSelection(id) {
  return { type: SET_SELECTED_NOTES, effect: 'remove', id };
}
export function clearSelectedNotes() {
  return { type: SET_SELECTED_NOTES, effect: 'remove-all' };
}
