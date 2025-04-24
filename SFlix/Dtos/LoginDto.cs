using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SFlix.Dtos
{
    public class LoginDto
    {

        [Required(ErrorMessage = "Kullanıcı adı gereklidir")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Şifre alanı gereklidir")]
        public required string Password { get; set; }
    }
}