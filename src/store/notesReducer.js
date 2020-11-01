/* eslint-disable import/no-unresolved */
import { associativeArrToArr } from '@/utils';
/* eslint-enable import/no-unresolved */
import {
  SET_FOCUSED_NOTE,
  SET_NOTE_PIN,
  SET_NOTE_AS_REGULAR,
  SET_NOTE_AS_ARCHIVED,
  MANAGE_TAG,
  SET_NOTE_TAG,
  ADD_NOTE,
  COPY_NOTE,
  UPDATE_NOTE,
  REMOVE_NOTE,
  RESTORE_NOTE,
  DELETE_NOTE,
  ADD_NOTE_LIST_ITEM,
  REMOVE_NOTE_LIST_ITEM,
  SET_CHECK_NOTE_LIST_ITEM,
  UNCHECK_ALL_LIST_ITEMS,
  REMOVE_CHECKED_LIST_ITEMS,
  INSERT_LIST_ITEM,
  INSERT_LIST_SUB_ITEM,
  TEXT_NOTE_TO_LIST,
  LIST_NOTE_TO_TEXT,
  SET_NOTE_COLOR,
  SET_SELECTED_NOTES,
} from './actionsTypes';

const handlers = {
  // ---unused---
  [ADD_NOTE]: (state) => {
    const newAddingNoteId = Date.now();
    const addingNote = state.notes[state.addingNoteId];
    const newNoteId = addingNote.id; // using an addingNote previous id
    // no headerText and no text/items or items array is empty
    if (
      !addingNote.headerText &&
      !addingNote.text &&
      (!addingNote.items || !addingNote.items[0])
    ) {
      return state; // nothing to add
    }
    return {
      ...state,
      notes: {
        ...state.notes,
        [newAddingNoteId]: {
          id: newAddingNoteId,
          type: 'default',
          headerText: '',
          text: '',
          color: 'default',
        },
        [newNoteId]: {
          id: newNoteId,
          type: addingNote.type,
          headerText: addingNote.headerText,
          text: addingNote.text,
          items: addingNote.items,
          creationDate: new Date(),
          editingDate: new Date(),
          color: addingNote.color,
        },
      },
      addingNoteId: newAddingNoteId,
      regularNotes: {
        ...state.regularNotes,
        [newNoteId]: true,
        order: [newNoteId, ...state.regularNotes.order],
      },
    };
  },
  [COPY_NOTE]: (state, { ids }) => {
    const newNoteId = Date.now();
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
        copies.regularNotes[noteId] = true;
        copies.regularNotes.order.push(noteId);
        return copies;
        /* eslint-enable no-param-reassign */
      },
      { notes: {}, regularNotes: { order: [] } }
    );
    return {
      ...state,
      notes: {
        ...state.notes,
        ...noteCopies.notes,
      },
      regularNotes: {
        ...state.regularNotes,
        ...noteCopies.regularNotes,
        order: [
          state.regularNotes.order[0],
          ...noteCopies.regularNotes.order,
          ...state.regularNotes.order.slice(1),
        ],
      },
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
    const removedNotes = { ...state.removedNotes };
    const pinnedNotes = { ...state.pinnedNotes };
    const touchedFields = {};
    ids.forEach((id) => {
      removedNotes[id] = true;
      if (pinnedNotes[id]) {
        delete pinnedNotes[id];
        if (!touchedFields.pinnedNotes) touchedFields.pinnedNotes = true;
      }
    });
    const { notes } = state;
    removedNotes.order = [...ids, ...removedNotes.order].sort(
      (noteId1, noteId2) =>
        notes[noteId2].creationDate - notes[noteId1].creationDate
    );
    return {
      ...state,
      pinnedNotes: touchedFields.pinnedNotes ? pinnedNotes : state.pinnedNotes,
      removedNotes,
      selectedNotes: { length: 0 },
    };
  },
  [RESTORE_NOTE]: (state, { ids }) => {
    const removedNotes = { ...state.removedNotes };
    ids.forEach((id) => {
      delete removedNotes[id];
    });
    removedNotes.order = removedNotes.order.filter((id) => removedNotes[id]);
    return { ...state, removedNotes };
  },
  [DELETE_NOTE]: (state, { ids }) => {
    const notes = { ...state.notes };
    const regularNotes = { ...state.regularNotes };
    const archivedNotes = { ...state.archivedNotes };
    const removedNotes = { ...state.removedNotes };
    const touchedFields = {};
    ids.forEach((id) => {
      delete notes[id];
      if (regularNotes[id]) {
        delete regularNotes[id];
        touchedFields.regularNotes = true;
      }
      if (archivedNotes[id]) {
        delete archivedNotes[id];
        archivedNotes.archivedNotes = true;
      }
      delete removedNotes[id];
    });
    removedNotes.order = removedNotes.order.filter((id) => removedNotes[id]);
    if (touchedFields.regularNotes) {
      regularNotes.order = regularNotes.order.filter((id) => regularNotes[id]);
    }
    if (touchedFields.archivedNotes) {
      archivedNotes.order = archivedNotes.order.filter(
        (id) => archivedNotes[id]
      );
    }
    return {
      ...state,
      notes,
      regularNotes: touchedFields.regularNotes
        ? regularNotes
        : state.regularNotes,
      archivedNotes: touchedFields.archivedNotes
        ? archivedNotes
        : state.archivedNotes,
      removedNotes,
    };
  },
  // + { id, text, after }
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
          itemsOrder: [...state.notes[id].itemsOrder, newItemId], // + splice
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
  [INSERT_LIST_ITEM]: (
    state,
    { id, itemId, itemToDisplaceId, parentItemId, recvSubItemsFromSubId }
  ) => {
    // extract list item with itemId from its place
    const notes = { ...state.notes };
    const note = { ...notes[id] };
    let item = note.items[itemId];
    let itemsOrder;
    let parentItem;
    if (item.subOf) {
      // nested
      itemsOrder = [...note.itemsOrder];
      parentItem = {
        ...note.items[parentItemId],
        sub: note.items[parentItemId].sub.filter((iid) => iid !== itemId),
      };
      if (recvSubItemsFromSubId) {
        // take itemToDisplace's subItems from recvSubItemsFromSubId
        const nestedItemPos = parentItem.sub.indexOf(recvSubItemsFromSubId);
        item.sub = parentItem.sub.slice(nestedItemPos);
        parentItem.sub = parentItem.sub.slice(0, nestedItemPos);
      }
      item = { ...item };
      delete item.subOf;
    } else {
      itemsOrder = note.itemsOrder.filter((iid) => iid !== itemId);
    }
    // place item on new position
    const pos = note.itemsOrder.indexOf(itemToDisplaceId);
    itemsOrder.splice(pos, 0);

    if (item !== note.items[itemId]) note.items[itemId] = item;
    if (parentItem) note.items[parentItemId] = parentItem;
    note.itemsOrder = itemsOrder;
    notes[id] = note;
    return { ...state, notes };
  },
  [INSERT_LIST_SUB_ITEM]: (
    state,
    {
      id,
      subItemId,
      itemId,
      // subItemToDisplaceId
    }
  ) => {
    const notes = { ...state.notes };
    const note = { ...notes[id] };
    const items = { ...note.items };
    const subItem = { ...items[subItemId] };
    subItem.subOf = itemId;
    // extract list item with subItemId from its place
    // ...

    // check for 'subItemToDisplaceId' parameter
    // if subItemToDisplaceId === null then insert in the end of item's sub array
    // else displace subItemToDisplace
    // ...
    const item = { ...items[itemId] };

    note[itemId] = item;
    note.items = items;
    notes[id] = note;
    return { ...state, notes };
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
    if (focusedId === state.regularNotes.order[0]) {
      const date = new Date();
      newState.notes[focusedId].creationDate = date;
      newState.notes[focusedId].editingDate = date;
    }
    return newState;
  },
  [SET_NOTE_PIN]: (state, { ids, isPinned }) => {
    const pinnedNotes = { ...state.pinnedNotes };
    let isArchivedWasPinned;
    const archivedNotes = { ...state.archivedNotes };
    const regularNotes = { ...state.regularNotes };
    ids.forEach((id) => {
      if (isPinned) {
        pinnedNotes[id] = true;
        if (state.archivedNotes[id]) {
          if (!isArchivedWasPinned) isArchivedWasPinned = true;
          // setting note as regular
          delete archivedNotes[id];
          regularNotes[id] = true;
          regularNotes.order = [id, ...regularNotes.order];
        }
      } else {
        delete pinnedNotes[id];
      }
      if (isArchivedWasPinned) {
        archivedNotes.order = archivedNotes.order.filter(
          (noteId) => archivedNotes[noteId]
        );
      }
    });
    return {
      ...state,
      pinnedNotes,
      archivedNotes: isArchivedWasPinned ? archivedNotes : state.archivedNotes,
      regularNotes: isArchivedWasPinned ? regularNotes : state.regularNotes,
    };
  },
  [SET_NOTE_AS_REGULAR]: (state, { ids }) => {
    const archivedNotes = { ...state.archivedNotes };
    const regularNotes = { ...state.regularNotes };
    ids.forEach((id) => {
      delete archivedNotes[id];
      regularNotes[id] = true;
    });
    archivedNotes.order = archivedNotes.order.filter((id) => archivedNotes[id]);
    regularNotes.order = [...ids, ...regularNotes.order];
    return { ...state, regularNotes, archivedNotes };
  },
  [SET_NOTE_AS_ARCHIVED]: (state, { ids }) => {
    const regularNotes = { ...state.regularNotes };
    const archivedNotes = { ...state.archivedNotes };
    ids.forEach((id) => {
      delete regularNotes[id];
      archivedNotes[id] = true;
    });
    regularNotes.order = regularNotes.order.filter((id) => regularNotes[id]);
    archivedNotes.order = [...ids, ...archivedNotes.order];
    return { ...state, regularNotes, archivedNotes };
  },
  [MANAGE_TAG]: (state, { operation, tag, value }) => {
    const labeledNotes = { ...state.labeledNotes };
    switch (operation) {
      case 'add':
        labeledNotes[tag] = { id: Date.now() };
        return { ...state, labeledNotes };
      case 'rename':
        if (labeledNotes[value])
          labeledNotes[value] = {
            ...labeledNotes[value],
            ...labeledNotes[tag],
          };
        labeledNotes[value] = labeledNotes[tag];
        delete labeledNotes[tag];
        return { ...state, labeledNotes };
      case 'remove':
        delete labeledNotes[tag];
        return { ...state, labeledNotes };
      default:
        return state;
    }
  },
  [SET_NOTE_TAG]: (state, { ids, tag, remove }) => {
    const labeledNotes = { ...state.labeledNotes };
    ids.forEach((id) => {
      if (remove) {
        delete labeledNotes[tag][id];
      } else {
        labeledNotes[tag][id] = true;
      }
    });
    return { ...state, labeledNotes };
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
          subOf: '222-2',
        },
        '222-5': {
          id: '222-5',
          text: 'fifth',
          sub: ['222-6'],
        },
        '222-6': {
          id: '222-6',
          text: 'sixth',
          sub: [],
          subOf: '222-5',
        },
        '222-7': {
          id: '222-7',
          text: 'seventh',
          sub: [],
        },
      },
      itemsOrder: ['222-1', '222-2', '222-3', '222-7', '222-5'],
      creationDate: new Date(2020, 5, 30, 10),
      editingDate: new Date(2020, 6, 1, 1, 12),
      // color: 'blue',
      color: 'default',
    },
  },
  addingNoteId: '000',
  regularNotes: {
    111: true,
    222: true,
    order: ['111', '222'],
  },
  pinnedNotes: {
    // '222': true,
  },
  archivedNotes: {
    // '111': true,
    order: [],
  },
  removedNotes: {
    // '111': true,
    order: [],
  },
  labeledNotes: {
    'Label 1': {
      id: 100,
      111: true,
    },
  },
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

