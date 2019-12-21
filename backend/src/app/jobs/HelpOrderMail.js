import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';

class HelpOrderMail {
  /**
   * Get name of job. need be unique
   */
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;
    await Mail.sendMail({
      to: `${helpOrder.student.name}<${helpOrder.student.email}>`,
      subject: `Re: Help Order: ${helpOrder.question.substring(0, 10)}...`,
      template: 'helporder',
      context: {
        name: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}
export default new HelpOrderMail();
