namespace SFlix.Models
{
    public class Movies
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int ReleaseYear { get; set; }
        public string Duration { get; set; } 
        public double? ImdbRating { get; set; }
        public string Description { get; set; }

        // Many-to-Many ilişkisi
        public ICollection<MoviesCategories> MoviesCategories { get; set; }
    }
}
