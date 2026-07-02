export async function getProductsFromJson() {
    try{
        const res = await fetch("./data/products.json");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error al cargar los prodcutos del archivo json", err);
        return [];
    }
}
