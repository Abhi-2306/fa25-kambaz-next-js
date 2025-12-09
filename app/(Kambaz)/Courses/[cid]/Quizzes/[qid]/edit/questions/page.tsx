/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import * as client from "../../../client";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaEdit } from "react-icons/fa";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

export default function QuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingQuestions, setEditingQuestions] = useState<Set<string>>(new Set());
  const [originalQuestions, setOriginalQuestions] = useState<Record<string, any>>({});
  const [newQuestionType, setNewQuestionType] = useState<"multiple-choice" | "true-false" | "fill-blank">("multiple-choice");

  // Quill editor modules configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'color', 'background',
    'link', 'image'
  ];

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await client.findQuizById(qid as string);
        setQuiz(data);
        setQuestions(data.questions || []);
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

  const addBlank = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "fill-blank") {
          const currentBlanks = q.blanks || [{ possibleAnswers: q.possibleAnswers || [""] }];
          return { ...q, blanks: [...currentBlanks, { possibleAnswers: [""] }] };
        }
        return q;
      })
    );
  };

  const deleteBlank = (questionId: string, blankIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "fill-blank") {
          const newBlanks = (q.blanks || []).filter((_: any, i: number) => i !== blankIndex);
          return { ...q, blanks: newBlanks.length > 0 ? newBlanks : [{ possibleAnswers: [""] }] };
        }
        return q;
      })
    );
  };

  const updateBlankAnswer = (questionId: string, blankIndex: number, answerIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "fill-blank") {
          const newBlanks = [...(q.blanks || [{ possibleAnswers: q.possibleAnswers || [""] }])];
          newBlanks[blankIndex] = {
            ...newBlanks[blankIndex],
            possibleAnswers: newBlanks[blankIndex].possibleAnswers.map((a: string, i: number) =>
              i === answerIndex ? value : a
            ),
          };
          return { ...q, blanks: newBlanks };
        }
        return q;
      })
    );
  };

  const addBlankAnswer = (questionId: string, blankIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "fill-blank") {
          const newBlanks = [...(q.blanks || [{ possibleAnswers: q.possibleAnswers || [""] }])];
          newBlanks[blankIndex] = {
            ...newBlanks[blankIndex],
            possibleAnswers: [...newBlanks[blankIndex].possibleAnswers, ""],
          };
          return { ...q, blanks: newBlanks };
        }
        return q;
      })
    );
  };

  const deleteBlankAnswer = (questionId: string, blankIndex: number, answerIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "fill-blank") {
          const newBlanks = [...(q.blanks || [])];
          const newAnswers = newBlanks[blankIndex].possibleAnswers.filter(
            (_: string, i: number) => i !== answerIndex
          );
          newBlanks[blankIndex] = {
            ...newBlanks[blankIndex],
            possibleAnswers: newAnswers.length > 0 ? newAnswers : [""],
          };
          return { ...q, blanks: newBlanks };
        }
        return q;
      })
    );
  };

  const addQuestion = (type: "multiple-choice" | "true-false" | "fill-blank") => {
    const newQuestion: any = {
      _id: generateQuestionId(),
      type,
      title: "New Question",
      points: 1,
      question: "",
    };

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
      newQuestion.blanks = [{ possibleAnswers: [""] }];
    }

    setQuestions([...questions, newQuestion]);
  };

  const deepCopyQuestion = (question: any) => {
    return {
      ...question,
      choices: question.choices ? question.choices.map((c: any) => ({ ...c })) : undefined,
      possibleAnswers: question.possibleAnswers ? [...question.possibleAnswers] : undefined,
      blanks: question.blanks ? question.blanks.map((b: any) => ({
        possibleAnswers: [...b.possibleAnswers]
      })) : undefined,
    };
  };

  const startEditing = (question: any) => {
    setOriginalQuestions((prev) => ({
      ...prev,
      [question._id]: deepCopyQuestion(question),
    }));
    setEditingQuestions((prev) => new Set([...prev, question._id]));
  };

  const cancelEditing = (questionId: string) => {
    if (originalQuestions[questionId]) {
      setQuestions(questions.map((q) =>
        q._id === questionId ? originalQuestions[questionId] : q
      ));
    }
    setEditingQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
    setOriginalQuestions((prev) => {
      const newOriginals = { ...prev };
      delete newOriginals[questionId];
      return newOriginals;
    });
  };

  const saveQuestion = (questionId: string) => {
    setEditingQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
    setOriginalQuestions((prev) => {
      const newOriginals = { ...prev };
      delete newOriginals[questionId];
      return newOriginals;
    });
  };

  const updateQuestion = (id: string, updates: any) => {
    setQuestions(questions.map((q) => (q._id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q._id !== id));
    setEditingQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < questions.length) {
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  // Updated to allow multiple correct answers
  const updateChoice = (questionId: string, choiceIndex: number, updates: any) => {
    setQuestions(
      questions.map((q) => {
        if (q._id === questionId && q.type === "multiple-choice") {
          const newChoices = [...q.choices];
          newChoices[choiceIndex] = { ...newChoices[choiceIndex], ...updates };
          // Allow multiple correct answers - no longer deselect others
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
          if (!newChoices.some((c: any) => c.isCorrect) && newChoices.length > 0) {
            newChoices[0].isCorrect = true;
          }
          return { ...q, choices: newChoices };
        }
        return q;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
      const updatedQuiz = { ...quiz, questions, points: totalPoints };
      await client.updateQuiz(qid as string, updatedQuiz);
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Failed to save questions");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndPublish = async () => {
    setSaving(true);
    try {
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
      const updatedQuiz = { ...quiz, questions, points: totalPoints, published: true };
      await client.updateQuiz(qid as string, updatedQuiz);
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Failed to save questions");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Discard unsaved changes?")) {
      router.push(`/Courses/${cid}/Quizzes`);
    }
  };

  const calculateTotalPoints = () => {
    return questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  const getQuestionPreview = (question: any) => {
    if (question.type === "multiple-choice") {
      const correctChoices = question.choices?.filter((c: any) => c.isCorrect) || [];
      if (correctChoices.length === 0) return "Correct answer: Not set";
      if (correctChoices.length === 1) return `Correct answer: ${correctChoices[0].text}`;
      return `Correct answers (${correctChoices.length}): ${correctChoices.map((c: any) => c.text).join(", ")}`;
    } else if (question.type === "true-false") {
      return `Correct answer: ${question.correctAnswer ? "True" : "False"}`;
    } else if (question.type === "fill-blank") {
      const blanks = question.blanks || [{ possibleAnswers: question.possibleAnswers || [] }];
      return blanks.map((b: any, i: number) =>
        `Blank ${i + 1}: ${b.possibleAnswers.join(", ") || "Not set"}`
      ).join(" | ");
    }
    return "";
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
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
            <Link href={`/Courses/${cid}/Quizzes`}>Quizzes</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/Courses/${cid}/Quizzes/${qid}/edit`}>{quiz.title}</Link>
          </li>
          <li className="breadcrumb-item active">Questions</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quiz Questions</h2>
        <div>
          <span className="badge bg-secondary me-2">{questions.length} Questions</span>
          <span className="badge bg-primary">{calculateTotalPoints()} Total Points</span>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <Link className="nav-link" href={`/Courses/${cid}/Quizzes/${qid}/edit`}>Details</Link>
        </li>
        <li className="nav-item">
          <span className="nav-link active">Questions</span>
        </li>
      </ul>

      <div className="mb-3 d-flex align-items-center gap-2">
        <select
          className="form-select"
          style={{ width: "200px" }}
          value={newQuestionType}
          onChange={(e) => setNewQuestionType(e.target.value as any)}
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
          <option value="fill-blank">Fill in the Blank</option>
        </select>
        <button className="btn btn-success" onClick={() => addQuestion(newQuestionType)}>
          <FaPlus className="me-1" /> New Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="alert alert-info">
          No questions yet. Select a question type and click <strong>+ New Question</strong> to add one.
        </div>
      ) : (
        questions.map((question, index) => (
          <div key={question._id} className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>Question {index + 1}</strong>
                <span className="badge bg-secondary ms-2">{question.type.replace("-", " ").toUpperCase()}</span>
                <span className="badge bg-info ms-1">{question.points} pts</span>
              </div>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-secondary" onClick={() => moveQuestion(index, "up")} disabled={index === 0}>
                  <FaArrowUp />
                </button>
                <button className="btn btn-outline-secondary" onClick={() => moveQuestion(index, "down")} disabled={index === questions.length - 1}>
                  <FaArrowDown />
                </button>
                <button className="btn btn-outline-danger" onClick={() => { if (confirm("Delete this question?")) deleteQuestion(question._id); }}>
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Preview Mode */}
            {!editingQuestions.has(question._id) && (
              <div className="card-body">
                <p className="fw-bold mb-1">{question.title}</p>
                {question.question && (
                  <div className="text-muted mb-2">
                    {stripHtml(question.question).substring(0, 150)}
                    {stripHtml(question.question).length > 150 && "..."}
                  </div>
                )}
                <p className="text-muted small mb-2">{getQuestionPreview(question)}</p>
                <button className="btn btn-sm btn-outline-primary" onClick={() => startEditing(question)}>
                  <FaEdit className="me-1" /> Edit
                </button>
              </div>
            )}

            {/* Edit Mode */}
            {editingQuestions.has(question._id) && (
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Question Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={question.title}
                    onChange={(e) => updateQuestion(question._id, { title: e.target.value })}
                  />
                </div>

                {/* WYSIWYG Editor */}
                <div className="mb-3">
                  <label className="form-label">Question</label>
                  <ReactQuill
                    theme="snow"
                    value={question.question || ""}
                    onChange={(value) => updateQuestion(question._id, { question: value })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter the question text..."
                    style={{ backgroundColor: "white" }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Points</label>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "100px" }}
                    value={question.points}
                    onChange={(e) => updateQuestion(question._id, { points: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>

                {question.type === "multiple-choice" && (
                  <div>
                    <label className="form-label">Choices</label>
                    <small className="text-muted d-block mb-2">
                      Check all correct answers. Points will be divided equally among correct choices.
                    </small>
                    {question.choices.map((choice: any, i: number) => (
                      <div key={i} className="input-group mb-2">
                        <div className="input-group-text">
                          <input
                            type="checkbox"
                            checked={choice.isCorrect}
                            onChange={() => updateChoice(question._id, i, { isCorrect: !choice.isCorrect })}
                            title="Mark as correct answer"
                          />
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={choice.text}
                          onChange={(e) => updateChoice(question._id, i, { text: e.target.value })}
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
                    {(() => {
                      const correctCount = question.choices.filter((c: any) => c.isCorrect).length;
                      if (correctCount > 1) {
                        const pointsPerChoice = (question.points / correctCount).toFixed(2);
                        return (
                          <div className="alert alert-info py-2 mt-2">
                            <small>{correctCount} correct answers × {pointsPerChoice} pts each = {question.points} pts total</small>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <button className="btn btn-sm btn-outline-primary" onClick={() => addChoice(question._id)}>
                      <FaPlus /> Add Choice
                    </button>
                  </div>
                )}

                {/* True/False */}
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

                {/* Fill in the Blank */}
                {question.type === "fill-blank" && (
                  <div>
                    <label className="form-label">Blanks</label>
                    <small className="text-muted d-block mb-2">
                      Each blank can have multiple accepted answers. Use [BLANK1], [BLANK2], etc. in your question text.
                    </small>

                    {(question.blanks || [{ possibleAnswers: [""] }]).map((blank: any, blankIndex: number) => (
                      <div key={blankIndex} className="card mb-3 p-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Blank {blankIndex + 1}</strong>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteBlank(question._id, blankIndex)}
                            disabled={(question.blanks || []).length <= 1}
                          >
                            <FaTrash /> Remove Blank
                          </button>
                        </div>

                        <label className="form-label">Accepted Answers for Blank {blankIndex + 1}</label>
                        {blank.possibleAnswers.map((answer: string, answerIndex: number) => (
                          <div key={answerIndex} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={answer}
                              onChange={(e) => updateBlankAnswer(question._id, blankIndex, answerIndex, e.target.value)}
                              placeholder={`Accepted answer ${answerIndex + 1}`}
                            />
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => deleteBlankAnswer(question._id, blankIndex, answerIndex)}
                              disabled={blank.possibleAnswers.length <= 1}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                        <button className="btn btn-sm btn-outline-primary" onClick={() => addBlankAnswer(question._id, blankIndex)}>
                          <FaPlus /> Add Accepted Answer
                        </button>
                      </div>
                    ))}

                    <button className="btn btn-outline-success" onClick={() => addBlank(question._id)}>
                      <FaPlus /> Add Another Blank
                    </button>
                  </div>
                )}

                <hr />
                <div className="d-flex gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => cancelEditing(question._id)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={() => saveQuestion(question._id)}>Update Question</button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <div className="d-flex justify-content-between mt-4 mb-5">
        <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        <div>
          <Link href={`/Courses/${cid}/Quizzes/${qid}/preview`} className="btn btn-outline-primary me-2">Preview</Link>
          <button className="btn btn-success me-2" onClick={handleSaveAndPublish} disabled={saving}>Save & Publish</button>
          <button className="btn btn-danger" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}