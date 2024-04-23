export default function schemaMiddleware(next) {
    this.populate("products.product");
    next();
}