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
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const res = await fetch("https://dummyjson.com/products?limit=10", {
                    signal: controller.signal,
                });
                if (!res.ok) {
                    throw new Error(`HTTP error, status: ${res.status}`);
                }
                const data: ProductObject = await res.json();
                setProducts(data);
            } catch (error: unknown) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
                if (error instanceof Error) {
                    console.error("Error fetching data:", error.message);
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        }
        
        fetchData();

        return () => controller.abort();
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
                <ul className="grid">
                    {filteredProducts?.products.map((product) => (
                        <Card key={product.id} {...product} />
                    ))}
                </ul>
            }
        </div>
    );
}