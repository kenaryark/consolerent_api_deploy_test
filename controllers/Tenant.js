import path from "path";
import fs from "fs";
import Tenant from "../models/TenantModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

// Fungsi untuk mendapatkan semua tenant
export const getTenants = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Tenant.findAll({
        // attributes:['uuid','name','price'],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Tenant.findAll({
        // attributes:['uuid','name','price'],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
    // const tenants = await Tenant.findAll();
    // res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!tenant) {
      return res.status(404).json({ msg: "Tenant tidak ditemukan" });
    }
    let response;
    if (req.role === "admin") {
      response = await Tenant.findOne({
        // attributes:['uuid','name','price'],
        where: {
          id: tenant.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Tenant.findOne({
        // attributes:['uuid','name','price'],
        where: {
          [Op.and]: [{ id: tenant.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
      if (!response) {
        return res.status(403).json({ msg: "Akses terlarang" });
      }
    }

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editStatusComplete = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!tenant) {
      return res.status(404).json({ msg: "Tenant tidak ditemukan" });
    }

    // Update status to "Selesai"
    tenant.status = "Selesai";
    await tenant.save();

    res.status(200).json({ msg: "Status tenant berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk membuat tenant baru
export const createTenant = async (req, res) => {
  const {
    nama,
    alamat,
    no_telp,
    tipe_playstation,
    unit,
    periode_sewa,
    item_tambahan,
    tanggal_sewa,
    harga,
    daerah_pengiriman,
    ongkir,
    total_harga,
    jenis_pembayaran,
    jaminan,
    nama_tim,
    waktu_pengiriman,
    status,
    bukti_transaksi,
    testimoni_customer,
  } = req.body;

  try {
    // Validasi data penting
    if (
      !nama ||
      !alamat ||
      !no_telp ||
      !tipe_playstation ||
      !unit ||
      !periode_sewa ||
      !tanggal_sewa ||
      !harga
    ) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    // Membuat tenant baru
    const tenant = await Tenant.create({
      nama,
      alamat,
      no_telp,
      tipe_playstation,
      unit,
      periode_sewa,
      item_tambahan: item_tambahan || null, // Optional, jika tidak diisi default null
      tanggal_sewa,
      harga,
      daerah_pengiriman: daerah_pengiriman || null,
      ongkir: ongkir || null, // Optional, jika tidak diisi default null
      total_harga: total_harga || null, // Optional, jika tidak diisi default null
      jenis_pembayaran: jenis_pembayaran || null, // Optional, jika tidak diisi default null
      jaminan: jaminan || null, // Optional, jika tidak diisi default null
      nama_tim: nama_tim || null, // Optional, jika tidak diisi default null
      waktu_pengiriman: waktu_pengiriman || null, // Optional, jika tidak diisi default null
      status: status || null, // Optional, jika tidak diisi default null
      bukti_transaksi: bukti_transaksi || null, // Optional, jika tidak diisi default null
      testimoni_customer: testimoni_customer || null, // Optional, jika tidak diisi default null
      userId: req.userId,
    });

    res.status(201).json({ msg: "Tenant berhasil ditambahkan", tenant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk memperbarui tenant
export const updateTenant = async (req, res) => {
  const {
    nama,
    alamat,
    no_telp,
    tipe_playstation,
    unit,
    periode_sewa,
    item_tambahan,
    tanggal_sewa,
    harga,
    daerah_pengiriman,
    ongkir,
    total_harga,
    jenis_pembayaran,
    jaminan,
    nama_tim,
    waktu_pengiriman,
    status,
  } = req.body;

  try {
    const tenant =
      // await Tenant.findByPk(req.params.id);
      await Tenant.findOne({
        where: {
          uuid: req.params.id,
        },
      });

    if (!tenant) {
      return res.status(404).json({ msg: "Tenant tidak ditemukan" });
    }

    let buktiTransaksiFileName = tenant.bukti_transaksi || null;
    let testimoniCustomerFileName = tenant.testimoni_customer || null;

    if (req.files) {
      const allowedType = [".png", ".jpg", ".jpeg"];

      // Jika file bukti transaksi diupload
      if (req.files.bukti_transaksi) {
        const buktiTransaksiFile = req.files.bukti_transaksi;
        const extTransaksi = path.extname(buktiTransaksiFile.name);

        if (!allowedType.includes(extTransaksi.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Images" });
        }

        if (buktiTransaksiFile.size > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5 MB" });
        }

        // Hapus file bukti transaksi lama jika ada
        if (tenant.bukti_transaksi) {
          const oldFilePath = `./public/images/${path.basename(
            tenant.bukti_transaksi
          )}`;
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        // Simpan file baru
        buktiTransaksiFileName = buktiTransaksiFile.md5 + extTransaksi;
        buktiTransaksiFile.mv(`./public/images/${buktiTransaksiFileName}`);
      }

      // Jika file testimoni customer diupload
      if (req.files.testimoni_customer) {
        const testimoniCustomerFile = req.files.testimoni_customer;
        const extTestimoni = path.extname(testimoniCustomerFile.name);

        if (!allowedType.includes(extTestimoni.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Images" });
        }

        if (testimoniCustomerFile.size > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5 MB" });
        }

        // Hapus file testimoni lama jika ada
        if (tenant.testimoni_customer) {
          const oldFilePath = `./public/images/${path.basename(
            tenant.testimoni_customer
          )}`;
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        // Simpan file baru
        testimoniCustomerFileName = testimoniCustomerFile.md5 + extTestimoni;
        testimoniCustomerFile.mv(
          `./public/images/${testimoniCustomerFileName}`
        );
      }
    }

    // Jika tidak ada file yang diunggah, tetap setel ke null
    const urlBuktiTransaksi = buktiTransaksiFileName
      ? `${req.protocol}://${req.get("host")}/images/${buktiTransaksiFileName}`
      : null;
    const urlTestimoniCustomer = testimoniCustomerFileName
      ? `${req.protocol}://${req.get(
          "host"
        )}/images/${testimoniCustomerFileName}`
      : null;

    // Perbarui tenant dengan data baru
    await Tenant.update(
      {
        nama,
        alamat,
        no_telp,
        tipe_playstation,
        unit,
        periode_sewa,
        item_tambahan: item_tambahan || null,
        tanggal_sewa,
        harga,
        daerah_pengiriman,
        ongkir,
        total_harga,
        jenis_pembayaran: jenis_pembayaran,
        jaminan,
        nama_tim,
        waktu_pengiriman,
        status,
        bukti_transaksi: urlBuktiTransaksi,
        testimoni_customer: urlTestimoniCustomer,
      },
      {
        where: { uuid: req.params.id },
      }
    );

    res.status(200).json({ msg: "Tenant berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk menghapus tenant
export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!tenant) {
      return res.status(404).json({ msg: "Tenant tidak ditemukan" });
    }

    await Tenant.destroy({
      where: { uuid: req.params.id },
    });

    res.status(200).json({ msg: "Tenant berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
