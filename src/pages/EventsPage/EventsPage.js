import React, {useEffect, useRef, useState} from 'react';
import Header from '../../components/Header';
import {Toast} from 'primereact/toast';
import EventsTab from '../../components/EventsTab';
import Loader from '../../components/Loader';
import {EventsService} from "../../service/eventsService";

const EventsPage = () => {
  const toast = useRef(null);
  const handleToastShow = (type = 'info', title = 'Info', text = 'test') => {
    toast.current.show({ severity: type, summary: title, detail: text, life: 3000 });
  };

  const [events, setEvents] = useState([]);
  const [criterias, setCriterias] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = () => {
    setLoading(true);
    const eventsRequest = EventsService.getEvents();
    const criteriasRequest = EventsService.getCriterias();
    Promise.all([eventsRequest, criteriasRequest])
      .then(([eventsResponse, criteriasResponse]) => {
        if (eventsResponse.error || criteriasResponse.error) {
          handleToastShow('error', 'Данные не загружены', 'Во время загрузки данных произошла ошибка, пожалуйста, перезагрузите страницу');
        }
        else {
          setEvents(eventsResponse.events);
          setCriterias(criteriasResponse.criterias)
        }
      })
      .finally(() => setLoading(false))

  }

  useEffect(() => {
    fetch();
  }, [])

  return <>
    <Toast ref={toast} position='top-right' />
    <Header />
    {!loading && <EventsTab events={events} criterias={criterias} showToast={handleToastShow} refetch={fetch} />}
    {loading && <Loader />}
  </>
};

export default EventsPage;