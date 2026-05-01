const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      tags: tags || []
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate, tags } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.tags = tags ?? task.tags;

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get task statistics for dashboard
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const [total, todo, inProgress, done] = await Promise.all([
      Task.countDocuments({ user: req.user._id }),
      Task.countDocuments({ user: req.user._id, status: 'todo' }),
      Task.countDocuments({ user: req.user._id, status: 'in-progress' }),
      Task.countDocuments({ user: req.user._id, status: 'done' })
    ]);

    res.json({ total, todo, inProgress, done });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;
