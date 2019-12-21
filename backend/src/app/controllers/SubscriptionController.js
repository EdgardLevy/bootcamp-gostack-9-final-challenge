import { isBefore, addMonths, parseISO, startOfDay } from 'date-fns';
import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import totalizeRecords from '../../util/dbfunctions';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Subscription from '../models/Subscription';
import User from '../models/User';

class SubscriptionController {
  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const options = {
      order: ['start_date'],
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    };

    const result = await Subscription.findAndCountAll(options);

    return res.json(totalizeRecords(result, limit, page));
  }

  async show(req, res) {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id, {
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    return res.json(subscription);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    // validate schema and return all errors messages if need
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const { student_id, plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan does not exists' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ error: 'Student does not exists' });
    }

    const startDate = parseISO(start_date);

    if (isBefore(startOfDay(startDate), startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(startDate, plan.duration);
    const price = plan.price * plan.duration;

    const { id } = await Subscription.create({
      start_date: startDate,
      end_date,
      student_id,
      user_id: req.userId,
      plan_id,
      price,
    });

    const subscription = await Subscription.findByPk(
      id,

      {
        attributes: ['id', 'start_date', 'end_date', 'price'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
          {
            model: Plan,
            as: 'plan',
            attributes: ['id', 'title'],
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name', 'email'],
          },
        ],
      }
    );

    await Queue.add(SubscriptionMail.key, {
      subscription,
    });

    return res.json(subscription);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().min(1),
      plan_id: Yup.number().min(1),
      start_date: Yup.date(),
      end_date: Yup.date(),
      price: Yup.number(),
    });

    // validate schema and return all errors messages if need
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);

    const subUpdated = await subscription.update(req.body);
    return res.json(subUpdated);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });
    const { id } = req.params;
    // validate schema and return all errors messages if need
    try {
      await schema.validate({ id }, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(400).json({ error: 'Subscription does not exists' });
    }

    await Subscription.destroy({ where: { id } });
    return res.send();
  }
}
export default new SubscriptionController();
