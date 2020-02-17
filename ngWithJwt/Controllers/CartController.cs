using System;
using System.Collections.Generic;
using System.Linq;
using DataContext.Data;
using DataContext.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using ngWithJwt.Helpers;
using ngWithJwt.Models;

namespace ngWithJwt.Controllers
{
    [Route("api/[controller]")]
    public class CartController : Controller
    {
        private readonly Lazy<IRepository<Product>> _productRepository;

        //public CartController(Lazy<IRepository<Product>> productRepository)
        //{
        //    _productRepository = productRepository;
        //}

        [HttpGet]
        public IActionResult GetCard()
        {
            var cart = HttpContext.Session.GetObjectFromJson<List<Item>>("cart");
            var total = 0D;
            if (cart != null)
                total = cart.Sum(item => item.Product.Price * item.Quantity);
            return Ok(new
            {
                cart,
                total
            });
        }

        [HttpPost]
        public IActionResult Buy([FromBody] Product product)
        {
            ////var product = _productRepository.Value.FirstOrDefault(t => t.Id == id);
            var cart = HttpContext.Session.GetObjectFromJson<List<Item>>("cart");
            if (cart == null)
            {
                cart = new List<Item> { new Item { Product = product, Quantity = 1 } };
                HttpContext.Session.SetObjectAsJson("cart", cart);
            }
            else
            {
                var index = cart.FindIndex(t => t.Product.Id == product.Id);
                if (index > 0)
                    cart[index].Quantity++;
                else
                    cart.Add(new Item { Product = product, Quantity = 1 });

                HttpContext.Session.SetObjectAsJson("cart", cart);
            }

            return Ok();
        }

        [HttpDelete]
        public IActionResult Remove(int id)
        {
            List<Item> cart = HttpContext.Session.GetObjectFromJson<List<Item>>("cart");
            var index = cart.FindIndex(t => t.Product.Id == id);
            cart.RemoveAt(index);
            HttpContext.Session.SetObjectAsJson("cart", cart);
            return Ok();
        }

    }
}