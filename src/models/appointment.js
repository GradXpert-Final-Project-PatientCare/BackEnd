"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.belongsTo(models.Doctor);
      this.belongsTo(models.Timeslot);
    }
  }
  Appointment.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
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
      DoctorId: {
        type: DataTypes.INTEGER,
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
      TimeslotId: {
        type: DataTypes.INTEGER,
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tidak boleh null",
          },
          notEmpty: {
            msg: "Tidak boleh kosong",
          },
          isIn: {
            args: [["dipesan", "dibatalkan", "selesai"]],
            msg: "Status tidak tepat",
          },
        },
      },
      keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Appointment",
    }
  );
  return Appointment;
};
