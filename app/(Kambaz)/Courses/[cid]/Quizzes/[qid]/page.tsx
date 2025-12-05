/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import * as client from "../../Quizzes/client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isFaculty = currentUser?.role === "FACULTY";

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

  const handlePublishToggle = async () => {
    try {
      await client.updateQuiz(qid as string, { published: !quiz.published });
      setQuiz({ ...quiz, published: !quiz.published });
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading quiz details...</div>;
  }

  if (!quiz) {
    return <div className="container mt-4">Quiz not found</div>;
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleString();
  };

  const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;

  return (
    <div className="container mt-4">
      {/* Action Buttons */}
      <div className="d-flex justify-content-center mb-4 gap-2">
        {isFaculty && (
          <>
            <button
              className={`btn ${quiz.published ? "btn-warning" : "btn-success"}`}
              onClick={handlePublishToggle}
            >
              {quiz.published ? "Unpublish" : "Publish"}
            </button>
            <Link
              href={`/Courses/${cid}/Quizzes/${qid}/preview`}
              className="btn btn-secondary"
            >
              Preview
            </Link>
            <Link
              href={`/Courses/${cid}/Quizzes/${qid}/edit`}
              className="btn btn-secondary"
            >
              <FaEdit className="me-2" />
              Edit
            </Link>
          </>
        )}
        {!isFaculty && quiz.published && (
          <Link
            href={`/Courses/${cid}/Quizzes/${qid}/take`}
            className="btn btn-danger"
          >
            Start Quiz
          </Link>
        )}
      </div>

      <hr />

      {/* Quiz Title */}
      <h2>{quiz.title}</h2>

      {/* Quiz Details Table */}
      <div className="row mt-4">
        <div className="col-md-8">
          <table className="table">
            <tbody>
              <tr>
                <td className="text-end fw-bold" style={{ width: "40%" }}>
                  Quiz Type
                </td>
                <td>{quiz.quizType}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Points</td>
                <td>{totalPoints}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Assignment Group</td>
                <td>{quiz.assignmentGroup}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Shuffle Answers</td>
                <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Time Limit</td>
                <td>{quiz.timeLimit} Minutes</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Multiple Attempts</td>
                <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
              </tr>
              {quiz.multipleAttempts && (
                <tr>
                  <td className="text-end fw-bold">How Many Attempts</td>
                  <td>{quiz.howManyAttempts}</td>
                </tr>
              )}
              <tr>
                <td className="text-end fw-bold">Show Correct Answers</td>
                <td>{quiz.showCorrectAnswers || "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Access Code</td>
                <td>{quiz.accessCode || "None"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">One Question at a Time</td>
                <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Webcam Required</td>
                <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">
                  Lock Questions After Answering
                </td>
                <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>

          {/* Dates */}
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Due</th>
                <th>Available From</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(quiz.dueDate)}</td>
                <td>{formatDate(quiz.availableDate)}</td>
                <td>{formatDate(quiz.untilDate)}</td>
              </tr>
            </tbody>
          </table>

          {/* Questions Summary */}
          <div className="mt-4">
            <h5>Questions: {quiz.questions?.length || 0}</h5>
            {quiz.questions?.length > 0 && (
              <ul className="list-group">
                {quiz.questions.map((q: any, index: number) => (
                  <li
                    key={q._id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>
                      {index + 1}. {q.title || "Untitled Question"}
                    </span>
                    <span className="text-muted">
                      {q.type} - {q.points} pts
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}