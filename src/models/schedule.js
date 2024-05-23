"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Timeslot)
      this.belongsTo(models.Doctor);
    }
  }
  Schedule.init(
    {
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
      kuota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tidak boleh null",
          },
          notEmpty: {
            msg: "Tidak boleh kosong",
          },
          min: {
            args: [0],
            msg: "Minimum 0",
          },
        },
      },
      hari: {
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
            args: [
              ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
            ],
            msg: "Status tidak tepat",
          },
        },
      },
      waktu: {
        type: DataTypes.TIME,
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
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};
