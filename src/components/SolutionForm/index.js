import React, { useState, useEffect } from 'react';
import { SolutionsService } from '../../service/solutionsService';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import Loader from '../Loader';
import { Accordion, AccordionTab } from 'primereact/accordion';
import MarksTable from "../MarksTable";
import PairingMarksTable from "../PairingMarksTable";

const SolutionForm = ({ solution_id, event_id, onHide, showToast, criterias }) => {
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState({
    url: '',
    description: ''
  });

  const [error, setError] = useState(false);

  useEffect(() => {
    if (solution_id) {
      setLoading(true);
      SolutionsService.getSolution(solution_id)
        .then((res) => {
          if (res.error) {}
          else setSolution(res);
        })
        .finally(() => setLoading(false))
    }
  }, [solution_id])

  const handleChange = (value, field) => {
    setSolution({
      ...solution,
      [field]: value
    });
    if (field === 'url')
      setError(false);
  };

  const handleSave = () => {
    if (solution.url === '') {
      setError(true);
      return;
    }
    const payload = {
      ...solution,
      event_id
    };
    SolutionsService.createSolution(payload)
      .then((res) => {
        if (res.error)
          showToast('danger', 'Ошибка!', `${res.error}: ${res.message}`)
        else {
          showToast('success', 'Отлично!', 'Решение отправлено на проверку');
          onHide();
          window.location.reload();
        }
      })
  }

  if (loading) {
    return <Loader width='100%' height='100%' />
  }

  return (
    <div className='flex flex-column align-items-stretch'>
      <div className='flex flex-column align-content-start mb-4'>
        <label htmlFor="url" className="text-left mb-2">URL</label>
        <InputText
          id='url'
          readOnly={!!solution_id}
          placeholder='Ссылка на решение'
          value={solution.url}
          className={error ? 'p-invalid' : ''}
          onChange={(ev) => handleChange(ev.target.value, 'url')}
        />
        {error && <small className='p-error'>Ссылка на решение обязательна</small>}
      </div>
      <div className='flex flex-column align-content-start mb-4'>
        <label htmlFor="description" className="text-left mb-2">Описание решениея</label>
        <InputTextarea
          id='description'
          readOnly={!!solution_id}
          placeholder='Описание решения'
          value={solution.description}
          onChange={(ev) => handleChange(ev.target.value, 'description')}
        />
      </div>
      {!solution_id && (
        <div className='flex justify-content-end'>
          <Button className='p-button-outlined p-button-danger' label='Отмена' onClick={onHide} />
          <Button className='p-button ml-3' label='Сохранить решение' onClick={handleSave} />
        </div>
      )}
      {solution_id && (
        <Accordion>
          <AccordionTab header='Оценки'>
            {solution.marks?.length === 0 && solution.pairing_marks?.length === 0 && <span className='font-italic'>Нет оценок</span> }
            {solution.marks?.length > 0 && <MarksTable criterias={criterias} marks={solution.marks} />}
            {solution.pairing_marks?.length > 0 &&
              <>
                <span className='block mb-2 text-sm font-italic'>
                  Оценки представлены по критериям в виде таблицы с результатами парных сравнений с другими решениями.
                  2 - Ваше решение лучше соответствующего; 1 - решения равны; 0 - Ваше решение хуже соответствующего;
                  -1 - оценка еще не произведена. В итоговом столбце считается сумма только по произведенным оценкам
                </span>
                <Accordion multiple>
                  {criterias.map((el) => {
                    return <AccordionTab header={el.name} key={el.criteria_id}>
                      <PairingMarksTable
                        marks={solution.pairing_marks.filter((elem) => el.criteria_id === elem.criteria_id)}
                        solution_id={solution.solution_id}
                      />
                    </AccordionTab>
                  })}
                </Accordion></>
            }
          </AccordionTab>
        </Accordion>
      )}
    </div>
  )
};

export default SolutionForm;