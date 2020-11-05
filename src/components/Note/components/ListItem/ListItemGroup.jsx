import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* eslint-disable import/no-unresolved */
import {
  addNoteListItem,
  insertListItem,
  insertListSubItem,
} from '@store/notesReducer';
/* eslint-enable import/no-unresolved */

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
          if (isOverlappedNested) {
            onListSubItemInsertion(
              item.id,
              overlappedParentItem,
              overlappedItem
            );
          } else if (overlappedItem !== items[0].id) {
            const parentIndex = items.findIndex(
              (pi) => overlappedItem === pi.id
            );
            if (item.id === items[0].id) {
              onListItemInsertion(item.id, items[parentIndex].id);
            } else {
              onListSubItemInsertion(item.id, items[parentIndex - 1].id);
            }
          } else {
            onListItemInsertion(item.id, overlappedItem);
          }
        } else {
          if (isOverlappedNested) {
            const parentIndex = items.findIndex(
              (pi) => overlappedParentItem === pi.id
            );
            onListItemInsertion(
              item.id,
              items.length === parentIndex + 1
                ? null
                : items[parentIndex + 1].id,
              overlappedItem
            );
          } else {
            onListItemInsertion(item.id, overlappedItem);
          }
          onListItemInsertion(
            item.id,
            overlappedParentItem || overlappedItem,
            overlappedParentItem ? overlappedItem : null
          );
        }
      }
      setOverlappedItem(null);
      setOverlappedParentItem(null);
      setDraggingItem(null);
    };
  };

  return (
    <>
      {items.map((item, i) => [
        <ListItemDnD
          isPreview={item.onFocus}
          value={item.text}
          onChange={item.onChange}
          onRemove={item.onRemove}
          onCheck={item.onCheck}
          onMouseUp={item.onFocus}
          key={item.id}
          textareaRef={item.ref}
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
                onRemove={subItem.onRemove}
                onCheck={subItem.onCheck}
                onMouseUp={subItem.onFocus}
                key={subItem.id}
                textareaRef={subItem.ref}
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
      onListItemAdd: (itemText) => addNoteListItem(id, itemText),
      onListItemInsertion: (itemId, itemToDisplaceId, subItemId) =>
        insertListItem(id, itemId, itemToDisplaceId, subItemId),
      onListSubItemInsertion: (itemId, parentItemId, subItemId) =>
        insertListSubItem(id, itemId, parentItemId, subItemId),
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(ListItemGroup);
