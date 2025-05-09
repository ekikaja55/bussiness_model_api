const express = require('express')
const Joi = require('joi')
const app = express()
const port = 3000
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//function validasi tanggal buat schema ini aku pake chatgpt buat minta bikinin regex nya aku ga ngerti regex hehe

const validasiTgl = (value, helpers) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([2-9][0-9]{3})$/;
    const match = value.match(regex);

    if (!match) {
        return helpers.error('any.invalid', { message: 'Format tanggal harus dd/mm/yyyy' });
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);

    const dateObj = new Date(year, month, day);

    const isValid =
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month &&
        dateObj.getDate() === day;

    if (!isValid) {
        return helpers.error('any.invalid', { message: 'Tanggal tidak valid secara kalender' });
    }

    return value;
};

app.get('/', (req, res) => res.send('Hello World!'))

//tugas 1 regis user
app.post('/api/users', async (req, res) => {

    const schema = Joi.object({
        username: Joi.string().required().min(5).messages({
            "string.empty": "username tidak boleh kosong",
            "string.min": "username harus minimal 5 karakter"
        }),
        password: Joi.string().required().min(5).messages({
            "string.empty": "password tidak boleh kosong",
            "string.min": "password harus minimal 5 karakter"

        }),
        date_of_birth: Joi.string().custom(validasiTgl).required().messages({
            "any.invalid": "Tanggal tidak valid secara kalender"
        })
    }
    )

    try {
        let inputan = await schema.validateAsync(req.body, {
            abortEarly: false
        })

        return res.status(202).json(inputan)

    } catch (error) {

        return res.status(404).json(error.message)

    }
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
