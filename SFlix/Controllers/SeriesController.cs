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
    public class SeriesController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public SeriesController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        
        [HttpGet]
        public IActionResult GetAllSeries()
        {
            var series = dbContext.Series
                .Include(s => s.SeriesCategories)
                    .ThenInclude(sc => sc.Category)
                .Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.NumberOfSeasons,
                    s.NumberOfEpisodes,
                    s.StartYear,
                    s.EndYear,
                    s.Rating,
                    s.Description,
                    Categories = s.SeriesCategories.Select(sc => new 
                    {
                        sc.Category.Id,
                        sc.Category.Name
                    })
                }).ToList();

            return Ok(series);
        }

        
        [HttpGet("{seriesId:int}")]
        public IActionResult GetSeriesById(int seriesId)
        {
            var seriesObj = dbContext.Series
                .Include(s => s.SeriesCategories)
                    .ThenInclude(sc => sc.Category)
                .Where(s => s.Id == seriesId)
                .Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.NumberOfSeasons,
                    s.NumberOfEpisodes,
                    s.StartYear,
                    s.EndYear,
                    s.Rating,
                    s.Description,
                    Categories = s.SeriesCategories.Select(sc => new 
                    {
                        sc.Category.Id,
                        sc.Category.Name
                    })
                }).FirstOrDefault();

            if (seriesObj == null)
                return NotFound();

            return Ok(seriesObj);
        }


        [HttpPost]
        public IActionResult CreateSeries(SeriesDto dto)
        {
            if (dto == null)
                return BadRequest("Series data cannot be null.");

            if (string.IsNullOrEmpty(dto.Title))
                return BadRequest("Title is required.");

            if (dto.CategoryIds == null || !dto.CategoryIds.Any())
                return BadRequest("At least one category must be provided.");

            try
            {
                var series = new Series
                {
                    Title = dto.Title,
                    NumberOfSeasons = dto.NumberOfSeasons,
                    NumberOfEpisodes = dto.NumberOfEpisodes,
                    Rating = dto.Rating,
                    Description = dto.Description,
                    StartYear = dto.StartYear,
                    EndYear = dto.EndYear,
                    SeriesCategories = dto.CategoryIds.Select(catId => new SeriesCategories
                    {
                        CategoryId = catId
                    }).ToList()
                };

                dbContext.Series.Add(series);
                dbContext.SaveChanges();

                return Ok(series);
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, $"Database update error: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        
        [HttpPut]
        [Route("{seriesId:int}")]
        public IActionResult UpdateSeries(int seriesId, SeriesDto dto)
        {
            var seriesObj = dbContext.Series.Find(seriesId);
            if (seriesObj is null)
                return NotFound();

            seriesObj.Title = dto.Title;
            seriesObj.NumberOfSeasons = dto.NumberOfSeasons;
            seriesObj.NumberOfEpisodes = dto.NumberOfEpisodes;
            seriesObj.Rating = dto.Rating;
            seriesObj.Description = dto.Description;
            seriesObj.StartYear = dto.StartYear;
            seriesObj.EndYear = dto.EndYear;

            dbContext.SaveChanges();

            return Ok(seriesObj);
        }

        
        [HttpDelete]
        [Route("{seriesId:int}")]
        public IActionResult DeleteSeries(int seriesId)
        {
            var series = dbContext.Series
                .Include(s => s.SeriesCategories) 
                .FirstOrDefault(s => s.Id == seriesId);

            if (series == null)
                return NotFound(new { message = "Dizi bulunamadı." });

            
            dbContext.SeriesCategories.RemoveRange(series.SeriesCategories);

            
            dbContext.Series.Remove(series);
            dbContext.SaveChanges();

            return Ok(new { message = "Dizi başarıyla silindi." });
        }


        [HttpGet("category/{categoryId:int}")]
        public IActionResult GetSeriesByCategory(int categoryId)
        {
            var series = dbContext.SeriesCategories
                .Where(sc => sc.CategoryId == categoryId)
                .Include(sc => sc.Series)
                    .ThenInclude(s => s.SeriesCategories)
                        .ThenInclude(sc => sc.Category) 
                .Select(sc => new
                {
                    sc.Series.Id,
                    sc.Series.Title,
                    sc.Series.NumberOfSeasons,
                    sc.Series.NumberOfEpisodes,
                    sc.Series.StartYear,
                    sc.Series.EndYear,
                    sc.Series.Rating,
                    sc.Series.Description,
                    Categories = sc.Series.SeriesCategories.Select(c => new
                    {
                        c.Category.Id,
                        c.Category.Name
                    })
                }).ToList();

            return Ok(series);
        }

    }
}
