import { format, parseISO } from 'date-fns';

// import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  /**
   * Get name of job. need be unique
   */
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    /**
     * Format price to locale currency
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
     */
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const { subscription } = data;
    await Mail.sendMail({
      to: `${subscription.student.name}<${subscription.student.email}>`,
      subject: 'Welcome to GymPoint',
      template: 'subscription',
      context: {
        plan: subscription.plan.title,
        student_id: subscription.student.id,
        name: subscription.student.name,
        startDate: format(parseISO(subscription.start_date), "MMMM dd',' yyyy"),
        endDate: format(parseISO(subscription.end_date), "MMMM dd',' yyyy"),
        price: formatter.format(subscription.price),
      },
    });
  }
}
export default new SubscriptionMail();
