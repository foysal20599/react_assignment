import { useState, useEffect } from 'react';

interface Author {
  name: string;
  birth_year: number | null;
  death_year: number | null;
}

interface Book {
  id: number;
  title: string;
  authors: Author[];
  summaries: string[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: {
    [key: string]: string;
  };
  download_count: number;
}

interface BookResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

export default function Task2() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchBooks = async (pageNumber: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://gutendex.com/books/?page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data: BookResponse = await response.json();
      setBooks(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Gutenberg Books</h1>
          <p className="text-gray-600">A collection of freely available eBooks</p>
        </header>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              onClick={() => fetchBooks(page)} 
              className="ml-4 text-red-700 underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div 
                  key={book.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                      {book.title}
                    </h2>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 font-medium">
                        {book.authors.map(author => author.name).join(', ')}
                      </p>
                      {book.authors[0]?.birth_year && book.authors[0]?.death_year && (
                        <p className="text-xs text-gray-500">
                          ({book.authors[0].birth_year} - {book.authors[0].death_year})
                        </p>
                      )}
                    </div>
                    
                    {book.summaries.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {book.summaries[0].replace(/(This is an automatically generated summary\.)/, '')}
                        </p>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {book.subjects.slice(0, 3).map((subject, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {subject.split(' -- ')[0]}
                          </span>
                        ))}
                        {book.subjects.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            +{book.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <span>Downloads: {book.download_count.toLocaleString()}</span>
                      <span className="uppercase">{book.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Previous
              </button>
              <span className="text-gray-600">Page {page}</span>
              <button
                onClick={handleNextPage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}