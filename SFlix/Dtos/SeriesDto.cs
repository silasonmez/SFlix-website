using System.ComponentModel.DataAnnotations;

public class SeriesDto
{
    [Required]
    public string Title { get; set; }

    [Required]
    public int NumberOfSeasons { get; set; }

    [Required]
    public int NumberOfEpisodes { get; set; }

    [Required]
    public double Rating { get; set; }

    public string Description { get; set; }

    [Required]
    public int StartYear { get; set; }

    public int? EndYear { get; set; } 

    [Required]
    public List<int> CategoryIds { get; set; }
}
