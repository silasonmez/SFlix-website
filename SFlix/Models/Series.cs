namespace SFlix.Models
{
    public class Series
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int NumberOfSeasons { get; set; }
        public int NumberOfEpisodes { get; set; }
        public double? Rating { get; set; }
        public string Description { get; set; }
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }

        // Many-to-Many ilişkisi
        public ICollection<SeriesCategories> SeriesCategories { get; set; }

    }
}
