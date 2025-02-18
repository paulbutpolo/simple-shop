import React, { useState, useEffect } from 'react';
import Client from '../api/client/Client';

// Ideally I need to change the useEffect
export const BookForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [genreIds, setGenreIds] = useState([]);
  const [publisherId, setPublisherId] = useState('');
  const [publicationDate, setpublicationDate] = useState('');
  const [pages, setPages] = useState(0);
  const [language, setLanguage] = useState('');
  const [isbn, setIsbn] = useState('');
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authors = await Client.callFunc('fetchAuthors');
        setAuthors(authors);

        const genres = await Client.callFunc('fetchGenres');
        setGenres(genres);

        const publishers = await Client.callFunc('fetchPublishers');
        setPublishers(publishers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Book Submitted:', { title, description, authorId, genreIds, publisherId, publicationDate, pages, language, isbn });
    // Add logic to save the books to your collection
    const bookId = await Client.callFunc("insert.book", {
      _id: new Mongo.ObjectID(),
      title: title,
      description: description,
      author: new Mongo.ObjectID(authorId),
      genre: new Mongo.ObjectID(genreIds[0]),
      publisher: new Mongo.ObjectID(publisherId),
      publication_date: publicationDate,
      pages: pages,
      language: language,
      isbn: isbn,
    });
    console.log("Book inserted with ID:", bookId);
    alert("Book added successfully!");
    // Sloppy but got no time
    setTitle('');
    setDescription('');
    setAuthorId('');
    setGenreIds('');
    setPublisherId('');
    setpublicationDate('');
    setPages('');
    setLanguage('');
    setIsbn('');
  };

  return (
    <div className="book-form-container">
      <form onSubmit={handleSubmit} className="book-form">
        <div className='first-row'>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className='second-row'>
          <div>
            <label>Author</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              required
            >
              <option value="">Select an author</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Genres</label>
            <select multiple value={genreIds} onChange={(e) => setGenreIds(Array.from(e.target.selectedOptions, (option) => option.value))} required>
              {genres.map((genre) => (
                <option key={genre._id} value={genre._id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Publisher</label>
            <select
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              required
            >
              <option value="">Select a publisher</option>
              {publishers.map((publisher) => (
                <option key={publisher._id} value={publisher._id}>
                  {publisher.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="third-row">
          <div className="input-group">
            <label>Publication Date</label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setpublicationDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Pages</label>
            <input
              type="number"
              placeholder="Pages"
              value={pages}
              onChange={(e) => setPages(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="input-group">
            <label>Language</label>
            <input
              type="text"
              placeholder="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>ISBN</label>
            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};