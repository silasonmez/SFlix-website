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
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public CategoriesController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        
        [HttpGet]
        public IActionResult GetAllCategories()
        {
            var categories = dbContext.Categories.ToList();
            return Ok(categories);
        }

        
        [HttpGet]
        [Route("{categoryId:int}")]
        public IActionResult GetCategoryById(int categoryId)
        {
            var categoryObj = dbContext.Categories.FirstOrDefault(c => c.Id == categoryId);
            if (categoryObj is null)
                return NotFound();

            return Ok(categoryObj);
        }

        
        [HttpPost]
        public IActionResult CreateCategory(CategoriesDto dto)
        {
            var category = new Categories
            {
                Name = dto.Name
            };

            dbContext.Categories.Add(category);
            dbContext.SaveChanges();

            return Ok(category);
        }

        
        [HttpPut]
        [Route("{categoryId:int}")]
        public IActionResult UpdateCategory(int categoryId, CategoriesDto dto)
        {
            var categoryObj = dbContext.Categories.Find(categoryId);
            if (categoryObj is null)
                return NotFound();

            categoryObj.Name = dto.Name;

            dbContext.SaveChanges();

            return Ok(categoryObj);
        }

        
        [HttpDelete]
        [Route("{categoryId:int}")]
        public IActionResult DeleteCategory(int categoryId)
        {
            var categoryObj = dbContext.Categories.Find(categoryId);
            if (categoryObj is null)
                return NotFound();

            dbContext.Categories.Remove(categoryObj);
            dbContext.SaveChanges();

            return Ok(categoryObj);
        }
    }
}
