import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  addNoteListItem,
  insertListItem,
  insertListSubItem,
} from '@store/notesReducer';

import ListItemDnD from './ListItem.dnd';

function ListItemGroup({
  items,
  isAddNeeded,
  addListItemRef,
  onListItemAdd,
  onListItemInsertion,
  onListSubItemInsertion,
}) {
  const [draggingItem, setDraggingItem] = useState(null);
  const [overlappedItem, setOverlappedItem] = useState(null);
  const [overlappedParentItem, setOverlappedParentItem] = useState(null);

  const onDragEnd = (item) => {
    // + check overlappedItem for 'add'
    // + check for item inserting to itself
    return (isNested) => {
      if (overlappedItem === 'add') {
        const possibleParentItems = items.filter(
          ({ id: iid }) => iid !== item.id
        );
        if (isNested && possibleParentItems.length) {
          const parentItemId =
            possibleParentItems[possibleParentItems.length - 1].id;
          onListSubItemInsertion(item.id, parentItemId);
        } else {
          onListItemInsertion(item.id);
        }
      } else {
        const isOverlappedNested = !!overlappedParentItem;
        if (isNested) {
          // nested
          if (isOverlappedNested) {
            onListSubItemInsertion(
              item.id,
              overlappedParentItem,
              overlappedItem
            );
          } else if (overlappedItem !== items[0].id) {
            const possibleParentItems = items.filter(
              ({ id: iid }) => iid !== item.id
            );
            const parentIndex = possibleParentItems.findIndex(
              (pi) => overlappedItem === pi.id
            );
            if (item.id === items[0].id) {
              onListItemInsertion(item.id, possibleParentItems[parentIndex].id);
            } else {
              onListSubItemInsertion(
                item.id,
                possibleParentItems[parentIndex - 1].id
              );
            }
          } else {
            onListItemInsertion(item.id, overlappedItem);
          }
          // not nested
        } else if (isOverlappedNested) {
          const parentIndex = items.findIndex(
            (pi) => overlappedParentItem === pi.id
          );
          onListItemInsertion(
            item.id,
            items.length === parentIndex + 1 ? null : items[parentIndex + 1].id,
            overlappedItem
          );
        } else {
          onListItemInsertion(item.id, overlappedItem);
        }
      }
      setOverlappedItem(null);
      setOverlappedParentItem(null);
      setDraggingItem(null);
    };
  };

  // focus handling
  const [focusingItemInfo, setFocusingItemInfo] = useState(null);
  const setFocusingItem = (originIndex, originSubIndex = null) => {
    setFocusingItemInfo({ index: originIndex, subIndex: originSubIndex });
  };
  const focusingItemTextareaRef = useRef(null);
  useEffect(() => {
    if (!focusingItemInfo) return;
    let focusingItemTextarea;
    if (focusingItemInfo.index === 'add') {
      focusingItemTextarea = addListItemRef.current;
    } else {
      focusingItemTextarea = focusingItemTextareaRef.current;
      if (!focusingItemTextarea) {
        if (focusingItemInfo.subIndex != null) {
          focusingItemTextarea =
            items[focusingItemInfo.index].sub[focusingItemInfo.subIndex].ref
              .current;
        } else {
          focusingItemTextarea = items[focusingItemInfo.index].ref.current;
        }
      }
    }

    focusingItemTextarea.focus();
    focusingItemTextarea.setSelectionRange(9999, 9999);
    setFocusingItemInfo(null);
  }, [focusingItemInfo]);

  return (
    <>
      {items.map((item, i) => [
        <ListItemDnD
          isPreview={item.onFocus}
          value={item.text}
          onChange={item.onChange}
          onRemove={() => {
            let index;
            let subIndex;
            if (i === 0) {
              if (!items[0].sub.length) {
                index = 'add';
              } else {
                index = 0;
              }
            } else {
              index = i - 1;
              const subCount = items[index].sub.length;
              if (subCount) {
                subIndex = subCount - 1;
              }
            }
            setFocusingItem(index, subIndex);
            item.onRemove();
          }}
          onCheck={item.onCheck}
          onMouseUp={item.onFocus}
          key={item.id}
          textareaRef={(() => {
            if (item.ref) return item.ref;
            if (
              focusingItemInfo &&
              focusingItemInfo.index === i &&
              focusingItemInfo.subIndex == null
            )
              return focusingItemTextareaRef;
            return null;
          })()}
          onInputConfirm={() => {
            setFocusingItem(i + 1);
            onListItemAdd('', item.id);
          }}
          onDrag={() => {
            setDraggingItem(item.id);
            if (item.sub.length !== 0) {
              setOverlappedItem(item.sub[0].id);
            } else if (i !== items.length - 1) {
              setOverlappedItem(items[i + 1].id);
            } else {
              setOverlappedItem('add');
            }
          }}
          onOverlap={
            draggingItem !== item.id
              ? () => {
                  setOverlappedItem(item.id);
                  setOverlappedParentItem(null);
                }
              : null
          }
          onDragEnd={onDragEnd(item)}
          overlapNext={(() => {
            if (item.sub.length !== 0) {
              return () => {
                setOverlappedItem(item.sub[0].id);
              };
            }
            if (i !== items.length - 1) {
              return () => {
                setOverlappedItem(items[i + 1].id);
              };
            }
            return () => {
              setOverlappedItem('add');
            };
          })()}
          isOverlapped={overlappedItem === item.id}
        />,
        ...(draggingItem !== item.id
          ? item.sub.map((subItem, si) => (
              <ListItemDnD
                isNested
                isPreview={subItem.onFocus}
                value={subItem.text}
                onChange={subItem.onChange}
                onRemove={() => {
                  const subIndex = si === 0 ? null : si - 1;
                  setFocusingItem(i, subIndex);
                  subItem.onRemove();
                }}
                onCheck={subItem.onCheck}
                onMouseUp={subItem.onFocus}
                key={subItem.id}
                // textareaRef={subItem.ref}
                textareaRef={(() => {
                  if (item.ref) return subItem.ref;
                  if (
                    focusingItemInfo &&
                    focusingItemInfo.index === i &&
                    focusingItemInfo.subIndex === si
                  )
                    return focusingItemTextareaRef;
                  return null;
                })()}
                onInputConfirm={() => {
                  setFocusingItem(i, si + 1);
                  onListItemAdd('', subItem.id);
                }}
                onDrag={() => {
                  if (si !== item.sub.length - 1) {
                    setOverlappedItem(item.sub[si + 1].id);
                  } else if (i !== items.length - 1) {
                    setOverlappedItem(items[i + 1].id);
                  } else {
                    setOverlappedItem('add');
                  }
                }}
                onOverlap={
                  draggingItem !== item.id
                    ? () => {
                        setOverlappedItem(subItem.id);
                        setOverlappedParentItem(item.id);
                      }
                    : null
                }
                onDragEnd={onDragEnd(subItem)}
                overlapNext={(() => {
                  if (si !== item.sub.length - 1) {
                    return () => {
                      setOverlappedItem(item.sub[si + 1].id);
                    };
                  }
                  if (i !== items.length - 1) {
                    return () => {
                      setOverlappedItem(items[i + 1].id);
                    };
                  }
                  return () => {
                    setOverlappedItem('add');
                  };
                })()}
                isOverlapped={overlappedItem === subItem.id}
              />
            ))
          : []),
      ])}
      {isAddNeeded && (
        <ListItemDnD
          isAddItem
          onChange={({ target: { value } }) => {
            if (value !== '') {
              setFocusingItem(items.length);
              onListItemAdd(value);
            }
          }}
          key="add-list-item"
          textareaRef={addListItemRef}
          onOverlap={() => {
            setOverlappedItem('add');
          }}
          isOverlapped={overlappedItem === 'add'}
        />
      )}
    </>
  );
}

function mapDispatchToProps(dispatch, { id }) {
  return bindActionCreators(
    {
      onListItemAdd: (itemText, after) => addNoteListItem(id, itemText, after),
      onListItemInsertion: (itemId, itemToDisplaceId, subItemId) =>
        insertListItem(id, itemId, itemToDisplaceId, subItemId),
      onListSubItemInsertion: (itemId, parentItemId, subItemId) =>
        insertListSubItem(id, itemId, parentItemId, subItemId),
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(ListItemGroup);
