/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import { IoRocketOutline } from "react-icons/io5";
import { FaCheckCircle, FaBan, FaPlus, FaTrash, FaEdit, FaCopy } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import * as client from "../Quizzes/client";

export default function QuizList() {
  const { cid } = useParams();
  const router = useRouter();
 
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const fetchQuizzes = async () => {
    try {
      const data = await client.findQuizzesForCourse(cid as string);
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuiz = async () => {
    try {
      const newQuiz = await client.createQuiz(cid as string, {
        title: "New Quiz",
        description: "Quiz description",
        quizType: "Graded Quiz",
        points: 0,
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        howManyAttempts: 1,
        showCorrectAnswers: "",
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        published: false,
        questions: [],
      });
      router.push(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}/edit`);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await client.deleteQuiz(quizId);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handlePublishToggle = async (quiz: any) => {
    try {
      await client.updateQuiz(quiz._id, { published: !quiz.published });
      setQuizzes(
        quizzes.map((q) =>
          q._id === quiz._id ? { ...q, published: !q.published } : q
        )
      );
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  const handleCopy = async (quiz: any) => {
    try {
      const { _id, ...quizData } = quiz;
      const newQuiz = await client.createQuiz(cid as string, {
        ...quizData,
        title: `${quiz.title} (Copy)`,
        published: false,
      });
      setQuizzes([...quizzes, newQuiz]);
    } catch (error) {
      console.error("Error copying quiz:", error);
    }
  };

  const getAvailabilityStatus = (quiz: any) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (availableDate && now < availableDate) {
      return `Not available until ${availableDate.toLocaleDateString()}`;
    }
    if (untilDate && now > untilDate) {
      return "Closed";
    }
    if (availableDate && untilDate) {
      return `Available until ${untilDate.toLocaleDateString()}`;
    }
    return "Available";
  };

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  // Filter quizzes for students — only show published
  const visibleQuizzes = isFaculty
    ? quizzes
    : quizzes.filter((q) => q.published);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search for Quiz"
        />
        {isFaculty && (
          <button className="btn btn-danger" onClick={handleAddQuiz}>
            <FaPlus className="me-2" />
            Quiz
          </button>
        )}
      </div>

      <hr />

      {/* Quiz List */}
      <ul className="list-group">
        <li className="list-group-item bg-light d-flex align-items-center">
          <BsGripVertical className="me-2" />
          <strong>Assignment Quizzes</strong>
        </li>

        {visibleQuizzes.length === 0 ? (
          <li className="list-group-item text-muted">No quizzes available</li>
        ) : (
          visibleQuizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 text-muted" />
                <IoRocketOutline className="me-3 text-success" />
                <div>
                  <Link
                    href={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                    className="fw-bold text-decoration-none"
                  >
                    {quiz.title}
                  </Link>
                  <div className="text-muted small">
                    <span className="me-3">{getAvailabilityStatus(quiz)}</span>
                    <span className="me-3">
                      <strong>Due:</strong>{" "}
                      {quiz.dueDate
                        ? new Date(quiz.dueDate).toLocaleDateString()
                        : "No due date"}
                    </span>
                    <span className="me-3">{quiz.points} pts</span>
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                {/* Publish status */}
                {isFaculty && (
                  <span
                    className="me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePublishToggle(quiz)}
                    title={quiz.published ? "Unpublish" : "Publish"}
                  >
                    {quiz.published ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaBan className="text-secondary" />
                    )}
                  </span>
                )}

                {/* Context menu */}
                {isFaculty && (
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="link"
                      className="text-dark p-0"
                      id={`dropdown-${quiz._id}`}
                    >
                      <BsThreeDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          router.push(
                            `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit`
                          )
                        }
                      >
                        <FaEdit className="me-2" /> Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(quiz._id)}>
                        <FaTrash className="me-2" /> Delete
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handlePublishToggle(quiz)}>
                        {quiz.published ? (
                          <>
                            <FaBan className="me-2" /> Unpublish
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="me-2" /> Publish
                          </>
                        )}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleCopy(quiz)}>
                        <FaCopy className="me-2" /> Copy
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}