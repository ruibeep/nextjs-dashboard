const books = [
    {
        cover: null,
        title: 'The Great Gatsby',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-great-gatsby',
        author_id: 1
    },
    {
        cover: null,
        title: 'Pride & Prejudice',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/pride-prejudice',
        author_id: 2
    },
    {
        cover: null,
        title: 'Romeo and Juliet',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/romeo-and-juliet',
        author_id: 3
    },
    {
        cover: null,
        title: 'Little Women',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/little-women',
        author_id: 4
    },
    {
        cover: null,
        title: 'Jane Eyre',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/jane-eyre',
        author_id: 5
    },
    {
        cover: null,
        title: 'Wuthering Heights',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/wuthering-heights',
        author_id: 6
    },
    {
        cover: null,
        title: 'Frankenstein',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/frankenstein',
        author_id: 7
    },
    {
        cover: null,
        title: 'The Picture of Dorian Gray',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-picture-of-dorian-gray',
        author_id: 8
    },
    {
        cover: null,
        title: 'The Adventures of Huckleberry Finn',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-adventures-of-huckleberry-finn',
        author_id: 9
    },
    {
        cover: null,
        title: 'Dracula',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/dracula',
        author_id: 10
    },
    {
        cover: null,
        title: 'The Odyssey',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-odyssey',
        author_id: 11
    },
    {
        cover: null,
        title: 'Anne of Green Gables',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/anne-of-green-gables',
        author_id: 12
    },
    {
        cover: null,
        title: 'A Tale of Two Cities',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/a-tale-of-two-cities',
        author_id: 13
    },
    {
        cover: null,
        title: 'The Count of Monte Cristo',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-count-of-monte-cristo',
        author_id: 14
    },
    {
        cover: null,
        title: 'Crime and Punishment',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/crime-and-punishment',
        author_id: 15
    },
    {
        cover: null,
        title: 'Emma',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/emma',
        author_id: 2
    },
    {
        cover: null,
        title: 'Anna Karenina',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/anna-karenina',
        author_id: 16
    },
    {
        cover: null,
        title: 'Les Misérables',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/ebooks/les-misérables',
        author_id: 17
    },
    {
        cover: null,
        title: "Alice's Adventures in Wonderland",
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/alice-s-adventures-in-wonderland',
        author_id: 18
    },
    {
        cover: null,
        title: 'Moby-Dick',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/moby-dick',
        author_id: 19
    },
    {
        cover: null,
        title: 'The Art of War',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-art-of-war',
        author_id: 20
    },
    {
        cover: null,
        title: 'The Wonderful Wizard of Oz',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/wizard-of-oz',
        author_id: 21
    },
    {
        cover: null,
        title: 'The Iliad',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-iliad',
        author_id: 11
    },
    {
        cover: null,
        title: 'The Adventures of Sherlock Holmes',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-adventures-of-sherlock-holmes',
        author_id: 22
    },
    {
        cover: null,
        title: 'The Call of the Wild',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-call-of-the-wild-novel-by-jack-london',
        author_id: 23
    },
    {
        cover: null,
        title: 'Peter Pan',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/peter-pan',
        author_id: 24
    },
    {
        cover: null,
        title: 'Meditations',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/meditations',
        author_id: 25
    },
    {
        cover: null,
        title: 'The Strange Case of Dr Jekyll and Mr Hyde',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-strange-case-of-dr-jekyll-and-mr-hyde',
        author_id: 26
    },
    {
        cover: null,
        title: "Le Morte d'Arthur",
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/le-morte-d-arthur',
        author_id: 27
    },
    {
        cover: null,
        title: 'The Autobiography of Benjamin Franklin',
        files: null,
        language: 'en',
        link: 'https://publicdomainlibrary.org/en/books/the-autobiography-of-benjamin-franklin',
        author_id: 28
    }
];


