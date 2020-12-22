import { REDO, UNDO } from './actionsTypes';

export default function historyEnhancer(
  reducers,
  historyStateName = 'history'
) {
  const initialState = {
    ...Object.keys(reducers).reduce((s, rk) => {
      // eslint-disable-next-line no-param-reassign
      s[rk] = reducers[rk](undefined, {});
      return s;
    }, {}),
    [historyStateName]: {
      past: [],
      future: [],
    },
  };

  return (state = initialState, action) => {
    const {
      [historyStateName]: { past, future },
      ...present
    } = state;

    switch (action.type) {
      case UNDO:
        return {
          ...past[past.length - 1],
          [historyStateName]: {
            past: past.slice(0, -1),
            future: [...future, present],
          },
        };
      case REDO:
        return {
          ...future[future.length - 1],
          [historyStateName]: {
            past: [...past, present],
            future: future.slice(0, -1),
          },
        };
      default: {
        const { saveHistory, clearHistory } = action;

        const [newState, isChanged] = Object.keys(reducers).reduce(
          ([s, wasChanged], key) => {
            const chunkState = reducers[key](state[key], action);
            // eslint-disable-next-line no-param-reassign
            s[key] = chunkState;
            return wasChanged ? [s, true] : [s, chunkState === state[key]];
          },
          [{}, false]
        );
        if (!isChanged) return state;
        if (saveHistory) {
          return {
            ...newState,
            [historyStateName]: {
              past: [...past, present],
              future: [],
            },
          };
        }
        if (clearHistory) {
          return {
            ...newState,
            [historyStateName]: {
              past: [],
              future: [],
            },
          };
        }
        return {
          ...newState,
          [historyStateName]: state[historyStateName],
        };
      }
    }
  };
}

export function undoHistory() {
  return { type: UNDO };
}

export function redoHistory() {
  return { type: REDO };
}
