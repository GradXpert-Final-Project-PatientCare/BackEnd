'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsToMany(models.Doctor, { through: models.Appointment, foreignKey: 'UserId' , as: 'doctors'});
      this.hasMany(models.Appointment)
    }
  }
  User.init({
    username: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:'Tidak boleh null'
        },
        notEmpty:{
          msg:'Tidak boleh kosong'
        }
        
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:'Tidak boleh null'
        },
        notEmpty:{
          msg:'Tidak boleh kosong'
        },
        isEmail:{
          msg:'Format wajib email'
        }
      },
      unique:{
        msg:'Email sudah terdaftar'
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:'Tidak boleh null'
        },
        notEmpty:{
          msg:'Tidak boleh kosong'
        },
        minLength(val){
          if (val.length < 5){
            throw new Error ("Minimum 5 karakter")
        }
      }
      }
    },
    phoneNumber: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user,opt) => {
        const hashedPassword = hashPassword(user.password);
        user.password = hashedPassword;
        user.role = user.role ?? 'user';
      }
    }
  });
  return User;
};