using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DataContext.Data.Repository;
using DataContext.Repository;

namespace DataContext.Data
{
    public class Product : EntityBase, IShopRepository
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public string SerialNumber { get; set; }
        public int ShopId { get; set; }

        [ForeignKey("ShopId")]
        [InverseProperty("Products")]
        public virtual Shop Shop { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<UserProductHistory> UserProductHistories { get; set; }
    }
}