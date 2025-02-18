import Server from '../../api.v2/server/Server';
import { Meteor } from 'meteor/meteor';
import { faker } from '@faker-js/faker';
import { toIndexField } from 'meteor/tmq:tools';
import DB from './DB';

Meteor.startup(async () => {
  // Server.startUp();
  Server.startUp().then(() => {
    // Seeder.run();
  }).catch((error) => {
    console.error('Failed to start server:', error);
  });
});

class Seeder {
  static async run() {
    for (let i = 0; i < 1000; i++) {
      const seededAuthor = {
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        date_of_birth: faker.date.past(),
        createdAt: faker.date.past().getTime(),
        updatedAt: faker.date.recent().getTime(),
      };
      const authorSeed = new AuthorSeed(seededAuthor);
      await authorSeed.insertToDB();
    }
    console.log("Finish seeding data in Authors collection")
    for (let i = 0; i < 1000; i++) {
      const seededGenre = {
        name: faker.music.genre(),
        description: faker.lorem.sentence(),
        createdAt: faker.date.past().getTime(),
        updatedAt: faker.date.recent().getTime(),
      };
      const genreSeed = new GenreSeed(seededGenre);
      await genreSeed.insertToDB();
    }
    console.log("Finish seeding data in Genres collection")
    for (let i = 0; i < 1000; i++) {
      const seededPublisher = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        email: faker.internet.email(),
        phone_number: faker.phone.number(),
        createdAt: faker.date.past().getTime(),
        updatedAt: faker.date.recent().getTime(),
      };
      const publisherSeed = new PublisherSeed(seededPublisher);
      await publisherSeed.insertToDB();
    }
    console.log("Finish seeding data in Publisher collection")
    const authors = await DB.Authors.find().fetch();
    const genres = await DB.Genres.find().fetch();
    const publishers = await DB.Publishers.find().fetch();

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
      const seededBook = {
        title: faker.lorem.words(3), // Generate a fake title
        description: faker.lorem.paragraphs(2), // Generate a fake description
        author: new Mongo.ObjectID(faker.helpers.arrayElement(authors)._id._str), // Randomly pick an author _id
        genre: faker.helpers.arrayElements(genres, faker.number.int({ min: 1, max: 3 })).map(g => new Mongo.ObjectID(g._id._str)), // Use the original genre _ids (ObjectId)
        publisher: new Mongo.ObjectID(faker.helpers.arrayElement(publishers)._id._str), // Use the original publisher _id (ObjectId)
        publication_date: faker.date.past(), // Generate a fake publication date
        pages: faker.number.int({ min: 100, max: 500 }), // Generate a fake page count
        language: faker.helpers.arrayElement(['English', 'Spanish', 'French', 'German']), // Randomly pick a language
        isbn, // Use the unique ISBN
        picture, // Use the unique picture URL
      };
      
      const bookSeed = new BookSeed(seededBook);
      await bookSeed.insertToDB();

    }
    console.log("Finish seeding data in Books collection")
  }
}

class AuthorSeed {
  constructor(author) {
    this.author = author;
  }

  generateTokens() {
    return this.author.name.split(" ").map(token => token.trim()).filter(token => token.length > 0);
  }

  toObject() {
    return {
      ...this.author,
      nameToken: this.generateTokens(),
    };
  }

  async insertToDB() {
    const authorObject = this.toObject();
    try {
      const result = await DB.Authors.insert(authorObject);
      // console.log('Author inserted successfully:', result);
    } catch (error) {
      console.error('Failed to insert author:', error);
    }
  }
}

class GenreSeed {
  constructor(genre) {
    this.genre = genre;
  }
  generateTokens() {
    return this.genre.name.split(" ").map(token => token.trim()).filter(token => token.length > 0);
  }
  
  toObject() {
    return {
      ...this.genre,
      nameToken: this.generateTokens(),
    };
  }

  async insertToDB() {
    const genreObject = this.toObject();
    try {
      const result = await DB.Genres.insert(genreObject);
      // console.log('Genre inserted successfully:', result);
    } catch (error) {
      console.error('Failed to insert Genre:', error);
    }
  }
}

class PublisherSeed {
  constructor(publisher) {
    this.publisher = publisher;
  }

  generateTokens() {
    return this.publisher.name.split(" ").map(token => token.trim()).filter(token => token.length > 0);
  }
  
