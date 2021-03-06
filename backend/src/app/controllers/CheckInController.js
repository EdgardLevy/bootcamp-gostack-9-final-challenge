import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';

import totalizeRecords from '../../util/dbfunctions';
import CheckIn from '../models/CheckIn';
import Student from '../models/Student';

class CheckInController {
  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { student_id } = req.params;

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    // validate schema and return all errors messages if need
    try {
      await schema.validate({ student_id }, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const checkStudentExists = await Student.findByPk(student_id);

    if (!checkStudentExists) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const options = {
      limit,
      offset: (page - 1) * limit,
      where: { student_id },
      order: [['id', 'DESC']],
    };

    const result = await CheckIn.findAndCountAll(options);

    return res.json(totalizeRecords(result, limit, page));
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });
    const { student_id } = req.params;
    // validate schema and return all errors messages if need
    try {
      await schema.validate({ student_id }, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const checkStudentExists = await Student.findByPk(student_id);

    if (!checkStudentExists) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const minDate = subDays(new Date(), 7);

    const totalCheckinsInLast7Days = await CheckIn.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [minDate, new Date()],
        },
      },
    });

    if (totalCheckinsInLast7Days >= 5) {
      return res
        .status(400)
        .json({ error: 'Maximum numbers of entries in last 7 days reached' });
    }

    const checkIn = await CheckIn.create({ student_id });
    return res.json(checkIn);
  }
}

export default new CheckInController();
