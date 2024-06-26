import Filter from "./Filter";
import SearchAppBar from "./Search";
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import PaginatedItemsPage from "./PaginationItems";

const FiltersContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center', // Center the filters horizontally
  borderRadius: theme.shape.borderRadius,
  marginTop: '1%',
}));


const items = [
    {
      itemId: 1,
      title: 'כותרת המוצר 1',
      author: 'שם המחבר 1',
      description: 'תיאור מפורט של המוצר 1.',
      category: 'קטגוריה 1',
      filePath: '/path/to/file1',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },
    {
      itemId: 2,
      title: 'כותרת המוצר 2',
      author: 'שם המחבר 2',
      description: 'תיאור מפורט של המוצר 2.',
      category: 'קטגוריה 2',
      filePath: '/path/to/file2',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },
    {
      itemId: 3,
      title: 'כותרת המוצר 3',
      author: 'שם המחבר 3',
      description: 'תיאור מפורט של המוצר 3.',
      category: 'קטגוריה 3',
      filePath: '/path/to/file3',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },
    {
      itemId: 4,
      title: 'כותרת המוצר 4',
      author: 'שם המחבר 4',
      description: 'תיאור מפורט של המוצר 4.',
      category: 'קטגוריה 4',
      filePath: '/path/to/file4',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },
    {
      itemId: 5,
      title: 'כותרת המוצר 5',
      author: 'שם המחבר 5',
      description: 'תיאור מפורט של המוצר 5.',
      category: 'קטגוריה 5',
      filePath: '/path/to/file5',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },
    {
      itemId: 6,
      title: 'כותרת המוצר 6',
      author: 'שם המחבר 6',
      description: 'תיאור מפורט של המוצר 6.',
      category: 'קטגוריה 6',
      filePath: '/path/to/file6',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },
    {
      itemId: 7,
      title: 'כותרת המוצר 7',
      author: 'שם המחבר 7',
      description: 'תיאור מפורט של המוצר 7.',
      category: 'קטגוריה 7',
      filePath: '/path/to/file7',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },
    {
      itemId: 8,
      title: 'כותרת המוצר 8',
      author: 'שם המחבר 8',
      description: 'תיאור מפורט של המוצר 8.',
      category: 'קטגוריה 8',
      filePath: '/path/to/file8',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },
    {
      itemId: 9,
      title: 'כותרת המוצר 9',
      author: 'שם המחבר 9',
      description: 'תיאור מפורט של המוצר 9.',
      category: 'קטגוריה 9',
      filePath: '/path/to/file9',
      createdAt: '2024-06-23T12:34:56Z',
      updatedAt: '2024-06-23T12:34:56Z'
    },{
    itemId: 10,
    title: 'כותרת המוצר 10',
    author: 'שם המחבר 10',
    description: 'תיאור מפורט של המוצר 10.',
    category: 'קטגוריה 10',
    filePath: '/path/to/file10',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 11,
    title: 'כותרת המוצר 11',
    author: 'שם המחבר 11',
    description: 'תיאור מפורט של המוצר 11.',
    category: 'קטגוריה 11',
    filePath: '/path/to/file11',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 12,
    title: 'כותרת המוצר 12',
    author: 'שם המחבר 12',
    description: 'תיאור מפורט של המוצר 12.',
    category: 'קטגוריה 12',
    filePath: '/path/to/file12',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 13,
    title: 'כותרת המוצר 4',
    author: 'שם המחבר 4',
    description: 'תיאור מפורט של המוצר 4.',
    category: 'קטגוריה 4',
    filePath: '/path/to/file4',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 14,
    title: 'כותרת המוצר 5',
    author: 'שם המחבר 5',
    description: 'תיאור מפורט של המוצר 5.',
    category: 'קטגוריה 5',
    filePath: '/path/to/file5',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 15,
    title: 'כותרת המוצר 6',
    author: 'שם המחבר 6',
    description: 'תיאור מפורט של המוצר 6.',
    category: 'קטגוריה 6',
    filePath: '/path/to/file6',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 16,
    title: 'כותרת המוצר 7',
    author: 'שם המחבר 7',
    description: 'תיאור מפורט של המוצר 7.',
    category: 'קטגוריה 7',
    filePath: '/path/to/file7',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 17,
    title: 'כותרת המוצר 8',
    author: 'שם המחבר 8',
    description: 'תיאור מפורט של המוצר 8.',
    category: 'קטגוריה 8',
    filePath: '/path/to/file8',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 18,
    title: 'כותרת המוצר 9',
    author: 'שם המחבר 9',
    description: 'תיאור מפורט של המוצר 9.',
    category: 'קטגוריה 9',
    filePath: '/path/to/file9',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 19,
    title: 'כותרת המוצר 10',
    author: 'שם המחבר 10',
    description: 'תיאור מפורט של המוצר 10.',
    category: 'קטגוריה 10',
    filePath: '/path/to/file10',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 20,
    title: 'כותרת המוצר 11',
    author: 'שם המחבר 11',
    description: 'תיאור מפורט של המוצר 11.',
    category: 'קטגוריה 11',
    filePath: '/path/to/file11',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  },
  {
    itemId: 21,
    title: 'כותרת המוצר 12',
    author: 'שם המחבר 12',
    description: 'תיאור מפורט של המוצר 12.',
    category: 'קטגוריה 12',
    filePath: '/path/to/file12',
    createdAt: '2024-06-23T12:34:56Z',
    updatedAt: '2024-06-23T12:34:56Z'
  }
  // ... ניתן להוסיף עוד פריטים במידת הצורך
];

function AllSearchScreen() {
    return (
        <>
            <Container dir="rtl">
                <SearchAppBar />
                <FiltersContainer >
                    <Filter filterBy="תג" />
                    <Filter filterBy="קטגוריה" />
                </FiltersContainer>
            </Container>
            <PaginatedItemsPage items={items} />
        </>
    );
}

export default AllSearchScreen;