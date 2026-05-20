import Assignment from "../models/Assignment.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFileUrl = (req, filename) => {
  return filename
    ? `${req.protocol}://${req.get("host")}/uploads/${filename}`
    : "";
};

export const getAssignments = async (req, res) => {
  const assignments = await Assignment.find({});
  res.json(assignments);
};

export const addAssignment = async (req, res) => {
  const { title, subject, dueDate, assignedBy } = req.body;
  const assignmentFile = req.file;

  if (!title || !subject || !dueDate) {
    res.status(400);
    throw new Error("Title, subject, and due date are required");
  }

  const lastAssignment = await Assignment.findOne().sort({ id: -1 });
  const id = lastAssignment ? lastAssignment.id + 1 : Date.now();

  const assignment = await Assignment.create({
    id,
    title,
    subject,
    dueDate,
    assignedBy,
    assignmentFileName: assignmentFile?.originalname || "",
    assignmentFileType: assignmentFile?.mimetype || "",
    assignmentFileUrl: getFileUrl(req, assignmentFile?.filename),
    submissions: [],
  });

  res.status(201).json(assignment);
};

export const submitAssignment = async (req, res) => {
  const { id } = req.params;
  const { studentId } = req.body;
  const submissionFile = req.file;

  const assignment = await Assignment.findOne({ id: Number(id) });

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found");
  }

  const submission = assignment.submissions.find(
    (item) => item.studentId === Number(studentId),
  );

  if (!submission) {
    assignment.submissions.push({
      studentId: Number(studentId),
      status: "Submitted",
      submittedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      submittedFileName: submissionFile?.originalname || "",
      submittedFileType: submissionFile?.mimetype || "",
      submittedFileUrl: getFileUrl(req, submissionFile?.filename),
    });
  } else {
    submission.status = "Submitted";
    submission.submittedAt = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    submission.submittedFileName =
      submissionFile?.originalname || submission.submittedFileName;
    submission.submittedFileType =
      submissionFile?.mimetype || submission.submittedFileType;
    submission.submittedFileUrl =
      getFileUrl(req, submissionFile?.filename) || submission.submittedFileUrl;
  }

  await assignment.save();
  res.json(assignment);
};
