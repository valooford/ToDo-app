const SET_NOTE_FOCUS = 'main/set-note-focus';
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
const SET_NOTE_POPUP = 'main/set-note-popup';

const initialState = {
  notes: [
    { type: 'default', headerText: '', text: '' },
    {
      type: 'default',
      headerText: 'Мой заголовок',
      text: 'Привет\nПока',
      creationDate: new Date(2020, 5, 29, 10),
      editingDate: new Date(2020, 6, 1, 1, 12),
    },
    {
      type: 'list',
      headerText: 'Список',
      items: [
        {
          text: 'first',
          sub: [],
          key: '0-',
        },
        {
          text: 'second',
          sub: [
            {
              text: 'nested',
              key: '10-',
            },
          ],
          isMarked: true,
          key: '1-',
        },
        {
          text: 'third',
          sub: [],
          key: '2-',
        },
      ],
      creationDate: new Date(2020, 5, 30, 10),
      editingDate: new Date(2020, 6, 1, 1, 12),
    },
  ],
  removedNotes: [],
};

export default function mainReducer(state = initialState, action) {
  let note;
  let notes;
  let item;
  let items;
  let sub;
  let subItem;
  let removedNotes;
  let flag = false;
  let key;
  // eslint-disable-next-line no-param-reassign
  const emptyNote = { type: 'default', headerText: '', text: '' };
  switch (action.type) {
    case SET_NOTE_FOCUS:
      if (state.notes[action.index].isFocused === action.focus) {
        return state;
      }
      notes = [...state.notes];
      note = { ...notes[action.index] };
      note.isFocused = action.focus;
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case ADD_NOTE:
      notes = [...state.notes];
      note = {
        type: action.text ? 'default' : 'list',
        headerText: action.headerText,
        text: action.text,
        items: action.items,
        creationDate: new Date(),
        editingDate: new Date(),
      };
      notes = [notes[0], note, ...notes.slice(1)];
      return {
        ...state,
        notes,
      };
    case COPY_NOTE:
      notes = [...state.notes];
      note = {
        ...notes[action.index],
        isFocused: false,
        popup: null,
        creationDate: new Date(),
        editingDate: new Date(),
      };
      // first note is used for adding
      if (action.index === 0 && action.isAdding) {
        // no headerText and no text/items or items array is empty
        if (!note.headerText && !note.text && (!note.items || !note.items[0])) {
          return state; // nothing to add
        }
        notes[0] = note;
        notes = [{ ...emptyNote }, ...notes];
      } else {
        notes[action.index] = { ...notes[action.index] };
        note = {
          type: note.type,
          headerText: note.headerText,
          text: note.text,
          items: note.items,
          creationDate: note.creationDate,
          editingDate: note.editingDate,
        };
        notes = [notes[0], note, ...notes.slice(1)];
      }
      return {
        ...state,
        notes,
      };
    case UPDATE_NOTE:
      notes = [...state.notes];
      note = { ...notes[action.index] };
      if (typeof action.headerText === 'string') {
        note.headerText = action.headerText;
      }
      if (typeof action.text === 'string') {
        note.text = action.text;
      }
      if (action.itemNum != null) {
        items = [...note.items];
        item = { ...items[action.itemNum] };
        if (action.subItem == null) {
          item.text = action.itemText;
        } else {
          sub = [...item.sub];
          subItem = { ...sub[action.subItem] };
          subItem.text = action.itemText;
          sub[action.subItem] = subItem;
          item.sub = sub;
        }
        items[action.itemNum] = item;
        note.items = items;
      }
      note.editingDate = new Date();
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case REMOVE_NOTE:
      if (action.indices.length === 0) {
        return state;
      }
      notes = [...state.notes];
      removedNotes = [...state.removedNotes];

      notes = notes.filter((el, index) => {
        const res = action.indices.includes(index);
        if (res) {
          removedNotes.unshift(el);
          if (index === 0) {
            flag = true;
          }
        }
        return !res;
      });
      if (flag) {
        notes.unshift({ ...emptyNote });
      }
      // *
      // * removedNotes need to be sorted by date
      // *
      return {
        ...state,
        notes,
        removedNotes,
      };
    case ADD_NOTE_LIST_ITEM:
      key = Date.now();
      notes = [...state.notes];
      note = { ...notes[action.index] };
      items = [...note.items];
      if (action.itemNum !== null) {
        if (action.subNum == null) {
          items.splice(action.itemNum, 0, {
            text: action.text,
            sub: [],
            key: `${action.itemNum}-${key}`,
          });
        } else {
          item = { ...items[action.itemNum] };
          sub = [...item.sub];
          sub.splice(action.subNum, 0, {
            text: action.text,
            key: `${action.itemNum}${action.subNum}-${key}`,
          });
          item.sub = sub;
          items[action.itemNum] = item;
        }
      } else {
        items.splice(items.length, 0, {
          text: action.text,
          sub: [],
          key: `${items.length}-${key}`,
        });
      }
      note.items = items;
      note.editingDate = new Date();
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case REMOVE_NOTE_LIST_ITEM:
      notes = [...state.notes];
      note = { ...notes[action.index] };
      items = [...note.items];
      if (action.subNum == null) {
        items.splice(action.itemNum, 1);
      } else {
        item = { ...items[action.itemNum] };
        sub = [...item.sub];
        sub.splice(action.subNum, 1);
        item.sub = sub;
        items[action.itemNum] = item;
      }
      note.items = items;
      note.editingDate = new Date();
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case SET_CHECK_NOTE_LIST_ITEM:
      notes = [...state.notes];
      note = { ...notes[action.index] };
      items = [...note.items];
      item = { ...items[action.itemNum] };
      if (action.subNum == null) {
        item.isMarked = action.value;
      } else {
        sub = [...item.sub];
        subItem = { ...sub[action.subItem] };
        subItem.isMarked = action.value;
        sub[action.subItem] = subItem;
        item.sub = sub;
      }
      items[action.itemNum] = item;
      note.items = items;
      note.editingDate = new Date();
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case UNCHECK_ALL_LIST_ITEMS:
      notes = [...state.notes];
      note = { ...notes[action.index] };
      items = [...note.items];
      items.forEach((i) => {
        if (i.isMarked) {
          // eslint-disable-next-line no-param-reassign
          i.isMarked = false;
        }
        sub = [...i.sub];
        sub.forEach((si) => {
          if (si.isMarked) {
            // eslint-disable-next-line no-param-reassign
            si.isMarked = false;
          }
        });
        // eslint-disable-next-line no-param-reassign
        i.sub = sub;
      });
      note.items = items;
      note.editingDate = new Date();
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case REMOVE_CHECKED_LIST_ITEMS:
      notes = [...state.notes];
      note = { ...notes[action.index] };
      note.items = note.items.filter((i) => {
        if (i.isMarked) {
          return false;
        }
        // eslint-disable-next-line no-param-reassign
        i.sub = i.sub.filter((si) => {
          if (si.isMarked) {
            return false;
          }
          return true;
        });
        return true;
      });
      note.editingDate = new Date();
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case TEXT_NOTE_TO_LIST:
      notes = [...state.notes];
      note = {
        ...notes[action.index],
        text: null,
        type: 'list',
        items:
          notes[action.index].text === ''
            ? []
            : notes[action.index].text.split('\n').map((text, i) => ({
                text,
                sub: [],
                key: `${i}-${Date.now()}`,
              })),
      };
      note.editingDate = new Date();
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case LIST_NOTE_TO_TEXT:
      notes = [...state.notes];
      note = {
        ...notes[action.index],
        type: 'default',
        text: notes[action.index].items
          .map((i) => [i.text, ...i.sub.map((si) => si.text)])
          .flat()
          .join('\n'),
      };
      note.editingDate = new Date();
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    case SET_NOTE_POPUP:
      if (state.notes[action.index].popup === action.popup) {
        return state;
      }
      notes = [...state.notes];
      note = { ...notes[action.index] };
      note.popup = action.popup;
      notes[action.index] = note;
      return {
        ...state,
        notes,
      };
    default:
      return state;
  }
}

