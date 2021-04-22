const { validationResult } = require("express-validator");
const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");

const validarErrores = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
};

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
  validarErrores(req, res);

  try {
    //Extraer el proyecto y comprobar si este existe
    const { proyecto } = req.body;

    const existe_proyecto = await Proyecto.findById(proyecto);
    if (!existe_proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autneticado
    if (existe_proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Crea la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtener las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar si este existe
    const { proyecto } = req.query;

    const existe_proyecto = await Proyecto.findById(proyecto);
    if (!existe_proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autneticado
    if (existe_proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Obtener las tareas por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({creado: -1});

    res.json({ tareas });
  } catch (error) {
    res.status(500).send("Hubo un error");
    console.log(error);
  }
};

exports.actualizarTarea = async (req, res) => {
  try {
    const { proyecto, nombre, estado } = req.body;

    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no existe" });
    }

    const existe_proyecto = await Proyecto.findById(proyecto);
    if (!existe_proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autneticado
    if (existe_proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    const nuevaTarea = {};

    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    //Guardar la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });

    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
  try {
    const { proyecto } = req.query;

    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no existe" });
    }

    const existe_proyecto = await Proyecto.findById(proyecto);
    if (!existe_proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autneticado
    if (existe_proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    
    //Eliminar tarea
    await Tarea.findOneAndRemove({ _id: req.params.id });

    res.json({msg: "Tarea elminada",});
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
