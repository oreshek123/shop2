using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DataContext.Repository;

namespace DataContext.Data
{
    public class Shop: EntityBase, IShopRepository
    {
        public string Name { get; set; }

        [InverseProperty("Shop")]
        public virtual ICollection<Product> Products { get; set; }
    }
}