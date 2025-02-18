import { Meteor } from 'meteor/meteor';
import Server from '../../api/server/Server';
import { AuthorCollection } from "../../api/AuthorCollection"
import { BookCollection } from "../../api/BookCollection"
import { GenreCollection } from "../../api/GenreCollection"
import { PublisherCollection } from "../../api/PublisherCollection"
import { ProductCollection } from "../../api/ProductCollection"
import { faker } from '@faker-js/faker';
import { BSON } from 'bson';

// Okay so I removed redis. To reduce the headache.
Meteor.methods({
  'products.fetch'() {
    // Fetch data from MongoDB
    console.log("Trying to fetch the data in mongoDB by using methods")
    return ProductCollection.find({}).fetch();
  },
  async "products.insert"(doc) {
    const productId = await ProductCollection.insert({
      ...doc,
      userId: this.userId,
    });
    await Server.redisVentTriggerInsert(productId);
    return productId;
  },
  async "products.buy"({ _id, quantity }) {
    const productId = await ProductCollection.update(
      { _id }, 
      { $inc: { productQuantity: -quantity }}
    )
    await Server.redisVentUpdateTrigger(_id, quantity);
    return productId;
  },
  async "products.delete"(_id) {
    const productId = await ProductCollection.remove(_id);
    await Server.redisVentTriggerDelete(_id);
    return productId;
  },
  "insert.author"(doc) {
    const authorId = AuthorCollection.insert(doc);
    return authorId;
  },
  "insert.genre"(doc) {
    const genreId = GenreCollection.insert(doc);
    return genreId;
  },
  "insert.publisher"(doc) {
    const publisherId = PublisherCollection.insert(doc);
    return publisherId;
  },
  async "insert.book"(doc) {
    console.log("Inserting book with doc:", doc);
    const bookId = await BookCollection.insert(doc);
    return bookId;
  },
  'fetchAuthors'() {
    return AuthorCollection.find({}, { fields: { name: 1 } }).fetch();
  },
  'fetchGenres'() {
    return GenreCollection.find({}, { fields: { name: 1 } }).fetch();
  },
  'fetchPublishers'() {
    return PublisherCollection.find({}, { fields: { name: 1 } }).fetch();
  },
  async "books.findByIsbn"(isbn) {
    // Fetch the book from BookCollection using ISBN
    const book = await BookCollection.findOneAsync({ isbn: isbn.isbn});
    if (!book) {
      throw new Meteor.Error("not-found", "Book not found!");
    }
    console.log(book)
    return book;
  },
  async "getBookDetails"(bookId) {
    // console.log("Selected",bookId._str)
    // const converted = new BSON.ObjectId(bookId._str)
    // console.log("Converted",converted)
    const rawCollection = BookCollection.rawCollection();
    // rawCollection.findOne({ _id: converted})
    //   .then((result) => {
    //     console.log("Raw collection find result:", result);
    //   })
    //   .catch((error) => {
    //     console.error("Error in raw collection find:", error);
    //   });
    return rawCollection.aggregate([
         // Stage 1
        { $match: { _id: new BSON.ObjectId(bookId._str) } }, // Convert the string to ObjectId by using BSON package/Library
         // Stage 2. All look up is stage 2
        { $lookup: { from: "authors", localField: "author", foreignField: "_id", as: "authorDetails" } }, // Basically its join in authors collection, from author field, in _id, as authorDetails
        { $lookup: { from: "genres", localField: "genre", foreignField: "_id", as: "genreDetails" } },
        { $lookup: { from: "publishers", localField: "publisher", foreignField: "_id", as: "publisherDetails" } },
         // Stage 3
        { $project: { title: 1, price: 1, stock_quantity: 1, isbn: 1, publication_date: 1, pages: 1, language: 1, picture: 1, "authorDetails.name": 1, "genreDetails.name": 1, "publisherDetails.name": 1 } },
      ])
      .toArray()
      .then((results) => {
        console.log("Aggregation results:", results);
        if (results.length === 0) {
          console.error("No book found with _id:", bookId);
          throw new Meteor.Error("no-book-found", "No book found with the given ID");
        }
        return results[0];
      })
      .catch((error) => {
        console.error("Error in aggregation:", error);
        throw new Meteor.Error("aggregation-failed", "Failed to fetch book details");
      });
  },
  // "seedFirstStage"() {
  //   console.log('Seeding authors, genres, and publishers...');

  //   // Seed Authors
  //   const authors = [];
  //   for (let i = 0; i < 1000; i++) {
  //     const authorId = AuthorCollection.insert({
  //       _id: new Mongo.ObjectID(),
  //       name: faker.person.fullName(),
  //       bio: faker.lorem.paragraph(),
  //       date_of_birth: faker.date.past(),
  //     });
  //     authors.push(authorId); // Store the _id
  //   }
  //   console.log(`Inserted ${authors.length} authors.`);

  //   // Seed Genres
  //   const genres = [];
  //   for (let i = 0; i < 1000; i++) {
  //     const genreId = GenreCollection.insert({
  //       _id: new Mongo.ObjectID(),
  //       name: faker.music.genre(),
  //       description: faker.lorem.sentence(),
  //     });
  //     genres.push(genreId); // Store the _id
  //   }
  //   console.log(`Inserted ${genres.length} genres.`);

  //   // Seed Publishers
  //   const publishers = [];
  //   for (let i = 0; i < 1000; i++) {
  //     const publisherId = PublisherCollection.insert({
  //       _id: new Mongo.ObjectID(),
  //       name: faker.company.name(),
  //       address: faker.location.streetAddress(),
  //       email: faker.internet.email(),
  //       phone_number: faker.phone.number(),
  //     });
  //     publishers.push(publisherId); // Store the _id
  //   }
  //   console.log(`Inserted ${publishers.length} publishers.`);

  //   return { authors, genres, publishers };
  // },
  async "seedBooks"() {
    console.log('Seeding books...');

    // Fetch existing authors, genres, and publishers
    const authors = await AuthorCollection.find().fetch();
    const genres = await GenreCollection.find().fetch();
    const publishers = await PublisherCollection.find().fetch();

    if (authors.length === 0 || genres.length === 0 || publishers.length === 0) {
      throw new Meteor.Error('missing-data', 'Authors, genres, or publishers are missing. Seed them first.');
    }

    // console.log("Original",authors._id); // checking
    // console.log("Converted",new BSON.ObjectId(authors[0]._id._str)); // checking
    // Generate 500 books
    const books = [];
    const usedIsbns = new Set();
    const usedPictureUrls = new Set();

    for (let i = 0; i < 500; i++) {
      // Generate a unique ISBN
      let isbn;
      do {
        isbn = faker.commerce.isbn();
      } while (usedIsbns.has(isbn));
      usedIsbns.add(isbn);

      let picture;
      do {
        picture = faker.image.urlLoremFlickr({ category: 'book' }); // Generate a book-related image URL
      } while (usedPictureUrls.has(picture));
      usedPictureUrls.add(picture);

      // Create a book document
      const book = {
        _id: new BSON.ObjectId(), // Generate a new ObjectId. For some reason Mongo.ObjectID() is not working
        title: faker.lorem.words(3), // Generate a fake title
        description: faker.lorem.paragraphs(2), // Generate a fake description
        author: new BSON.ObjectId(faker.helpers.arrayElement(authors)._id._str), // Randomly pick an author _id
        genre: faker.helpers.arrayElements(genres, faker.number.int({ min: 1, max: 3 })).map(g => new BSON.ObjectId(g._id._str)), // Use the original genre _ids (ObjectId)
        publisher: new BSON.ObjectId(faker.helpers.arrayElement(publishers)._id._str), // Use the original publisher _id (ObjectId)
        publication_date: faker.date.past(), // Generate a fake publication date
        pages: faker.number.int({ min: 100, max: 500 }), // Generate a fake page count
        language: faker.helpers.arrayElement(['English', 'Spanish', 'French', 'German']), // Randomly pick a language
        isbn, // Use the unique ISBN
        picture, // Use the unique picture URL
      };

      books.push(book);
    }

    // Insert books into the collection
    await BookCollection.rawCollection().insertMany(books);
    console.log(`Inserted ${books.length} books.`);

    return 'Books seeded successfully!';
  },
  // async "seedProducts"() {
  //   console.log('Seeding products...');

  //   // Fetch existing books
  //   const books = await BookCollection.find().fetch();

  //   if (books.length === 0) {
  //     throw new Meteor.Error('missing-data', 'Books are missing. Seed them first.');
  //   }

  //   // Generate 500 products
  //   const products = [];

  //   for (let i = 0; i < 500; i++) {
  //     // Randomly pick a book
  //     const book = faker.helpers.arrayElement(books);

  //     // Create a product document
  //     const product = {
  //       _id: new BSON.ObjectId(), // Generate a new ObjectId for the product
  //       bookId: new BSON.ObjectId(book._id._str), // Reference the book's _id (ObjectId)
  //       productType: "book", // Static value for now
  //       productName: book.title, // Use the book's title
  //       productQuantity: faker.number.int({ min: 1, max: 100 }), // Generate a fake quantity
  //       productPrice: faker.commerce.price({ min: 10, max: 100 }), // Generate a fake price
  //       createdAt: new Date(), // Use the current date and time
  //       userId: "d94osXCHN5aTavNBX", // ehhh
  //     };

  //     products.push(product);
  //   }

  //   // Insert products into the collection
  //   await ProductCollection.rawCollection().insertMany(products);
  //   console.log(`Inserted ${products.length} products.`);

  //   return 'Products seeded successfully!';
  // },
})

Meteor.startup(async () => {
  Server.startUp();
});
