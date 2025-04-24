using Microsoft.AspNetCore.Mvc;
using SFlix.Dtos;
using SFlix.Models;
using SFlix.Services;
using Microsoft.EntityFrameworkCore;

namespace SFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesCategoriesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public MoviesCategoriesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public IActionResult AddMoviesCategories(MoviesCategoriesDto dto)
        {
            var MoviesCategories = new MoviesCategories
            {
                MovieId = dto.MovieId,
                CategoryId = dto.CategoryId
            };

            _dbContext.MoviesCategories.Add(MoviesCategories);
            _dbContext.SaveChanges();

            return Ok(MoviesCategories);
        }

        [HttpGet]
        public IActionResult GetAllMoviesCategories()
        {
            var MoviesCategories = _dbContext.MoviesCategories
                .Include(mc => mc.Movie) 
                .Include(mc => mc.Category) 
                .ToList();

            return Ok(MoviesCategories);
        }
        [HttpGet("movie/{movieId}")]
        public IActionResult GetCategoriesForMovie(int movieId)
        {
            var categories = _dbContext.MoviesCategories
                .Where(mc => mc.MovieId == movieId)
                .Include(mc => mc.Category)
                .Select(mc => mc.Category) 
                .ToList();

            return Ok(categories);
        }
        [HttpGet("category/{categoryId}")]
        public IActionResult GetMoviesForCategory(int categoryId)
        {
            var movies = _dbContext.MoviesCategories
                .Where(mc => mc.CategoryId == categoryId)
                .Include(mc => mc.Movie)
                .Select(mc => mc.Movie) 
                .ToList();

            return Ok(movies);
        }
    }
}
