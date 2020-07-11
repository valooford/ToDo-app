import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import IconButton from '@components/IconButton/IconButton';
import Textarea from '@components/Textarea/Textarea';
import Notification from '@components/Notification/Notification';
import CreationTime from '@components/CreationTime/CreationTime';
import ListItem from '@components/ListItem/ListItem';
import PopupMenu from '@components/PopupMenu/PopupMenu';

import {
  updateNoteHeader,
  updateNoteText,
  addNoteListItem,
  updateNoteListItem,
  removeNoteListItem,
  checkNoteListItem,
  uncheckNoteListItem,
  setNotePopup,
} from '@store/mainReducer';
/* eslint-enable import/no-unresolved */
import style from './Note-cfg.module.scss';

function Note({
  noteData: {
    type,
    headerText,
    text,
    items,
    markedItems,
    isFocused,
    creationDate,
    editingDate,
  },
  buttons,
  eventHandlers: {
    onClick,
    onHeaderBlur,
    onTextFieldBlur,
    onListItemAdd,
    onListItemBlur,
    onListItemRemove,
    onListItemCheck,
    onListItemUncheck,
  },
}) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <form
      className={style.note}
      onSubmit={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <div className={style.note__check}>
        <IconButton
          iconSymbol="&#xe80b;"
          titleText="Выбрать заметку"
          modificators="icon-button_no-padding"
        />
      </div>
      <div className={style.note__cornerButtons}>
        <IconButton
          iconSymbol="&#xe812;"
          titleText="Закрепить заметку"
          modificators="icon-button_smaller"
        />
      </div>
      {(isFocused || headerText !== '') && (
        <input
          className={style.note__header}
          type="text"
          placeholder="Введите заголовок"
          value={headerText}
          // readOnly
          // onBlur={onHeaderBlur}
          onChange={onHeaderBlur}
        />
      )}
      {type !== 'list' && (
        <div className={style.note__text}>
          <Textarea
            placeholder="Заметка..."
            value={text}
            onBlur={onTextFieldBlur}
          />
        </div>
      )}
      {type === 'list' && (
        <div className={style.note__listWrapper}>
          <ul className={style.note__list}>
            {items.map((item) => (
              <ListItem
                text={item.text}
                onBlur={onListItemBlur(item.index)}
                onRemove={onListItemRemove(item.index)}
                onCheck={onListItemCheck(item.index)}
              />
            ))}
            <ListItem isAddItem onInput={onListItemAdd} />
          </ul>
          <div className={style.note__markedList}>
            <i>&#xe81a;</i>
            <span className={style.note__markedCount}>
              {`${markedItems.length} отмеченных пунктов`}
            </span>
            <ul className={style.note__list}>
              {markedItems.map((item) => (
                <ListItem
                  isChecked
                  text={item.text}
                  onBlur={onListItemBlur(item.index)}
                  onRemove={onListItemRemove(item.index)}
                  onCheck={onListItemUncheck(item.index)}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className={style.note__info}>
        {isFocused && creationDate && editingDate && (
          <span className={style.note__creationTime}>
            <CreationTime
              creationDate={creationDate}
              editingDate={editingDate}
            />
          </span>
        )}
        <Notification />
      </div>
      <div className={style.note__buttons}>
        {isFocused && (
          <button className={style.note__button} type="button">
            Закрыть
          </button>
        )}
        {buttons}
      </div>
    </form>
  );
}

function getNoteButtons({ index, popup, showPopup, hasMarkedItems }) {
  return [
    {
      iconSymbol: '\uf0f3',
      titleText: 'Сохранить напоминание',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue803',
      titleText: 'Соавторы',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue804',
      titleText: 'Изменить цвет',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue802',
      titleText: 'Добавить картинку',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue805',
      titleText: 'Архивировать',
      modificators: 'icon-button_smaller',
    },
    {
      iconSymbol: '\ue81f',
      titleText: 'Ещё',
      modificators:
        popup === 'menu'
          ? ['icon-button_smaller', 'icon-button_no-hover']
          : 'icon-button_smaller',
      onClick() {
        function popupDisappearanceHandler() {
          // const closestPopup = e.target.closest(
          //   `*:nth-of-type(${index + 1}) > .note .popup-menu`
          // );
          // if (!closestPopup) {
          showPopup(index, '');
          document.removeEventListener('click', popupDisappearanceHandler);
          // }
        }

        showPopup(index, 'menu');
        if (popup !== 'menu') {
          setTimeout(() => {
            document.addEventListener('click', popupDisappearanceHandler);
          }, 0);
        }
      },
      append: popup === 'menu' && (
        <PopupMenu index={index} hasMarkedItems={hasMarkedItems} />
      ),
    },
    {
      iconSymbol: '\ue807',
      titleText: 'Отменить',
      modificators: 'icon-button_smaller',
      // disabled: true,
    },
    {
      iconSymbol: '\ue808',
      titleText: 'Повторить',
      modificators: 'icon-button_smaller',
      // disabled: true,
    },
  ].map((params) => (
    <IconButton
      iconSymbol={params.iconSymbol}
      titleText={params.titleText}
      modificators={params.modificators}
      onClick={params.onClick}
    >
      {params.append}
    </IconButton>
  ));
}

function NoteContainer({
  index,
  notes,
  onClick,
  onHeaderBlur,
  onTextFieldBlur,
  onListItemAdd,
  onListItemBlur,
  onListItemRemove,
  onListItemCheck,
  onListItemUncheck,
  showPopup,
}) {
  const note = notes[index];
  const { items, popup } = note;
  let itemsCopy;
  let unmarkedItems;
  let markedItems;
  if (items) {
    // adding indexes to items and sub items
    itemsCopy = items.map((item, i) => ({ ...item, index: i }));
    itemsCopy.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.map((subItem, i) => ({ ...subItem, index: i }));
    });
    unmarkedItems = itemsCopy.filter((item) => !item.isMarked);
    unmarkedItems.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.filter((subItem) => !subItem.isMarked);
    });
    markedItems = itemsCopy.filter((item) => {
      // eslint-disable-next-line no-param-reassign
      item.sub = item.sub.filter((subItem) => subItem.isMarked);
      return item.isMarked || item.sub.length > 0;
    });
  }
  return (
    <Note
      noteData={{
        type: note.type,
        headerText: note.headerText,
        text: note.text,
        items: unmarkedItems,
        markedItems,
        isFocused: note.isFocused,
        creationDate: note.creationDate,
        editingDate: note.editingDate,
      }}
      buttons={getNoteButtons({
        index,
        popup,
        showPopup,
        hasMarkedItems: markedItems && !!markedItems.length,
      })}
      eventHandlers={{
        onClick,
        onHeaderBlur: ({ target: { value: headerText } }) => {
          onHeaderBlur(index, headerText);
        },
        onTextFieldBlur: ({ target: { value: text } }) => {
          onTextFieldBlur(index, text);
        },
        onListItemAdd: ({ target: { value: itemText } }) => {
          if (itemText !== '') {
            onListItemAdd(index, itemText);
          }
        },
        onListItemBlur: (itemNum, subNum) => ({
          target: { value: itemText },
        }) => {
          onListItemBlur(index, itemText, itemNum, subNum);
        },
        onListItemRemove: (itemNum) => () => {
          onListItemRemove(index, itemNum);
        },
        onListItemCheck: (itemNum) => () => {
          onListItemCheck(index, itemNum);
        },
        onListItemUncheck: (itemNum) => () => {
          onListItemUncheck(index, itemNum);
        },
      }}
    />
  );
}

function mapStateToProps(state) {
  return {
    notes: state.main.notes,
  };
}

export default connect(mapStateToProps, {
  onHeaderBlur: updateNoteHeader,
  onTextFieldBlur: updateNoteText,
  onListItemAdd: addNoteListItem,
  onListItemBlur: updateNoteListItem,
  onListItemRemove: removeNoteListItem,
  onListItemCheck: checkNoteListItem,
  onListItemUncheck: uncheckNoteListItem,
  showPopup: setNotePopup,
})(NoteContainer);
