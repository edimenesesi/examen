import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createExam, getExams } from "../services/examService";

function TeacherPage() {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [message, setMessage] = useState("");

  async function loadExams() {
    try {
      const data = await getExams();
      setExams(data);
    } catch {
      setMessage("No se pudo conectar con el backend.");
    }
  }

  useEffect(() => {
    loadExams();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!title.trim()) {
      setMessage("El titulo es obligatorio.");
      return;
    }

    if (Number(durationMinutes) <= 0) {
      setMessage("La duracion debe ser mayor a cero.");
      return;
    }

    try {
      await createExam({
        title,
        description,
        durationMinutes: Number(durationMinutes),
        teacherId: 1,
      });

      setTitle("");
      setDescription("");
      setDurationMinutes(30);
      setMessage("Examen creado correctamente.");

      await loadExams();
    } catch {
      setMessage("No se pudo crear el examen.");
    }
  }

  return (
    <div className="page">
      <Link to="/">← Volver al inicio</Link>

      <h1>Panel del Docente</h1>
      <p>Crea y administra los examenes de la plataforma.</p>

      <div className="teacher-grid">
        <section className="panel">
          <h2>Crear examen</h2>

          <form onSubmit={handleSubmit}>
            <label>Titulo</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Examen de Base de Datos"
            />

            <label>Descripcion</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripcion del examen"
            />

            <label>Duracion (minutos)</label>
            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />

            <button type="submit">Crear examen</button>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="panel">
          <h2>Examenes registrados</h2>

          {exams.length === 0 ? (
            <p>No hay examenes registrados.</p>
          ) : (
            <div className="exam-list">
              {exams.map((exam) => (
                <div className="exam-item" key={exam.id}>
                  <h3>{exam.title}</h3>
                  <p>{exam.description}</p>
                  <strong>{exam.durationMinutes} minutos</strong>
                  <Link
                    className="manage-button"
                    to={`/teacher/exams/${exam.id}/questions`}
                  >
                    Gestionar preguntas
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default TeacherPage;