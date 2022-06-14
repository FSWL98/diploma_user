import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import SolutionForm from '../SolutionForm';
import { Tag } from 'primereact/tag';

const EventsList = ({ events,onRegister, showToast, criterias }) => {
  const parseDate = date => {
    const dateString = date.split('T')[0];
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  }
  const getDate = el => {
    const start = parseDate(el.date_start);
    const end = parseDate(el.date_end);
    return `${start} - ${end}`;
  }

  const [dialog, setDialog] = useState({
    show: false,
    event: {},
    solution_id: null
  })

  const confirm = event => {
    confirmDialog({
      message: `Действительно зарегестрироваться на мероприятие ${event.name}?`,
      header: 'Подтверждение',
      accept() {
        onRegister(event.event_id);
      },
      acceptLabel: 'Да',
      rejectLabel: 'Нет'
    })
  }

  const renderTag = el => {
    const now = new Date().getTime();
    const start = new Date(el.date_start).getTime();
    const end = new Date(el.date_end).getTime();
    if (!el.is_registered && (start - now < 24 * 60 * 60 * 1000) && (start > now))
      return <Tag value='Скоро начнется' severity='warning' className='text-xs ml-2' rounded />
    if (el.is_registered && !el.solution && (end - now < 24 * 60 * 60 * 1000) && (end > now))
      return <Tag value='Требуется решение' severity='danger' className='text-xs ml-2' rounded />
    if (el.is_registered && !el.solution && end > now && start < now)
      return <Tag value='Ожидает решения' severity='info' className='text-xs ml-2' rounded />
    if (el.is_registered && !el.solution && end < now)
      return <Tag value='Провалено' severity='danger' className='text-xs ml-2' rounded />
    return null;
  }

  const renderButton = el => {
    if (!el.is_registered) {
      return <Button
        label='Принять участие'
        className='p-button-help'
        disabled={new Date(el.date_end) < new Date()}
        onClick={() => confirm(el)}
      />
    }
    if (el.solution)
      return <Button
        label='Смотреть решение'
        className='p-button-secondary'
        onClick={() => setDialog({
          show: true,
          event: el,
          solution_id: el.solution.solution_id
        })}
      />
    return <Button
      label='Загрузить решение'
      disabled={new Date(el.date_end) < new Date() || new Date(el.date_start) > new Date()}
      onClick={() => setDialog({
        show: true,
        event: el,
        solution_id: null
      })}
    />
  }
  return (
    <div className='flex flex-column'>
      <ConfirmDialog />
      <Dialog
        visible={dialog.show}
        onHide={() => setDialog({ ...dialog, show: false })}
        header={`Решение для ${dialog.event.name}`}
        style={{ width: '50vw' }}
      >
        <SolutionForm
          solution_id={dialog.solution_id}
          event_id={dialog.event.event_id}
          onHide={() => setDialog({ ...dialog, show: false })}
          showToast={showToast}
          criterias={criterias}
        />
      </Dialog>
      {events.map((el) => {
        const date = getDate(el);
        return (
          <div
            className='flex justify-content-between p-3 border-primary border-solid my-1 align-items-center'
            key={el.event_id}
          >
            <span className='text font-bold w-4 text-left'>
              {el.name}
              {renderTag(el)}
            </span>
            <div className='flex flex-column align-items-center'>
              <span className='text font-light text-sm'>Даты проведения:</span>
              <span className='text font-light text-sm'>{date}</span>
            </div>
            <div className='w-3 text-right'>
              {renderButton(el)}
            </div>
          </div>
        )
      })}
      {events.length === 0 && <span className='block text-center font-italic'>Не найдено ни одного мероприятия</span>}
    </div>
  )
};

export default EventsList;