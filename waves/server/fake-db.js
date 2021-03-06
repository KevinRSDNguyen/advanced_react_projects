const { User } = require("./models/user");
const { Brand } = require("./models/brand");
const { Wood } = require("./models/wood");
const { Product } = require("./models/product");
const { Site } = require("./models/site");

const fakeDbData = require("./data.json");

class FakeDb {
  constructor() {
    this.brands = fakeDbData.brands;
    this.brandsDocs = [];
    this.woods = fakeDbData.woods;
    this.woodsDocs = [];
    this.users = fakeDbData.users;
    this.products = fakeDbData.products;
    this.site = fakeDbData.sites[0];
  }
  async cleanDb() {
    await User.remove({});
    await Brand.remove({});
    await Wood.remove({});
    await Product.remove({});
    await Site.remove({});
    return "Finished";
  }
  pushDataToDb() {
    const user = new User(this.users[0]);
    const site = new Site(this.site);

    this.brands.forEach(brand => {
      const newBrand = new Brand(brand);
      this.brandsDocs.push(newBrand);
      newBrand.save();
    });

    this.woods.forEach(wood => {
      const newWood = new Wood(wood);
      this.woodsDocs.push(newWood);
      newWood.save();
    });

    this.products.forEach(product => {
      const newProduct = new Product(product);
      newProduct.brand = this.brandsDocs[
        Math.floor(Math.random() * Math.floor(this.brandsDocs.length))
      ];
      newProduct.wood = this.woodsDocs[
        Math.floor(Math.random() * Math.floor(this.woodsDocs.length))
      ];
      newProduct.save();
    });

    user.save();
    site.save();
  }
  seedDb() {
    this.cleanDb().then(() => {
      this.pushDataToDb();
    });
  }
}

module.exports = FakeDb;
