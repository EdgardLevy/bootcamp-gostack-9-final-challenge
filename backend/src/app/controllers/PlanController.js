import { Op } from 'sequelize';
import * as Yup from 'yup';

import totalizeRecords from '../../util/dbfunctions';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const { page = 1, limit = 20, q } = req.query;

    const options = {
      order: ['title'],
      limit,
      offset: (page - 1) * limit,
      attributes: { exclude: ['created_at', 'updated_at'] },
    };

    if (q) {
      options.where = { title: { [Op.iLike]: `%${q}%` } };
    }

    const result = await Plan.findAndCountAll(options);

    return res.json(totalizeRecords(result, limit, page));
  }

  async show(req, res) {
    const { id } = req.params;
    const plan = await Plan.findByPk(id, {
      attributes: { exclude: ['created_at', 'updated_at'] },
    });
    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string()
        .required()
        .min(3),
      duration: Yup.number()
        .required()
        .positive()
        .min(1),
      price: Yup.number()
        .required()
        .min(1),
    });

    // validate schema and return all errors messages if need
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const { title } = req.body;

    const checkIFPlanExists = await Plan.findOne({
      where: {
        title,
      },
    });

    if (checkIFPlanExists) {
      return res.status(401).json({ error: 'Plan already exists' });
    }

    const { duration, price } = await Plan.create(req.body);

    return res.json({ title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().min(3),
      duration: Yup.number()
        .positive()
        .min(1),
      price: Yup.number().min(1),
    });

    // validate schema and return all errors messages if need
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const { id } = req.params;
    const { title } = req.body;

    const plan = await Plan.findByPk(id);

    if (title && plan.title !== title) {
      const checkIFPlanExists = await Plan.findOne({
        where: { title, id: { [Op.ne]: id } },
      });

      if (checkIFPlanExists) {
        return res.status(401).json({ error: 'Plan already exists' });
      }
    }

    const { title: _title, duration, price } = await plan.update(req.body);

    return res.send({ title: _title, duration, price });
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

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }
    try {
      await Plan.destroy({ where: { id } });
      return res.send();
    } catch (error) {
      return res.status(403).json({ error: 'Plan has students associated' });
    }
  }
}

export default new PlanController();
