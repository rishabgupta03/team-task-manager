// const mongoose = require("mongoose");
// const auth = require("../middleware/auth");

// const taskSchema = new mongoose.Schema({
//   title: String,
//   status: { type: String, default: "pending" },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
//   dueDate: Date
// });

// module.exports = mongoose.model("Task", taskSchema);

const router = require("express").Router();
const Project = require("../models/Project");
const User = require("../models/User");
const auth = require("../middleware/auth");

// ================= CREATE PROJECT =================
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name required" });
    }

    const project = await Project.create({
      name,
      members: [req.user.id],
      createdBy: req.user.id
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET ALL PROJECTS =================
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    }).populate("members", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET SINGLE PROJECT =================
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // check if user is member
    if (!project.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= ADD MEMBER (ADMIN ONLY) =================
router.post("/:id/add-member", auth, async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only creator/admin can add
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // avoid duplicate
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User already in project" });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= REMOVE MEMBER =================
router.post("/:id/remove-member", auth, async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only admin
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    project.members = project.members.filter(
      member => member.toString() !== userId
    );

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= DELETE PROJECT =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // only admin
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can delete project" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;