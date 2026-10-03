namespace OnlineExam.Domain.Entities;

public class Submission
{
    public int Id { get; set; }
    public int ExamId { get; set; }
    public int UserId { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public decimal Score { get; set; }

    public Exam? Exam { get; set; }
    public User? User { get; set; }
    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
}
