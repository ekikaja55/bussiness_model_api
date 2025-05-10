const express = require("express");
const Joi = require("joi");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const { validasiTgl, generateApiKey } = require("./helper/utils");
const { User, Note } = require("./models");
const bcrypt = require("bcryptjs");
const verify = require("./middleware/verify");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("Hello World!"));

//tugas 1 regis user
app.post("/api/users", async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required().min(5).messages({
      "string.empty": "username tidak boleh kosong",
      "string.min": "username harus minimal 5 karakter",
    }),
    date_of_birth: Joi.string().required().custom(validasiTgl).messages({
      "any.invalid":
        "Format tidak valid (dd/mm/yyyy) dan pastikan usia minimal 13 tahun",
      "string.empty": "Tanggal tidak boleh kosong",
    }),
  });

  try {
    let inputan = await schema.validateAsync(req.body, {
      abortEarly: false,
    });

    const addUser = await User.create({
      username: inputan.username,
      date_of_birth: inputan.date_of_birth,
      api_key: generateApiKey(10),
    });

    return res.status(201).json({
      message: `Berhasil registrasi atas nama ${addUser.username}`,
      details: {
        balance: addUser.balance,
        api_hit: addUser.api_hit,
        api_key: addUser.api_key,
      },
    });
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

//tugas 2 top up saldo user
app.post("/api/topup", [verify], async (req, res) => {
  const { data_user } = req.headers;

  const schema = Joi.object({
    amount: Joi.number().required().min(1000).messages({
      "number.empty": "inputan saldo tidak boleh kosong",
      "number.min": "top up saldo minimal 1000 ",
    }),
  });
  try {
    let inputan = await schema.validateAsync(req.body, {
      abortEarly: false,
    });

    const result = await data_user.update({
      balance: data_user.balance + inputan.amount,
    });
    return res.status(201).json({
      message: "Saldo berhasil ditambahkan",
      details: {
        username: result.username,
        balance: result.balance,
      },
    });
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

//tugas 3 recharge quota note user
app.put("/api/recharge", [verify], async (req, res) => {
  const { data_user } = req.headers;
  if (data_user.balance < 1000) {
    return res.status(400).json({
      message: `saldo anda sebesar: ${data_user.balance} tidak cukup untuk pembayaran, silahkan top up e-wallet anda untuk melanjutkan pembayaran`,
    });
  }
  try {
    const result = await data_user.update({
      api_hit: data_user.api_hit + 100,
      balance: data_user.balance - 1000,
    });
    return res.status(201).json({
      message: "Transaksi berhasil, quota note anda bertambah sebesar 100 ",
      details: {
        username: result.username,
        api_hit: result.api_hit,
        balance: result.balance,
      },
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

//tugas 4 note user
app.post("/api/notes", [verify], async (req, res) => {
  const { data_user } = req.headers;

  const schema = Joi.object({
    note: Joi.string().required().messages({
      "string.empty": "inputan note tidak boleh kosong",
    }),
  });

  if (data_user.api_hit <= 0) {
    return res.status(400).json({
      message: `quota anda sebesar: ${data_user.api_hit} tidak cukup untuk menambahkan note, silahkan isi quota note anda`,
    });
  }
  try {
    let inputan = await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    const updatedUser = await data_user.update({
      api_hit: data_user.api_hit - Math.floor(inputan.note.length / 10),
    });
    const addNote = await Note.create({
      user_id: data_user.user_id,
      note_desc: inputan.note,
      note_length: inputan.note.length,
    });

    return res.status(201).json({
      message: "Berhasil tambah note baru",
      details: {
        username: data_user.username,
        note_length: addNote.note_length,
        quota_note: updatedUser.api_hit,
      },
    });
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

//nomor 5 get data note
app.get("/api/notes", [verify], async (req, res) => {
  const { data_user } = req.headers;
  const result = await User.findOne({
    attributes: ["username"],
    where: {
      api_key: data_user.api_key,
    },
    include: {
      model: Note,
      attributes: ["note_desc", "note_length"],
    },
  });
  
  if (result.notes.length <=0 ) {
    return res
      .status(400)
      .json({ message: "Anda belum memiliki riwayat notes" });
  }
  return res.status(201).json(result);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
