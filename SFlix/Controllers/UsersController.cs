using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SFlix.Models;
using SFlix.Dtos;
using SFlix.Services;
using System.Security.Claims;

namespace SFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public UsersController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var users = dbContext.Users.ToList();
            return Ok(users);
        }

        
        [HttpGet]
        [Route("{userId:int}")]
        public IActionResult GetUserById(int userId)
        {
            var userObj = dbContext.Users.FirstOrDefault(u => u.Id == userId);
            if (userObj is null)
                return NotFound();

            return Ok(userObj);
        }

        
        [HttpPost]
        public IActionResult CreateUser(UsersDto dto)
        {
            if (dto.Password.Length < 8)
            {
                return BadRequest("Parola en az 8 karakter olmalıdır.");
            }
            var user = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password,
                CreatedAt = DateTime.Now,
                IsAdmin = false
            };

            dbContext.Users.Add(user);
            dbContext.SaveChanges();

            return Ok(user);
        }

        
        [HttpPut]
        [Route("{userId:int}")]
        public IActionResult UpdateUser(int userId, UsersDto dto)
        {
            if (dto.Password.Length < 8)
            {
                return BadRequest("Parola en az 8 karakter olmalıdır.");
            }
            var userObj = dbContext.Users.Find(userId);
            if (userObj is null)
                return NotFound();

            userObj.Name = dto.Name;
            userObj.Email = dto.Email;
            userObj.Password = dto.Password;

            dbContext.SaveChanges();

            return Ok(userObj);
        }

        [HttpDelete]
        [Route("{userId:int}")]
        public IActionResult DeleteUser(int userId)
        {
            var userObj = dbContext.Users.Find(userId);
            if (userObj is null)
                return NotFound();

            dbContext.Users.Remove(userObj);
            dbContext.SaveChanges();

            return Ok(userObj);
        }
        [HttpGet]
        [Route("api/Users")]
        public IActionResult GetUserByEmail(string email)
        {
            var user = dbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
                return NotFound(new { message = "Kullanıcı bulunamadı" });

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.IsAdmin
            });
        }
    
 


        [HttpGet]
        [Route("GetUserDetails")]
        public IActionResult GetUserDetails()
        {
            var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(userName))
                return Unauthorized("Kullanıcı giriş yapmamış.");

            
            var user = dbContext.Users.FirstOrDefault(u => u.Name == userName);

            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            return Ok(new
            {
                user.Name,
                user.Email
            });
        }
    }
}  