// SET_NOTE_FOCUS
export function focusNote(index) {
  return {
    type: SET_NOTE_FOCUS,
    index,
    focus: true,
  };
}
export function blurNote(index) {
  return {
    type: SET_NOTE_FOCUS,
    index,
    focus: false,
  };
}

// ADD_NOTE
export function addTextNote(headerText = '', text = '') {
  return {
    type: ADD_NOTE,
    headerText,
    text,
  };
}
export function addListNote(headerText = '', items = []) {
  return {
    type: ADD_NOTE,
    headerText,
    items,
  };
}

// COPY_NOTE
export function addNewNote() {
  return {
    type: COPY_NOTE,
    index: 0,
    isAdding: true,
  };
}
export function copyNote(index) {
  return {
    type: COPY_NOTE,
    index,
  };
}

// UPDATE_NOTE
export function updateNoteHeader(index, headerText = '') {
  return {
    type: UPDATE_NOTE,
    index,
    headerText,
  };
}
export function updateNoteText(index, text = '') {
  return {
    type: UPDATE_NOTE,
    index,
    text,
  };
}
export function updateNoteListItem(
  index,
  itemText = '',
  itemNum = null,
  subNum = null
) {
  return {
    type: UPDATE_NOTE,
    index,
    itemText,
    itemNum,
    subNum,
  };
}

// REMOVE_NOTE
export function removeNote(indices = []) {
  return { type: REMOVE_NOTE, indices };
}

// LIST ITEM ACTION CREATORS
export function addNoteListItem(
  index,
  text = '',
  itemNum = null,
  subNum = null
) {
  return {
    type: ADD_NOTE_LIST_ITEM,
    index,
    text,
    itemNum,
    subNum,
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
export function checkNoteListItem(index, itemNum, subNum = null) {
  return {
    type: SET_CHECK_NOTE_LIST_ITEM,
    value: true,
    index,
    itemNum,
    subNum,
  };
}
export function uncheckNoteListItem(index, itemNum, subNum = null) {
  return {
    type: SET_CHECK_NOTE_LIST_ITEM,
    value: false,
    index,
    itemNum,
    subNum,
  };
}
export function uncheckAllListItems(index) {
  return {
    type: UNCHECK_ALL_LIST_ITEMS,
    index,
  };
}
export function removeCheckedListItems(index) {
  return {
    type: REMOVE_CHECKED_LIST_ITEMS,
    index,
  };
}

// TEXT_NOTE_TO_LIST
export function textNoteToList(index) {
  return { type: TEXT_NOTE_TO_LIST, index };
}

// LIST_NOTE_TO_TEXT
export function listNoteToText(index) {
  return { type: LIST_NOTE_TO_TEXT, index };
}

// SET_NOTE_POPUP
export function setNotePopup(index, popup = null) {
  return {
    type: SET_NOTE_POPUP,
    index,
    popup,
  };
}
