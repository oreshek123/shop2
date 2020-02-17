using System;
using System.Collections.Generic;
using System.Text;
using Autofac;
using DataContext.Data;

namespace DataContext.Repository
{
    public class AutofacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ShopDataContext>().AsSelf().InstancePerLifetimeScope();
        }
    }
}
