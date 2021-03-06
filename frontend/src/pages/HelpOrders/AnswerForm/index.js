import React, {useState, useEffect} from 'react';
import Popup from 'reactjs-popup';
import {Form} from '@rocketseat/unform';
import * as Yup from 'yup';

import {Container} from './styles';
import {PrimaryButton} from '~/components/Button';

const schema = Yup.object().shape({
  answer: Yup.string().required('Type a answer'),
});
/**
 *
 * Form from unform does not fire submit on modal
 */

export default function AnswerForm({isOpen, helpOrder, onClose, onFormSubmit}) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setAnswer('');
  }, [isOpen]);

  return (
    <Popup open={isOpen} modal onClose={onClose}>
      {isOpen && (
        <Container>
          <label htmlFor="question">QUESTION</label>
          <span name="question">{helpOrder.question}</span>
          <label htmlFor="answerForm">ANSWER</label>

          <Form id="answerForm">
            <textarea onChange={e => setAnswer(e.target.value)} />
            {error && <span>{error}</span>}

            <PrimaryButton
              type="button"
              onClick={async () => {
                try {
                  await schema.validate({answer}, {abortEarly: false});
                  onFormSubmit(helpOrder.id, answer);
                } catch (error) {
                  setError(error.message);
                }
              }}>
              <span>Reply</span>
            </PrimaryButton>
          </Form>
        </Container>
      )}
    </Popup>
  );
}
