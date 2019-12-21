import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // when password field is assigned, create hash of password using bcrypt
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // method to compare password param with actual password
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