/* SET_NOTE_AS_REGULAR
 * id: actual id / array of ids
 */
export function setNoteAsRegular(id) {
  const ids = associativeArrToArr(id);
  return { type: SET_NOTE_AS_REGULAR, ids };
}
/* SET_NOTE_AS_ARCHIVED
 * id: actual id / array of ids
 */
export function setNoteAsArchived(id) {
  const ids = associativeArrToArr(id);
  return { type: SET_NOTE_AS_ARCHIVED, ids };
}

// MANAGE_TAG
export function addNewTag(tag) {
  return { type: MANAGE_TAG, operation: 'add', tag };
}
export function renameTag(tag, value) {
  return { type: MANAGE_TAG, operation: 'rename', tag, value };
}
export function removeTag(tag) {
  return { type: MANAGE_TAG, operation: 'remove', tag };
}

/* SET_NOTE_TAG
 * id: actual id / array of ids
 */
export function setNoteTag(id, tag) {
  // const ids = associativeArrToArr(id);
  const ids = id.forEach ? id : [id];
  return { type: SET_NOTE_TAG, ids, tag };
}
export function removeNoteTag(id, tag) {
  // const ids = associativeArrToArr(id);
  const ids = id.forEach ? id : [id];
  return { type: SET_NOTE_TAG, ids, tag, remove: true };
}

// ADD_NOTE
export function addNewNote() {
  return { type: ADD_NOTE };
}

/* COPY_NOTE
 * id: actual id / array of ids
 */
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
/* RESTORE_NOTE
 * id: actual id / array of ids
 */
export function restoreNote(id) {
  const ids = associativeArrToArr(id);
  return { type: RESTORE_NOTE, ids };
}
/* DELETE_NOTE
 * id: actual id / array of ids
 */
export function deleteNote(id) {
  const ids = associativeArrToArr(id);
  return { type: DELETE_NOTE, ids };
}

// LIST ITEM ACTION CREATORS
export function addNoteListItem(id, text) {
  return { type: ADD_NOTE_LIST_ITEM, id, text }; // + after
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
