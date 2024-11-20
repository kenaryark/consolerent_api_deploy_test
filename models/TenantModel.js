// models/TenantModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Tenant = db.define(
  "tenant",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_telp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipe_playstation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    periode_sewa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_tambahan: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    tanggal_sewa: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    daerah_pengiriman: {
      type: DataTypes.STRING,
      allowNull: false, // Bisa null
    },
    ongkir: {
      type: DataTypes.INTEGER,
      allowNull: true, // Bisa null
    },
    total_harga: {
      type: DataTypes.INTEGER,
      allowNull: true, // Bisa null
    },
    jenis_pembayaran: {
      type: DataTypes.STRING,
      allowNull: true, // Bisa null
    },
    jaminan: {
      type: DataTypes.STRING,
      allowNull: true, // Bisa null
    },
    nama_tim: {
      type: DataTypes.STRING,
      allowNull: true, // Bisa null
    },
    waktu_pengiriman: {
      type: DataTypes.TIME,
      allowNull: true, // Bisa null
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true, // Bisa null
    },
    bukti_transaksi: {
      type: DataTypes.STRING,
      allowNull: true, // Bisa null
    },
    testimoni_customer: {
      type: DataTypes.STRING,
      allowNull: true, // Bisa null
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Tenant);
Tenant.belongsTo(Users, { foreignKey: "userId" });

export default Tenant;
