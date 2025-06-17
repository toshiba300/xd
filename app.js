const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Alumno = require('./models/alumno');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar:', err));

// Alta (crear)
app.post('/alumnos', async (req, res) => {
  try {
    const nuevo = new Alumno(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (err) {
    res.status(400).json({ error: 'Error al dar de alta' });
  }
});

// Baja (eliminar por ID)
app.delete('/alumnos/:id', async (req, res) => {
  try {
    await Alumno.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Alumno eliminado' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar' });
  }
});

// Actualizar (por ID)
app.put('/alumnos/:id', async (req, res) => {
  try {
    const actualizado = await Alumno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar' });
  }
});

// Obtener todos
app.get('/alumnos', async (req, res) => {
  const alumnos = await Alumno.find();
  res.json(alumnos);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
