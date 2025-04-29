using Application.Interface;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Sell_Rent
{
    public class RentFeature
    {
        private readonly IAppDbContext _context;

        public RentFeature(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Rent> CreateRentAsync(string userId, int pronaId, Rent rent)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found.");

            var prona = await _context.Pronas.FindAsync(pronaId);
            if (prona == null)
                throw new Exception("Property not found.");

            if (prona.Status != "Available")
                throw new Exception("Property is not Available.");

            if (prona.Type != "Rent")
                throw new Exception("Property is not for Rent, it is for Sale.");

            rent.UserID = userId;
            rent.PronaID = pronaId;
            rent.Users = user;
            rent.Pronat = prona;

            prona.Status = "Unavailable";

            _context.Rents.Add(rent);
            await _context.SaveChangesAsync();

            return rent;
        }
    }
}
