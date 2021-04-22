const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });

exports.crearUsuario = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, password } = req.body;

  try {
    //Revisar que el usairo registrado sea unico
    let usuario = await Usuario.findOne({
      email,
    });

    if (usuario) {
      return res
        .status(400)
        .json({ msg: "El usuario que trata de registrar ya existe" });
    }

    //crea el nuevo usuarioo
    usuario = new Usuario(req.body);

    //Hashear password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //guarda el nuevo usuario
    await usuario.save();

    //Crear y firmar el JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    //Firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600000,
      },
      (error, token) => {
        if (error) throw error;

        return res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
