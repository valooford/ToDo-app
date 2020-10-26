import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* eslint-disable import/no-unresolved */
import { addNoteListItem } from '@store/notesReducer';
/* eslint-enable import/no-unresolved */

import ListItemDnD from './ListItem.dnd';

function ListItemGroup({ items, isAddNeeded, addListItemRef, onListItemAdd }) {
  const [draggingItem, setDraggingItem] = useState(null);
  const [overlappedItem, setOverlappedItem] = useState(null);

  return (
    <>
      {items.map((item) => [
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
          }}
          onOverlap={() => {
            setOverlappedItem(item.id);
          }}
          onDragEnd={() => {
            setOverlappedItem(null);
            setDraggingItem(null);
          }}
          isOverlapped={overlappedItem === item.id}
        />,
        ...(draggingItem !== item.id
          ? item.sub.map((subItem) => (
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
                onOverlap={() => {
                  setOverlappedItem(subItem.id);
                }}
                onDragEnd={() => {
                  setOverlappedItem(null);
                }}
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
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(ListItemGroup);
