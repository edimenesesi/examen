using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Domain.Entities;
using OnlineExam.Infrastructure.Data;

namespace OnlineExam.Api.Controllers;

[ApiController]
[Route("exams")]
public class ExamsController : ControllerBase
{
    private readonly OnlineExamDbContext _context;

    public ExamsController(OnlineExamDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Exam>> Create(Exam exam)
    {
        if (string.IsNullOrWhiteSpace(exam.Title))
            return BadRequest("El título del examen es obligatorio.");

        if (exam.DurationMinutes <= 0)
            return BadRequest("La duración debe ser mayor a cero.");

        var teacherExists = await _context.Users
            .AnyAsync(u => u.Id == exam.TeacherId);

        if (!teacherExists)
            return BadRequest("El docente especificado no existe.");

        exam.Id = 0;
        exam.CreatedAt = DateTime.UtcNow;

        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = exam.Id }, exam);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Exam>>> GetAll()
    {
        var exams = await _context.Exams
            .AsNoTracking()
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

        return Ok(exams);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Exam>> GetById(int id)
    {
        var exam = await _context.Exams
            .AsNoTracking()
            .Include(e => e.Questions)
                .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exam is null)
            return NotFound();

        return Ok(exam);
    }
}
