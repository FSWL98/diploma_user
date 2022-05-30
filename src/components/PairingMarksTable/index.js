import React, { useState, useEffect } from 'react';
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

const PairingMarksTable = ({ marks, solution_id }) => {
  const [tableValue, setTableValue] = useState({
    rows: [],
    columns: []
  });

  useEffect(() => {

    const columnsMap = {};
    marks.forEach((el) => {
      const second_solution = el.first_solution_id === solution_id
        ? el.second_solution_id
        : el.first_solution_id;
      columnsMap[second_solution] = second_solution;
    })

    const columns = Object.keys(columnsMap).map((el) => {
      return {
        field: `${el}`,
        header: `Решение №${el}`
      }
    });

    const staffMark = {};

    marks.forEach((el) => {
      const score = el.first_solution_id === solution_id
        ? el.score
        : 2 - el.score;
      const second_solution = el.first_solution_id === solution_id
        ? el.second_solution_id
        : el.first_solution_id;
      if (staffMark[el.staff_id]) {
        staffMark[el.staff_id][second_solution] = score;
      }
      else {
        staffMark[el.staff_id] = {
          [second_solution]: score
        };
      }
    });

    const rows = Object.keys(staffMark).map((el) => {
      const marksObj = {};
      let sum = 0;
      Object.keys(staffMark[el]).forEach((elem) => {
        marksObj[elem] = staffMark[el][elem];
        sum += marksObj[elem] > -1 ? marksObj[elem] : 0;
      })
      return {
        ...marksObj,
        id: el,
        name: el,
        sum
      }
    });

    setTableValue({
      rows,
      columns: [{
        field: 'name',
        header: 'ID эксперта'
      }, ...columns, {
        field: 'sum',
        header: 'Итого'
      }]
    })
  }, []);

  const renderColumns = () => {
    return tableValue.columns.map((el) => {
      return <Column key={el.field} field={el.field} header={el.header} />
    })
  }

  return <DataTable value={tableValue.rows} emptyMessage='Еще нет оценок'>
    {renderColumns()}
  </DataTable>;
};

export default PairingMarksTable;