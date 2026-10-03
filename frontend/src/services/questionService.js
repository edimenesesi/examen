const API_URL = "http://localhost:5001";

export async function getQuestions(examId) {
  const response = await fetch(`${API_URL}/questions/${examId}`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las preguntas.");
  }

  return response.json();
}

export async function createQuestion(question) {
  const response = await fetch(`${API_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No se pudo crear la pregunta.");
  }

  return response.json();
}