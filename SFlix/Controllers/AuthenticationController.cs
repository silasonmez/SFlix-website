using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SFlix.Dtos;
using SFlix.Models;
using SFlix.Services;

namespace SFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private static readonly TimeSpan TokenLifeTime = TimeSpan.FromHours(8);
        private readonly IConfiguration configuration;
        private readonly AppDbContext dbContext;

        public AuthenticationController(AppDbContext dbContext, IConfiguration configuration)
        {
            this.configuration = configuration;
            this.dbContext = dbContext;
        }

      
        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            
            var user = dbContext.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null)
            {
                Console.WriteLine("Kullanıcı bulunamadı.");
                return Unauthorized("Kullanıcı Bulunamadı.");
            }
          
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                Console.WriteLine($"Düz şifre: {dto.Password}");
                Console.WriteLine($"Şifre eşleşmedi. Düz şifre: {dto.Password}, Hash: {user.Password}");
                return Unauthorized("Geçersiz Şifre.");
            }
            
            Console.WriteLine("Şifre doğrulama başarılı.");

            var jwtKey = "SuperGucluVeUzunBirJWTKey12345678901234567890"; 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

           
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Name),                      
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")  
            };

           
            var token = new JwtSecurityToken(
                issuer: "sila",              
                audience: "sflix.com",        
                claims: claims,               
                expires: DateTime.Now.AddHours(1), 
                signingCredentials: creds   
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.WriteToken(token);

            HttpContext.Response.Cookies.Append("token", tokenString, new CookieOptions
            {
                Expires = DateTime.Now.AddDays(7),
                HttpOnly = true
            });

            
            return Ok(new
            { 
                UserId = user.Id,
                Mail = user.Email,
                Token = tokenString,
                Role = user.IsAdmin ? "Admin" : "User",

            });
        }

        
        [HttpPost("Register")]
        public IActionResult Register([FromBody] UsersDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            
            if (dbContext.Users.Any(u => u.Email == dto.Email))
                return BadRequest(new { message = "Bu email zaten mevcut." });

           
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var userObj = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = hashedPassword,
                IsAdmin = false 
            };

            dbContext.Users.Add(userObj);
            dbContext.SaveChanges();

            return Ok(new { message = "Kullanıcı başarıyla kaydedildi.", user = userObj });
        }

 
        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            HttpContext.Response.Cookies.Append("token", "", new CookieOptions
            {
                Expires = DateTime.Now.AddDays(-1),
                HttpOnly = true
            });
            return Ok();
        }
    }
}
