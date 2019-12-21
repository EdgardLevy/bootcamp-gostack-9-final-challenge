import React, {useState, useEffect, useMemo} from 'react';
import {MdAdd, MdKeyboardArrowLeft} from 'react-icons/md';
import {Form, Input} from '@rocketseat/unform';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {formatPrice} from '~/util/format';
import history from '~/services/history';
import {Container} from '../styles';
import {PrimaryButton, SecondaryButton} from '~/components/Button';
import api from '~/services/api';

const schema = Yup.object().shape({
  title: Yup.string()
    .required()
    .min(3),
  duration: Yup.number()
    .required()
    .min(1)
    .typeError('Enter a valid value for duration'),
  price: Yup.number()
    .required()
    .typeError('Enter a valid value for price'),
});

export default function EditForm({match}) {
  const id = useMemo(() => match.params.id, [match.params]);
  const mode = useMemo(() => {
    return id === undefined ? 'create' : 'update';
  }, [id]);

  const titleMode = useMemo(() => {
    return id === undefined ? 'Registration' : 'Edition';
  }, [id]);

  const [record, setRecord] = useState({});
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (id === undefined) return;
    async function loadRecord() {
      try {
        const response = await api.get(`plans/${id}`);
        const _plan = response.data;
        _plan.totalPriceFormatted = formatPrice(_plan.duration * _plan.price);
        setRecord(_plan);
      } catch (error) {
        console.tron.error(error);
      }
    }

    loadRecord();
  }, [id]);

  async function handleSubmit(data) {
    try {
      if (mode === 'create') {
        await api.post('plans', data);
      } else {
        await api.put(`plans/${id}`, data);
      }
      toast.success(
        `Plan successful ${mode === 'create' ? 'created' : 'updated'}`
      );
      history.push('/plans');
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  function handleDurationChange(value) {
    setDuration(Number(value));
    record.totalPriceFormatted = formatPrice(Number(value) * price);
    document.getElementsByName('totalPriceFormatted')[0].value =
      record.totalPriceFormatted;
    setRecord(record);
  }

  function handlePriceChange(value) {
    setPrice(Number(value));
    record.totalPriceFormatted = formatPrice(duration * Number(value));
    document.getElementsByName('totalPriceFormatted')[0].value =
      record.totalPriceFormatted;
    setRecord(record);
  }

  return (
    <Container>
      <header>
        <strong>Plan {titleMode}</strong>
        <div>
          <aside>
            <SecondaryButton
              type="button"
              onClick={() => {
                history.push('/plans');
              }}>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <span>BACK</span>
            </SecondaryButton>

            <PrimaryButton type="submit" form="planForm">
              <MdAdd color="#fff" size={20} />
              <span>SAVE</span>
            </PrimaryButton>
          </aside>
        </div>
      </header>
      <Form
        id="planForm"
        initialData={record}
        schema={schema}
        onSubmit={handleSubmit}>
        <content>
          <Input name="title" label="TITLE" />
          <div>
            <div>
              <Input
                name="duration"
                label="DURATION (in months)"
                onChange={e => handleDurationChange(e.target.value)}
              />
            </div>
            <div>
              <Input
                name="price"
                label="MONTHLY FEE"
                onChange={e => handlePriceChange(e.target.value)}
              />
            </div>
            <div>
              <Input
                name="totalPriceFormatted"
                label="TOTAL PRICE"
                className="disableInput"
                disabled
              />
            </div>
          </div>
        </content>
      </Form>
    </Container>
  );
}
