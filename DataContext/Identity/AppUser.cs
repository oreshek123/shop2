using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DataContext.Data;
using DataContext.Data.Repository;
using DataContext.Repository;
using Microsoft.AspNetCore.Identity;

namespace DataContext.Identity
{
    public class AppUser : IdentityUser<int>, IEntityBase, IShopRepository
    {
        
        /// <summary>Given name(s) or first name(s) of the End-User.</summary>
        public virtual string GivenName { get; set; }
        /// <summary>Surname(s) or last name(s) of the End-User.</summary>
        public virtual string FamilyName { get; set; }

        public virtual ICollection<AppUserRole> UserRoles { get; set; }
        [InverseProperty("User")]
        public virtual ICollection<UserProductHistory> UserProductHistories { get; set; }

    }

    public class AppUserLogin : IdentityUserLogin<int>
    {
    }

    public class AppUserToken : IdentityUserToken<int>
    {
    }

    public class AppUserRole : IdentityUserRole<int>, IEntityBase, IShopRepository
    {
        [NotMapped]
        public int Id { get; set; }

        public virtual AppUser User { get; set; }
        public virtual AppRole Role { get; set; }
    }

}
