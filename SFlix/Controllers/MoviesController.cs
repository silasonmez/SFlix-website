using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SFlix.Models;
using SFlix.Dtos;
using SFlix.Services;

namespace SFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public MoviesController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        
        [HttpGet]
        public IActionResult GetAllMovies()
        {
            var movies = dbContext.Movies
                .Include(m => m.MoviesCategories)
                    .ThenInclude(mc => mc.Category) 
                .Select(m => new
                {
                    m.Id,
                    m.Title,
                    m.ReleaseYear,
                    m.Duration,
                    m.ImdbRating,
                    m.Description,
                    Categories = m.MoviesCategories.Select(mc => new 
                    {
                        mc.Category.Id,
                        mc.Category.Name
                    })
                }).ToList();

            return Ok(movies);
        }

        
        [HttpGet("{movieId:int}")]
        public IActionResult GetMovieById(int movieId)
        {
            var movie = dbContext.Movies
                .Include(m => m.MoviesCategories)
                    .ThenInclude(mc => mc.Category)
                .Where(m => m.Id == movieId)
                .Select(m => new
                {
                    m.Id,
                    m.Title,
                    m.ReleaseYear,
                    m.Duration,
                    m.ImdbRating,
                    m.Description,
                    Categories = m.MoviesCategories.Select(mc => new 
                    {
                        mc.Category.Id,
                        mc.Category.Name
                    })
                }).FirstOrDefault();

            if (movie == null)
                return NotFound();

            return Ok(movie);
        }

        [HttpPost]
        public IActionResult CreateMovie(MoviesDto dto)
        {
            var movie = new Movies
            {
                Title = dto.Title,
                ReleaseYear = dto.ReleaseYear,
                Duration = dto.Duration,
                ImdbRating = dto.ImdbRating,
                Description = dto.Description,
                MoviesCategories = dto.CategoryIds.Select(catId => new MoviesCategories
                {
                    CategoryId = catId
                }).ToList()
            };

            dbContext.Movies.Add(movie);
            dbContext.SaveChanges();

            return Ok(movie);
        }

        
        [HttpPut]
        [Route("{movieId:int}")]
        public IActionResult UpdateMovie(int movieId, MoviesDto dto)
        {
            var movie = dbContext.Movies.Find(movieId);
            if (movie is null)
                return NotFound();

            movie.Title = dto.Title;
            movie.ReleaseYear = dto.ReleaseYear;
            movie.Duration = dto.Duration;
            movie.ImdbRating = dto.ImdbRating;
            movie.Description = dto.Description;

            dbContext.SaveChanges();

            return Ok(movie);
        }

        [HttpDelete]
        [Route("{movieId:int}")]
        public IActionResult DeleteMovie(int movieId)
        {
            var movie = dbContext.Movies
                .Include(m => m.MoviesCategories) 
                .FirstOrDefault(m => m.Id == movieId);

            if (movie == null)
                return NotFound(new { message = "Film bulunamadı." });

            
            dbContext.MoviesCategories.RemoveRange(movie.MoviesCategories);

            
            dbContext.Movies.Remove(movie);
            dbContext.SaveChanges();

            return Ok(new { message = "Film başarıyla silindi." });
        }

        
        [HttpGet("category/{categoryId:int}")]
        public IActionResult GetMoviesByCategory(int categoryId)
        {
            var movies = dbContext.MoviesCategories
                .Where(mc => mc.CategoryId == categoryId)
                .Include(mc => mc.Movie)
                    .ThenInclude(m => m.MoviesCategories)
                        .ThenInclude(mc => mc.Category) 
                .Select(mc => new
                {
                    mc.Movie.Id,
                    mc.Movie.Title,
                    mc.Movie.ReleaseYear,
                    mc.Movie.Duration,
                    mc.Movie.ImdbRating,
                    mc.Movie.Description,
                    Categories = mc.Movie.MoviesCategories.Select(c => new 
                    {
                        c.Category.Id,
                        c.Category.Name
                    })
                }).ToList();

            return Ok(movies);
        }

    }
}
