using Application.Features.Sell_Rent;
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
    public class RentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet, Authorize(Policy = "AgentPolicy")]
        public async Task<IActionResult> GetAllSales()
        {
            var sales = await _context.Set<Rent>()
                .Include(s => s.Users)
                .Include(s => s.Pronat)
                .ToListAsync();

            return Ok(sales);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> GetRentByUserId(string id)
        {
            var rents = await _context.Rents
                .Include(s => s.Users)
                .Include(s => s.Pronat)
                .Where(s => s.UserID == id)
                .ToListAsync();

            if (rents == null || !rents.Any())
            {
                return NotFound("No rent found for the given user.");
            }

            return Ok(rents);
        }

        [HttpPost, Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> CreateSale([FromQuery] string userId, [FromQuery] int pronaId, [FromQuery] double koheZgjatja, [FromQuery] DateTime bookingDate, [FromQuery] string paymentMethod)
        {
            try
            {
                if (string.IsNullOrEmpty(userId) || pronaId <= 0)
                {
                    return BadRequest("Invalid userId or pronaId.");
                }

                var rent = new Rent
                {
                    BookingDate = bookingDate,
                    PaymentMethod = paymentMethod,
                    UserID = userId,
                    PronaID = pronaId
                };

                var user = await _context.Users.FindAsync(userId);
                var property = await _context.Pronas.FindAsync(pronaId);

                if (user == null || property == null)
                {
                    return BadRequest("User or Property not found.");
                }

                rent.Users = user;
                rent.Pronat = property;

                if (!TryValidateModel(rent))
                {
                    return BadRequest(ModelState);
                }

                var rentFeature = new RentFeature(_context);
                var kontrataFeature = new KontrataFeature(_context);
                var createdRent = await rentFeature.CreateRentAsync(userId, pronaId, rent);
                var createdKontrata = await kontrataFeature.CreateKontrataRentAsync(userId, pronaId);

                return CreatedAtAction(nameof(GetRentByUserId), new { id = createdRent.RentId }, createdRent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}"), Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> UpdateSale(int id, [FromBody] Rent rent)
        {
            if (id != rent.RentId)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(rent).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                if (!RentExists(id))
                {
                    return NotFound("Rent not found.");
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}"), Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> DeleteRent(int id)
        {
            var rent = await _context.Set<Rent>().FindAsync(id);

            if (rent == null)
            {
                return NotFound("Rent not found.");
            }

            _context.Set<Rent>().Remove(rent);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool RentExists(int id)
        {
            return _context.Set<Rent>().Any(s => s.RentId == id);
        }
    }
}