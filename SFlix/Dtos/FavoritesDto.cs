namespace SFlix.Dtos
{
    public class FavoritesDto
    {
        public string Title { get; set; } // Favori başlığı (zorunlu alan)
        public string Description { get; set; } // Favori açıklaması (opsiyonel alan)
        public string Type { get; set; } // Tür ("Film" veya "Dizi")
    }
}