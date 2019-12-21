import React, {useState, useEffect} from 'react';
import {MdAdd, MdEdit, MdDelete} from 'react-icons/md';
import swal from 'sweetalert';
import {toast} from 'react-toastify';
import history from '~/services/history';
import {Container} from '../styles';
import {PrimaryButton, PaginateButton, ActionButton} from '~/components/Button';
import api from '~/services/api';

let tmrDebounceEvent = null;
const LIMIT_RECORDS_PER_PAGE = 5;
const path = 'students';

export default function Grid() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({
    records: [],
    meta: {has_prev: false, has_next: false, total_pages: 0, total_records: 0},
  });
  const [page, setPage] = useState(1);

  function debounce(event, param, ms) {
    if (tmrDebounceEvent) clearTimeout(tmrDebounceEvent);
    tmrDebounceEvent = setTimeout(() => {
      event(param);
    }, ms);
  }

  useEffect(() => {
    async function loadRecords() {
      const response = await api.get(path, {
        params: {q: searchText, page, limit: LIMIT_RECORDS_PER_PAGE},
      });

      setData(response.data);
    }

    debounce(loadRecords, null, 300);
  }, [page, searchText]);

  function confirmDelete(id) {
    const _student = data.records.find(student => student.id === id);
    swal({
      text: `Do you want to delete the student ${_student.name} ?`,
      icon: 'warning',
      dangerMode: true,
      buttons: ['No', 'Yes'],
    }).then(async willDelete => {
      if (willDelete) {
        try {
          await api.delete(`${path}/${_student.id}`);

          const _data = {...data};
          _data.records.splice(
            data.records.findIndex(item => item.id === _student.id),
            1
          );
          _data.meta.total_records -= 1;
          setData(_data);

          toast.success('Student successfully deleted');
        } catch (error) {
          toast.error('Delete failed, contact support');
        }
      }
    });
  }

  function renderPages() {
    if (data.meta.total_pages === 1) return;
    const pages = [];
    for (let idxpage = 1; idxpage <= data.meta.total_pages; idxpage++) {
      const b = (
        <PaginateButton
          key={idxpage}
          selected={idxpage === page}
          onClick={() => {
            setPage(idxpage);
          }}>
          {idxpage}
        </PaginateButton>
      );
      pages.push(b);
    }
    return pages;
  }

  return (
    <Container>
      <header>
        <strong>Managing students</strong>
        <div>
          <aside>
            <PrimaryButton
              type="button"
              onClick={() => {
                history.push(`/${path}/create`);
              }}>
              <MdAdd color="#fff" size={20} />
              <span>REGISTER</span>
            </PrimaryButton>
            <input
              type="text"
              id="search"
              placeholder="Search student"
              onChange={e => {
                setPage(1);
                setSearchText(e.target.value);
              }}
            />
          </aside>
        </div>
      </header>
      <div className="totalRecords">
        <span>{`Total records: ${data.meta.total_records}`}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th width="390">NAME</th>
            <th width="390">E-MAIL</th>
            <th width="150" className="center">
              AGE
            </th>
            <th width="80" />
            <th width="80" />
          </tr>
        </thead>
        <tbody>
          {data.records.map(student => {
            return (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td className="center">{student.age}</td>
                <td className="center">
                  <ActionButton
                    type="button"
                    title="edit"
                    onClick={() => {
                      history.push(`${path}/${student.id}`);
                    }}>
                    <MdEdit size={20} color="#fb6f91" />
                  </ActionButton>
                </td>

                <td className="center delete">
                  <ActionButton
                    type="button"
                    title="delete"
                    onClick={() => {
                      confirmDelete(student.id);
                    }}>
                    <MdDelete size={20} color="#fb6f91" />
                  </ActionButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <div>
          <div>{renderPages()}</div>
        </div>
      </div>
    </Container>
  );
}
