const SET_ADD_NOTE_FOCUS = 'main/switch-add-note-focus';
const ADD_NEW_NOTE = 'main/add-new-note';
const REMOVE_NOTE = 'main/remove-note';
const COPY_NOTE = 'main/copy-note';
const ADD_NOTE_LIST_ITEM = 'main/add-note-list-item';
const REMOVE_NOTE_LIST_ITEM = 'main/remove-note-list-item';
const SET_MARK_NOTE_LIST_ITEM = 'main/set-mark-note-list-item';
const TEXT_NOTE_TO_LIST = 'main/text-note-to-list';
const LIST_NOTE_TO_TEXT = 'main/list-note-to-text';

function mainReducer(state, action) {
  let note;
  let notes;
  let item;
  let items;
  let removedNotes;
  switch (action.type) {
    case SET_ADD_NOTE_FOCUS:
      return {
        ...state,
        isAddPostFocused: action.isFocused,
      };
    case ADD_NEW_NOTE:
      return {
        ...state,
        notes: [action.note, ...state.notes],
      };
    case REMOVE_NOTE:
      notes = [...state.notes];
      removedNotes = notes.splice(action.index, 1);
      return {
        ...state,
        notes,
        removedNotes: [...state.removedNotes, ...removedNotes],
      };
    case COPY_NOTE:
      note = { ...state.notes[action.index] };
      return {
        ...state,
        notes: [note, ...state.notes],
      };
    case ADD_NOTE_LIST_ITEM:
      if (action.after === null) {
        notes = [...state.notes];
        note = { ...notes[action.index] };
        note.items = [...note.items, { text: action.text, sub: [] }];
        notes[action.index] = note;
      }
      return {
        ...state,
        notes,
      };
    case REMOVE_NOTE_LIST_ITEM:
      notes = [...state.notes];
      note = { ...notes[action.index] };
      items = [...note.items];
      if (action.subNum === null) {
        items.splice(action.itemNum, 1);
      }
      note.items = items;
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case SET_MARK_NOTE_LIST_ITEM:
      notes = [...state.notes];
      note = { ...notes[action.index] };
      items = [...note.items];
      item = { ...items[action.itemNum] };
      if (action.subNum === null) {
        item.isMarked = action.value;
      }
      items[action.itemNum] = item;
      note.items = items;
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case TEXT_NOTE_TO_LIST:
      notes = [...state.notes];
      note = {
        type: 'list',
        headerText: notes[action.index].headerText,
        items: notes[action.index].text
          .split('\n')
          .map((text) => ({ text, sub: [] })),
      };
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case LIST_NOTE_TO_TEXT:
      notes = [...state.notes];
      note = {
        type: 'default',
        headerText: notes[action.index].headerText,
        text: notes[action.index].items
          .map((i) => [i.text, ...i.sub.map((subItem) => subItem.text)])
          .flat()
          .join('\n'),
      };
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    default:
      return state;
  }
}

export default mainReducer;

export function focusAddNote() {
  return { type: SET_ADD_NOTE_FOCUS, isFocused: true };
}
export function blurAddNote() {
  return { type: SET_ADD_NOTE_FOCUS, isFocused: false };
}

export function addNewNote(text = '', headerText = '') {
  return { type: ADD_NEW_NOTE, note: { text, headerText } };
}

export function removeNote(index = null) {
  if (index === null) return {};
  return { type: REMOVE_NOTE, index };
}

export function copyNote(index) {
  return { type: COPY_NOTE, index };
}

export function addNoteListItem(index, text, after = null) {
  return {
    type: ADD_NOTE_LIST_ITEM,
    index,
    text,
    after,
  };
}

export function removeNoteListItem(index, itemNum, subNum = null) {
  return {
    type: REMOVE_NOTE_LIST_ITEM,
    index,
    itemNum,
    subNum,
  };
}

export function markNoteListItem(index, itemNum, subNum = null) {
  return {
    type: SET_MARK_NOTE_LIST_ITEM,
    value: true,
    index,
    itemNum,
    subNum,
  };
}

export function unmarkNoteListItem(index, itemNum, subNum = null) {
  return {
    type: SET_MARK_NOTE_LIST_ITEM,
    value: false,
    index,
    itemNum,
    subNum,
  };
}

export function textNoteToList(index) {
  return { type: TEXT_NOTE_TO_LIST, index };
}

export function listNoteToText(index) {
  return { type: LIST_NOTE_TO_TEXT, index };
}