const authors = [
    {
      name: 'F. Scott Fitzgerald',
      image: 'test',
      birth: '1896-09-24',
      death: '1940-12-21',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/f-scott-fitzgerald'
    },
    {
      name: 'Jane Austen',
      image: null,
      birth: '1775-12-16',
      death: '1817-07-18',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/jane-austen'
    },
    {
      name: 'William Shakespeare',
      image: null,
      birth: null,
      death: '1616-04-23',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/william-shakespeare'
    },
    {
      name: 'Louisa May Alcott',
      image: null,
      birth: '1832-11-29',
      death: '1888-03-06',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/louisa-may-alcott'
    },
    {
      name: 'Charlotte Brontë',
      image: null,
      birth: '1816-04-21',
      death: '1855-03-31',
      description: null,
      link: 'https://publicdomainlibrary.org/en/books/jane-eyre'
    },
    {
      name: 'Emily Brontë',
      image: null,
      birth: '1818-06-30',
      death: '1848-12-19',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/emily-brontë'
    },
    {
      name: 'Mary Shelley',
      image: null,
      birth: '1797-08-30',
      death: '1851-02-01',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/mary-wollstonecraft-shelley'
    },
    {
      name: 'Oscar Wilde',
      image: null,
      birth: '1854-10-16',
      death: '1900-11-30',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/oscar-wilde'
    },
    {
      name: 'Mark Twain',
      image: null,
      birth: '1835-11-30',
      death: '1910-04-21',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/mark-twain'
    },
    {
      name: 'Bram Stoker',
      image: null,
      birth: '1847-11-08',
      death: '1912-04-20',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/bram-stoker'
    },
    {
      name: 'Homer',
      image: null,
      birth: null,
      death: null,
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/homer'
    },
    {
      name: 'L. M. Montgomery',
      image: null,
      birth: '1874-11-30',
      death: '1942-04-24',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/lucy-maud-montgomery'
    },
    {
      name: 'Charles Dickens',
      image: null,
      birth: '1812-02-07',
      death: '1870-06-09',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/charles-john-huffam-dickens'
    },
    {
      name: 'Alexandre Dumas',
      image: null,
      birth: '1802-07-24',
      death: '1870-12-05',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/alexandre-dumas'
    },
    {
      name: 'Fyodor Dostoevsky',
      image: null,
      birth: '1821-11-11',
      death: '1881-02-09',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/fyodor-dostoevsky'
    },
    {
      name: 'Leo Tolstoy',
      image: null,
      birth: '1828-09-09',
      death: '1910-11-20',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/leo-tolstoy'
    },
    {
      name: 'Victor Hugo',
      image: null,
      birth: '1802-02-26',
      death: '1885-05-22',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/victor-hugo'
    },
    {
      name: 'Lewis Carroll',
      image: null,
      birth: '1832-01-27',
      death: '1898-01-14',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/lewis-carroll'
    },
    {
      name: 'Herman Melville',
      image: null,
      birth: '1819-08-01',
      death: '1891-09-28',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/herman-melville'
    },
    {
      name: 'Sun Tzu',
      image: null,
      birth: null,
      death: null,
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/sun-tzu'
    },
    {
      name: 'L. Frank Baum',
      image: null,
      birth: '1856-05-15',
      death: '1919-05-06',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/l-frank-baum'
    },
    {
      name: 'Arthur Conan Doyle',
      image: null,
      birth: '1859-05-22',
      death: '1930-07-07',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/arthur-conan-doyle'
    },
    {
      name: 'Jack London',
      image: null,
      birth: '1876-01-12',
      death: '1916-11-22',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/jack-london'
    },
    {
      name: 'J. M. Barrie',
      image: null,
      birth: '1860-05-09',
      death: '1937-06-19',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/james-matthew-barrie'
    },
    {
      name: 'Marcus Aurelius',
      image: null,
      birth: '0121-04-26',
      death: '0180-03-17',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/marcus-aurelius'
    },
    {
      name: 'Robert Louis Stevenson',
      image: null,
      birth: '1850-11-13',
      death: '1894-12-03',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/robert-louis-stevenson'
    },
    {
      name: 'Sir Thomas Malory',
      image: null,
      birth: null,
      death: '1471-03-14',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/thomas-malory'
    },
    {
      name: 'Benjamin Franklin',
      image: null,
      birth: '1706-01-17',
      death: '1790-04-17',
      description: null,
      link: 'https://publicdomainlibrary.org/en/authors/benjamin-franklin'
    }
  ];
  
const quotes = [
    {
        quote: "So we beat on, boats against the current, borne back ceaselessly into the past.",
        popularity: 12544,
        book_id: 1
    },
    {
        quote: "I hope she'll be a fool -- that's the best thing a girl can be in this world, a beautiful little fool.",
        popularity: 10566,
        book_id: 1
    },
    {
        quote: "Angry, and half in love with her, and tremendously sorry, I turned away.",
        popularity: 5463,
        book_id: 1
    },
    {
        quote: "I was within and without, simultaneously enchanted and repelled by the inexhaustible variety of life.",
        popularity: 4803,
        book_id: 1
    },
    {
        quote: "And I like large parties. They’re so intimate. At small parties there isn’t any privacy.",
        popularity: 4668,
        book_id: 1
    },
    {
        quote: "And so with the sunshine and the great bursts of leaves growing on the trees, just as things grow in fast movies, I had that familiar conviction that life was beginning over again with the summer.",
        popularity: 4410,
        book_id: 1
    },
    {
        quote: "I wasn’t actually in love, but I felt a sort of tender curiosity.",
        popularity: 4020,
        book_id: 1
    },
    {
        quote: "He smiled understandingly—much more than understandingly. It was one of those rare smiles with a quality of eternal reassurance in it, that you may come across four or five times in life. It faced—or seemed to face—the whole eternal world for an instant, and then concentrated on you with an irresistible prejudice in your favor. It understood you just as far as you wanted to be understood, believed in you as you would like to believe in yourself, and assured you that it had precisely the impression of you that, at your best, you hoped to convey.",
        popularity: 4007,
        book_id: 1
    },
    {
        quote: "Let us learn to show our friendship for a man when he is alive and not after he is dead.",
        popularity: 3890,
        book_id: 1
    },
    {
        quote: "You see I usually find myself among strangers because I drift here and there trying to forget the sad things that happened to me.",
        popularity: 3181,
        book_id: 1
    },
    {
        quote: "There are only the pursued, the pursuing, the busy and the tired.",
        popularity: 3060,
        book_id: 1
    },
    {
        quote: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven’t had the advantages that you’ve had.'",
        popularity: 2909,
        book_id: 1
    },
    {
        quote: "Life starts all over again when it gets crisp in the fall.",
        popularity: 2743,
        book_id: 1
    }
]

export { authors, books, quotes};