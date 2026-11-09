import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { Card, Product } from "./Card";

interface ProductObject {
    products: Product[],
}

export const Page = () => {
    const [products, setProducts] = useState<ProductObject | null>(null);
    const [query, setQuery] = useState<string>("");
    const deferedQuery = useDeferredValue(query);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://dummyjson.com/products?limit=10");
                if (!res.ok) {
                    throw new Error(`HTTP error, status: ${res.status}`);
                }
                const data: ProductObject = await res.json();
                setProducts(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error fetching data:", error.message);
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        }
        
        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!products) return null;

        const queryFiltered = deferedQuery.trim().toLowerCase();
        return {
            products: products.products.filter((product) => {
                return product.title.toLowerCase().includes(queryFiltered) ||
                    product.description.toLowerCase().includes(queryFiltered) ||
                    product.category.toLowerCase().includes(queryFiltered);
            }),
        };
    }, [products, deferedQuery]);

    return (
        <div>
            <input className="search" type="text" placeholder="search box" value={query} onChange={(event) => setQuery(event.target.value)}/>
            {
                <div className="grid">
                    {filteredProducts?.products.map((product) => (
                        <Card key={product.id} {...product} />
                    ))}
                </div>
            }
        </div>
    );
}