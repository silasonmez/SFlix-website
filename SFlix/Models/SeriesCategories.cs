namespace SFlix.Models
{
    public class SeriesCategories
    {
        public int SeriesId { get; set; }
        public Series Series { get; set; }

        public int CategoryId { get; set; }
        public Categories Category { get; set; }
    }
}