  toObject() {
    return {
      ...this.publisher,
      nameToken: this.generateTokens(),
    };
  }

  async insertToDB() {
    const publisherObject = this.toObject();
    try {
      const result = await DB.Publishers.insert(publisherObject);
      // console.log('Publisher inserted successfully:', result);
    } catch (error) {
      console.error('Failed to insert Publisher:', error);
    }
  }
}

class BookSeed {
  constructor(book) {
    this.book = book;
  }

  async generateTokens() {
    const tokens = [
      ...this.book.title.split(" "),
      this.book.isbn
    ];

    if (this.book.author) {
      const author = await DB.Authors.findOneAsync({ _id: this.book.author });
      if (author && author.nameToken) {
        tokens.push(...author.nameToken);
      }
    }
  
    if (this.book.genre && this.book.genre.length > 0) {
      const genres = await DB.Genres.find({ _id: { $in: this.book.genre } }).fetch();
      genres.forEach(genre => {
        if (genre.nameToken) {
          tokens.push(...genre.nameToken);
        }
      });
    }
  
    if (this.book.publisher) {
      const publisher = await DB.Publishers.findOneAsync({ _id: this.book.publisher });
      if (publisher && publisher.nameToken) {
        tokens.push(...publisher.nameToken);
      }
    }

    const testing = tokens
    .map(token => token.trim())
    .filter(token => token.length > 0);

    return testing
  }
  
  async toObject() {
    return {
      ...this.book,
      nameToken: await this.generateTokens(),
    };
  }

  async insertToDB() {
    const bookObject = await this.toObject();
    try {
      const result = await DB.Books.insert(bookObject);
      // console.log('Book inserted successfully:', result);
    } catch (error) {
      console.error('Failed to insert Book:', error);
    }
  }
}

// class ConsumerSeed {
//   constructor(consumer) {
//     this.fullName = consumer.fullName;
//     this.dateOfBirth = consumer.dateOfBirth;
//     this.email = consumer.email;
//     this.phone = consumer.phone;
//     this.address = consumer.address;
//     this.state = consumer.state;
//     this.postalCode = consumer.postalCode;
//     this.country = consumer.country;
//     this.service = consumer.subscribedService;
//     this.newsletter = 1;
//     this.createdAt = consumer.createdAt;
//     this.updatedAt = consumer.updatedAt;
//     this.tokens = this.generateTokens(); // Generate tokens when creating the object
//   }

//   toIndex1() { // for lazy loading
//     return toIndexField([{ value: this.service, hash: true}, this.newsletter, this.createdAt]);
//   }

//   toIndex2() { // for sorting
//     return toIndexField([{ value: this.fullName, hash: true}, new Date(this.dateOfBirth).getTime()]);
//   }

//   toIndex3() { // for sorting name testing
//     return toIndexField([{ value: this.fullName, hash: true}]);
//   }

//   toIndex4() { // for sorting dob testing
//     return toIndexField([new Date(this.dateOfBirth).getTime()]);
//   }

//   generateTokens() {
//     return [
//       ...this.fullName.split(" "),             // Tokenize fullName
//       ...this.dateOfBirth.split("-"),          // Tokenize dateOfBirth (YYYY-MM-DD)
//       ...this.address.split(" "),              // Tokenize address
//       ...this.service.split(" ")               // Tokenize service
//     ].map(token => token.trim()).filter(token => token.length > 0);
//   }

//   toObject() {
//     return {
//       fullName: this.fullName,
//       dateOfBirth: this.dateOfBirth,
//       email: this.email,
//       phone: this.phone,
//       address: this.address,
//       state: this.state,
//       postalCode: this.postalCode,
//       country: this.country,
//       service: this.service,
//       newsletter: this.newsletter,
//       index1: this.toIndex1(),
//       index2: this.toIndex2(),
//       index3: this.toIndex3(),
//       index4: this.toIndex4(),
//       createdAt: this.createdAt,
//       updatedAt: this.updatedAt,
//       tokens: this.tokens,
//     };
//   }

//   insertToDB() {
//     const consumerObject = this.toObject();
//     DB.Consumers.insert(consumerObject, (error, result) => {
//       if (error) {
//         console.error('Failed to insert consumer:', error);
//       } else {
//         console.log('Consumer inserted successfully:', result);
//       }
//     });
//   }
// }
