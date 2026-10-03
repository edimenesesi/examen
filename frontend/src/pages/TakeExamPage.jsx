import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAvailableExams,
  getExamQuestions,
  submitExam
} from "../services/studentService";

function TakeExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const studentId = 2;

  useEffect(() => {
    async function loadExam() {
      try {
        const [exams, questionData] = await Promise.all([
          getAvailableExams(),
          getExamQuestions(examId)
        ]);

        const selectedExam = exams.find(
          (item) => item.id === Number(examId)
        );

        if (!selectedExam) {
          setMessage("El examen no existe.");
          return;
        }

        setExam(selectedExam);
        setQuestions(questionData);
        setTimeLeft(selectedExam.durationMinutes * 60);
      } catch {
        setMessage("No se pudo cargar el examen.");
      }
    }

    loadExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  function updateAnswer(questionId, value) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value
    }));
  }

  async function sendExam() {
    if (sending) return;

    const unanswered = questions.some(
      (question) => !answers[question.id]?.trim()
    );

    if (unanswered && timeLeft > 0) {
      setMessage("Debes responder todas las preguntas.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const result = await submitExam({
        examId: Number(examId),
        userId: studentId,
        answers: questions.map((question) => ({
          questionId: question.id,
          response: answers[question.id] || ""
        }))
      });

      alert(
        `Examen enviado correctamente. Puntaje automático: ${result.score}`
      );

      navigate("/student");
    } catch {
      setMessage("No se pudo enviar el examen.");
      setSending(false);
    }
  }

  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) {
      sendExam();
    }
  }, [timeLeft]);

  function formatTime(seconds) {
    if (seconds === null) return "--:--";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  if (!exam) {
    return (
      <div className="page">
        <p>{message || "Cargando examen..."}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/student">← Volver al panel</Link>

      <div className="exam-header">
        <div>
          <h1>{exam.title}</h1>
          <p>{exam.description}</p>
        </div>

        <div className={timeLeft <= 60 ? "timer timer-danger" : "timer"}>
          Tiempo: {formatTime(timeLeft)}
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="panel">
          <p>Este examen todavía no tiene preguntas.</p>
        </div>
      ) : (
        <div className="question-container">
          {questions.map((question, index) => (
            <section className="panel question-card" key={question.id}>
              <h3>
                {index + 1}. {question.text}
              </h3>

              <p>{question.points} punto(s)</p>

              {question.type === 0 &&
                question.options.map((option) => (
                  <label className="answer-option" key={option.id}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.text}
                      checked={answers[question.id] === option.text}
                      onChange={(e) =>
                        updateAnswer(question.id, e.target.value)
                      }
                    />
                    {option.text}
                  </label>
                ))}

              {question.type === 1 && (
                <>
                  <label className="answer-option">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="True"
                      checked={answers[question.id] === "True"}
                      onChange={(e) =>
                        updateAnswer(question.id, e.target.value)
                      }
                    />
                    Verdadero
                  </label>

                  <label className="answer-option">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="False"
                      checked={answers[question.id] === "False"}
                      onChange={(e) =>
                        updateAnswer(question.id, e.target.value)
                      }
                    />
                    Falso
                  </label>
                </>
              )}

              {question.type === 2 && (
                <textarea
                  className="open-answer"
                  placeholder="Escribe tu respuesta..."
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    updateAnswer(question.id, e.target.value)
                  }
                />
              )}
            </section>
          ))}

          {message && <p className="message">{message}</p>}

          <button
            className="submit-exam"
            onClick={sendExam}
            disabled={sending}
          >
            {sending ? "Enviando..." : "Finalizar y enviar examen"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TakeExamPage;