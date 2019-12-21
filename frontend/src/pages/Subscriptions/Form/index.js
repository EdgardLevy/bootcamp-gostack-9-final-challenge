import React, {useState, useEffect, useMemo} from 'react';
import {MdAdd, MdKeyboardArrowLeft} from 'react-icons/md';
import {Form, Input} from '@rocketseat/unform';

import * as Yup from 'yup';
import {toast} from 'react-toastify';
// import DatePicker, {registerLocale} from 'react-datepicker';
import {registerLocale} from 'react-datepicker';

import {addMonths, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
// import AsyncSelect from 'react-select/async';
import AsyncSelect from '~/components/ReactSelectAsync';
import DatePicker from '~/components/ReactDatePicker';
import Select from '~/components/ReactSelect';

import history from '~/services/history';
import {Container} from '../styles';
import {PrimaryButton, SecondaryButton} from '~/components/Button';
import api from '~/services/api';
import {formatPrice} from '~/util/format';

registerLocale('pt', pt);

const schema = Yup.object().shape({
  student_id: Yup.number()
    .typeError('Select one student')
    .required(),
  plan_id: Yup.number()
    .typeError('Select one plan')
    .required(),
  start_date: Yup.date()
    .typeError('Enter start date')
    .required(),
});

export default function EditForm({match}) {
  const id = useMemo(() => match.params.id, [match.params]);
  const mode = id === undefined ? 'create' : 'update';
  const titleMode = id === undefined ? 'Registration' : 'Edition';

  const [plans, setPlans] = useState([]);
  const [record, setRecord] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(null);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (id === undefined) return;

    async function loadRecord() {
      try {
        const response = await api.get(`subscriptions/${id}`);
        const start_date = parseISO(response.data.start_date);
        const plan_id = response.data.plan.id;
        const {student} = response.data;

        const _plan = plans.find(plan => plan.id === plan_id);
        setSelectedPlan(_plan);
        setStartDate(start_date);
        setSelectedStudent({value: student.id, label: student.name});

        console.tron.log('student', student);
        const r = {};
        console.tron.log('record', r);
        setRecord(r);

        console.tron.log(response);
      } catch (error) {
        console.tron.error(error);
      }
    }

    loadRecord();
  }, [id, plans]);

  useEffect(() => {
    async function loadPlans() {
      const response = await api.get('plans', {
        params: {page: 1, limit: 100},
      });

      response.data.records.map(plan => {
        plan.title =
          plan.duration === 1
            ? `${plan.title} (${plan.duration} month)`
            : `${plan.title} (${plan.duration} months)`;

        plan.totalPriceFormatted = formatPrice(plan.price * plan.duration);
      });

      setPlans(response.data.records);
    }
    loadPlans();
  }, []);

  async function handleSubmit(data) {
    const {student_id, plan_id, start_date} = data;

    try {
      if (mode === 'create') {
        await api.post('subscriptions', {student_id, plan_id, start_date});
      } else {
        await api.put(`subscriptions/${id}`, {student_id, plan_id, start_date});
      }

      toast.success(
        `Subscription successful  ${mode === 'create' ? 'created' : 'updated'}`
      );
      history.push('/subscriptions');
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  async function loadStudents(inputValue) {
    const response = await api.get('students', {
      params: {q: inputValue, page: 1, limit: 100},
    });

    return response.data.records.map(student => ({
      label: student.name,
      value: student.id,
    }));
  }

  const totalPriceFormatted = useMemo(() => {
    if (selectedPlan) {
      return formatPrice(selectedPlan.duration * selectedPlan.price);
    }
    return '';
  }, [selectedPlan]);

  const endDate = useMemo(() => {
    if (selectedPlan) {
      return addMonths(startDate, selectedPlan.duration);
    }
    return '';
  }, [selectedPlan, startDate]);

  return (
    <Container>
      <header>
        <strong>Subscription {titleMode}</strong>
        <div>
          <aside>
            <SecondaryButton
              type="button"
              onClick={() => {
                history.push('/subscriptions');
              }}>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <span>BACK</span>
            </SecondaryButton>

            <PrimaryButton type="submit" form="subscriptionForm">
              <MdAdd color="#fff" size={20} />
              <span>SAVE</span>
            </PrimaryButton>
          </aside>
        </div>
      </header>

      <Form
        id="subscriptionForm"
        initialData={record}
        schema={schema}
        onSubmit={handleSubmit}>
        <AsyncSelect
          id="student_id"
          name="student_id"
          placeholder="Select one student"
          loadOptions={loadStudents}
          label="STUDENT"
          value={selectedStudent}
          onChange={setSelectedStudent}
        />
        <table>
          <tbody>
            <tr>
              <td>
                <Select
                  placeholder="Select one plan"
                  name="plan_id"
                  options={plans}
                  label="PLAN"
                  onChange={setSelectedPlan}
                  value={selectedPlan}
                />
              </td>
              <td>
                <DatePicker
                  name="start_date"
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  label="START DATE"
                />
              </td>
              <td>
                <DatePicker
                  name="end_date"
                  selected={endDate}
                  disabled
                  className="disableInput"
                  label="END DATE"
                />
              </td>
              <td>
                <Input
                  name="totalPriceFormatted"
                  label="FINAL PRICE"
                  disabled
                  className="disableInput"
                  value={totalPriceFormatted}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    </Container>
  );
}
