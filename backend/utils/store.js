// In-memory stores (replace with DB in production)
const users = []
const products = []
let siteDetailsStore = {}

module.exports = { users, products, getSiteDetails: () => siteDetailsStore, setSiteDetails: (data) => { siteDetailsStore = { ...data } } }
