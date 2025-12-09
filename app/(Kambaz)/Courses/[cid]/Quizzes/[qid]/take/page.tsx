/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "../../client";

export default function TakeQuiz() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [latestAttempt, setLatestAttempt] = useState<any>(null);
    const [attemptCount, setAttemptCount] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [accessCodeVerified, setAccessCodeVerified] = useState(false);
    const [enteredAccessCode, setEnteredAccessCode] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const quizData = await client.findQuizById(qid as string);
                setQuiz(quizData);

                const attempts = await client.getAttempts(qid as string);
                setAttemptCount(attempts.length);

                if (attempts.length > 0) {
                    const latest = await client.getLatestAttempt(qid as string);
                    setLatestAttempt(latest);

                    if (!quizData.multipleAttempts && attempts.length > 0) {
                        setSubmitted(true);
                        setScore(latest.score);
                        const restoredAnswers: Record<string, any> = {};
                        latest.answers.forEach((a: any) => {
                            restoredAnswers[a.questionId] = a.answer;
                        });
                        setAnswers(restoredAnswers);
                    } else if (quizData.multipleAttempts && attempts.length >= quizData.howManyAttempts) {
                        setSubmitted(true);
                        setScore(latest.score);
                        const restoredAnswers: Record<string, any> = {};
                        latest.answers.forEach((a: any) => {
                            restoredAnswers[a.questionId] = a.answer;
                        });
                        setAnswers(restoredAnswers);
                    } else if (quizData.timeLimit && quizData.timeLimit > 0) {
                        setTimeRemaining(quizData.timeLimit * 60);
                        setQuizStartTime(new Date());
                    }
                } else if (quizData.timeLimit && quizData.timeLimit > 0) {
                    setTimeRemaining(quizData.timeLimit * 60);
                    setQuizStartTime(new Date());
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
                setError("Failed to load quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [qid]);

    useEffect(() => {
        if (timeRemaining !== null && timeRemaining > 0 && !submitted) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev === null || prev <= 1) return 0;
                    return prev - 1;
                });
            }, 1000);
            return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
        }
    }, [timeRemaining, submitted]);

    useEffect(() => {
        if (timeRemaining === 0 && !submitted) {
            handleSubmit(true);
        }
    }, [timeRemaining, submitted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (!timeRemaining || !quiz?.timeLimit) return "";
        const percentRemaining = (timeRemaining / (quiz.timeLimit * 60)) * 100;
        if (percentRemaining <= 10) return "text-danger";
        if (percentRemaining <= 25) return "text-warning";
        return "";
    };

    const handleAnswerChange = (questionId: string, answer: any) => {
        setAnswers({ ...answers, [questionId]: answer });
        const questionIndex = quiz.questions.findIndex((q: any) => q._id === questionId);
        if (questionIndex !== -1) {
            setAnsweredQuestions(prev => new Set([...prev, questionIndex]));
        }
    };

    const handleMultipleChoiceChange = (questionId: string, choiceText: string, isChecked: boolean) => {
        const currentAnswers = answers[questionId] || [];
        let newAnswers: string[];
        if (isChecked) {
            newAnswers = [...currentAnswers, choiceText];
        } else {
            newAnswers = currentAnswers.filter((a: string) => a !== choiceText);
        }
        handleAnswerChange(questionId, newAnswers);
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        let totalScore = 0;

        quiz.questions.forEach((question: any) => {
            const userAnswer = answers[question._id];

            if (question.type === "multiple-choice") {
                const correctChoices = question.choices.filter((c: any) => c.isCorrect);
                const correctCount = correctChoices.length;
                if (correctCount === 0) return;

                const pointsPerCorrect = question.points / correctCount;
                const userAnswers = Array.isArray(userAnswer) ? userAnswer : (userAnswer ? [userAnswer] : []);

                let questionScore = 0;
                userAnswers.forEach((ans: string) => {
                    const choice = question.choices.find((c: any) => c.text === ans);
                    if (choice?.isCorrect) questionScore += pointsPerCorrect;
                });
                totalScore += Math.max(0, questionScore);

            } else if (question.type === "true-false") {
                if (userAnswer === question.correctAnswer) {
                    totalScore += question.points;
                }
            } else if (question.type === "fill-blank") {
                const blanks = question.blanks || [{ possibleAnswers: question.possibleAnswers || [] }];
                const userAnswers = answers[question._id] || [];
                let allCorrect = true;
                blanks.forEach((blank: any, index: number) => {
                    const ua = userAnswers[index] || "";
                    const isCorrect = blank.possibleAnswers.some(
                        (ans: string) => ans.toLowerCase().trim() === ua.toLowerCase().trim()
                    );
                    if (!isCorrect) allCorrect = false;
                });
                if (allCorrect) totalScore += question.points;
            }
        });

        return Math.round(totalScore * 100) / 100;
    };

    const handleSubmit = async (isAutoSubmit = false) => {
        try {
            if (intervalRef.current) clearInterval(intervalRef.current);
            const finalScore = calculateScore();

            const attemptData = {
                answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
                score: finalScore,
                timeUsed: quiz.timeLimit && quizStartTime ? Math.floor((Date.now() - quizStartTime.getTime()) / 1000 / 60) : undefined,
                autoSubmitted: isAutoSubmit
            };

            const newAttempt = await client.submitAttempt(qid as string, attemptData);
            setLatestAttempt(newAttempt);
            setScore(finalScore);
            setSubmitted(true);
            setAttemptCount(attemptCount + 1);
            if (isAutoSubmit) alert("Time's up! Your quiz has been automatically submitted.");
        } catch (error: any) {
            console.error("Error submitting attempt:", error);
            setError(error.response?.data?.message || "Failed to submit quiz");
        }
    };

    const getQuestionScore = (question: any) => {
        const userAnswer = answers[question._id];
        if (question.type === "multiple-choice") {
            const correctChoices = question.choices.filter((c: any) => c.isCorrect);
            const correctCount = correctChoices.length;
            if (correctCount === 0) return 0;
            const pointsPerCorrect = question.points / correctCount;
            const userAnswers = Array.isArray(userAnswer) ? userAnswer : (userAnswer ? [userAnswer] : []);
            let questionScore = 0;
            userAnswers.forEach((ans: string) => {
                const choice = question.choices.find((c: any) => c.text === ans);
                if (choice?.isCorrect) questionScore += pointsPerCorrect;
            });
            return Math.max(0, Math.round(questionScore * 100) / 100);
        } else if (question.type === "true-false") {
            return userAnswer === question.correctAnswer ? question.points : 0;
        } else if (question.type === "fill-blank") {
            const blanks = question.blanks || [{ possibleAnswers: question.possibleAnswers || [] }];
            const userAnswers = answers[question._id] || [];
            let allCorrect = true;
            blanks.forEach((blank: any, index: number) => {
                const ua = userAnswers[index] || "";
                const isCorrect = blank.possibleAnswers.some((ans: string) => ans.toLowerCase().trim() === ua.toLowerCase().trim());
                if (!isCorrect) allCorrect = false;
            });
            return allCorrect ? question.points : 0;
        }
        return 0;
    };

    const isCorrect = (question: any) => getQuestionScore(question) === question.points;
    const isPartiallyCorrect = (question: any) => {
        const s = getQuestionScore(question);
        return s > 0 && s < question.points;
    };

    const shouldShowCorrectAnswers = () => {
        if (!quiz.showCorrectAnswers || quiz.showCorrectAnswers === "") return false;
        if (quiz.showCorrectAnswers === "immediately") return true;
        if (quiz.showCorrectAnswers === "after_due" && quiz.dueDate) return new Date() > new Date(quiz.dueDate);
        return false;
    };

    const canRetake = () => {
        if (!quiz) return false;
        if (!quiz.multipleAttempts) return false;
        return attemptCount < quiz.howManyAttempts;
    };

    const handleRetake = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        setVisitedQuestions(new Set([0]));
        setAnsweredQuestions(new Set());
        setQuizStartTime(new Date());
        if (quiz.timeLimit && quiz.timeLimit > 0) setTimeRemaining(quiz.timeLimit * 60);
    };

    const navigateToQuestion = (index: number) => {
        if (quiz.lockQuestionsAfterAnswering) {
            const canNavigate = index <= currentQuestionIndex || answeredQuestions.has(index) ||
                index === Math.min(...Array.from({ length: quiz.questions.length }, (_, i) => i).filter(i => !answeredQuestions.has(i)));
            if (!canNavigate) return;
        }
        setCurrentQuestionIndex(index);
        setVisitedQuestions(prev => new Set([...prev, index]));
    };

    const goToPrevious = () => { if (currentQuestionIndex > 0) navigateToQuestion(currentQuestionIndex - 1); };
    const goToNext = () => { if (currentQuestionIndex < quiz.questions.length - 1) navigateToQuestion(currentQuestionIndex + 1); };

    const getQuestionStatus = (index: number) => {
        const question = quiz.questions[index];
        if (submitted) return isCorrect(question) ? 'correct' : isPartiallyCorrect(question) ? 'partial' : 'incorrect';
        if (answers[question._id] !== undefined) return 'answered';
        if (visitedQuestions.has(index)) return 'visited';
        return 'unvisited';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'correct': return 'bg-success text-white';
            case 'partial': return 'bg-warning text-dark';
            case 'incorrect': return 'bg-danger text-white';
            case 'answered': return 'bg-primary text-white';
            case 'visited': return 'bg-warning';
            default: return 'bg-light border';
        }
    };

    if (loading) return <div className="container mt-4">Loading quiz...</div>;
    if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
    if (!quiz) return <div className="container mt-4">Quiz not found</div>;

    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (availableDate && now < availableDate) {
        return <div className="container mt-4 alert alert-warning">This quiz is not available until {availableDate.toLocaleDateString()}</div>;
    }
    if (untilDate && now > untilDate) {
        return <div className="container mt-4 alert alert-danger">This quiz is no longer available (closed on {untilDate.toLocaleDateString()})</div>;
    }

    // Access Code Check
    if (quiz.accessCode && !accessCodeVerified && !submitted) {
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header"><h4>Access Code Required</h4></div>
                            <div className="card-body">
                                <p>This quiz requires an access code to begin.</p>
                                <div className="mb-3">
                                    <label htmlFor="accessCode" className="form-label">Enter Access Code:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="accessCode"
                                        value={enteredAccessCode}
                                        onChange={(e) => setEnteredAccessCode(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                if (enteredAccessCode === quiz.accessCode) setAccessCodeVerified(true);
                                                else { alert("Incorrect access code."); setEnteredAccessCode(""); }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={() => {
                                        if (enteredAccessCode === quiz.accessCode) setAccessCodeVerified(true);
                                        else { alert("Incorrect access code."); setEnteredAccessCode(""); }
                                    }}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions?.[currentQuestionIndex];
    const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;

    // Render question component
    const renderQuestion = (question: any, isDisabled: boolean) => {
        const correctChoices = question.type === "multiple-choice" ? question.choices.filter((c: any) => c.isCorrect) : [];
        const hasMultipleCorrect = correctChoices.length > 1;
        const userAnswers = Array.isArray(answers[question._id]) ? answers[question._id] : (answers[question._id] ? [answers[question._id]] : []);

        return (
            <>
                <h5 className="mb-3">{question.title}</h5>
                <div dangerouslySetInnerHTML={{ __html: question.question }} className="mb-4" />

                {question.type === "multiple-choice" && (
                    <div className="mt-3">
                        {hasMultipleCorrect && !submitted && <small className="text-muted d-block mb-2">Select all that apply</small>}
                        {question.choices.map((choice: any, i: number) => {
                            const isSelected = userAnswers.includes(choice.text);
                            return (
                                <div key={i} className="form-check mb-2">
                                    <input
                                        type={hasMultipleCorrect ? "checkbox" : "radio"}
                                        className="form-check-input"
                                        name={`question-${question._id}`}
                                        id={`choice-${question._id}-${i}`}
                                        checked={isSelected}
                                        onChange={(e) => {
                                            if (hasMultipleCorrect) handleMultipleChoiceChange(question._id, choice.text, e.target.checked);
                                            else handleAnswerChange(question._id, [choice.text]);
                                        }}
                                        disabled={isDisabled}
                                    />
                                    <label className="form-check-label" htmlFor={`choice-${question._id}-${i}`}>
                                        {choice.text}
                                        {submitted && shouldShowCorrectAnswers() && choice.isCorrect && <span className="text-success ms-2">✓ Correct</span>}
                                        {submitted && shouldShowCorrectAnswers() && isSelected && !choice.isCorrect && <span className="text-danger ms-2">✗ Incorrect</span>}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                )}

                {question.type === "true-false" && (
                    <div className="mt-3">
                        {[true, false].map((val) => (
                            <div key={String(val)} className="form-check mb-2">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name={`question-${question._id}`}
                                    id={`${val}-${question._id}`}
                                    checked={answers[question._id] === val}
                                    onChange={() => handleAnswerChange(question._id, val)}
                                    disabled={isDisabled}
                                />
                                <label className="form-check-label" htmlFor={`${val}-${question._id}`}>
                                    {val ? "True" : "False"}
                                    {submitted && shouldShowCorrectAnswers() && question.correctAnswer === val && <span className="text-success ms-2">✓ Correct</span>}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {question.type === "fill-blank" && (
                    <div className="mt-3">
                        {(question.blanks || [{ possibleAnswers: question.possibleAnswers || [] }]).map((blank: any, blankIndex: number) => (
                            <div key={blankIndex} className="mb-3">
                                <label className="form-label">Blank {blankIndex + 1}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Answer for blank ${blankIndex + 1}`}
                                    value={answers[question._id]?.[blankIndex] || ""}
                                    onChange={(e) => {
                                        const curr = answers[question._id] || [];
                                        const newAns = [...curr];
                                        newAns[blankIndex] = e.target.value;
                                        handleAnswerChange(question._id, newAns);
                                    }}
                                    disabled={isDisabled}
                                />
                                {submitted && shouldShowCorrectAnswers() && <small className="text-muted">Accepted: {blank.possibleAnswers.join(", ")}</small>}
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };

    // One Question at a Time Mode
    if (quiz.oneQuestionAtATime && currentQuestion) {
        return (
            <div className="container-fluid mt-4">
                {/* Webcam Required Message */}
                {quiz.webcamRequired && !submitted && (
                    <div className="alert alert-warning mb-3">
                        <strong>⚠️ Webcam Required:</strong> This quiz requires a webcam to be enabled.
                    </div>
                )}

                {timeRemaining !== null && !submitted && (
                    <div className={`alert ${timeRemaining <= 60 ? 'alert-danger' : timeRemaining <= 300 ? 'alert-warning' : 'alert-info'} mb-3`}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">{quiz.title}</h5>
                            <div className="d-flex align-items-center">
                                <strong className="me-2">Time Remaining:</strong>
                                <span className={`fs-4 ${getTimerColor()}`}>{formatTime(timeRemaining)}</span>
                                {timeRemaining <= 60 && <span className="badge bg-danger ms-2">Critical!</span>}
                            </div>
                        </div>
                    </div>
                )}

                <div className="row">
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                                    <span className="badge bg-secondary">{currentQuestion.points} points</span>
                                </div>
                            </div>
                            <div className="card-body">
                                {!submitted ? (
                                    <>
                                        {renderQuestion(currentQuestion, quiz.lockQuestionsAfterAnswering && answeredQuestions.has(currentQuestionIndex) && visitedQuestions.size > currentQuestionIndex + 1)}
                                        <hr className="my-4" />
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-outline-secondary" onClick={goToPrevious} disabled={currentQuestionIndex === 0}>← Previous</button>
                                            {currentQuestionIndex === quiz.questions.length - 1 ? (
                                                <button className="btn btn-danger" onClick={() => { if (window.confirm("Submit quiz?")) handleSubmit(false); }}>Submit Quiz</button>
                                            ) : (
                                                <button className="btn btn-primary" onClick={goToNext}>Next →</button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <div className="alert alert-info mb-4">
                                            <h4>Quiz Completed!</h4>
                                            <p className="mb-1"><strong>Your Score:</strong> {score} / {totalPoints}</p>
                                            <p className="mb-0"><strong>Percentage:</strong> {Math.round((score / totalPoints) * 100)}%</p>
                                        </div>
                                        {shouldShowCorrectAnswers() && (
                                            <>
                                                {renderQuestion(currentQuestion, true)}
                                                <div className={`mt-3 ${isCorrect(currentQuestion) ? 'text-success' : isPartiallyCorrect(currentQuestion) ? 'text-warning' : 'text-danger'}`}>
                                                    {isCorrect(currentQuestion) ? '✓ Correct' : isPartiallyCorrect(currentQuestion) ? `◐ Partial (${getQuestionScore(currentQuestion)}/${currentQuestion.points})` : '✗ Incorrect'}
                                                </div>
                                                <hr />
                                                <div className="d-flex justify-content-between">
                                                    <button className="btn btn-outline-secondary" onClick={goToPrevious} disabled={currentQuestionIndex === 0}>← Previous</button>
                                                    {currentQuestionIndex < quiz.questions.length - 1 && <button className="btn btn-outline-secondary" onClick={goToNext}>Next →</button>}
                                                </div>
                                            </>
                                        )}
                                        <div className="mt-4">
                                            {canRetake() && <button className="btn btn-primary me-2" onClick={handleRetake}>Retake Quiz</button>}
                                            <button className="btn btn-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>Back to Quizzes</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card position-sticky" style={{ top: "20px" }}>
                            <div className="card-header"><h6 className="mb-0">Questions</h6></div>
                            <div className="card-body">
                                <div className="row g-2 mb-3">
                                    {quiz.questions.map((q: any, index: number) => {
                                        const status = getQuestionStatus(index);
                                        const isCurrent = index === currentQuestionIndex;
                                        const isLocked = quiz.lockQuestionsAfterAnswering && !answeredQuestions.has(index) && index > currentQuestionIndex;
                                        return (
                                            <div key={q._id} className="col-3">
                                                <button
                                                    className={`btn btn-sm w-100 ${getStatusColor(status)} ${isCurrent ? 'border-dark border-2' : ''}`}
                                                    onClick={() => !isLocked && navigateToQuestion(index)}
                                                    disabled={isLocked}
                                                    style={{ fontSize: '0.9rem', padding: '0.4rem', fontWeight: isCurrent ? 'bold' : 'normal', opacity: isLocked ? 0.5 : 1 }}
                                                >
                                                    {index + 1}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="small text-muted">
                                    <div className="mb-1">🟨 Visited</div>
                                    <div className="mb-1">🔵 Answered</div>
                                    {submitted && <>
                                        <div className="mb-1">🟢 Correct</div>
                                        <div className="mb-1">🟡 Partial</div>
                                        <div className="mb-1">🔴 Incorrect</div>
                                    </>}
                                </div>
                                {!submitted && (
                                    <div className="mt-3 d-grid">
                                        <button className="btn btn-danger btn-sm" onClick={() => {
                                            const unanswered = quiz.questions.filter((q: any) => answers[q._id] === undefined).length;
                                            if (window.confirm(unanswered > 0 ? `You have ${unanswered} unanswered. Submit?` : "Submit quiz?")) handleSubmit(false);
                                        }}>Submit All</button>
                                    </div>
                                )}
                                <div className="mt-3 text-center">
                                    <small className="text-muted">{Object.keys(answers).length} of {quiz.questions.length} answered</small>
                                    <div className="progress mt-1" style={{ height: '5px' }}>
                                        <div className="progress-bar" style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // All Questions Mode
    return (
        <div className="container mt-4">
            <h2>{quiz.title}</h2>
            {quiz.description && <p className="text-muted">{quiz.description}</p>}

            <div className="mb-3">
                <strong>Points:</strong> {totalPoints} |
                <strong> Questions:</strong> {quiz.questions?.length || 0} |
                <strong> Time Limit:</strong> {quiz.timeLimit > 0 ? `${quiz.timeLimit} minutes` : 'None'} |
                <strong> Attempts:</strong> {attemptCount} / {quiz.multipleAttempts ? quiz.howManyAttempts : 1}
            </div>

            {/* Webcam Required Message */}
            {quiz.webcamRequired && !submitted && (
                <div className="alert alert-warning">
                    <strong>⚠️ Webcam Required:</strong> This quiz requires a webcam to be enabled.
                </div>
            )}

            {timeRemaining !== null && !submitted && (
                <div className={`alert ${timeRemaining <= 60 ? 'alert-danger' : timeRemaining <= 300 ? 'alert-warning' : 'alert-info'} position-sticky top-0`} style={{ zIndex: 100 }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div><strong>Time Remaining: </strong><span className={`fs-5 ${getTimerColor()}`}>{formatTime(timeRemaining)}</span></div>
                        {timeRemaining <= 60 && <span className="badge bg-danger">Less than 1 minute!</span>}
                    </div>
                </div>
            )}

            <hr />

            {quiz.questions?.map((question: any, index: number) => {
                const qScore = submitted ? getQuestionScore(question) : 0;
                const full = isCorrect(question);
                const partial = isPartiallyCorrect(question);
                const borderClass = submitted ? (full ? "border-success" : partial ? "border-warning" : "border-danger") : "";

                return (
                    <div key={question._id} className={`card mb-3 ${borderClass}`}>
                        <div className="card-header d-flex justify-content-between">
                            <span>Question {index + 1}</span>
                            <span>{question.points} pts</span>
                        </div>
                        <div className="card-body">
                            {renderQuestion(question, submitted)}
                            {submitted && (
                                <div className={`mt-2 ${full ? "text-success" : partial ? "text-warning" : "text-danger"}`}>
                                    {full ? "✓ Correct" : partial ? `◐ Partially Correct (${qScore}/${question.points} pts)` : "✗ Incorrect"}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            <hr />

            {submitted ? (
                <div className="mb-4">
                    <div className="alert alert-info">
                        <h4>Your Score: {score} / {totalPoints}</h4>
                        <p>Attempts used: {attemptCount} / {quiz.multipleAttempts ? quiz.howManyAttempts : 1}</p>
                    </div>
                    {canRetake() && <button className="btn btn-primary me-2" onClick={handleRetake}>Retake Quiz</button>}
                    <button className="btn btn-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>Back to Quizzes</button>
                </div>
            ) : (
                <div className="mb-4">
                    <button className="btn btn-danger me-2" onClick={() => handleSubmit(false)}>Submit Quiz</button>
                    <button className="btn btn-secondary" onClick={() => {
                        if (timeRemaining !== null && timeRemaining > 0 && !window.confirm("Leave? Progress will be lost.")) return;
                        router.push(`/Courses/${cid}/Quizzes`);
                    }}>Cancel</button>
                </div>
            )}
        </div>
    );
}