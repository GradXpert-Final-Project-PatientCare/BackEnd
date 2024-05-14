'use strict';
const dayjs = require('dayjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Timeslot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Appointment)
      this.belongsTo(models.Schedule);
    }
  }
  Timeslot.init({
    ScheduleId: {
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
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
      validate:{
        notNull:{
          msg:'Tidak boleh null'
        },
        notEmpty:{
          msg:'Tidak boleh kosong'
        },
        isAfter:{
          args: dayjs().add(1, 'day'),
          msg:'Tanggal kurang dari hari ini'
        }
      }
    },
    slotTersedia: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notNull: {
          msg: "Tidak boleh null",
        },
        notEmpty: {
          msg: "Tidak boleh kosong",
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Timeslot',
  });
  return Timeslot;
};