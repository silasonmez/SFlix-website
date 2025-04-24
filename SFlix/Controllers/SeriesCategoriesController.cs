using Microsoft.AspNetCore.Mvc;
using SFlix.Dtos;
using SFlix.Models;
using SFlix.Services;
using Microsoft.EntityFrameworkCore;


namespace SFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeriesCategoriesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public SeriesCategoriesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public IActionResult AddSeriesCategories(SeriesCategoriesDto dto)
        {
            var SeriesCategories = new SeriesCategories
            {
                SeriesId = dto.SeriesId,
                CategoryId = dto.CategoryId
            };

            _dbContext.SeriesCategories.Add(SeriesCategories);
            _dbContext.SaveChanges();

            return Ok(SeriesCategories);
        }
        [HttpGet]
        public IActionResult GetAllSeriesCategories()
        {
            var seriesCategories = _dbContext.SeriesCategories
                .Include(sc => sc.Series) 
                .Include(sc => sc.Category) 
                .ToList();

            return Ok(seriesCategories);
        }
        [HttpGet("series/{seriesId}")]
        public IActionResult GetCategoriesForSeries(int seriesId)
        {
            var categories = _dbContext.SeriesCategories
                .Where(sc => sc.SeriesId == seriesId)
                .Include(sc => sc.Category)
                .Select(sc => sc.Category) 
                .ToList();

            return Ok(categories);
        }
        [HttpGet("category/{categoryId}")]
        public IActionResult GetSeriesForCategory(int categoryId)
        {
            var series = _dbContext.SeriesCategories
                .Where(sc => sc.CategoryId == categoryId)
                .Include(sc => sc.Series)
                .Select(sc => sc.Series) 
                .ToList();

            return Ok(series);
        }
        
    }
}
