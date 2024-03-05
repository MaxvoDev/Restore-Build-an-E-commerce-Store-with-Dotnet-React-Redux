using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _storeContext;
        public BasketController(StoreContext storeContext)
        {
            this._storeContext = storeContext;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();
            return MapToBasketDto(basket);
        }

        private BasketDto MapToBasketDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select((item) => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity){
            var basket = await RetrieveBasket();
            if(basket == null){
                basket = CreateBasket();
            }
            var product = await this._storeContext.Products.FindAsync(productId);
            if(product == null) return NotFound();

            basket.AddItem(product, quantity);

            var result = await _storeContext.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetBasket", MapToBasketDto(basket));

            return BadRequest(new ProblemDetails{ Title = "Problem Saving Item To Basket "});

        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity){
            var basket = await RetrieveBasket();
            if(basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);
            var result = await _storeContext.SaveChangesAsync() > 0;
            if(result)  return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem Remove Item From Basket "});
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOption = new CookieOptions{
                IsEssential = true,
                Expires = DateTime.Now.AddDays(3),
            };
            Response.Cookies.Append("buyerId", buyerId, cookieOption);

            var basket = new Basket{
                BuyerId = buyerId
            };
            _storeContext.Baskets.Add(basket);
            return basket;
        }

        private async Task<Basket> RetrieveBasket(){
            return await this._storeContext.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }
    }
}