import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { Card, Product } from "./Card";

interface ProductObject {
    products: Product[];
}

export const Page = () => {
    const [products, setProducts] = useState<ProductObject | null>(null);
    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const deferredQuery = useDeferredValue(query);

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
                setError("Could not load products. Please try again later.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => controller.abort();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!products) return null;

        const queryFiltered = deferredQuery.trim().toLowerCase();
        return {
            products: products.products.filter((product) => {
                return product.title.toLowerCase().includes(queryFiltered) ||
                    product.description.toLowerCase().includes(queryFiltered) ||
                    product.category.toLowerCase().includes(queryFiltered);
            }),
        };
    }, [products, deferredQuery]);

    return (
        <div>
            <input
                className="search"
                type="search" 
                aria-label="Search products"
                placeholder="search box"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            {loading && <p role="status">Loading...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && (
                <ul className="grid">
                    {filteredProducts?.products.map((product) => (
                        <Card key={product.id} {...product} />
                    ))}
                </ul>
            )}
        </div>
    );
}
