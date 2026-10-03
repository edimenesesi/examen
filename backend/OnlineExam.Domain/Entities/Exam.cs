namespace OnlineExam.Domain.Entities;

public class Exam
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public int TeacherId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? Teacher { get; set; }
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}
