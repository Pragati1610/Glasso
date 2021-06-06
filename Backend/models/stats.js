const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
    statId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
    wins: { type: DataTypes.INTEGER, allowNull: false, default: 0 },
    loses: { type: DataTypes.INTEGER, allowNull: false, default: 0 },
    draws: { type: DataTypes.INTEGER, allowNull: false, default: 0 },
}

const options = {
    timestamps: false
}

const stats = sequelize.define('Stats', schema, options)

module.exports = stats