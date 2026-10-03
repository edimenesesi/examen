const API_URL = "http://localhost:5001";

export async function getAvailableExams() {
  const response = await fetch(`${API_URL}/exams`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los examenes.");
  }

  return response.json();
}

export async function getExamQuestions(examId) {
  const response = await fetch(`${API_URL}/questions/${examId}`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las preguntas.");
  }

  return response.json();
}

export async function submitExam(submission) {
  const response = await fetch(`${API_URL}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No se pudo enviar el examen.");
  }

  return response.json();
}

export async function getStudentResults(userId) {
  const response = await fetch(`${API_URL}/results/${userId}`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los resultados.");
  }

  return response.json();
}