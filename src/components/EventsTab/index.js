import React, { useEffect, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import PropTypes from 'prop-types';
import EventsList from "../EventsList";
import { EventsService } from "../../service/eventsService";

const EventsTab = ({ events, showToast, refetch, criterias }) => {
  const [active, setActive] = useState(0);

  const items = [
    { label: 'Будущие мероприятия', icon: 'pi pi-calendar'},
    { label: 'Завершенные мероприятия', icon: 'pi pi-check-circle'},
    { label: 'Мои мероприятия', icon: 'pi pi-user'}
  ];

  const sortByDate = (a, b) => {
    const dateA = new Date(a.date_start);
    const dateB = new Date(b.date_start);
    if (dateA > dateB)
      return 1;
    return -1;
  };

  const registerForEvent = (eventId) => {
    EventsService.registerOnEvent(eventId)
      .then((res) => {
        if (res.error) {
          showToast('error', 'Ошибка!', `${res.error}: ${res.message}`);
        } else {
          showToast('success', 'Отлично!', 'Вы зарегестрированы на мероприятие!');
          refetch();
        }
      })
  }

  const renderTab = () => {
    switch (active) {
      case 0:
        return <EventsList
          events={
            events
            .filter((el) => new Date(el.date_end) > new Date())
            .sort(sortByDate)
          }
          criterias={criterias}
          onRegister={registerForEvent}
          showToast={showToast}
        />
      case 1:
        return <EventsList
          events={
            events
              .filter((el) => new Date(el.date_end) < new Date())
              .sort(sortByDate)
          }
          criterias={criterias}
          onRegister={registerForEvent}
          showToast={showToast}
        />
      case 2:
        return <EventsList
          events={
            events
              .filter((el) => el.is_registered === true)
              .sort((a, b) => {
                if (!!a.solution === !!b.solution) {
                  return sortByDate(a, b);
                }
                else {
                  if (!a.solution)
                    return -1;
                  return 1;
                }
              })
          }
          criterias={criterias}
          onRegister={registerForEvent}
          showToast={showToast}
        />
    }
  }

  return (
    <div className='events-tab p-5'>
      <TabMenu model={items} activeIndex={active} onTabChange={(e) => setActive(e.index)} className='mb-3' />
      {renderTab()}
    </div>
  )
};

EventsTab.propTypes = {
  events: PropTypes.array.isRequired,
  criterias: PropTypes.array.isRequired,
  showToast: PropTypes.func,
  refetch: PropTypes.func
}

export default EventsTab;