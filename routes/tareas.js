const tareaController = require("../controllers/tareaController");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//Crea una tarea
router.post(
  "/",
  auth,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("proyecto", "El proyecto es obligatorio").not().isEmpty(),
  ],
  tareaController.crearTarea
);

//Obtiene tareas por proyecto
router.get("/", auth, tareaController.obtenerTareas);

//Actualiza una tarea 
router.put("/:id", auth, tareaController.actualizarTarea);

//Eliminar una tarea 
router.delete("/:id", auth, tareaController.eliminarTarea);

module.exports = router;
