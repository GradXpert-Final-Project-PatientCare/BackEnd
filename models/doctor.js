"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsToMany(models.User, { through: models.Appointment, foreignKey: 'DoctorId' , as: 'users'});
      this.hasMany(models.Appointment);
      this.hasMany(models.Schedule);
    }
  }
  Doctor.init(
    {
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tidak boleh null",
          },
          notEmpty: {
            msg: "Tidak boleh kosong",
          },
        },
      },
      spesialis: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tidak boleh null",
          },
          notEmpty: {
            msg: "Tidak boleh kosong",
          },
        },
      },
      alamatPraktek: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tidak boleh null",
          },
          notEmpty: {
            msg: "Tidak boleh kosong",
          },
        },
      },
      telepon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Doctor",
    }
  );
  return Doctor;
};
