using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace CRUDAspEntity.Models
{
    public class PersonalInfo
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public int Age { get; set; }

        [Required]
        public string Grade { get; set; }
    }
}