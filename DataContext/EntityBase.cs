using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using DataContext.Data.Repository;
using Microsoft.AspNetCore.Mvc;

namespace DataContext
{
    public class EntityBase:IEntityBase
    {
        [Display(Name = "№")]
        [HiddenInput]
        public int Id { get; set; }
    }
}
