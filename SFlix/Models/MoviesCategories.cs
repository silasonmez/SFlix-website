namespace SFlix.Models
{
    public class MoviesCategories
    {
        public int MovieId { get; set; }
        public Movies Movie { get; set; }

        public int CategoryId { get; set; }
        public Categories Category { get; set; }
    }
}
