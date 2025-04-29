using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DocumentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet, Authorize(Policy = "UserPolicy")]
        public async Task<ActionResult<IEnumerable<Documents>>> GetDocuments()
        {
            try
            {
                var documents = await _context.Set<Documents>()
                    .Include(s => s.Pronat)
                    .ToListAsync();
                    
                return await _context.Documents.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        [HttpGet("{id}"), Authorize(Policy = "UserPolicy")]
        public async Task<ActionResult<Documents>> GetDocumentById(int id)
        {
            try
            {
                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                {
                    return NotFound();
                }

                return document;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        [HttpPost, Authorize(Policy = "AgentPolicy")]
        public async Task<ActionResult<Documents>> PostDocuments(Documents document)
        {
            try
            {
                var existingProna = await _context.Pronas.FindAsync(document.PronaID);
                if (existingProna == null)
                {
                    return BadRequest($"Prona with ID {document.PronaID} does not exist.");
                }

                var doc = new Documents
                {
                    DocumentId = document.DocumentId,
                    Type = document.Type,
                    CreatedData = document.CreatedData,
                    ExpiorationDate = document.ExpiorationDate,
                    PronaID = document.PronaID
                };

                _context.Documents.Add(doc);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetDocuments", new { id = document.DocumentId }, document);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating new record.");
            }
        }

        [HttpPut("{id}"), Authorize(Policy = "AgentPolicy")]
        public async Task<IActionResult> PutApartment(int id, Documents document)
        {
            if (id != document.DocumentId)
            {
                return BadRequest();
            }

            _context.Entry(document).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error updating the record. Concurrency issue.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating the data.");
            }

            return NoContent();
        }

        [HttpDelete("{id}"), Authorize(Policy = "AgentPolicy")]
        public async Task<IActionResult> DeleteDocuments(int id)
        {
            try
            {
                var document = await _context.Documents.FindAsync(id);
                if (document == null)
                {
                    return NotFound();
                }

                _context.Documents.Remove(document);

                await _context.SaveChangesAsync();

                return Ok(await _context.Documents.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting data.");
            }
        }
        private bool DocumentsExists(int id)
        {
            try
            {
                return _context.Documents.Any(e => e.DocumentId == id);
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
    }
