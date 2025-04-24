using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SFlix.Models;
using SFlix.Services;

namespace SFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public FavoritesController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        
        [HttpGet]
        public IActionResult GetAllFavorites()
        {
            var favorites = dbContext.Favorites
                .Select(f => new
                {
                    f.Id,
                    f.Title,
                    f.Description,
                    f.Type
                })
                .ToList();

            return Ok(favorites);
        }

        
        [HttpGet]
        [Route("{favoriteId:int}")]
        public IActionResult GetFavoriteById(int favoriteId)
        {
            var favoriteObj = dbContext.Favorites
                .Where(f => f.Id == favoriteId)
                .Select(f => new
                {
                    f.Id,
                    f.Title,
                    f.Description,
                    f.Type
                })
                .FirstOrDefault();

            if (favoriteObj is null)
                return NotFound();

            return Ok(favoriteObj);
        }

        
        [HttpPost]
        public IActionResult CreateFavorite([FromBody] Favorites favorite)
        {
            if (string.IsNullOrWhiteSpace(favorite.Title) || 
                string.IsNullOrWhiteSpace(favorite.Type) || 
                (favorite.Type != "Film" && favorite.Type != "Dizi"))
            {
                return BadRequest("Geçerli bir 'Title' ve 'Type' (Film/Dizi) girilmelidir.");
            }

            dbContext.Favorites.Add(favorite);
            dbContext.SaveChanges();

            return Ok(favorite);
        }

        
        [HttpPut]
        [Route("{favoriteId:int}")]
        public IActionResult UpdateFavorite(int favoriteId, [FromBody] Favorites favorite)
        {
            var favoriteObj = dbContext.Favorites.Find(favoriteId);
            if (favoriteObj is null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(favorite.Title) || 
                string.IsNullOrWhiteSpace(favorite.Type) || 
                (favorite.Type != "Film" && favorite.Type != "Dizi"))
            {
                return BadRequest("Geçerli bir 'Title' ve 'Type' (Film/Dizi) girilmelidir.");
            }

            favoriteObj.Title = favorite.Title;
            favoriteObj.Description = favorite.Description;
            favoriteObj.Type = favorite.Type;

            dbContext.SaveChanges();

            return Ok(favoriteObj);
        }

        
        [HttpDelete]
        [Route("{favoriteId:int}")]
        public IActionResult DeleteFavorite(int favoriteId)
        {
            var favoriteObj = dbContext.Favorites.Find(favoriteId);
            if (favoriteObj is null)
                return NotFound();

            dbContext.Favorites.Remove(favoriteObj);
            dbContext.SaveChanges();

            return Ok(favoriteObj);
        }
    }
}