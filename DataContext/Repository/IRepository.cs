using System;
using System.Linq;
using System.Linq.Expressions;

namespace DataContext.Data.Repository
{
    public interface IRepository<TEntity> : IDisposable
        where TEntity : class, IEntityBase
    {
        IQueryable<TEntity> GetQuery();
        TEntity Add(TEntity entity);
        TEntity FirstOrDefault(Expression<Func<TEntity, bool>> predicate);
        void Delete(TEntity entity);
        TEntity Update(TEntity entity);
        void SaveChanges();
    }

    public interface IEntityBase
    {
        int Id { get; set; }
    }
}