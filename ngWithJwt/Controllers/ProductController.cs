using System;
using System.Collections;
using System.Collections.Generic;
using DataContext.Data;
using DataContext.Data.Repository;
using Microsoft.AspNetCore.Mvc;

namespace ngWithJwt.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly Lazy<IRepository<Product>> _productRepository;
        public ProductController(Lazy<IRepository<Product>> productRepository)
        {
            _productRepository = productRepository;
        }
        [HttpGet]
        public IEnumerable<Product> GetProducts()
        {
            return _productRepository.Value.GetQuery();
        }

        [HttpPost]
        public IActionResult AddProduct([FromBody] Product product)
        {
            product.ShopId = 1;

            _productRepository.Value.Add(product);
            if (product.Id > 0)
                _productRepository.Value.Update(product);

            _productRepository.Value.SaveChanges();
            return Ok(product.Id);
        }

        [HttpDelete]
        public IActionResult DeleteProduct(int id)
        {
            var p = _productRepository.Value.FirstOrDefault(t => t.Id == id);
            _productRepository.Value.Delete(p);
            _productRepository.Value.SaveChanges();

            return Ok(p.Id);
        }
    }
}