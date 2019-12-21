import React, {useState, useEffect, useMemo} from 'react';
import {MdReply} from 'react-icons/md';

import {toast} from 'react-toastify';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {Container} from '../styles';
import {PaginateButton, ActionButton} from '~/components/Button';
import api from '~/services/api';
import AnswerForm from '../AnswerForm';

let tmrDebounceEvent = null;
const LIMIT_RECORDS_PER_PAGE = 10;
const path = 'help-orders';

export default function Grid() {
  const [data, setData] = useState({
    records: [],
    meta: {has_prev: false, has_next: false, total_pages: 0, total_records: 0},
  });
  const [page, setPage] = useState(1);
  const [helpOrderId, setHelpOrderId] = useState(0);

  const helpOrder = useMemo(() => {
    if (!helpOrderId) return;
    return data.records.find(item => item.id === helpOrderId);
  }, [data.records, helpOrderId]);

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
        item.createdAtFormatted = format(
          parseISO(item.created_at),
          "d 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        );
      });
      setData(response.data);
    }

    debounce(loadRecords, null, 300);
  }, [page]);

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

  async function handleFormSubmit(id, answer) {
    console.tron.log('handleFormSubmit', data);

    try {
      await api.post(`${path}/${id}/answer`, {answer});

      const _data = {...data};
      _data.records.splice(
        data.records.findIndex(item => item.id === id),
        1
      );
      _data.meta.total_records -= 1;
      setData(_data);
      setHelpOrderId(null);
      toast.success('Pedido de auxílio respondido com sucesso');
    } catch (error) {
      toast.error('Falha no envio da resposta, entre em contato com o suporte');
    }
  }

  return (
    <Container>
      <AnswerForm
        isOpen={helpOrder}
        helpOrder={helpOrder}
        onClose={() => setHelpOrderId(null)}
        onFormSubmit={handleFormSubmit}
      />
      <header>
        <strong>Help Orders</strong>
      </header>
      <div className="totalRecords">
        <span>{`Total records: ${data.meta.total_records}`}</span>
      </div>
      <table className="grid">
        <thead>
          <tr>
            <th>Student</th>
            <th>Question</th>
            <th width="80" />
          </tr>
        </thead>
        <tbody>
          {data.records.map(helpOrder => {
            return (
              <tr key={helpOrder.id}>
                <td>{helpOrder.student.name}</td>
                <td>{helpOrder.question}</td>

                <td className="center">
                  <ActionButton
                    type="button"
                    title="reply"
                    onClick={() => {
                      // history.push(`subscriptions/${helpOrder.id}`);
                      setHelpOrderId(helpOrder.id);
                    }}>
                    <MdReply size={20} color="#fb6f91" />
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
