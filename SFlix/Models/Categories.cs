namespace SFlix.Models
{
    public class Categories
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Many-to-Many ilişkisi
        public ICollection<MoviesCategories> MoviesCategories { get; set; }
        public ICollection<SeriesCategories> SeriesCategories { get; set; }
    }
}
