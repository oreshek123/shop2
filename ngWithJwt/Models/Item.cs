using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataContext.Data;

namespace ngWithJwt.Models
{
    public class Item
    {
        public Product Product { get; set; }

        public int Quantity { get; set; }
    }
}
