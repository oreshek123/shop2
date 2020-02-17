using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using DataContext.Data.Repository;
using Microsoft.EntityFrameworkCore;

namespace DataContext.Repository
{
    public class BaseRepository<TDbContext, TEntity> : IRepository<TEntity>
        where TEntity : class, IEntityBase
        where TDbContext : DbContext
    {
        protected readonly Lazy<TDbContext> _dbContext;
        private readonly Lazy<DbSet<TEntity>> _dbSet;
        public bool AutoTracking
        {
            set { _dbContext.Value.ChangeTracker.AutoDetectChangesEnabled = value; }
            get { return _dbContext.Value.ChangeTracker.AutoDetectChangesEnabled; }
        }
        public BaseRepository(Lazy<TDbContext> dbContext)
        {
            _dbContext = dbContext;
            _dbSet = new Lazy<DbSet<TEntity>>(() => _dbContext.Value.Set<TEntity>());
        }

        public IQueryable<TEntity> GetQuery()
        {
            return _dbSet.Value;
        }
        public virtual void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_dbContext != null && _dbContext.IsValueCreated)
                {
                    _dbContext.Value.Dispose();
                }
            }
        }
        public virtual TEntity Add(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            return _dbSet.Value.Add(entity).Entity;
        }
        public virtual TEntity FirstOrDefault(Expression<Func<TEntity, bool>> predicate)
        {
            return GetQuery().FirstOrDefault(predicate);
        }
        public virtual void Delete(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            _dbSet.Value.Remove(entity);
        }

        public virtual TEntity Update(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            var edit = Single(e => e.Id == entity.Id);

            _dbContext.Value.Entry(edit).CurrentValues.SetValues(entity);

            return edit;
        }
        public virtual TEntity Single(Expression<Func<TEntity, bool>> predicate)
        {
            return GetQuery().Single(predicate);
        }

        public virtual void SaveChanges()
        {
            if (!AutoTracking)
                _dbContext.Value.ChangeTracker.DetectChanges();
            _dbContext.Value.SaveChanges();
        }
    }
}
