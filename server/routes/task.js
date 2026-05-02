const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// CREATE TASK
// router.post("/", auth, async (req, res) => {
//   try {
//     const { title, dueDate } = req.body;

//     const task = await Task.create({
//       title,
//       dueDate,
//       assignedTo: req.user.id
//     });

//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
router.post("/", auth, async (req, res) => {
    try {
      const { title, dueDate, projectId, assignedTo } = req.body;
  
      const task = await Task.create({
        title,
        dueDate,
        project: projectId,
        assignedTo
      });
  
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// GET TASKS
// router.get("/", auth, async (req, res) => {
//   const tasks = await Task.find({
//     assignedTo: req.user.id
//   });

//   res.json(tasks);
// });
router.get("/:projectId", auth, async (req, res) => {
    const tasks = await Task.find({
      project: req.params.projectId
    }).populate("assignedTo", "name");
  
    res.json(tasks);
  });

// UPDATE STATUS
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(task);
});

module.exports = router;


