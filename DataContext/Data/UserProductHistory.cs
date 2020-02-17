using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DataContext.Identity;
using DataContext.Repository;

namespace DataContext.Data
{
    public class UserProductHistory: EntityBase, IShopRepository
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        [InverseProperty("UserProductHistories")]
        public virtual Product Product { get; set; }
        [ForeignKey("UserId")]
        [InverseProperty("UserProductHistories")]
        public virtual AppUser User { get; set; }
    }
}