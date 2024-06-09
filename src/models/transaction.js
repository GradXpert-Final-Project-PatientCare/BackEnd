"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
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
      keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
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
            args: [["pending", "success", "failed"]],
            msg: "Status tidak sesuai",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
