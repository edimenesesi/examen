using OnlineExam.Domain.Enums;

namespace OnlineExam.Domain.Entities;

public class Question
{
    public int Id { get; set; }
    public int ExamId { get; set; }
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public string? CorrectAnswer { get; set; }
    public decimal Points { get; set; } = 1;

    public Exam? Exam { get; set; }
    public ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
}
