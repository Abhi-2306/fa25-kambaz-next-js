/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import * as client from "../../../Quizzes/client";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await client.findQuizById(qid as string);
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [qid]);

  const handleChange = (field: string, value: any) => {
    setQuiz({ ...quiz, [field]: value });
  };

  const validateDates = () => {
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (availableDate && untilDate && availableDate > untilDate) {
      alert("'Available From' date must be before 'Until' date");
      return false;
    }

    if (availableDate && dueDate && availableDate > dueDate) {
      alert("'Available From' date must be before or equal to 'Due Date'");
      return false;
    }

    if (dueDate && untilDate && dueDate > untilDate) {
      alert("'Due Date' must be before or equal to 'Until' date");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateDates()) return;

    setSaving(true);
    try {
      const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;
      await client.updateQuiz(qid as string, { ...quiz, points: totalPoints });
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    } catch (error) {
      console.error("Error saving quiz:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!validateDates()) return;

    setSaving(true);
    try {
      const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;
      await client.updateQuiz(qid as string, { ...quiz, points: totalPoints, published: true });
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error saving quiz:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (loading) {
    return <div className="container mt-4">Loading quiz editor...</div>;
  }

  if (!quiz) {
    return <div className="container mt-4">Quiz not found</div>;
  }

  // Calculate total points from questions
  const totalPoints =
    quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) ||
    0;

  return (
    <div className="container mt-4">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <Link
            href={`/Courses/${cid}/Quizzes/${qid}/edit/questions`}
            className="nav-link"
          >
            Questions
          </Link>
        </li>
      </ul>

      {/* Details Tab Content */}
      {activeTab === "details" && (
        <div>
          {/* Title */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              value={quiz.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Quiz Title"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Quiz Instructions</label>
            <textarea
              className="form-control"
              rows={4}
              value={quiz.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter quiz instructions..."
            />
          </div>

          {/* Quiz Type */}
          <div className="row mb-3">
            <div className="col-md-3 text-end">
              <label className="form-label">Quiz Type</label>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={quiz.quizType}
                onChange={(e) => handleChange("quizType", e.target.value)}
              >
                <option value="Graded Quiz">Graded Quiz</option>
                <option value="Practice Quiz">Practice Quiz</option>
                <option value="Graded Survey">Graded Survey</option>
                <option value="Ungraded Survey">Ungraded Survey</option>
              </select>
            </div>
          </div>

          {/* Assignment Group */}
          <div className="row mb-3">
            <div className="col-md-3 text-end">
              <label className="form-label">Assignment Group</label>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={quiz.assignmentGroup}
                onChange={(e) => handleChange("assignmentGroup", e.target.value)}
              >
                <option value="Quizzes">Quizzes</option>
                <option value="Exams">Exams</option>
                <option value="Assignments">Assignments</option>
                <option value="Project">Project</option>
              </select>
            </div>
          </div>

          {/* Points Display */}
          <div className="row mb-3">
            <div className="col-md-3 text-end">
              <label className="form-label">Points</label>
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                value={totalPoints}
                disabled
              />
              <small className="text-muted">
                Calculated from question points
              </small>
            </div>
          </div>

          {/* Options Section */}
          <div className="row mb-3">
            <div className="col-md-3 text-end">
              <label className="form-label">Options</label>
            </div>
            <div className="col-md-6">
              {/* Shuffle Answers */}
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="shuffleAnswers"
                  checked={quiz.shuffleAnswers}
                  onChange={(e) =>
                    handleChange("shuffleAnswers", e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor="shuffleAnswers">
                  Shuffle Answers
                </label>
              </div>

              {/* Time Limit */}
              <div className="d-flex align-items-center mb-2">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id="hasTimeLimit"
                  checked={quiz.timeLimit > 0}
                  onChange={(e) =>
                    handleChange("timeLimit", e.target.checked ? 20 : 0)
                  }
                />
                <label className="form-check-label me-2" htmlFor="hasTimeLimit">
                  Time Limit
                </label>
                {quiz.timeLimit > 0 && (
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "80px" }}
                    value={quiz.timeLimit}
                    onChange={(e) =>
                      handleChange("timeLimit", parseInt(e.target.value) || 0)
                    }
                  />
                )}
                {quiz.timeLimit > 0 && (
                  <span className="ms-2">Minutes</span>
                )}
              </div>

              {/* Multiple Attempts */}
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="multipleAttempts"
                  checked={quiz.multipleAttempts}
                  onChange={(e) =>
                    handleChange("multipleAttempts", e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor="multipleAttempts">
                  Allow Multiple Attempts
                </label>
              </div>

              {quiz.multipleAttempts && (
                <div className="ms-4 mb-2">
                  <label className="form-label">Number of Attempts</label>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "100px" }}
                    value={quiz.howManyAttempts}
                    min={1}
                    onChange={(e) =>
                      handleChange(
                        "howManyAttempts",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </div>
              )}

              {/* Show Correct Answers */}
              <div className="mb-2">
                <label className="form-label">Show Correct Answers</label>
                <select
                  className="form-select"
                  value={quiz.showCorrectAnswers}
                  onChange={(e) =>
                    handleChange("showCorrectAnswers", e.target.value)
                  }
                >
                  <option value="">Never</option>
                  <option value="immediately">Immediately</option>
                  <option value="after_due">After Due Date</option>
                </select>
              </div>

              {/* Access Code */}
              <div className="mb-2">
                <label className="form-label">Access Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={quiz.accessCode || ""}
                  onChange={(e) => handleChange("accessCode", e.target.value)}
                  placeholder="Leave blank for no code"
                />
              </div>

              {/* One Question at a Time */}
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="oneQuestionAtATime"
                  checked={quiz.oneQuestionAtATime}
                  onChange={(e) =>
                    handleChange("oneQuestionAtATime", e.target.checked)
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="oneQuestionAtATime"
                >
                  One Question at a Time
                </label>
              </div>

              {/* Webcam Required */}
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="webcamRequired"
                  checked={quiz.webcamRequired}
                  onChange={(e) =>
                    handleChange("webcamRequired", e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor="webcamRequired">
                  Webcam Required
                </label>
              </div>

              {/* Lock Questions After Answering */}
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="lockQuestionsAfterAnswering"
                  checked={quiz.lockQuestionsAfterAnswering}
                  onChange={(e) =>
                    handleChange("lockQuestionsAfterAnswering", e.target.checked)
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="lockQuestionsAfterAnswering"
                >
                  Lock Questions After Answering
                </label>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="row mb-3">
            <div className="col-md-3 text-end">
              <label className="form-label">Due Date</label>
            </div>
            <div className="col-md-6">
              <input
                type="datetime-local"
                className="form-control"
                value={
                  quiz.dueDate
                    ? new Date(quiz.dueDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  handleChange(
                    "dueDate",
                    e.target.value ? new Date(e.target.value).toISOString() : null
                  )
                }
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 text-end">
              <label className="form-label">Available From</label>
            </div>
            <div className="col-md-6">
              <input
                type="datetime-local"
                className="form-control"
                value={
                  quiz.availableDate
                    ? new Date(quiz.availableDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  handleChange(
                    "availableDate",
                    e.target.value ? new Date(e.target.value).toISOString() : null
                  )
                }
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 text-end">
              <label className="form-label">Until</label>
            </div>
            <div className="col-md-6">
              <input
                type="datetime-local"
                className="form-control"
                value={
                  quiz.untilDate
                    ? new Date(quiz.untilDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  handleChange(
                    "untilDate",
                    e.target.value ? new Date(e.target.value).toISOString() : null
                  )
                }
              />
            </div>
          </div>

          <hr />

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2 mb-4">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSaveAndPublish}
              disabled={saving}
            >
              Save & Publish
            </button>
            <button
              className="btn btn-danger"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}