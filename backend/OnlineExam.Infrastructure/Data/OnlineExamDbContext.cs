using Microsoft.EntityFrameworkCore;
using OnlineExam.Domain.Entities;

namespace OnlineExam.Infrastructure.Data;

public class OnlineExamDbContext : DbContext
{
    public OnlineExamDbContext(DbContextOptions<OnlineExamDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<QuestionOption> QuestionOptions => Set<QuestionOption>();
    public DbSet<ExamAssignment> ExamAssignments => Set<ExamAssignment>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<Answer> Answers => Set<Answer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Exam>()
            .HasOne(e => e.Teacher)
            .WithMany()
            .HasForeignKey(e => e.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Question>()
            .HasOne(q => q.Exam)
            .WithMany(e => e.Questions)
            .HasForeignKey(q => q.ExamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<QuestionOption>()
            .HasOne(o => o.Question)
            .WithMany(q => q.Options)
            .HasForeignKey(o => o.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ExamAssignment>()
            .HasOne(a => a.Exam)
            .WithMany()
            .HasForeignKey(a => a.ExamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ExamAssignment>()
            .HasOne(a => a.Student)
            .WithMany()
            .HasForeignKey(a => a.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Submission>()
            .HasOne(s => s.Exam)
            .WithMany()
            .HasForeignKey(s => s.ExamId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Submission>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Answer>()
            .HasOne(a => a.Submission)
            .WithMany(s => s.Answers)
            .HasForeignKey(a => a.SubmissionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Answer>()
            .HasOne(a => a.Question)
            .WithMany()
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ExamAssignment>()
            .HasIndex(a => new { a.ExamId, a.StudentId })
            .IsUnique();
    }
}
