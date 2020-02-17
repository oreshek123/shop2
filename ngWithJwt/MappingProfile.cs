using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DataContext.Identity;
using ngWithJwt.Models;

namespace ngWithJwt
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, AppUser>();
        }
    }
}
