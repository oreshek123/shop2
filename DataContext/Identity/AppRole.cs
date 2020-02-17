using System;
using System.Collections.Generic;
using System.Text;
using DataContext.Data.Repository;
using DataContext.Repository;
using Microsoft.AspNetCore.Identity;

namespace DataContext.Identity
{
    public class AppRole : IdentityRole<int>, IEntityBase, IShopRepository
    {
        public virtual ICollection<AppUserRole> UserRoles { get; set; }
    }
    public class AppRoleClaim : IdentityRoleClaim<int>
    {
    }
}
