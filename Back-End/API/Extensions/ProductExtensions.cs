using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy){
            if(!string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            query = orderBy switch{
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderBy(p => p.Price),
                "name" => query.OrderBy(p => p.Name)
            };

            return query;
        }
    }
}