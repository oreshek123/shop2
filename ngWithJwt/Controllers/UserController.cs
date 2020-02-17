using System;
using AutoMapper;
using DataContext.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ngWithJwt.Models;

namespace ngWithJwt.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public UserController(UserManager<AppUser> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        // api/user/GetUserData
        [HttpGet]
        [Route("GetUserData")]
        [Authorize(Policy = Policies.User)]
        public IActionResult GetUserData()
        {
            return Ok("This is an normal user");
        }

        [HttpGet]
        [Route("GetAdminData")]
        [Authorize(Policy = Policies.Admin)]
        public IActionResult GetAdminData()
        {
            return Ok("This is an Admin user");
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("Register")]
        public IActionResult Register([FromBody] User model)
        {
            if (!model.Password.Equals(model.ConfirmedPassword))
            {
                throw new ArgumentException("Пароли должны совпадать");
            }

            var create = _mapper.Map<User, AppUser>(model);

            try
            {
                var created = _userManager.CreateAsync(create, model.Password).Result;
                if (created.Succeeded)
                    _userManager?.AddToRoleAsync(create, "User");
                return Ok(create.Id);
            }
            catch (Exception ex)
            {
                return BadRequest("Не удалось сохранить данные пользователя");
            }
        }


        [HttpPost]
        [Route("IsUniqueUserName")]
        public bool IsUniqueUserName([FromBody] User data)
        {
            return _userManager.FindByNameAsync(data.UserName).Result == null;
        }
    }
}
