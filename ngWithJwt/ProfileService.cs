using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DataContext.Data.Repository;
using DataContext.Identity;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace ngWithJwt
{
    public interface IUserClaimsService
    {
        Task<List<Claim>> GetUserClaims(AppUser user);
    }

    public class ProfileService : IProfileService, IUserClaimsService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IRepository<AppUser> _appUserRepository;

        public ProfileService(UserManager<AppUser> userManager,
            IRepository<AppUser> appUserRepository)
        {
            _appUserRepository = appUserRepository;
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var user = await _userManager.GetUserAsync(context.Subject);
            var newClaims = await GetUserClaims(user);

            context.IssuedClaims.AddRange(newClaims);
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var user = await _userManager.GetUserAsync(context.Subject);
            context.IsActive = user != null;
        }

        public async Task<List<Claim>> GetUserClaims(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var roleName = roles != null && roles.ToList().Any() ? roles.First() : string.Empty;

            var userData = _appUserRepository.GetQuery()
                .FirstOrDefault(p => p.Id == user.Id);

            var newClaims = new List<Claim>
            {
                new Claim("family_name", user.FamilyName),
                new Claim("given_name", user.GivenName),
                new Claim("name", user.UserName),
                new Claim("preferred_username", user.UserName),
                new Claim("role", roleName),
            };

            return newClaims;
        }
    }
}
