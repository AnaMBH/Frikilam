const Lamina = require('../models/Lamina');

exports.getAll = async (req, res, next) => {
  try {
    const laminas = await Lamina.find().sort({ createdAt: -1 });
    res.json(laminas);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const lamina = await Lamina.findById(req.params.id);
    if (!lamina) return res.status(404).json({ error: 'No encontrado' });
    res.json(lamina);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const lamina = new Lamina(req.body);
    await lamina.save();
    res.status(201).json(lamina);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const lamina = await Lamina.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lamina) return res.status(404).json({ error: 'No encontrado' });
    res.json(lamina);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Lamina.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};
