export interface Product {
    id: number,
    title: string,
    description: string,
    category: string,
    price: number,
}

export const Card = ({ title, description, category }: Product) => {
    return (
        <div className="card">
            <h2>{title}</h2>
            <p>{description}</p>
            <div>{category}</div>
        </div>
    );
}