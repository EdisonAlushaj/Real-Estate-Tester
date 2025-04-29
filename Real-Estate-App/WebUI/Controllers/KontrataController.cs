using Application.DTO;
using Application.Features.Sell_Rent;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KontrataController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KontrataController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet, Authorize(Policy = "UserPolicy")]
        public async Task<ActionResult<IEnumerable<Kontrata>>> GetKontrata()
        {
            try
            {
                return await _context.Kontrata
                    .Include(s => s.Users)
                    .Include(s => s.Pronat)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        [HttpGet("{id}"), Authorize(Policy = "AgentPolicy")]
        public async Task<ActionResult<Kontrata>> GetKontrata(int id)
        {
            try
            {
                var kontrata = await _context.Kontrata
                    .Include(s => s.Users)
                    .Include(s => s.Pronat)
                    .FirstOrDefaultAsync(s => s.KontrataId == id);

                if (kontrata == null)
                {
                    return NotFound("Sale not found.");
                }   

                return kontrata;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        [HttpPut("{id}"), Authorize(Policy = "AgentPolicy")]
        public async Task<IActionResult> PutKontrata(int id, Kontrata kontrata)
        {
            if (id != kontrata.KontrataId)
            {
                return BadRequest();
            }

            _context.Entry(kontrata).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KontrataExists(id))
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

        [HttpPost, Authorize(Policy = "AgentPolicy")]
        public async Task<ActionResult<Kontrata>> PostKontrata( [FromForm] KontrataDto kontrataDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _context.Users.FindAsync(kontrataDto.UserID);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var prona = await _context.Pronas.FindAsync(kontrataDto.PronaID);
                if (prona == null)
                {
                    return NotFound(new { message = "Property not found" });
                }

                var kontrataFeature = new KontrataFeature(_context);
                var kontrat = await kontrataFeature.CreateKontrataAsync(kontrataDto.UserID, kontrataDto.PronaID, kontrataDto.Type);

                return CreatedAtAction("GetKontrata", new { id = kontrat.KontrataId }, kontrat);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating new record: " + ex.Message);
            }
        }

        [HttpDelete("{id}"), Authorize(Policy = "AgentPolicy")]
        public async Task<IActionResult> DeleteKontrata(int id)
        {
            try
            {
                var kontrat = await _context.Kontrata.FindAsync(id);
                if (kontrat == null)
                {
                    return NotFound();
                }

                _context.Kontrata.Remove(kontrat);

                await _context.SaveChangesAsync();

                return Ok(await _context.Kontrata.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting data.");
            }
        }
        private bool KontrataExists(int id)
        {
            try
            {
                return _context.Kontrata.Any(k => k.KontrataId == id);
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
