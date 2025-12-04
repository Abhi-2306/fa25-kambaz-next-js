/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import * as client from "../../../client";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function QuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await client.findQuizById(qid as string);
        setQuiz(data);
        setQuestions(data.questions || []);
        const allIds = new Set<string>(data.questions?.map((q: any) => q._id) || []);
        setExpandedQuestions(allIds);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [qid]);

  const generateQuestionId = () => {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addQuestion = (type: "multiple-choice" | "true-false" | "fill-blank") => {
    const newQuestion: any = {
      _id: generateQuestionId(),
      type,
      title: "New Question",
      points: 1,
      question: "",
    };

    // Set defaults based on type
    if (type === "multiple-choice") {
      newQuestion.choices = [
        { text: "Option 1", isCorrect: true },
        { text: "Option 2", isCorrect: false },
        { text: "Option 3", isCorrect: false },
        { text: "Option 4", isCorrect: false },
      ];
    } else if (type === "true-false") {
      newQuestion.correctAnswer = true;
    } else if (type === "fill-blank") {
      newQuestion.possibleAnswers = [""];
    }

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    
    setExpandedQuestions((prev) => new Set([...prev, newQuestion._id]));
  };

  const updateQuestion = (id: string, updates: any) => {
    setQuestions(questions.map((q) => (q._id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q._id !== id));
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < questions.length) {
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const updateChoice = (questionId: string, choiceIndex: number, updates: any) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "multiple-choice") {
          const newChoices = [...q.choices];
          newChoices[choiceIndex] = { ...newChoices[choiceIndex], ...updates };
          
          // If setting this as correct, unset others
          if (updates.isCorrect) {
            newChoices.forEach((c, i) => {
              if (i !== choiceIndex) c.isCorrect = false;
            });
          }
          
          return { ...q, choices: newChoices };
        }
        return q;
      })
    );
  };

  const addChoice = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "multiple-choice") {
          const newChoice = { text: `Option ${q.choices.length + 1}`, isCorrect: false };
          return { ...q, choices: [...q.choices, newChoice] };
        }
        return q;
      })
    );
  };

  const deleteChoice = (questionId: string, choiceIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "multiple-choice") {
          const newChoices = q.choices.filter((_: any, i: number) => i !== choiceIndex);
          // Ensure at least one correct answer
          if (!newChoices.some((c: any) => c.isCorrect) && newChoices.length > 0) {
            newChoices[0].isCorrect = true;
          }
          return { ...q, choices: newChoices };
        }
        return q;
      })
    );
  };

  const updatePossibleAnswer = (questionId: string, answerIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "fill-blank") {
          const newAnswers = [...q.possibleAnswers];
          newAnswers[answerIndex] = value;
          return { ...q, possibleAnswers: newAnswers };
        }
        return q;
      })
    );
  };

  const addPossibleAnswer = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "fill-blank") {
          return { ...q, possibleAnswers: [...q.possibleAnswers, ""] };
        }
        return q;
      })
    );
  };

  const deletePossibleAnswer = (questionId: string, answerIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "fill-blank") {
          const newAnswers = q.possibleAnswers.filter((_: any, i: number) => i !== answerIndex);
          return { ...q, possibleAnswers: newAnswers.length > 0 ? newAnswers : [""] };
        }
        return q;
      })
    );
  };

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedQuiz = { ...quiz, questions };
      await client.updateQuiz(qid as string, updatedQuiz);
      alert("Questions saved successfully!");
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Failed to save questions");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Discard unsaved changes?")) {
      router.push(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
    }
  };

  const calculateTotalPoints = () => {
    return questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  if (loading) {
    return <div className="container mt-4">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="container mt-4">Quiz not found</div>;
  }

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href={`/Kambaz/Courses/${cid}/Quizzes`}>Quizzes</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`}>{quiz.title}</Link>
          </li>
          <li className="breadcrumb-item active">Questions</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quiz Questions</h2>
        <div>
          <span className="badge bg-secondary me-2">
            {questions.length} Questions
          </span>
          <span className="badge bg-primary">
            {calculateTotalPoints()} Total Points
          </span>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <Link
            className="nav-link"
            href={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`}
          >
            Details
          </Link>
        </li>
        <li className="nav-item">
          <span className="nav-link active">Questions</span>
        </li>
      </ul>

      {/* Add Question Buttons - Simplified without dropdown */}
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={() => addQuestion("multiple-choice")}>
          <FaPlus className="me-1" /> Multiple Choice
        </button>
        <button className="btn btn-success me-2" onClick={() => addQuestion("true-false")}>
          <FaPlus className="me-1" /> True/False
        </button>
        <button className="btn btn-success" onClick={() => addQuestion("fill-blank")}>
          <FaPlus className="me-1" /> Fill in Blank
        </button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="alert alert-info">
          No questions yet. Click a button above to add one.
        </div>
      ) : (
        questions.map((question, index) => (
          <div key={question._id} className="card mb-3">
            <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => toggleQuestion(question._id)}
            >
              <div>
                <strong>Question {index + 1}</strong>
                <span className="badge bg-secondary ms-2">
                  {question.type.replace("-", " ").toUpperCase()}
                </span>
                <span className="badge bg-info ms-1">{question.points} pts</span>
              </div>
              <div className="btn-group btn-group-sm">
                <button
                  className="btn btn-outline-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveQuestion(index, "up");
                  }}
                  disabled={index === 0}
                >
                  <FaArrowUp />
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveQuestion(index, "down");
                  }}
                  disabled={index === questions.length - 1}
                >
                  <FaArrowDown />
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Delete this question?")) {
                      deleteQuestion(question._id);
                    }
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {expandedQuestions.has(question._id) && (
              <div className="card-body">
                {/* Question Title */}
                <div className="mb-3">
                  <label className="form-label">Question Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={question.title}
                    onChange={(e) => updateQuestion(question._id, { title: e.target.value })}
                  />
                </div>

                {/* Question Content */}
                <div className="mb-3">
                  <label className="form-label">Question</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={question.question}
                    onChange={(e) => updateQuestion(question._id, { question: e.target.value })}
                    placeholder="Enter the question text (HTML supported)"
                  />
                </div>

                {/* Points */}
                <div className="mb-3">
                  <label className="form-label">Points</label>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "100px" }}
                    value={question.points}
                    onChange={(e) =>
                      updateQuestion(question._id, { points: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                  />
                </div>

                {/* Type-specific editors */}
                {question.type === "multiple-choice" && (
                  <div>
                    <label className="form-label">Choices</label>
                    {question.choices.map((choice: any, i: number) => (
                      <div key={i} className="input-group mb-2">
                        <div className="input-group-text">
                          <input
                            type="radio"
                            checked={choice.isCorrect}
                            onChange={() => updateChoice(question._id, i, { isCorrect: true })}
                            title="Mark as correct answer"
                          />
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={choice.text}
                          onChange={(e) =>
                            updateChoice(question._id, i, { text: e.target.value })
                          }
                        />
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => deleteChoice(question._id, i)}
                          disabled={question.choices.length <= 2}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => addChoice(question._id)}
                    >
                      <FaPlus /> Add Choice
                    </button>
                  </div>
                )}

                {question.type === "true-false" && (
                  <div>
                    <label className="form-label">Correct Answer</label>
                    <div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`tf-${question._id}`}
                          checked={question.correctAnswer === true}
                          onChange={() => updateQuestion(question._id, { correctAnswer: true })}
                        />
                        <label className="form-check-label">True</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`tf-${question._id}`}
                          checked={question.correctAnswer === false}
                          onChange={() => updateQuestion(question._id, { correctAnswer: false })}
                        />
                        <label className="form-check-label">False</label>
                      </div>
                    </div>
                  </div>
                )}

                {question.type === "fill-blank" && (
                  <div>
                    <label className="form-label">Possible Answers</label>
                    {question.possibleAnswers.map((answer: string, i: number) => (
                      <div key={i} className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={answer}
                          onChange={(e) =>
                            updatePossibleAnswer(question._id, i, e.target.value)
                          }
                          placeholder="Enter an accepted answer"
                        />
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => deletePossibleAnswer(question._id, i)}
                          disabled={question.possibleAnswers.length <= 1}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => addPossibleAnswer(question._id)}
                    >
                      <FaPlus /> Add Answer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
        <div>
          <Link
            href={`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`}
            className="btn btn-outline-primary me-2"
          >
            Preview
          </Link>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}