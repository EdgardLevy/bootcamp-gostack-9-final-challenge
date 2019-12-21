import React, {useState, useEffect} from 'react';
import {MdAdd, MdEdit, MdDelete, MdCheckCircle} from 'react-icons/md';
import swal from 'sweetalert';
import {toast} from 'react-toastify';
import {format, parseISO} from 'date-fns';
import history from '~/services/history';
import {Container} from '../styles';
import {PrimaryButton, PaginateButton, ActionButton} from '~/components/Button';
import api from '~/services/api';

let tmrDebounceEvent = null;
const LIMIT_RECORDS_PER_PAGE = 5;
const path = 'subscriptions';

export default function Grid() {
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
        params: {page, limit: LIMIT_RECORDS_PER_PAGE},
      });
      response.data.records.map(item => {
        item.startDateFormatted = format(
          parseISO(item.start_date),
          "MMMM dd',' yyyy"
        );

        item.endDateFormatted = format(
          parseISO(item.end_date),
          "MMMM dd',' yyyy"
        );
      });
      setData(response.data);
    }

    debounce(loadRecords, null, 300);
  }, [page]);

  function confirmDelete(id) {
    const _subscription = data.records.find(
      subscription => subscription.id === id
    );
    swal({
      text: `Do you want to delete ${_subscription.student.name} subscription?`,
      icon: 'warning',
      dangerMode: true,
      buttons: ['No', 'Yes'],
    }).then(async willDelete => {
      if (willDelete) {
        try {
          await api.delete(`${path}/${_subscription.id}`);

          const _data = {...data};
          _data.records.splice(
            data.records.findIndex(item => item.id === _subscription.id),
            1
          );
          _data.meta.total_records -= 1;
          setData(_data);

          toast.success('Subscription successfully deleted');
        } catch (error) {
          toast.error('Delete failed, contact support');
        }
      }
    });
  }

  function renderPages() {
    if (data.meta.total_pages === 1) return;
    const pages = [];
    // eslint-disable-next-line no-plusplus
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
        <strong>Managing subscriptions</strong>
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
          </aside>
        </div>
      </header>
      <div className="totalRecords">
        <span>{`Total records: ${data.meta.total_records}`}</span>
      </div>
      <table className="grid">
        <thead>
          <tr>
            <th>STUDENT</th>
            <th className="center">PLAN</th>
            <th className="center">START DATE</th>
            <th className="center">END DATE</th>
            <th className="center">ACTIVE</th>
            <th width="80" />
            <th width="80" />
          </tr>
        </thead>
        <tbody>
          {data.records.map(subscription => {
            return (
              <tr key={subscription.id}>
                <td>{subscription.student.name}</td>
                <td className="center">{subscription.plan.title}</td>
                <td className="center">{subscription.startDateFormatted}</td>
                <td className="center">{subscription.endDateFormatted}</td>
                <td className="center">
                  <MdCheckCircle
                    color={subscription.active ? '#42cb59' : '#dddddd'}
                  />
                </td>
                <td className="center">
                  <ActionButton
                    type="button"
                    title="edit"
                    onClick={() => {
                      history.push(`${path}/${subscription.id}`);
                    }}>
                    <MdEdit size={20} color="#fb6f91" />
                  </ActionButton>
                </td>

                <td className="center delete">
                  <ActionButton
                    type="button"
                    title="delete"
                    onClick={() => {
                      confirmDelete(subscription.id);
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
