const { User } = require("./models/user");
const { Brand } = require("./models/brand");
const { Wood } = require("./models/wood");

const fakeDbData = require("./data.json");

class FakeDb {
  constructor() {
    this.brands = fakeDbData.brands;
    this.woods = fakeDbData.woods;
    this.users = fakeDbData.users;
  }
  async cleanDb() {
    await User.remove({});
    await Brand.remove({});
    await Wood.remove({});
    return "Finished";
  }
  pushDataToDb() {
    const user = new User(this.users[0]);

    this.brands.forEach(brand => {
      const newBrand = new Brand(brand);
      newBrand.save();
    });

    this.woods.forEach(wood => {
      const newWood = new Wood(wood);
      newWood.save();
    });

    user.save();
  }
  seedDb() {
    this.cleanDb().then(() => {
      this.pushDataToDb();
    });
  }
}

module.exports = FakeDb;
