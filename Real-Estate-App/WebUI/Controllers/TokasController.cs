using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Application.DTO;
using Application.Features.Property;

namespace WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TokasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet, Authorize(Policy = "UserPolicy")]
        public async Task<ActionResult<IEnumerable<Toka>>> GetTokat()
        {
            try
            {
                return await _context.Tokat.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        [HttpGet("{id}"), Authorize(Policy = "AgentPolicy")]
        public async Task<ActionResult<Toka>> GetTokaById(int id)
        {
            try
            {
                var toka = await _context.Tokat.FindAsync(id);

                if (toka == null)
                {
                    return NotFound();
                }

                return toka;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        [HttpPost, Authorize(Policy = "AgentPolicy")]
        public async Task<ActionResult<Toka>> PostToka([FromForm] TokaCreateDto tokaDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var tokaFeature = new TokaFeature(_context);
                var documentFeature = new DocumentFeature(_context);

                var toka = await tokaFeature.CreateTokaAsync(tokaDto);

                await documentFeature.CreateDocumentForTokaAsync(toka.PronaID);

                await transaction.CommitAsync();

                return CreatedAtAction("GetTokaById", new { id = toka.PronaID }, toka);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating new record: " + ex.Message);
            }
        }

        [HttpPut("{id}"), Authorize(Policy = "AgentPolicy")]
        public async Task<IActionResult> PutToka(int id, Toka toka)
        {
            if (id != toka.PronaID)
            {
                return BadRequest();
            }

            _context.Entry(toka).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TokaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating the data.");
            }

            return NoContent();
        }

        [HttpDelete("{id}"), Authorize(Policy = "AgentPolicy")]
        public async Task<IActionResult> DeleteToka(int id)
        {
            try
            {
                var toka = await _context.Tokat.FindAsync(id);
                if (toka == null)
                {
                    return NotFound();
                }

                _context.Tokat.Remove(toka);
                await _context.SaveChangesAsync();

                return Ok(await _context.Tokat.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting data.");
            }
        }
        private bool TokaExists(int id)
        {
            try
            {
                return _context.Tokat.Any(e => e.PronaID == id);
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
