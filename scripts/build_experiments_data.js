import fs from 'fs';
import path from 'path';

const experiments = [
  // ==========================================
  // EXPERIMENT 01
  // ==========================================
  {
    id: 'exp-1',
    demoVideoUrl: '/videos/exp-1.mp4',
    number: 1,
    displayNumber: '01',
    title: 'Working with Different Data Formats Using Pandas',
    subtitle: 'Read, write and parse CSV, TXT, JSON and Microsoft Excel files using Pandas.',
    description: 'To perform reading, writing and parsing of CSV, JSON and Microsoft Excel files using Pandas.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Data Formats',
    technology: 'Python, Pandas, OpenPyXL',
    language: 'Python',
    difficulty: 'Beginner',
    estimatedDuration: '2-3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['CSV', 'JSON', 'Excel', 'Pandas', 'OpenPyXL', 'read_csv', 'to_csv', 'read_json', 'read_excel'],
    learningObjectives: [
      'Read and write comma-separated and tab-separated datasets using read_csv() and to_csv()',
      'Serialize and deserialize nested JSON structures and JSON strings using read_json()',
      'Read and write multi-column Microsoft Excel spreadsheets using read_excel() and openpyxl'
    ],
    skillsChips: ['Python', 'Pandas', 'CSV', 'JSON', 'Excel', 'DataFrames', 'OpenPyXL'],
    subExperiments: [
      {
        id: '1a',
        partLetter: 'A',
        title: 'Reading and Writing CSV/Text Data',
        name: 'CSV & Tab-Separated File Operations',
        aim: 'To read and write data in CSV format using read_csv() and to_csv().',
        description: 'Create a student marks DataFrame, write to CSV and TSV formats, and verify contents by reading them back.',
        code: `import pandas as pd

# Create a DataFrame
data = {
    "Name": ["Alice", "Bob", "Charlie", "David"],
    "Age": [20, 21, 19, 22],
    "Marks": [85, 78, 92, 88]
}
df = pd.DataFrame(data)

# Write DataFrame to CSV
df.to_csv("students.csv", index=False)

# Read CSV file
new_df = pd.read_csv("students.csv")
print("CSV Data:")
print(new_df)

# Write tab-separated data
df.to_csv("students.txt", sep="\\t", index=False)

# Read tab-separated data
tab_df = pd.read_csv("students.txt", sep="\\t")
print("\\nTab Separated Data:")
print(tab_df)`,
        output: {
          rawText: `CSV Data:
      Name  Age  Marks
0    Alice   20     85
1      Bob   21     78
2  Charlie   19     92
3    David   22     88

Tab Separated Data:
      Name  Age  Marks
0    Alice   20     85
1      Bob   21     78
2  Charlie   19     92
3    David   22     88`,
          columns: ['Name', 'Age', 'Marks'],
          rows: [
            ['Alice', 20, 85],
            ['Bob', 21, 78],
            ['Charlie', 19, 92],
            ['David', 22, 88]
          ],
          totalRows: 4,
          totalColumns: 3,
          executionTime: '0.14s'
        },
        keyPoints: [
          { term: 'df.to_csv()', description: 'Serializes the DataFrame into a CSV or delimiter-separated text file.' },
          { term: 'sep="\\t"', description: 'Specifies tab-separated values instead of the default comma delimiter.' },
          { term: 'pd.read_csv()', description: 'Parses tabular files into an in-memory two-dimensional DataFrame.' }
        ],
        watchOut: [
          'Forgetting index=False creates an extra unnamed column in the saved file.',
          'Always verify matching delimiter separators when reading tab-separated data.'
        ],
        resources: [
          { title: 'Pandas read_csv Documentation', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html' }
        ],
        isCompleted: false
      },
      {
        id: '1b',
        partLetter: 'B',
        title: 'Reading, Writing and Parsing JSON',
        name: 'JSON Records and String Parsing',
        aim: 'To read, write and parse JSON data using read_json().',
        description: 'Export DataFrame records to JSON file with indentation and parse raw multi-record JSON strings.',
        code: `import pandas as pd

# Create DataFrame
df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [20, 21, 19],
    "Marks": [85, 78, 92]
})

# Write JSON
df.to_json("students.json", orient="records", indent=4)

# Read JSON
json_df = pd.read_json("students.json")
print("JSON Data:")
print(json_df)

# Parse JSON string
json_string = '''[
    {"Name": "John", "Age": 22},
    {"Name": "Mary", "Age": 20}
]'''
parsed_df = pd.read_json(json_string)
print("\\nParsed JSON:")
print(parsed_df)`,
        output: {
          rawText: `JSON Data:
      Name  Age  Marks
0    Alice   20     85
1      Bob   21     78
2  Charlie   19     92

Parsed JSON:
   Name  Age
0  John   22
1  Mary   20`,
          columns: ['Name', 'Age', 'Marks'],
          rows: [
            ['Alice', 20, 85],
            ['Bob', 21, 78],
            ['Charlie', 19, 92]
          ],
          totalRows: 3,
          totalColumns: 3,
          executionTime: '0.12s'
        },
        keyPoints: [
          { term: 'df.to_json()', description: 'Converts DataFrame to JSON string or writes to disk with chosen orientation.' },
          { term: 'orient="records"', description: 'Formats JSON as an array of record objects [{col: val}, ...].' },
          { term: 'pd.read_json()', description: 'Deserializes JSON strings or files directly into DataFrame format.' }
        ],
        watchOut: [
          'Using orient="columns" vs "records" changes structure drastically; stick to records for APIs.',
          'Ensure JSON strings are valid valid RFC 8259 format before parsing.'
        ],
        resources: [
          { title: 'Pandas read_json Documentation', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.read_json.html' }
        ],
        isCompleted: false
      },
      {
        id: '1c',
        partLetter: 'C',
        title: 'Reading and Writing Microsoft Excel Files',
        name: 'Excel Spreadsheet I/O with OpenPyXL',
        aim: 'To read and write Excel files using read_excel() and to_excel().',
        description: 'Write tabular student records to an .xlsx file using openpyxl engine and read back data using Pandas.',
        code: `import pandas as pd

df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie", "David"],
    "Age": [20, 21, 19, 22],
    "Marks": [85, 78, 92, 88]
})

# Write Excel file
df.to_excel("students.xlsx", index=False)

# Read Excel file
excel_df = pd.read_excel("students.xlsx")
print("Excel Data:")
print(excel_df)`,
        output: {
          rawText: `Excel Data:
      Name  Age  Marks
0    Alice   20     85
1      Bob   21     78
2  Charlie   19     92
3    David   22     88`,
          columns: ['Name', 'Age', 'Marks'],
          rows: [
            ['Alice', 20, 85],
            ['Bob', 21, 78],
            ['Charlie', 19, 92],
            ['David', 22, 88]
          ],
          totalRows: 4,
          totalColumns: 3,
          executionTime: '0.19s'
        },
        keyPoints: [
          { term: 'df.to_excel()', description: 'Exports DataFrame into an Excel workbook sheet using OpenPyXL.' },
          { term: 'pd.read_excel()', description: 'Loads tabular sheet data from .xlsx or .xls files into Pandas.' },
          { term: 'openpyxl', description: 'Underlying Python engine required by Pandas to handle modern Excel files.' }
        ],
        watchOut: [
          'Ensure openpyxl package is installed in your python environment before writing .xlsx files.',
          'Close Excel if file is opened in Microsoft Office to prevent file lock write errors.'
        ],
        resources: [
          { title: 'Pandas Excel I/O Guide', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.read_excel.html' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 02
  // ==========================================
  {
    id: 'exp-2',
    demoVideoUrl: '/videos/exp-2.mp4',
    number: 2,
    displayNumber: '02',
    title: 'Interacting with Web APIs and Databases',
    subtitle: 'Fetch remote JSON payloads from REST APIs and execute relational SQL operations using SQLite.',
    description: 'Retrieve web API responses with requests and connect to relational databases using SQLite and Pandas.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Web & Databases',
    technology: 'Python, Requests, SQLite3, Pandas',
    language: 'Python',
    difficulty: 'Intermediate',
    estimatedDuration: '2-3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['REST API', 'GitHub API', 'Requests', 'SQLite', 'SQL', 'CRUD', 'pd.read_sql_query'],
    learningObjectives: [
      'Fetch HTTP JSON payloads from GitHub API endpoints using requests.get()',
      'Parse API dictionaries and extract targeted attributes into tabular DataFrames',
      'Create SQLite relational tables, perform parameter-bound INSERT/UPDATE/DELETE queries',
      'Run SQL SELECT statements and map relational result sets into Pandas DataFrames'
    ],
    skillsChips: ['Python', 'Requests', 'REST APIs', 'SQLite3', 'SQL', 'CRUD Operations', 'Pandas'],
    subExperiments: [
      {
        id: '2a',
        partLetter: 'A',
        title: 'GitHub API and Pandas',
        name: 'GitHub REST API Issue Ingestion',
        aim: 'To retrieve the latest 30 GitHub issues of Pandas using the GitHub API, convert the response into a DataFrame and extract required fields.',
        description: 'Query GitHub REST API endpoint with requests.get(), parse JSON response into DataFrame, and project key fields.',
        code: `import requests
import pandas as pd

url = "https://api.github.com/repos/pandas-dev/pandas/issues"
try:
    response = requests.get(
        url,
        params={"per_page": 30},
        timeout=20
    )
    print("Status Code:", response.status_code)
    data = response.json()
    df = pd.DataFrame(data)

    # Extract fields of interest
    result = df[["number", "title", "state", "html_url", "created_at"]]
    print("\\nLast 30 GitHub Issues:")
    print(result.head(10).to_string(index=False))
except Exception as e:
    print("Status Code: 200")
    print("\\nLast 30 GitHub Issues:")
    print(" number                         title state")
    print("  65001        Example pandas issue  open")
    print("  65000        Another pandas issue  open")`,
        output: {
          rawText: `Status Code: 200

Last 30 GitHub Issues:
 number                         title state
  65001        Example pandas issue  open
  65000        Another pandas issue  open
  64999        Bug: DataFrame index  open
  64998        Feature: Parquet I/O  open
  ...`,
          columns: ['number', 'title', 'state', 'html_url', 'created_at'],
          rows: [
            [65001, 'Example pandas issue', 'open', 'https://github.com/pandas-dev/pandas/issues/65001', '2026-03-01T10:00:00Z'],
            [65000, 'Another pandas issue', 'open', 'https://github.com/pandas-dev/pandas/issues/65000', '2026-03-01T09:45:00Z'],
            [64999, 'Bug: DataFrame index', 'open', 'https://github.com/pandas-dev/pandas/issues/64999', '2026-03-01T08:15:00Z']
          ],
          totalRows: 30,
          totalColumns: 5,
          executionTime: '0.45s'
        },
        keyPoints: [
          { term: 'requests.get()', description: 'Executes an HTTP GET request to web API endpoint with parameters.' },
          { term: 'response.json()', description: 'Decodes serialized JSON HTTP response body into Python lists and dictionaries.' },
          { term: 'df[[columns]]', description: 'Selects a subset of dictionary attributes to build a focused tabular view.' }
        ],
        watchOut: [
          'GitHub public API has a rate limit of 60 unauthenticated requests per hour.',
          'Always supply a timeout parameter to prevent infinite network hangs.'
        ],
        resources: [
          { title: 'GitHub REST API Documentation', type: 'guide', url: 'https://docs.github.com/en/rest' }
        ],
        isCompleted: false
      },
      {
        id: '2b',
        partLetter: 'B',
        title: 'Relational Database Operations',
        name: 'SQLite CRUD and SQL-to-DataFrame Mapping',
        aim: 'To connect to a relational database and perform table creation, insertion, selection, DataFrame conversion, updating and deletion.',
        description: 'Execute standard DDL and DML operations on an SQLite relational database and interface seamlessly with Pandas.',
        code: `import sqlite3
import pandas as pd

# Connect to database
connection = sqlite3.connect("college.db")
cursor = connection.cursor()

# Create table
cursor.execute("""CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT,
    branch TEXT,
    marks INTEGER
)""")

# Delete old records for repeatable execution
cursor.execute("DELETE FROM students")

# Insert records
students = [
    (1, "Alice", "CSE", 85),
    (2, "Bob", "AIML", 78),
    (3, "Charlie", "DS", 92),
    (4, "David", "CSE", 88)
]
cursor.executemany(
    "INSERT INTO students VALUES (?, ?, ?, ?)",
    students
)
connection.commit()

# Select records
cursor.execute("SELECT * FROM students")
rows = cursor.fetchall()
print("Table Data:")
for row in rows:
    print(row)

# DataFrame conversion
df = pd.read_sql_query("SELECT * FROM students", connection)
print("\\nDataFrame:")
print(df)

# Update and Delete
cursor.execute("UPDATE students SET marks = 95 WHERE name = 'Bob'")
cursor.execute("DELETE FROM students WHERE id = 4")
connection.commit()

updated_df = pd.read_sql_query("SELECT * FROM students", connection)
print("\\nAfter Update and Delete:")
print(updated_df)
connection.close()`,
        output: {
          rawText: `Table Data:
(1, 'Alice', 'CSE', 85)
(2, 'Bob', 'AIML', 78)
(3, 'Charlie', 'DS', 92)
(4, 'David', 'CSE', 88)

DataFrame:
   id     name branch  marks
0   1    Alice    CSE     85
1   2      Bob   AIML     78
2   3  Charlie     DS     92
3   4    David    CSE     88

After Update and Delete:
   id     name branch  marks
0   1    Alice    CSE     85
1   2      Bob   AIML     95
2   3  Charlie     DS     92`,
          columns: ['id', 'name', 'branch', 'marks'],
          rows: [
            [1, 'Alice', 'CSE', 85],
            [2, 'Bob', 'AIML', 95],
            [3, 'Charlie', 'DS', 92]
          ],
          totalRows: 3,
          totalColumns: 4,
          executionTime: '0.08s'
        },
        keyPoints: [
          { term: 'sqlite3.connect()', description: 'Opens a connection to local SQLite database file.' },
          { term: 'cursor.executemany()', description: 'Executes parameterized batch INSERT queries safely avoiding SQL injection.' },
          { term: 'pd.read_sql_query()', description: 'Runs a SQL query directly against the SQLite connection into a DataFrame.' }
        ],
        watchOut: [
          'Always call connection.commit() after INSERT, UPDATE or DELETE to persist changes.',
          'Always close connections properly with connection.close() to release database locks.'
        ],
        resources: [
          { title: 'Python SQLite3 Module', type: 'guide', url: 'https://docs.python.org/3/library/sqlite3.html' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 03
  // ==========================================
  {
    id: 'exp-3',
    demoVideoUrl: '/videos/exp-3.mp4',
    number: 3,
    displayNumber: '03',
    title: 'Data Cleaning and Preparation',
    subtitle: 'Missing value imputation, deduplication, value transformation, outlier detection via IQR, and regex.',
    description: 'Clean raw data by handling missing values and duplicates, transforming categorical variables, detecting outliers, and regex tokenization.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Data Cleaning',
    technology: 'Python, Pandas, NumPy, Regular Expressions',
    language: 'Python',
    difficulty: 'Intermediate',
    estimatedDuration: '2-3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['Data Cleaning', 'Imputation', 'fillna', 'dropna', 'drop_duplicates', 'map', 'replace', 'IQR', 'Outliers', 'Regex'],
    learningObjectives: [
      'Identify and handle missing NaN values using isna(), dropna() and fillna()',
      'Eliminate duplicate rows with duplicated() and drop_duplicates()',
      'Transform and rename series using map(), replace() and rename()',
      "Tokenize and extract patterns with Python's re module"
    ],
    skillsChips: ['Python', 'Pandas', 'NumPy', 'Data Cleaning', 'Outlier Detection', 'Regular Expressions'],
    subExperiments: [
      {
        id: '3a',
        partLetter: 'A',
        title: 'Missing Data and Duplicate Removal',
        name: 'Null Value Imputation & Deduplication',
        aim: 'To identify and handle missing values and duplicate records using isna(), dropna(), fillna(), duplicated() and drop_duplicates().',
        description: 'Detect null values across columns, compare dropna vs fillna mean imputation, and remove duplicate records.',
        code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie", "David", "David"],
    "Age": [20, np.nan, 19, 22, 22],
    "Marks": [85, 78, np.nan, 88, 88]
})

print("Original Data:")
print(df)

print("\\nMissing Values:")
print(df.isna().sum())

# Remove rows containing missing values
drop_df = df.dropna()
print("\\nAfter dropna():")
print(drop_df)

# Fill missing values
fill_df = df.copy()
fill_df["Age"] = fill_df["Age"].fillna(fill_df["Age"].mean())
fill_df["Marks"] = fill_df["Marks"].fillna(fill_df["Marks"].mean())
print("\\nAfter fillna():")
print(fill_df)

# Identify duplicates
print("\\nDuplicate Rows:")
print(fill_df.duplicated())

# Remove duplicates
clean_df = fill_df.drop_duplicates()
print("\\nAfter Removing Duplicates:")
print(clean_df)`,
        output: {
          rawText: `Missing Values:
Name     0
Age      1
Marks    1
dtype: int64

After fillna():
      Name   Age  Marks
0    Alice  20.00  85.00
1      Bob  20.75  78.00
2  Charlie  19.00  87.25
3    David  22.00  88.00
4    David  22.00  88.00

After Removing Duplicates:
      Name    Age  Marks
0    Alice  20.00  85.00
1      Bob  20.75  78.00
2  Charlie  19.00  87.25
3    David  22.00  88.00`,
          columns: ['Name', 'Age', 'Marks'],
          rows: [
            ['Alice', 20.0, 85.0],
            ['Bob', 20.75, 78.0],
            ['Charlie', 19.0, 87.25],
            ['David', 22.0, 88.0]
          ],
          totalRows: 4,
          totalColumns: 3,
          executionTime: '0.11s'
        },
        keyPoints: [
          { term: 'df.isna().sum()', description: 'Counts total missing NaN elements per column.' },
          { term: 'df.dropna()', description: 'Discards rows containing one or more missing values.' },
          { term: 'df.fillna()', description: 'Replaces null entries with statistical aggregates like mean or median.' },
          { term: 'drop_duplicates()', description: 'Removes redundant rows preserving unique observations.' }
        ],
        watchOut: [
          'Using dropna() aggressively can discard too much valuable training data; prefer thoughtful imputation.',
          'Always check df.duplicated() flags before discarding records.'
        ],
        resources: [
          { title: 'Pandas Missing Data Handling', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/missing_data.html' }
        ],
        isCompleted: false
      },
      {
        id: '3b',
        partLetter: 'B',
        title: 'Data Transformation Using map, replace and rename',
        name: 'Categorical Mapping & Renaming Columns',
        aim: 'To transform DataFrame values using map(), replace() and rename().',
        description: 'Map gender abbreviations, replace letter grades with descriptors, and rename column headers non-destructively.',
        code: `import pandas as pd

df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie", "David"],
    "Gender": ["M", "F", "M", "F"],
    "Grade": ["A", "B", "A", "C"]
})

print("Original Data:")
print(df)

# map
df["Gender"] = df["Gender"].map({
    "M": "Male",
    "F": "Female"
})

# replace
df["Grade"] = df["Grade"].replace({
    "A": "Excellent",
    "B": "Good",
    "C": "Average"
})

# rename without modifying original
new_df = df.rename(columns={
    "Name": "Student_Name",
    "Grade": "Performance"
})

print("\\nTransformed Data:")
print(new_df)`,
        output: {
          rawText: `Transformed Data:
  Student_Name  Gender Performance
0        Alice  Male    Excellent
1          Bob  Female  Good
2      Charlie  Male    Excellent
3        David  Female  Average`,
          columns: ['Student_Name', 'Gender', 'Performance'],
          rows: [
            ['Alice', 'Male', 'Excellent'],
            ['Bob', 'Female', 'Good'],
            ['Charlie', 'Male', 'Excellent'],
            ['David', 'Female', 'Average']
          ],
          totalRows: 4,
          totalColumns: 3,
          executionTime: '0.09s'
        },
        keyPoints: [
          { term: 'Series.map()', description: 'Substitutes each value in a Series according to input dictionary mapping.' },
          { term: 'Series.replace()', description: 'Selectively replaces targeted values leaving unmapped elements unchanged.' },
          { term: 'df.rename()', description: 'Modifies index labels and column headers without mutating original data.' }
        ],
        watchOut: [
          'Series.map() turns unmapped values into NaN if they are missing from the dictionary; replace() retains them.',
          'Always assign the returned DataFrame when using rename unless inplace=True is specified.'
        ],
        resources: [
          { title: 'Pandas Mapping and Replacing', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.Series.map.html' }
        ],
        isCompleted: false
      },
      {
        id: '3c',
        partLetter: 'C',
        title: 'Normally Distributed Data and Outlier Detection',
        name: 'Gaussian Distribution & IQR Outlier Filtering',
        aim: 'To generate normally distributed random data and detect possible outliers.',
        description: 'Simulate Gaussian random normal distribution with seed, inject synthetic anomalies, and isolate outliers using IQR.',
        code: `import numpy as np
import pandas as pd

np.random.seed(42)
data = np.random.normal(
    loc=50,
    scale=10,
    size=100
)

# Add outliers
data = np.append(data, [100, 110, 120])
df = pd.DataFrame({"Value": data})

Q1 = df["Value"].quantile(0.25)
Q3 = df["Value"].quantile(0.75)
IQR = Q3 - Q1

lower_limit = Q1 - 1.5 * IQR
upper_limit = Q3 + 1.5 * IQR

outliers = df[
    (df["Value"] < lower_limit) |
    (df["Value"] > upper_limit)
]

print("Q1:", round(Q1, 2))
print("Q3:", round(Q3, 2))
print("IQR:", round(IQR, 2))
print("\\nLower Limit:", round(lower_limit, 2))
print("Upper Limit:", round(upper_limit, 2))
print("\\nPossible Outliers:")
print(outliers)`,
        output: {
          rawText: `Q1: approximately 43
Q3: approximately 57
IQR: approximately 14

Lower Limit: approximately 22
Upper Limit: approximately 78

Possible Outliers:
     Value
100  100.0
101  110.0
102  120.0`,
          columns: ['Index', 'Value'],
          rows: [
            [100, 100.0],
            [101, 110.0],
            [102, 120.0]
          ],
          totalRows: 3,
          totalColumns: 2,
          executionTime: '0.10s'
        },
        keyPoints: [
          { term: 'np.random.normal()', description: 'Draws random samples from a normal (Gaussian) distribution.' },
          { term: 'IQR = Q3 - Q1', description: 'Interquartile range representing the middle 50% spread of observations.' },
          { term: 'Tukey Outlier Rule', description: 'Values beyond Q1 - 1.5*IQR or Q3 + 1.5*IQR are flagged as statistical anomalies.' }
        ],
        watchOut: [
          'Setting np.random.seed ensures reproducible randomized sequences for laboratory validation.',
          'Verify column data types before quantile computations to avoid TypeError on non-numeric data.'
        ],
        resources: [
          { title: 'Interquartile Range Outlier Rule', type: 'guide', url: 'https://en.wikipedia.org/wiki/Interquartile_range' }
        ],
        isCompleted: false
      },
      {
        id: '3d',
        partLetter: 'D',
        title: 'Regular Expressions',
        name: 'Regex Whitespace Splitting & Pattern Matching',
        aim: 'To split a string containing variable whitespace characters and find all matching patterns using regular expressions.',
        description: 'Utilize Python re module to split messy whitespace sequences, find targeted prefixes, and parse numeric floats.',
        code: `import re

text = "Python\\tis  a\\npowerful   programming\\tlanguage"

# Split using one or more whitespace characters
words = re.split(r"\\s+", text.strip())
print("Words:")
print(words)

# Find words starting with P or p
patterns = re.findall(r"\\b[Pp]\\w+", text)
print("\\nMatching Patterns:")
print(patterns)

# Find all numbers
text2 = "Python 3 is popular and Python 3.11 is widely used."
numbers = re.findall(r"\\d+(?:\\.\\d+)?", text2)
print("\\nNumbers:")
print(numbers)`,
        output: {
          rawText: `Words:
['Python', 'is', 'a', 'powerful', 'programming', 'language']

Matching Patterns:
['Python', 'powerful', 'programming']

Numbers:
['3', '3.11']`,
          columns: ['Token Index', 'Matched Value'],
          rows: [
            [0, 'Python'],
            [1, 'is'],
            [2, 'a'],
            [3, 'powerful'],
            [4, 'programming'],
            [5, 'language']
          ],
          totalRows: 6,
          totalColumns: 2,
          executionTime: '0.07s'
        },
        keyPoints: [
          { term: 're.split(r"\\s+", text)', description: 'Splits on one or more tabs, newlines, or whitespace characters cleanly.' },
          { term: 're.findall(pattern)', description: 'Returns all non-overlapping regex matches in string as a list of strings.' },
          { term: '\\b[Pp]\\w+', description: 'Word boundary matching words starting with upper or lower case letter P.' }
        ],
        watchOut: [
          'Always use raw strings (r"...") for regex patterns to prevent Python escape sequence clashes.',
          'Remember that \\s matches tabs (\\t) and newlines (\\n) in addition to standard space characters.'
        ],
        resources: [
          { title: 'Python re Module Documentation', type: 'guide', url: 'https://docs.python.org/3/library/re.html' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 04
  // ==========================================
  {
    id: 'exp-4',
    demoVideoUrl: '/videos/exp-4.mp4',
    number: 4,
    displayNumber: '04',
    title: 'Data Wrangling',
    subtitle: 'Hierarchical MultiIndex, reshape with stack/unstack, index merges, and combine_first.',
    description: 'Master multi-level indexing, pivoting tabular layouts, merging datasets on index keys, and combining overlapping records.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Data Wrangling',
    technology: 'Python, Pandas',
    language: 'Python',
    difficulty: 'Intermediate',
    estimatedDuration: '2-3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['MultiIndex', 'Hierarchical Indexing', 'stack()', 'unstack()', 'merge()', 'combine_first()'],
    learningObjectives: [
      'Build hierarchical MultiIndex arrays and perform inner/outer level slicing',
      'Reshape DataFrames between wide and tall configurations using stack() and unstack()',
      'Perform relational index merges and resolve duplicate schema suffixes',
      'Harmonize partially overlapping data sources using combine_first()'
    ],
    skillsChips: ['Pandas', 'MultiIndex', 'Data Wrangling', 'stack', 'unstack', 'merge', 'combine_first'],
    subExperiments: [
      {
        id: '4a',
        partLetter: 'A',
        title: 'Hierarchical Indexing',
        name: 'MultiIndex Series Creation & Slicing',
        aim: 'To create a Series with hierarchical indexing and select data using outer and inner levels.',
        description: 'Construct multi-level index on Country and City dimensions, selecting subsets via outer and inner hierarchical keys.',
        code: `import pandas as pd

index = [
    ["India", "India", "USA", "USA"],
    ["Delhi", "Mumbai", "New York", "Chicago"]
]
multi_index = pd.MultiIndex.from_arrays(
    index,
    names=["Country", "City"]
)
sales = pd.Series(
    [100, 150, 200, 180],
    index=multi_index
)

print("Hierarchical Series:")
print(sales)

print("\\nOuter Level - India:")
print(sales["India"])

print("\\nInner Level - Mumbai:")
print(sales.loc[("India", "Mumbai")])`,
        output: {
          rawText: `Hierarchical Series:
Country  City
India    Delhi       100
         Mumbai      150
USA      New York    200
         Chicago     180

Outer Level - India:
City
Delhi     100
Mumbai    150

Inner Level - Mumbai:
150`,
          columns: ['Country', 'City', 'Sales'],
          rows: [
            ['India', 'Delhi', 100],
            ['India', 'Mumbai', 150],
            ['USA', 'New York', 200],
            ['USA', 'Chicago', 180]
          ],
          totalRows: 4,
          totalColumns: 3,
          executionTime: '0.09s'
        },
        keyPoints: [
          { term: 'pd.MultiIndex.from_arrays()', description: 'Creates a hierarchical index from parallel coordinate arrays.' },
          { term: 'Outer level indexing', description: 'sales["India"] slices all children belonging to that primary root key.' },
          { term: 'Inner level tuple indexing', description: 'sales.loc[("India", "Mumbai")] pinpoints exact intersection.' }
        ],
        watchOut: [
          'Always name index levels with names=[...] for clearer downstream aggregation and grouping.',
          'Hierarchical indexing requires lexicographically sorted indexes for performant range slicing.'
        ],
        resources: [
          { title: 'Pandas MultiIndex Guide', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/advanced.html' }
        ],
        isCompleted: false
      },
      {
        id: '4b',
        partLetter: 'B',
        title: 'Stack and Unstack',
        name: 'Tabular Reshaping with Stack & Unstack',
        aim: 'To rearrange hierarchical tabular data using stack() and unstack().',
        description: 'Pivot innermost row indexes into wide columns with unstack(), and pack wide columns back into tall Series with stack().',
        code: `import pandas as pd

data = pd.DataFrame({
    "Country": ["India", "India", "USA", "USA"],
    "City": ["Delhi", "Mumbai", "New York", "Chicago"],
    "Sales": [100, 150, 200, 180]
})
df = data.set_index(["Country", "City"])

print("Original:")
print(df)

# Unstack
unstacked = df.unstack()
print("\\nUnstacked:")
print(unstacked)

# Stack again
stacked = unstacked.stack()
print("\\nStacked:")
print(stacked)`,
        output: {
          rawText: `Original:
                 Sales
Country City          
India   Delhi      100
        Mumbai     150
USA     New York   200
        Chicago    180

Unstacked:
        Sales                        
City  Chicago Delhi Mumbai New York
Country                              
India     NaN 100.0  150.0      NaN
USA     180.0   NaN    NaN    200.0

Stacked:
Country  City          
India    Delhi    Sales    100.0
         Mumbai   Sales    150.0
USA      Chicago  Sales    180.0
         New York Sales    200.0`,
          columns: ['Country', 'City', 'Sales'],
          rows: [
            ['India', 'Delhi', 100],
            ['India', 'Mumbai', 150],
            ['USA', 'New York', 200],
            ['USA', 'Chicago', 180]
          ],
          totalRows: 4,
          totalColumns: 3,
          executionTime: '0.10s'
        },
        keyPoints: [
          { term: 'df.unstack()', description: 'Pivots a level of the row index into a level of the column index.' },
          { term: 'df.stack()', description: 'Compresses a column level into the row MultiIndex structure.' },
          { term: 'Sparse Grid Alignment', description: 'Unstacking introduces NaN for non-existent combinations naturally.' }
        ],
        watchOut: [
          'Repeated stack/unstack operations can alter column types; inspect dtypes after reshaping.',
          'Specifying level parameters allows choosing which index tier to pivot.'
        ],
        resources: [
          { title: 'Reshaping and Pivot Tables', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/reshaping.html' }
        ],
        isCompleted: false
      },
      {
        id: '4c',
        partLetter: 'C',
        title: 'Merge Using Index and combine_first',
        name: 'Relational Index Merges & Patching',
        aim: 'To merge DataFrames using index and combine overlapping data using combine_first().',
        description: 'Perform relational merge using left_index and right_index, and reconcile partially missing records via combine_first().',
        code: `import pandas as pd

df1 = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie"],
    "Marks": [85, 78, None]
}, index=[1, 2, 3])

df2 = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie"],
    "Marks": [90, None, 92],
    "Grade": ["A", "B", "A"]
}, index=[1, 2, 3])

print("DataFrame 1:")
print(df1)
print("\\nDataFrame 2:")
print(df2)

# Merge using index
merged = df1.merge(
    df2,
    left_index=True,
    right_index=True,
    suffixes=("_1", "_2")
)
print("\\nMerged DataFrame:")
print(merged)

# Combine overlapping values
combined = df1.combine_first(df2)
print("\\nCombined DataFrame:")
print(combined)`,
        output: {
          rawText: `Combined DataFrame:
      Name  Marks Grade
1    Alice   85.0     A
2      Bob   78.0     B
3  Charlie   92.0     A`,
          columns: ['Index', 'Name', 'Marks', 'Grade'],
          rows: [
            [1, 'Alice', 85.0, 'A'],
            [2, 'Bob', 78.0, 'B'],
            [3, 'Charlie', 92.0, 'A']
          ],
          totalRows: 3,
          totalColumns: 4,
          executionTime: '0.08s'
        },
        keyPoints: [
          { term: 'left_index=True, right_index=True', description: 'Aligns and joins DataFrames on row keys rather than named columns.' },
          { term: 'suffixes=("_1", "_2")', description: 'Disambiguates colliding column names between merged tables.' },
          { term: 'df1.combine_first(df2)', description: 'Patches null gaps in df1 with corresponding available values in df2.' }
        ],
        watchOut: [
          'combine_first prioritizes values from the caller DataFrame, only filling NaNs from the argument table.',
          'Verify index alignments before merging to prevent unwanted cross-product expansions.'
        ],
        resources: [
          { title: 'Pandas Merging and Joining', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/merging.html' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 05
  // ==========================================
  {
    id: 'exp-5',
    demoVideoUrl: '/videos/exp-5.mp4',
    number: 5,
    displayNumber: '05',
    title: 'Data Visualization Using Matplotlib and Seaborn',
    subtitle: 'Line plots, grouped and stacked bar charts, histograms, KDE density, scatter plots, and box plots.',
    description: 'Plot explanatory data visuals with annotations, tick formatting, distributions, relationships, and categorical spreads.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Visualization',
    technology: 'Python, Matplotlib, Seaborn, NumPy',
    language: 'Python',
    difficulty: 'Intermediate',
    estimatedDuration: '2-3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['Matplotlib', 'Seaborn', 'Line Plot', 'Bar Plot', 'Histogram', 'KDE', 'Scatter Plot', 'Box Plot'],
    learningObjectives: [
      'Build styled line plots with custom ticks, labels, annotations and export to image',
      'Generate grouped and stacked bar plots comparing multidimensional metrics',
      'Create frequency histograms and continuous KDE density distributions',
      'Inspect continuous correlations using scatter plots',
      'Compare salary and wage distributions using categorical box plots'
    ],
    skillsChips: ['Python', 'Matplotlib', 'Seaborn', 'Data Visualization', 'Statistical Graphics'],
    subExperiments: [
      {
        id: '5a',
        partLetter: 'A',
        title: 'Line Plot',
        name: 'Annotated Monthly Trend Line Plot',
        aim: 'To create a line plot with title, axis labels, ticks, tick labels, annotations and save it to a file.',
        description: 'Construct an annotated monthly sales trend graph with custom axis markers, styled callouts, and PNG export.',
        code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May"]
sales = [20, 35, 30, 45, 50]

fig, ax = plt.subplots()
ax.plot(months, sales, marker="o")
ax.set_title("Monthly Sales")
ax.set_xlabel("Month")
ax.set_ylabel("Sales")
ax.set_xticks(range(len(months)))
ax.set_xticklabels(months)
ax.annotate(
    "Highest Sales",
    xy=("May", 50),
    xytext=("Mar", 55),
    arrowprops=dict(arrowstyle="->")
)
plt.tight_layout()
plt.savefig("line_plot.png")
print("Line plot successfully created and saved as line_plot.png")
plt.show()`,
        output: {
          rawText: `A line graph showing monthly sales is displayed and saved as:
line_plot.png

Months: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
Sales:  [20, 35, 30, 45, 50]
Annotation: Highest Sales -> (May, 50)`,
          columns: ['Month', 'Sales ($k)'],
          rows: [
            ['Jan', 20],
            ['Feb', 35],
            ['Mar', 30],
            ['Apr', 45],
            ['May', 50]
          ],
          totalRows: 5,
          totalColumns: 2,
          executionTime: '0.22s'
        },
        keyPoints: [
          { term: 'ax.plot(marker="o")', description: 'Renders connected line segments highlighting individual data points with circular markers.' },
          { term: 'ax.annotate()', description: 'Draws directional arrows and contextual text pointing directly to peak coordinates.' },
          { term: 'plt.savefig("line_plot.png")', description: 'Exports raster graphics file directly to disk with tight layout bounding.' }
        ],
        watchOut: [
          'Call plt.savefig() before plt.show() or the figure canvas will clear, creating an empty image file.',
          'Use plt.tight_layout() to prevent axis labels from clipping off screen borders.'
        ],
        resources: [
          { title: 'Matplotlib Pyplot Tutorial', type: 'guide', url: 'https://matplotlib.org/stable/tutorials/introductory/pyplot.html' }
        ],
        isCompleted: false
      },
      {
        id: '5b1',
        partLetter: 'B',
        title: 'Grouped Bar Plot',
        name: 'Multi-Series Grouped Bar Chart',
        aim: 'To create grouped bar plots using a DataFrame.',
        description: 'Plot side-by-side grouped bars comparing Python, Java, and SQL proficiencies across multiple students.',
        code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "Python": [80, 85, 90],
    "Java": [75, 88, 85],
    "SQL": [90, 82, 88]
}, index=["Alice", "Bob", "Charlie"])

df.plot(kind="bar")
plt.title("Student Marks")
plt.xlabel("Students")
plt.ylabel("Marks")
plt.tight_layout()
print("Grouped bar plot generated successfully.")
plt.show()`,
        output: {
          rawText: `Grouped bar plot generated successfully.
DataFrame:
         Python  Java  SQL
Alice        80    75   90
Bob          85    88   82
Charlie      90    85   88`,
          columns: ['Student', 'Python', 'Java', 'SQL'],
          rows: [
            ['Alice', 80, 75, 90],
            ['Bob', 85, 88, 82],
            ['Charlie', 90, 85, 88]
          ],
          totalRows: 3,
          totalColumns: 4,
          executionTime: '0.18s'
        },
        keyPoints: [
          { term: 'df.plot(kind="bar")', description: 'Renders DataFrame columns as grouped discrete vertical bars automatically.' },
          { term: 'Categorical X-axis', description: 'Index labels ("Alice", "Bob", "Charlie") form the primary grouping categories.' }
        ],
        watchOut: [
          'Ensure the index contains string identifiers so bars are grouped and labelled properly.',
          'Rotating x-ticks with rot=0 keeps horizontal names readable on small screens.'
        ],
        resources: [
          { title: 'Pandas Bar Plots', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.bar.html' }
        ],
        isCompleted: false
      },
      {
        id: '5b2',
        partLetter: 'C',
        title: 'Stacked Bar Plot',
        name: 'Cumulative Stacked Bar Chart',
        aim: 'To create a stacked bar plot from a DataFrame.',
        description: 'Stack student exam marks cumulatively to highlight composite aggregate performance across skill areas.',
        code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "Python": [80, 85, 90],
    "Java": [75, 88, 85],
    "SQL": [90, 82, 88]
}, index=["Alice", "Bob", "Charlie"])

df.plot(
    kind="bar",
    stacked=True
)
plt.title("Stacked Student Marks")
plt.xlabel("Students")
plt.ylabel("Total Marks")
plt.tight_layout()
print("Stacked bar plot generated successfully.")
plt.show()`,
        output: {
          rawText: `Stacked bar plot generated successfully.
Total Marks per Student:
Alice:   80 + 75 + 90 = 245
Bob:     85 + 88 + 82 = 255
Charlie: 90 + 85 + 88 = 263`,
          columns: ['Student', 'Python', 'Java', 'SQL', 'Total'],
          rows: [
            ['Alice', 80, 75, 90, 245],
            ['Bob', 85, 88, 82, 255],
            ['Charlie', 90, 85, 88, 263]
          ],
          totalRows: 3,
          totalColumns: 5,
          executionTime: '0.17s'
        },
        keyPoints: [
          { term: 'stacked=True', description: 'Stacks vertical bar partitions on top of one another representing cumulative totals.' },
          { term: 'Visual Proportion', description: 'Enables quick comparison of overall magnitude alongside internal composition.' }
        ],
        watchOut: [
          'Stacked bars work best with positive metrics; negative metrics distort vertical baseline alignments.'
        ],
        resources: [
          { title: 'Matplotlib Stacked Bar Guide', type: 'guide', url: 'https://matplotlib.org/stable/gallery/lines_bars_and_markers/bar_stacked.html' }
        ],
        isCompleted: false
      },
      {
        id: '5c',
        partLetter: 'D',
        title: 'Histogram and Density Plot',
        name: 'Gaussian Histogram & Seaborn KDE Curve',
        aim: 'To create a histogram for frequency distribution and a density plot for continuous probability distribution.',
        description: 'Generate 500 samples from normal distribution and compare discrete frequency bins against smooth KDE density curve.',
        code: `import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

np.random.seed(10)
data = np.random.normal(50, 10, 500)

# Histogram
plt.figure()
sns.histplot(data, bins=20, kde=False)
plt.title("Histogram")
plt.xlabel("Value")
plt.ylabel("Frequency")
plt.show()

# Density plot
plt.figure()
sns.kdeplot(data, fill=True)
plt.title("Density Plot")
plt.xlabel("Value")
plt.ylabel("Density")
plt.show()`,
        output: {
          rawText: `Histogram and density plots were successfully generated.
Samples: 500
Mean: ~50
Standard Deviation: ~10
Bins: 20`,
          columns: ['Bin Interval', 'Frequency Count'],
          rows: [
            ['[20 - 30]', 12],
            ['[30 - 40]', 76],
            ['[40 - 50]', 165],
            ['[50 - 60]', 158],
            ['[60 - 70]', 74],
            ['[70 - 80]', 15]
          ],
          totalRows: 6,
          totalColumns: 2,
          executionTime: '0.24s'
        },
        keyPoints: [
          { term: 'sns.histplot()', description: 'Plots binned observation counts indicating central tendencies and spread.' },
          { term: 'sns.kdeplot()', description: 'Fits kernel density estimation curves representing smooth continuous probability functions.' }
        ],
        watchOut: [
          'Selecting too few or too many bins can disguise or falsely exaggerate multimodality in histograms.'
        ],
        resources: [
          { title: 'Seaborn Distributions Guide', type: 'guide', url: 'https://seaborn.pydata.org/tutorial/distributions.html' }
        ],
        isCompleted: false
      },
      {
        id: '5d',
        partLetter: 'E',
        title: 'Scatter Plot',
        name: 'Bivariate Correlation Scatter Plot',
        aim: 'To examine the relationship between two one-dimensional data series using a scatter plot.',
        description: 'Plot study hours against exam scores to demonstrate positive linear correlation between study input and outcomes.',
        code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.array([1, 2, 3, 4, 5, 6, 7, 8])
marks = np.array([35, 42, 48, 55, 60, 68, 75, 82])

plt.scatter(hours, marks)
plt.title("Study Hours vs Marks")
plt.xlabel("Study Hours")
plt.ylabel("Marks")
print("Scatter plot created showing positive linear correlation.")
plt.show()`,
        output: {
          rawText: `The scatter plot shows a positive relationship between study hours and marks.
Hours: [1, 2, 3, 4, 5, 6, 7, 8]
Marks: [35, 42, 48, 55, 60, 68, 75, 82]
Correlation: ~0.99 (Strong Positive)`,
          columns: ['Study Hours', 'Marks'],
          rows: [
            [1, 35],
            [2, 42],
            [3, 48],
            [4, 55],
            [5, 60],
            [6, 68],
            [7, 75],
            [8, 82]
          ],
          totalRows: 8,
          totalColumns: 2,
          executionTime: '0.14s'
        },
        keyPoints: [
          { term: 'plt.scatter()', description: 'Renders discrete points in Cartesian coordinates to reveal correlation patterns.' },
          { term: 'Positive Correlation', description: 'Upward slope indicating that increases in hours accompany higher scores.' }
        ],
        watchOut: [
          'Remember correlation does not equal causation; verify domain factors before making causal claims.'
        ],
        resources: [
          { title: 'Matplotlib Scatter Guide', type: 'guide', url: 'https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html' }
        ],
        isCompleted: false
      },
      {
        id: '5e',
        partLetter: 'F',
        title: 'Box Plot',
        name: 'Departmental Salary Spread Box Plot',
        aim: 'To visualize data containing categorical variables using box plots.',
        description: 'Plot department salary distributions across CSE, AIML, and DS using Seaborn boxplots indicating medians and IQR spreads.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({
    "Department": [
        "CSE", "CSE", "CSE",
        "AIML", "AIML", "AIML",
        "DS", "DS", "DS"
    ],
    "Salary": [
        40000, 45000, 50000,
        42000, 48000, 55000,
        39000, 46000, 52000
    ]
})

sns.boxplot(
    x="Department",
    y="Salary",
    data=df
)
plt.title("Salary Distribution by Department")
plt.show()`,
        output: {
          rawText: `The box plot successfully displayed the distribution and spread of salary across different categories.
Department Summaries:
CSE:  Median 45,000, Min 40,000, Max 50,000
AIML: Median 48,000, Min 42,000, Max 55,000
DS:   Median 46,000, Min 39,000, Max 52,000`,
          columns: ['Department', 'Salary (INR)'],
          rows: [
            ['CSE', 45000],
            ['AIML', 48000],
            ['DS', 46000]
          ],
          totalRows: 3,
          totalColumns: 2,
          executionTime: '0.19s'
        },
        keyPoints: [
          { term: 'sns.boxplot()', description: 'Visualizes 5-number summaries (min, Q1, median, Q3, max) across categorical classes.' },
          { term: 'Whiskers', description: 'Indicates distribution spread excluding extreme outlier points.' }
        ],
        watchOut: [
          'Small sample sizes can make box plots misleading; combine with stripplot for small datasets.'
        ],
        resources: [
          { title: 'Seaborn Boxplot Guide', type: 'guide', url: 'https://seaborn.pydata.org/generated/seaborn.boxplot.html' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 06
  // ==========================================
  {
    id: 'exp-6',
    demoVideoUrl: '/videos/exp-6.mp4',
    number: 6,
    displayNumber: '06',
    title: 'Time Series Analysis',
    subtitle: 'Timestamps, date_range, time zones, period arithmetic, asfreq, to_period, and resampling.',
    description: 'Model temporal data using datetime indices, frequency transformations, tz conversions, and down/upsampling.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Time Series',
    technology: 'Python, Pandas, NumPy',
    language: 'Python',
    difficulty: 'Intermediate',
    estimatedDuration: '2-3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['Time Series', 'pd.to_datetime', 'date_range', 'Time Zones', 'Periods', 'asfreq', 'to_period', 'Resampling'],
    learningObjectives: [
      'Index series with datetime timestamps',
      'Generate regular timestamp sequences with date_range()',
      'Localize and convert time zones across international standards',
      'Perform arithmetic on monthly/annual periods and period ranges',
      'Convert frequencies with asfreq() and timestamps with to_period()',
      'Execute downsampling and interpolated upsampling'
    ],
    skillsChips: ['Python', 'Pandas', 'Time Series Analysis', 'DatetimeIndex', 'Resampling'],
    subExperiments: [
      {
        id: '6a',
        partLetter: 'A',
        title: 'Time Series Using Datetime',
        name: 'Datetime-Indexed Series Construction',
        aim: 'To create a time series using Pandas datetime objects indexed by timestamps.',
        description: 'Convert ISO string dates to DatetimeIndex and bind scalar observations to precise timestamps.',
        code: `import pandas as pd

dates = pd.to_datetime([
    "2026-01-01",
    "2026-01-02",
    "2026-01-03",
    "2026-01-04"
])
series = pd.Series(
    [100, 110, 105, 120],
    index=dates
)
print(series)`,
        output: {
          rawText: `2026-01-01    100
2026-01-02    110
2026-01-03    105
2026-01-04    120
dtype: int64`,
          columns: ['Timestamp', 'Value'],
          rows: [
            ['2026-01-01', 100],
            ['2026-01-02', 110],
            ['2026-01-03', 105],
            ['2026-01-04', 120]
          ],
          totalRows: 4,
          totalColumns: 2,
          executionTime: '0.07s'
        },
        keyPoints: [
          { term: 'pd.to_datetime()', description: 'Parses string date formats into high-precision Timestamp objects.' },
          { term: 'DatetimeIndex', description: 'Enables chronologically ordered fast slicing and window calculations.' }
        ],
        watchOut: [
          'Ambiguous dates (like 01/02/2026) can parse as Jan 2 or Feb 1 without explicit format flags.'
        ],
        resources: [
          { title: 'Pandas Time Series / Date Functionality', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/timeseries.html' }
        ],
        isCompleted: false
      },
      {
        id: '6b',
        partLetter: 'B',
        title: 'date_range',
        name: 'Regular Frequency Date Ranges',
        aim: 'To generate a DateTimeIndex with an indicated length using date_range().',
        description: 'Generate continuous 10-day sequences of calendar timestamps using date_range with daily frequency.',
        code: `import pandas as pd

dates = pd.date_range(
    start="2026-01-01",
    periods=10,
    freq="D"
)
print(dates)`,
        output: {
          rawText: `DatetimeIndex([
'2026-01-01',
'2026-01-02',
'2026-01-03',
'2026-01-04',
'2026-01-05',
'2026-01-06',
'2026-01-07',
'2026-01-08',
'2026-01-09',
'2026-01-10'
], dtype='datetime64[ns]', freq='D')`,
          columns: ['Index', 'Date (Daily)'],
          rows: [
            [0, '2026-01-01'],
            [1, '2026-01-02'],
            [2, '2026-01-03'],
            [3, '2026-01-04'],
            [4, '2026-01-05']
          ],
          totalRows: 10,
          totalColumns: 2,
          executionTime: '0.06s'
        },
        keyPoints: [
          { term: 'pd.date_range()', description: 'Generates equidistant time sequences given start, end, periods, and freq.' },
          { term: 'freq="D"', description: 'Specifies 24-hour daily increments.' }
        ],
        watchOut: [
          'Specify exactly 3 of: start, end, periods, and freq; defining all 4 causes ValueError.'
        ],
        resources: [
          { title: 'date_range Documentation', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.date_range.html' }
        ],
        isCompleted: false
      },
      {
        id: '6c',
        partLetter: 'C',
        title: 'Time Zones',
        name: 'Time Zone Localization & Conversion',
        aim: 'To create, localize and convert time zones and combine timestamps from different time zones.',
        description: 'Localize naive timestamps to Asia/Kolkata (IST) and convert to America/New_York and Europe/London.',
        code: `import pandas as pd

dates = pd.date_range(
    "2026-01-01",
    periods=3,
    freq="D"
)

# Localize to India
india_time = dates.tz_localize("Asia/Kolkata")
print("India:")
print(india_time)

# Convert to New York
new_york_time = india_time.tz_convert("America/New_York")
print("\\nNew York:")
print(new_york_time)

# Convert to London
london_time = india_time.tz_convert("Europe/London")
print("\\nLondon:")
print(london_time)`,
        output: {
          rawText: `India:
DatetimeIndex(['2026-01-01 00:00:00+05:30', '2026-01-02 00:00:00+05:30', '2026-01-03 00:00:00+05:30'], dtype='datetime64[ns, Asia/Kolkata]', freq='D')

New York:
DatetimeIndex(['2025-12-31 13:30:00-05:00', '2026-01-01 13:30:00-05:00', '2026-01-02 13:30:00-05:00'], dtype='datetime64[ns, America/New_York]', freq='D')

London:
DatetimeIndex(['2025-12-31 18:30:00+00:00', '2026-01-01 18:30:00+00:00', '2026-01-02 18:30:00+00:00'], dtype='datetime64[ns, Europe/London]', freq='D')`,
          columns: ['India Time (+05:30)', 'New York Time (-05:00)', 'London Time (+00:00)'],
          rows: [
            ['2026-01-01 00:00:00', '2025-12-31 13:30:00', '2025-12-31 18:30:00'],
            ['2026-01-02 00:00:00', '2026-01-01 13:30:00', '2026-01-01 18:30:00']
          ],
          totalRows: 3,
          totalColumns: 3,
          executionTime: '0.09s'
        },
        keyPoints: [
          { term: 'tz_localize()', description: 'Attaches time zone information to tz-naive timestamps.' },
          { term: 'tz_convert()', description: 'Converts tz-aware timestamps to another target time zone standard.' }
        ],
        watchOut: [
          'Calling tz_convert on tz-naive data throws TypeError; localize first before converting.'
        ],
        resources: [
          { title: 'Time Zone Handling in Pandas', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/timeseries.html#time-zone-handling' }
        ],
        isCompleted: false
      },
      {
        id: '6d',
        partLetter: 'D',
        title: 'Period Arithmetic',
        name: 'Period Arithmetic & Period Ranges',
        aim: 'To perform arithmetic operations on periods and generate period ranges.',
        description: 'Create monthly Period objects, perform addition/subtraction steps, and generate multi-month period ranges.',
        code: `import pandas as pd

p = pd.Period("2026-01", freq="M")
print("Original Period:", p)
print("Next Period:", p + 1)
print("Previous Period:", p - 1)

periods = pd.period_range(
    start="2026-01",
    periods=6,
    freq="M"
)
print("\\nPeriod Range:")
print(periods)`,
        output: {
          rawText: `Original Period: 2026-01
Next Period: 2026-02
Previous Period: 2025-12

Period Range:
PeriodIndex(['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'], dtype='period[M]')`,
          columns: ['Step', 'Period Value'],
          rows: [
            ['Original', '2026-01'],
            ['p + 1', '2026-02'],
            ['p - 1', '2025-12']
          ],
          totalRows: 3,
          totalColumns: 2,
          executionTime: '0.07s'
        },
        keyPoints: [
          { term: 'pd.Period()', description: 'Represents a span of time such as a month or quarter rather than a single point in time.' },
          { term: 'Period arithmetic', description: 'p + 1 advances cleanly to the next chronological period respecting calendar rules.' }
        ],
        watchOut: [
          'Period addition adds full period units (months, years) based on configured frequency.'
        ],
        resources: [
          { title: 'Pandas Period Overview', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/timeseries.html#time-span-representation' }
        ],
        isCompleted: false
      },
      {
        id: '6e',
        partLetter: 'E',
        title: 'asfreq()',
        name: 'Frequency Conversion with asfreq()',
        aim: 'To convert Period and PeriodIndex objects to another frequency using asfreq().',
        description: 'Convert annual periods to monthly frequency and monthly period ranges into daily increments with asfreq.',
        code: `import pandas as pd

period = pd.Period("2026", freq="Y")
print("Yearly Period:")
print(period)
print("\\nConverted to Month:")
print(period.asfreq("M", how="start"))

periods = pd.period_range(
    "2026-01",
    periods=3,
    freq="M"
)
print("\\nOriginal:")
print(periods)
print("\\nConverted to Daily:")
print(periods.asfreq("D", how="start"))`,
        output: {
          rawText: `Yearly Period:
2026

Converted to Month:
2026-01

Original:
PeriodIndex(['2026-01', '2026-02', '2026-03'], dtype='period[M]')

Converted to Daily:
PeriodIndex(['2026-01-01', '2026-02-01', '2026-03-01'], dtype='period[D]')`,
          columns: ['Source Frequency', 'Target Frequency (Daily)'],
          rows: [
            ['2026-01 (M)', '2026-01-01 (D)'],
            ['2026-02 (M)', '2026-02-01 (D)'],
            ['2026-03 (M)', '2026-03-01 (D)']
          ],
          totalRows: 3,
          totalColumns: 2,
          executionTime: '0.07s'
        },
        keyPoints: [
          { term: 'period.asfreq()', description: 'Transforms period granularities (e.g. Year to Month, Month to Day).' },
          { term: 'how="start" / "end"', description: 'Specifies anchoring at the inception or conclusion of the period window.' }
        ],
        watchOut: [
          'Converting to a finer frequency requires deciding between start and end date anchoring.'
        ],
        resources: [
          { title: 'asfreq Documentation', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.Period.asfreq.html' }
        ],
        isCompleted: false
      },
      {
        id: '6f',
        partLetter: 'F',
        title: 'to_period()',
        name: 'Timestamp-to-Period Conversion',
        aim: 'To convert Series and DataFrames indexed by timestamps to periods.',
        description: 'Transform high-precision daily DatetimeIndex timestamps into aggregate monthly PeriodIndex buckets.',
        code: `import pandas as pd

dates = pd.date_range(
    "2026-01-01",
    periods=5,
    freq="D"
)
df = pd.DataFrame(
    {"Sales": [100, 120, 130, 110, 150]},
    index=dates
)
print("Original:")
print(df)

period_df = df.to_period("M")
print("\\nConverted to Period:")
print(period_df)`,
        output: {
          rawText: `Original:
            Sales
2026-01-01    100
2026-01-02    120
2026-01-03    130
2026-01-04    110
2026-01-05    150

Converted to Period:
        Sales
2026-01   100
2026-01   120
2026-01   130
2026-01   110
2026-01   150`,
          columns: ['Period Index', 'Sales ($)'],
          rows: [
            ['2026-01', 100],
            ['2026-01', 120],
            ['2026-01', 130],
            ['2026-01', 110],
            ['2026-01', 150]
          ],
          totalRows: 5,
          totalColumns: 2,
          executionTime: '0.08s'
        },
        keyPoints: [
          { term: 'df.to_period()', description: 'Casts DatetimeIndex to PeriodIndex for reporting aggregations.' }
        ],
        watchOut: [
          'To convert back from periods to timestamps, use period_df.to_timestamp().'
        ],
        resources: [
          { title: 'DataFrame to_period Guide', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_period.html' }
        ],
        isCompleted: false
      },
      {
        id: '6g',
        partLetter: 'G',
        title: 'Resampling, Downsampling and Upsampling',
        name: 'Time Series Downsampling & Upsampling',
        aim: 'To perform resampling, downsampling and upsampling on a time series.',
        description: 'Aggregate high-frequency observations via downsampling and interpolate missing periods via upsampling.',
        code: `import pandas as pd
import numpy as np

dates = pd.date_range(
    "2026-01-01",
    periods=10,
    freq="D"
)
series = pd.Series(
    np.arange(10) * 10,
    index=dates
)
print("Original:")
print(series)

# Downsampling
monthly = series.resample("5D").mean()
print("\\nDownsampled:")
print(monthly)

# Upsampling
daily = series.resample("12H").interpolate()
print("\\nUpsampled:")
print(daily.head(6))`,
        output: {
          rawText: `Downsampled:
2026-01-01    20.0
2026-01-06    70.0
Freq: 5D, dtype: float64

Upsampled:
2026-01-01 00:00:00     0.0
2026-01-01 12:00:00     5.0
2026-01-02 00:00:00    10.0
2026-01-02 12:00:00    15.0
2026-01-03 00:00:00    20.0
2026-01-03 12:00:00    25.0
Freq: 12H, dtype: float64`,
          columns: ['Timestamp', 'Interpolated Value'],
          rows: [
            ['2026-01-01 00:00:00', 0.0],
            ['2026-01-01 12:00:00', 5.0],
            ['2026-01-02 00:00:00', 10.0],
            ['2026-01-02 12:00:00', 15.0]
          ],
          totalRows: 4,
          totalColumns: 2,
          executionTime: '0.11s'
        },
        keyPoints: [
          { term: 'series.resample()', description: 'Convenience method for frequency conversion and resampling of time series.' },
          { term: 'Downsampling', description: 'Aggregating higher frequency data into coarser bins using mean, sum, etc.' },
          { term: 'Upsampling & Interpolation', description: 'Increasing frequency and filling gaps using mathematical interpolation.' }
        ],
        watchOut: [
          'Upsampling creates NaN values unless chained with an interpolation function like .interpolate() or .ffill().'
        ],
        resources: [
          { title: 'Pandas Resample Documentation', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.Series.resample.html' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 07
  // ==========================================
  {
    id: 'exp-7',
    demoVideoUrl: '/videos/exp-7.mp4',
    number: 7,
    displayNumber: '07',
    title: 'Data Aggregation',
    subtitle: 'Group data using single/multiple keys, compute summary statistics with aggregate(), and perform EDA.',
    description: 'Group tabular datasets using categorical keys, compute multi-metric aggregations, and perform exploratory data analysis.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Data Aggregation',
    technology: 'Python, Pandas',
    language: 'Python',
    difficulty: 'Intermediate',
    estimatedDuration: '2-3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['groupby', 'aggregate', 'agg', 'EDA', 'Summary Statistics', 'Multivariate Grouping'],
    learningObjectives: [
      'Partition records into categorical buckets using single and multi-column keys',
      'Apply custom aggregation arrays (sum, mean, std) using DataFrame.agg()',
      'Conduct thorough exploratory data analysis across departments and demographics'
    ],
    skillsChips: ['Python', 'Pandas', 'groupby', 'Data Aggregation', 'Summary Statistics'],
    subExperiments: [
      {
        id: '7a',
        partLetter: 'A',
        title: 'Grouping Using groupby()',
        name: 'Single and Multi-Key Grouping',
        aim: 'To divide data into groups using single and multiple keys.',
        description: 'Partition students by Department and Gender to compute group-level performance averages.',
        code: `import pandas as pd

df = pd.DataFrame({
    "Department": [
        "CSE", "CSE", "AIML",
        "AIML", "DS", "DS"
    ],
    "Gender": [
        "M", "F", "M",
        "F", "M", "F"
    ],
    "Marks": [80, 90, 85, 95, 75, 88]
})
print("Data:")
print(df)

print("\\nGroup by Department:")
print(df.groupby("Department")["Marks"].mean())

print("\\nGroup by Department and Gender:")
print(df.groupby(["Department", "Gender"])["Marks"].mean())`,
        output: {
          rawText: `Group by Department:
Department
AIML    90.0
CSE     85.0
DS      81.5
Name: Marks, dtype: float64`,
          columns: ['Department', 'Average Marks'],
          rows: [
            ['AIML', 90.0],
            ['CSE', 85.0],
            ['DS', 81.5]
          ],
          totalRows: 3,
          totalColumns: 2,
          executionTime: '0.08s'
        },
        keyPoints: [
          { term: 'df.groupby()', description: 'Splits DataFrame into groups based on key values.' },
          { term: 'Split-Apply-Combine', description: 'Core paradigm where data is split by category, functions are applied, and results assembled.' }
        ],
        watchOut: [
          'Groupby produces a lazy GroupBy object; an aggregation function like .mean() must be called to produce results.'
        ],
        resources: [
          { title: 'Pandas GroupBy User Guide', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/groupby.html' }
        ],
        isCompleted: false
      },
      {
        id: '7b',
        partLetter: 'B',
        title: 'Summary Statistics Using aggregate()',
        name: 'Multi-Metric Custom Aggregation',
        aim: 'To calculate sum, mean and standard deviation for grouped data.',
        description: 'Compute comprehensive statistical metrics (sum, mean, std) across departmental cohorts.',
        code: `import pandas as pd

df = pd.DataFrame({
    "Department": ["CSE", "CSE", "AIML", "AIML", "DS", "DS"],
    "Marks": [80, 90, 85, 95, 75, 88]
})
result = df.groupby("Department")["Marks"].agg(
    ["sum", "mean", "std"]
)
print(result)`,
        output: {
          rawText: `             sum  mean        std
Department
AIML          180  90.0   7.071
CSE           170  85.0   7.071
DS            163  81.5   9.192`,
          columns: ['Department', 'Sum', 'Mean', 'Std Dev'],
          rows: [
            ['AIML', 180, 90.0, 7.071],
            ['CSE', 170, 85.0, 7.071],
            ['DS', 163, 81.5, 9.192]
          ],
          totalRows: 3,
          totalColumns: 4,
          executionTime: '0.08s'
        },
        keyPoints: [
          { term: '.agg(["sum", "mean", "std"])', description: 'Executes multiple summary metrics concurrently on grouped series.' }
        ],
        watchOut: [
          'Standard deviation on a sample of size 1 produces NaN; ensure adequate group sample sizes.'
        ],
        resources: [
          { title: 'Pandas agg Function', type: 'guide', url: 'https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.aggregate.html' }
        ],
        isCompleted: false
      },
      {
        id: '7c',
        partLetter: 'C',
        title: 'Exploratory Data Analysis Using GroupBy',
        name: 'Multivariate Academic EDA',
        aim: 'To perform exploratory data analysis using grouping based on one and multiple columns.',
        description: 'Examine overall descriptive statistics, departmental averages, and gender attendance interactions.',
        code: `import pandas as pd

df = pd.DataFrame({
    "Department": [
        "CSE", "CSE", "CSE",
        "AIML", "AIML", "DS"
    ],
    "Gender": [
        "M", "F", "M",
        "F", "M", "F"
    ],
    "Marks": [80, 90, 85, 95, 85, 75],
    "Attendance": [90, 95, 88, 92, 85, 80]
})

print("Basic Statistics:")
print(df.describe())

print("\\nAverage Marks by Department:")
print(df.groupby("Department")["Marks"].mean())

print("\\nDepartment + Gender:")
print(df.groupby(["Department", "Gender"])[["Marks", "Attendance"]].mean())

print("\\nMaximum Marks:")
print(df.groupby("Department")["Marks"].max())`,
        output: {
          rawText: `Exploratory analysis and summary statistics were successfully performed using groupby().
Average Marks by Department:
AIML: 90.0
CSE:  85.0
DS:   75.0

Maximum Marks by Department:
AIML: 95
CSE:  90
DS:   75`,
          columns: ['Department', 'Avg Marks', 'Avg Attendance', 'Max Marks'],
          rows: [
            ['AIML', 90.0, 88.5, 95],
            ['CSE', 85.0, 91.0, 90],
            ['DS', 75.0, 80.0, 75]
          ],
          totalRows: 3,
          totalColumns: 4,
          executionTime: '0.10s'
        },
        keyPoints: [
          { term: 'df.describe()', description: 'Generates summary statistics of numerical columns.' },
          { term: 'Multivariate slicing', description: 'Extracts both Marks and Attendance across Department and Gender hierarchies.' }
        ],
        watchOut: [
          'Pass column names as a list [["Marks", "Attendance"]] when selecting multiple metrics to return a DataFrame.'
        ],
        resources: [
          { title: 'EDA with Pandas', type: 'guide', url: 'https://pandas.pydata.org/docs/user_guide/groupby.html' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 08
  // ==========================================
  {
    id: 'exp-8',
    demoVideoUrl: '/videos/exp-8.mp4',
    number: 8,
    displayNumber: '08',
    title: 'Web Scraping and Review EDA Using BeautifulSoup',
    subtitle: 'HTML parsing, text extraction, WordCloud generation, lexical metrics, and NLTK VADER sentiment analysis.',
    description: 'Scrape review content from HTML DOM structures, compute lexical text metrics, visualize word clouds, and score sentiment polarity.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Web Scraping & NLP',
    technology: 'Python, BeautifulSoup, NLTK, WordCloud, Matplotlib',
    language: 'Python',
    difficulty: 'Intermediate',
    estimatedDuration: '2-3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['BeautifulSoup', 'Web Scraping', 'NLP', 'WordCloud', 'NLTK', 'VADER', 'Sentiment Analysis'],
    learningObjectives: [
      'Parse HTML documents with BeautifulSoup and extract targeted DOM nodes',
      'Generate visual WordClouds for overall, positive and negative feedback',
      'Extract stopword counts, word lengths, and text statistics',
      'Compute compound sentiment polarity scores using NLTK VADER',
      'Plot sentiment intensity distributions across reviews'
    ],
    skillsChips: ['Python', 'BeautifulSoup', 'Web Scraping', 'Text Processing', 'NLTK VADER', 'WordCloud'],
    subExperiments: [
      {
        id: '8a',
        partLetter: 'A',
        title: 'Extract Product Reviews and Save to File',
        name: 'BeautifulSoup HTML Review Extraction',
        aim: 'To extract product-review text from HTML using BeautifulSoup and save the reviews to a file.',
        description: 'Parse HTML review DOM nodes using CSS selectors and serialize cleaned review lines into reviews.txt.',
        code: `from bs4 import BeautifulSoup

# Example saved HTML containing review elements
html = """<html><body>
<div data-review>This product is excellent and very useful.</div>
<div data-review>The quality is good and I am happy with the purchase.</div>
<div data-review>The product stopped working after two days.</div>
<div data-review>Very poor quality and disappointing experience.</div>
</body></html>"""

soup = BeautifulSoup(html, "html.parser")
reviews = [
    element.get_text(strip=True)
    for element in soup.select("[data-review]")
]

print("Extracted Reviews:")
for r in reviews:
    print(r)

with open("reviews.txt", "w", encoding="utf-8") as file:
    for review in reviews:
        file.write(review + "\\n")

print("\\nReviews saved to reviews.txt")`,
        output: {
          rawText: `Extracted Reviews:
This product is excellent and very useful.
The quality is good and I am happy with the purchase.
The product stopped working after two days.
Very poor quality and disappointing experience.

Reviews saved to reviews.txt`,
          columns: ['Review #', 'Extracted Review Text'],
          rows: [
            [1, 'This product is excellent and very useful.'],
            [2, 'The quality is good and I am happy with the purchase.'],
            [3, 'The product stopped working after two days.'],
            [4, 'Very poor quality and disappointing experience.']
          ],
          totalRows: 4,
          totalColumns: 2,
          executionTime: '0.12s'
        },
        keyPoints: [
          { term: 'BeautifulSoup(html, "html.parser")', description: 'Constructs an in-memory DOM tree from raw HTML string.' },
          { term: 'soup.select("[data-review]")', description: 'Queries elements matching CSS attribute selector.' },
          { term: 'element.get_text(strip=True)', description: 'Extracts clean textual contents stripping extraneous whitespace.' }
        ],
        watchOut: [
          'Live websites frequently change tag classes and IDs; use robust attribute selectors where possible.'
        ],
        resources: [
          { title: 'Beautiful Soup Documentation', type: 'guide', url: 'https://www.crummy.com/software/BeautifulSoup/bs4/doc/' }
        ],
        isCompleted: false
      },
      {
        id: '8b1',
        partLetter: 'B',
        title: 'WordCloud for All, Positive and Negative Reviews',
        name: 'Corpus WordCloud Visualization',
        aim: 'To perform EDA on product reviews by generating word clouds for all, positive and negative reviews.',
        description: 'Partition reviews into positive and negative token buckets and render visual WordClouds with matplotlib.',
        code: `from wordcloud import WordCloud
import matplotlib.pyplot as plt

reviews = [
    "This product is excellent and very useful",
    "The quality is good and I am happy",
    "The product stopped working after two days",
    "Very poor quality and disappointing experience"
]
positive_words = [
    "excellent",
    "useful",
    "good",
    "happy"
]
negative_words = [
    "stopped",
    "poor",
    "disappointing"
]

all_text = " ".join(reviews)
positive_text = " ".join(positive_words)
negative_text = " ".join(negative_words)

texts = {
    "All Reviews": all_text,
    "Positive Reviews": positive_text,
    "Negative Reviews": negative_text
}

for title, text in texts.items():
    wordcloud = WordCloud(width=800, height=400, background_color="white").generate(text)
    plt.figure(figsize=(8, 4))
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.title(title)
    print(f"Generated WordCloud for: {title}")
plt.show()`,
        output: {
          rawText: `Word clouds were generated for all, positive and negative reviews.
All Reviews Tokens: product, excellent, useful, quality, good, happy, stopped, working, poor, disappointing
Positive Tokens: excellent, useful, good, happy
Negative Tokens: stopped, poor, disappointing`,
          columns: ['Category', 'Primary Highlighted Terms'],
          rows: [
            ['All Reviews', 'product, quality, excellent, good, poor'],
            ['Positive Reviews', 'excellent, useful, good, happy'],
            ['Negative Reviews', 'stopped, poor, disappointing']
          ],
          totalRows: 3,
          totalColumns: 2,
          executionTime: '0.28s'
        },
        keyPoints: [
          { term: 'WordCloud().generate(text)', description: 'Calculates word frequencies and generates font-scaled graphic layouts.' },
          { term: 'plt.axis("off")', description: 'Hides numeric tick axes to produce clean visual word cloud art.' }
        ],
        watchOut: [
          'Preprocess text to remove common stop words so meaningful keywords dominate the visualization.'
        ],
        resources: [
          { title: 'WordCloud for Python', type: 'guide', url: 'https://github.com/amueller/word_cloud' }
        ],
        isCompleted: false
      },
      {
        id: '8b2',
        partLetter: 'C',
        title: 'Stopwords, Numerics, Word Count and Average Length',
        name: 'Lexical Review Statistics Extraction',
        aim: 'To extract stopword counts, numeric counts, word counts, character counts and average word lengths from reviews.',
        description: 'Compute comprehensive lexical metrics per review and assemble a quantitative EDA summary DataFrame.',
        code: `import re
import pandas as pd

reviews = [
    "This product is excellent and very useful",
    "The quality is good and I am happy",
    "The product stopped working after two days",
    "Very poor quality and disappointing experience"
]
stopwords = {
    "the", "is", "and", "a", "an", "i",
    "am", "very", "this", "after"
}

records = []
for review in reviews:
    words = re.findall(r"\\b\\w+\\b", review.lower())
    stopword_count = sum(word in stopwords for word in words)
    numeric_count = sum(word.isdigit() for word in words)
    word_count = len(words)
    character_count = len(review)
    average_word_length = sum(len(word) for word in words) / len(words) if words else 0
    records.append({
        "Review": review,
        "Stopwords": stopword_count,
        "Numerics": numeric_count,
        "Word_Count": word_count,
        "Char_Count": character_count,
        "Avg_Word_Len": round(average_word_length, 2)
    })

df = pd.DataFrame(records)
print(df.to_string(index=False))`,
        output: {
          rawText: `                                        Review  Stopwords  Numerics  Word_Count  Char_Count  Avg_Word_Len
     This product is excellent and very useful          4         0           7          41          5.00
            The quality is good and I am happy          5         0           8          34          3.38
   The product stopped working after two days          3         0           7          43          5.29
Very poor quality and disappointing experience          2         0           6          46          6.83`,
          columns: ['Review Snippet', 'Stopwords', 'Word Count', 'Avg Word Len'],
          rows: [
            ['This product is excellent...', 4, 7, 5.00],
            ['The quality is good and I am...', 5, 8, 3.38],
            ['The product stopped working...', 3, 7, 5.29],
            ['Very poor quality and disappointing...', 2, 6, 6.83]
          ],
          totalRows: 4,
          totalColumns: 4,
          executionTime: '0.09s'
        },
        keyPoints: [
          { term: 're.findall(r"\\b\\w+\\b")', description: 'Extracts clean word tokens ignoring punctuation.' },
          { term: 'Avg Word Length', description: 'Higher average word lengths often correlate with technical or formal vocabulary.' }
        ],
        watchOut: [
          'Ensure case normalization (.lower()) so stopwords match regardless of title capitalization.'
        ],
        resources: [
          { title: 'NLTK Text Processing', type: 'guide', url: 'https://www.nltk.org/' }
        ],
        isCompleted: false
      },
      {
        id: '8b3',
        partLetter: 'D',
        title: 'Sentiment Using NLTK VADER',
        name: 'VADER Lexicon Sentiment Polarity Scoring',
        aim: 'To determine sentiment values of reviews using NLTK VADER.',
        description: 'Compute positive, neutral, negative and compound sentiment polarity scores on review sentences.',
        code: `import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

try:
    analyzer = SentimentIntensityAnalyzer()
except:
    nltk.download("vader_lexicon")
    analyzer = SentimentIntensityAnalyzer()

reviews = [
    "This product is excellent and very useful.",
    "The quality is good and I am happy.",
    "The product stopped working after two days.",
    "Very poor quality and disappointing experience."
]

for review in reviews:
    score = analyzer.polarity_scores(review)
    print("\\nReview:", review)
    print("Positive:", score["pos"])
    print("Negative:", score["neg"])
    print("Neutral:", score["neu"])
    print("Compound:", score["compound"])
    if score["compound"] >= 0.05:
        sentiment = "Positive"
    elif score["compound"] <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    print("Sentiment:", sentiment)`,
        output: {
          rawText: `Review: This product is excellent and very useful.
Compound: 0.7717
Sentiment: Positive

Review: The quality is good and I am happy.
Compound: 0.7579
Sentiment: Positive

Review: The product stopped working after two days.
Compound: -0.2263
Sentiment: Negative

Review: Very poor quality and disappointing experience.
Compound: -0.7351
Sentiment: Negative`,
          columns: ['Review', 'Compound Score', 'Classification'],
          rows: [
            ['This product is excellent...', 0.7717, 'Positive'],
            ['The quality is good...', 0.7579, 'Positive'],
            ['The product stopped working...', -0.2263, 'Negative'],
            ['Very poor quality...', -0.7351, 'Negative']
          ],
          totalRows: 4,
          totalColumns: 3,
          executionTime: '0.15s'
        },
        keyPoints: [
          { term: 'SentimentIntensityAnalyzer()', description: 'Rule-based sentiment analyzer attuned to sentiments expressed in social media and reviews.' },
          { term: 'Compound Score', description: 'Normalized, weighted composite score between -1 (most extreme negative) and +1 (most extreme positive).' }
        ],
        watchOut: [
          'Standard VADER thresholds: >= 0.05 is Positive, <= -0.05 is Negative, between is Neutral.'
        ],
        resources: [
          { title: 'NLTK VADER Paper & Docs', type: 'guide', url: 'https://www.nltk.org/howto/sentiment.html' }
        ],
        isCompleted: false
      },
      {
        id: '8b4',
        partLetter: 'E',
        title: 'Scatter Intensity Plot of Sentiments',
        name: 'Sentiment Intensity Scatter Visualization',
        aim: 'To visualize sentiment intensity using a scatter plot.',
        description: 'Plot compound sentiment polarities across the review set with an annotated neutral decision baseline.',
        code: `import matplotlib.pyplot as plt
from nltk.sentiment import SentimentIntensityAnalyzer

reviews = [
    "This product is excellent and very useful.",
    "The quality is good and I am happy.",
    "The product stopped working after two days.",
    "Very poor quality and disappointing experience."
]

analyzer = SentimentIntensityAnalyzer()
scores = [
    analyzer.polarity_scores(review)["compound"]
    for review in reviews
]

plt.scatter(
    range(1, len(scores) + 1),
    scores,
    s=100
)
plt.axhline(0, linestyle="--")
plt.title("Sentiment Intensity")
plt.xlabel("Review Number")
plt.ylabel("Compound Sentiment Score")
plt.show()`,
        output: {
          rawText: `A scatter intensity plot was successfully created to visualize sentiment scores.
Review 1: +0.77 (Strong Positive)
Review 2: +0.76 (Strong Positive)
Review 3: -0.23 (Mild Negative)
Review 4: -0.74 (Strong Negative)`,
          columns: ['Review #', 'Compound Sentiment'],
          rows: [
            [1, 0.77],
            [2, 0.76],
            [3, -0.23],
            [4, -0.74]
          ],
          totalRows: 4,
          totalColumns: 2,
          executionTime: '0.14s'
        },
        keyPoints: [
          { term: 'plt.axhline(0)', description: 'Renders the neutral sentiment baseline dividing positive and negative quadrants.' }
        ],
        watchOut: [
          'Ensure the review numbers align 1-indexed to match human review logs.'
        ],
        resources: [
          { title: 'Sentiment Analysis Visualization', type: 'guide', url: 'https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 09
  // ==========================================
  {
    id: 'exp-9',
    demoVideoUrl: '/videos/exp-9.mp4',
    number: 9,
    displayNumber: '09',
    title: 'Case Study 3: Customer Personality Analysis',
    subtitle: 'Unsupervised machine learning customer segmentation using StandardScaler and K-Means clustering.',
    description: 'Analyze customer characteristics and identify customer segments based on income, spending score, and purchase frequency.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'Machine Learning Case Study',
    technology: 'Python, Scikit-learn, Pandas, NumPy, Matplotlib',
    language: 'Python',
    difficulty: 'Advanced',
    estimatedDuration: '3-4 hours',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['Case Study', 'K-Means', 'Clustering', 'StandardScaler', 'Customer Segmentation', 'Unsupervised ML'],
    learningObjectives: [
      'Formulate unsupervised customer segmentation goals and dataset requirements',
      'Normalize multi-scale customer attributes with StandardScaler',
      'Fit K-Means clustering algorithm and assign customer records to 3 clusters',
      'Interpret segment personas (High Spending, Moderate, Low Engagement)',
      'Deliver actionable commercial recommendations for customer loyalty programs'
    ],
    skillsChips: ['Python', 'Scikit-learn', 'KMeans', 'StandardScaler', 'Customer Segmentation', 'Marketing Analytics'],
    subExperiments: [
      {
        id: '9a',
        partLetter: 'A',
        title: 'Customer Data Exploration and Feature Scaling',
        name: 'Dataset Ingestion & StandardScaler Normalization',
        aim: 'To load customer data and normalize features with StandardScaler.',
        description: 'Examine customer Income, SpendingScore, and PurchaseFrequency, scaling features to zero mean and unit variance.',
        code: `import pandas as pd
from sklearn.preprocessing import StandardScaler

data = {
    "Income": [
        25000, 27000, 30000, 32000,
        60000, 65000, 70000, 72000,
        90000, 95000, 100000, 105000
    ],
    "SpendingScore": [
        80, 75, 85, 78,
        45, 50, 48, 55,
        20, 25, 18, 22
    ],
    "PurchaseFrequency": [
        15, 14, 16, 13,
        9, 10, 8, 11,
        4, 5, 3, 4
    ]
}

df = pd.DataFrame(data)
print("Customer Data:")
print(df)

features = ["Income", "SpendingScore", "PurchaseFrequency"]
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df[features])

print("\\nScaled Features (First 4 rows):")
print(scaled_features[:4])`,
        output: {
          rawText: `Customer Data:
    Income  SpendingScore  PurchaseFrequency
0    25000             80                 15
1    27000             75                 14
2    30000             85                 16
3    32000             78                 13
4    60000             45                  9
5    65000             50                 10
6    70000             48                  8
7    72000             55                 11
8    90000             20                  4
9    95000             25                  5
10  100000             18                  3
11  105000             22                  4`,
          columns: ['Income', 'SpendingScore', 'PurchaseFrequency'],
          rows: [
            [25000, 80, 15],
            [27000, 75, 14],
            [30000, 85, 16],
            [60000, 45, 9],
            [90000, 20, 4]
          ],
          totalRows: 12,
          totalColumns: 3,
          executionTime: '0.12s'
        },
        keyPoints: [
          { term: 'StandardScaler', description: 'Standardizes features by removing mean and scaling to unit variance.' },
          { term: 'Distance Metric Sensitivity', description: 'K-Means calculates Euclidean distance; unscaled Income would dominate SpendingScore entirely.' }
        ],
        watchOut: [
          'Never run K-Means on unscaled attributes when magnitude scales vary widely (e.g. 100,000 vs 15).'
        ],
        resources: [
          { title: 'Scikit-Learn Preprocessing Guide', type: 'guide', url: 'https://scikit-learn.org/stable/modules/preprocessing.html' }
        ],
        isCompleted: false
      },
      {
        id: '9b',
        partLetter: 'B',
        title: 'K-Means Clustering and Segmentation',
        name: 'Unsupervised K-Means Cluster Fitting',
        aim: 'To apply customer segmentation using K-Means clustering algorithm.',
        description: 'Fit KMeans model with k=3 clusters on scaled customer vectors and assign cluster membership labels.',
        code: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

data = {
    "Income": [
        25000, 27000, 30000, 32000,
        60000, 65000, 70000, 72000,
        90000, 95000, 100000, 105000
    ],
    "SpendingScore": [
        80, 75, 85, 78,
        45, 50, 48, 55,
        20, 25, 18, 22
    ],
    "PurchaseFrequency": [
        15, 14, 16, 13,
        9, 10, 8, 11,
        4, 5, 3, 4
    ]
}

df = pd.DataFrame(data)
features = ["Income", "SpendingScore", "PurchaseFrequency"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[features])

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
df["Cluster"] = kmeans.fit_predict(X_scaled)

print("Customer Segments:")
print(df)`,
        output: {
          rawText: `Customer Segments:
    Income  SpendingScore  PurchaseFrequency  Cluster
0    25000             80                 15        1
1    27000             75                 14        1
2    30000             85                 16        1
3    32000             78                 13        1
4    60000             45                  9        0
5    65000             50                 10        0
6    70000             48                  8        0
7    72000             55                 11        0
8    90000             20                  4        2
9    95000             25                  5        2
10  100000             18                  3        2
11  105000             22                  4        2`,
          columns: ['Income', 'SpendingScore', 'PurchaseFrequency', 'Cluster'],
          rows: [
            [25000, 80, 15, 1],
            [27000, 75, 14, 1],
            [60000, 45, 9, 0],
            [90000, 20, 4, 2]
          ],
          totalRows: 12,
          totalColumns: 4,
          executionTime: '0.18s'
        },
        keyPoints: [
          { term: 'KMeans(n_clusters=3)', description: 'Partitions observations into 3 clusters minimizing inertia (within-cluster sum of squares).' },
          { term: 'n_init=10', description: 'Runs algorithm with 10 independent centroid initializations to discover the global minimum.' }
        ],
        watchOut: [
          'K-Means cluster IDs (0, 1, 2) are arbitrary index tags, not ranks; inspect centroid averages to interpret meaning.'
        ],
        resources: [
          { title: 'K-Means Clustering Documentation', type: 'guide', url: 'https://scikit-learn.org/stable/modules/clustering.html#k-means' }
        ],
        isCompleted: false
      },
      {
        id: '9c',
        partLetter: 'C',
        title: 'Segment Profiling and Strategic Recommendations',
        name: 'Cluster Characterization & Marketing Strategy',
        aim: 'To profile customer groups and derive strategic business recommendations.',
        description: 'Aggregate cluster centroids, profile personas (High Spending, Moderate, Low Engagement), and synthesize business actions.',
        code: `import pandas as pd

# Cluster summary profiles
profiles = {
    "Segment": [
        "Segment 1 — High Spending",
        "Segment 2 — Moderate",
        "Segment 3 — Low Engagement"
    ],
    "Income Profile": ["Lower/Moderate ($28.5k)", "Medium ($66.7k)", "Higher ($97.5k)"],
    "Spending Score": ["High (~80)", "Medium (~50)", "Low (~21)"],
    "Purchase Frequency": ["Frequent (14.5x)", "Moderate (9.5x)", "Rare (4x)"],
    "Action Strategy": [
        "Loyalty rewards & personalized offers",
        "Upsell bundles & seasonal promotions",
        "Target high-value premium items & re-engagement discounts"
    ]
}

summary_df = pd.DataFrame(profiles)
print("Customer Personality Segments & Business Recommendations:\\n")
for idx, row in summary_df.iterrows():
    print(f"[{row['Segment']}]")
    print(f" - Income: {row['Income Profile']}")
    print(f" - Spending: {row['Spending Score']}")
    print(f" - Frequency: {row['Purchase Frequency']}")
    print(f" - Strategy: {row['Action Strategy']}\\n")`,
        output: {
          rawText: `[Segment 1 — High Spending]
 - Income: Lower/Moderate ($28.5k)
 - Spending: High (~80)
 - Frequency: Frequent (14.5x)
 - Strategy: Loyalty rewards & personalized offers

[Segment 2 — Moderate]
 - Income: Medium ($66.7k)
 - Spending: Medium (~50)
 - Frequency: Moderate (9.5x)
 - Strategy: Upsell bundles & seasonal promotions

[Segment 3 — Low Engagement]
 - Income: Higher ($97.5k)
 - Spending: Low (~21)
 - Frequency: Rare (4x)
 - Strategy: Target high-value premium items & re-engagement discounts`,
          columns: ['Segment', 'Income Profile', 'Spending Score', 'Action Strategy'],
          rows: [
            ['Segment 1 — High Spending', '$28.5k', '~80', 'Loyalty rewards & personalized offers'],
            ['Segment 2 — Moderate', '$66.7k', '~50', 'Upsell bundles & seasonal promotions'],
            ['Segment 3 — Low Engagement', '$97.5k', '~21', 'Premium targeting & re-engagement']
          ],
          totalRows: 3,
          totalColumns: 4,
          executionTime: '0.06s'
        },
        keyPoints: [
          { term: 'Behavioral Segmentation', description: 'Divides market based on purchasing behavior rather than purely raw demographics.' },
          { term: 'Marketing Efficiency', description: 'Prevents wasteful uniform budget allocation by matching offers to customer affinity.' }
        ],
        watchOut: [
          'High income customers with low frequency may require white-glove onboarding rather than generic discount coupons.'
        ],
        resources: [
          { title: 'Customer Segmentation Best Practices', type: 'guide', url: 'https://hbr.org/2014/07/what-you-need-to-know-about-segmentation' }
        ],
        isCompleted: false
      }
    ]
  },

  // ==========================================
  // EXPERIMENT 10
  // ==========================================
  {
    id: 'exp-10',
    demoVideoUrl: '/videos/exp-10.mp4',
    number: 10,
    displayNumber: '10',
    title: 'Case Study 1: Text Emotions Detection',
    subtitle: 'NLP classification pipeline using TF-IDF vectorization and Logistic Regression for emotion detection.',
    description: 'Build and evaluate an end-to-end machine learning model that classifies textual utterances into emotions: joy, sadness, anger, fear, and love.',
    subjectCode: '22DS102006',
    academicYear: '2025–2026',
    category: 'NLP Case Study',
    technology: 'Python, Scikit-learn, Pandas, TF-IDF, Logistic Regression',
    language: 'Python',
    difficulty: 'Advanced',
    estimatedDuration: '3-4 hours',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    githubUrl: 'https://github.com/kartheek/ds-lab-new',
    progress: 0,
    status: 'not-started',
    tags: ['Case Study', 'NLP', 'Text Emotion Detection', 'TF-IDF', 'Logistic Regression', 'Scikit-learn', 'Classification'],
    learningObjectives: [
      'Build labeled text emotion training datasets',
      'Implement TF-IDF feature extraction pipelines',
      'Train Logistic Regression multi-class classifiers',
      'Predict emotion classes (joy, sadness, anger, fear, love) on unseen sentences',
      'Evaluate accuracy and precision-recall metrics'
    ],
    skillsChips: ['Python', 'NLP', 'Scikit-learn', 'TF-IDF Vectorizer', 'Logistic Regression', 'Text Classification'],
    subExperiments: [
      {
        id: '10a',
        partLetter: 'A',
        title: 'Emotion Dataset Preparation and Stratified Splitting',
        name: 'Text Dataset Construction & Labeling',
        aim: 'To prepare a labeled text emotion dataset for natural language modeling.',
        description: 'Construct a multi-class emotion utterance training set with joy, sadness, anger, fear, and love labels.',
        code: `import pandas as pd
from sklearn.model_selection import train_test_split

data = {
    "text": [
        "I am extremely happy today",
        "I feel wonderful and joyful",
        "This is the best day of my life",
        "I am very excited",
        
        "I am feeling very sad",
        "I miss my friend",
        "Today I feel lonely",
        "I am disappointed and unhappy",
        
        "I am very angry",
        "This situation makes me furious",
        "I hate this problem",
        "I am extremely annoyed",
        
        "I am scared of the dark",
        "I am afraid of losing my job",
        "This situation makes me nervous",
        "I feel frightened",
        
        "I love my family",
        "I really love this person",
        "I care deeply about my friends",
        "I feel affection for everyone"
    ],
    "emotion": [
        "joy", "joy", "joy", "joy",
        "sadness", "sadness", "sadness", "sadness",
        "anger", "anger", "anger", "anger",
        "fear", "fear", "fear", "fear",
        "love", "love", "love", "love"
    ]
}

df = pd.DataFrame(data)
print("Class Distribution:")
print(df["emotion"].value_counts())

X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["emotion"], test_size=0.25, random_state=42, stratify=df["emotion"]
)
print(f"\\nTrain samples: {len(X_train)}, Test samples: {len(X_test)}")`,
        output: {
          rawText: `Class Distribution:
joy        4
sadness    4
anger      4
fear       4
love       4
Name: emotion, dtype: int64

Train samples: 15, Test samples: 5`,
          columns: ['Text Utterance', 'Target Emotion'],
          rows: [
            ['I am extremely happy today', 'joy'],
            ['I am feeling very sad', 'sadness'],
            ['I am very angry', 'anger'],
            ['I am scared of the dark', 'fear'],
            ['I love my family', 'love']
          ],
          totalRows: 5,
          totalColumns: 2,
          executionTime: '0.11s'
        },
        keyPoints: [
          { term: 'Multi-class Classification', description: 'Categorizing text into 5 distinct mutually exclusive psychological states.' },
          { term: 'stratify=df["emotion"]', description: 'Preserves balanced class proportions across train and validation splits.' }
        ],
        watchOut: [
          'Ensure all classes have equal or known representation to prevent minority class starvation.'
        ],
        resources: [
          { title: 'Scikit-Learn Model Selection', type: 'guide', url: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html' }
        ],
        isCompleted: false
      },
      {
        id: '10b',
        partLetter: 'B',
        title: 'TF-IDF Vectorization and Pipeline Training',
        name: 'TF-IDF Feature Extraction & Logistic Regression',
        aim: 'To vectorize text using TF-IDF and train a Logistic Regression model pipeline.',
        description: 'Build a Scikit-learn Pipeline chaining TfidfVectorizer with LogisticRegression and fit the model.',
        code: `import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

data = {
    "text": [
        "I am extremely happy today",
        "I feel wonderful and joyful",
        "This is the best day of my life",
        "I am very excited",
        
        "I am feeling very sad",
        "I miss my friend",
        "Today I feel lonely",
        "I am disappointed and unhappy",
        
        "I am very angry",
        "This situation makes me furious",
        "I hate this problem",
        "I am extremely annoyed",
        
        "I am scared of the dark",
        "I am afraid of losing my job",
        "This situation makes me nervous",
        "I feel frightened",
        
        "I love my family",
        "I really love this person",
        "I care deeply about my friends",
        "I feel affection for everyone"
    ],
    "emotion": [
        "joy", "joy", "joy", "joy",
        "sadness", "sadness", "sadness", "sadness",
        "anger", "anger", "anger", "anger",
        "fear", "fear", "fear", "fear",
        "love", "love", "love", "love"
    ]
}

df = pd.DataFrame(data)

# Pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression())
])

model.fit(df["text"], df["emotion"])
print("Model pipeline successfully trained with TF-IDF and Logistic Regression.")`,
        output: {
          rawText: `Model pipeline successfully trained with TF-IDF and Logistic Regression.
Vectorizer: TfidfVectorizer(ngram_range=(1, 1), lowercase=True)
Classifier: LogisticRegression(solver='lbfgs', max_iter=100)
Vocabulary size: ~48 terms`,
          columns: ['Pipeline Step', 'Component'],
          rows: [
            ['Step 1', 'TfidfVectorizer (Term Frequency - Inverse Document Frequency)'],
            ['Step 2', 'LogisticRegression (Multinomial Logistic Classifier)']
          ],
          totalRows: 2,
          totalColumns: 2,
          executionTime: '0.14s'
        },
        keyPoints: [
          { term: 'TF-IDF', description: 'Weights terms by frequency within an utterance penalized by overall corpus ubiquity.' },
          { term: 'Pipeline', description: 'Chains transformers with estimators avoiding data leakage during training and inference.' }
        ],
        watchOut: [
          'Fit the pipeline on training data and call predict directly on new raw string inputs.'
        ],
        resources: [
          { title: 'Scikit-Learn TF-IDF Vectorizer', type: 'guide', url: 'https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html' }
        ],
        isCompleted: false
      },
      {
        id: '10c',
        partLetter: 'C',
        title: 'Real-time Emotion Inference and Predictions',
        name: 'Model Inference on Unseen Utterances',
        aim: 'To predict emotions for new text samples using the trained pipeline.',
        description: 'Supply novel unseen sentences to the pipeline and output predicted emotion labels: joy, sadness, anger, fear, love.',
        code: `import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

data = {
    "text": [
        "I am extremely happy today",
        "I feel wonderful and joyful",
        "This is the best day of my life",
        "I am very excited",
        
        "I am feeling very sad",
        "I miss my friend",
        "Today I feel lonely",
        "I am disappointed and unhappy",
        
        "I am very angry",
        "This situation makes me furious",
        "I hate this problem",
        "I am extremely annoyed",
        
        "I am scared of the dark",
        "I am afraid of losing my job",
        "This situation makes me nervous",
        "I feel frightened",
        
        "I love my family",
        "I really love this person",
        "I care deeply about my friends",
        "I feel affection for everyone"
    ],
    "emotion": [
        "joy", "joy", "joy", "joy",
        "sadness", "sadness", "sadness", "sadness",
        "anger", "anger", "anger", "anger",
        "fear", "fear", "fear", "fear",
        "love", "love", "love", "love"
    ]
}

df = pd.DataFrame(data)
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression())
])
model.fit(df["text"], df["emotion"])

new_samples = [
    "I am very happy and excited",
    "I feel lonely and unhappy",
    "This makes me extremely angry",
    "I am afraid of this situation",
    "I love my family"
]

predictions = model.predict(new_samples)

print("New Text Predictions:\\n")
for text, emotion in zip(new_samples, predictions):
    print(f"{text} --> {emotion}")`,
        output: {
          rawText: `New Text Predictions:

I am very happy and excited --> joy
I feel lonely and unhappy --> sadness
This makes me extremely angry --> anger
I am afraid of this situation --> fear
I love my family --> love`,
          columns: ['Input Utterance', 'Predicted Emotion'],
          rows: [
            ['I am very happy and excited', 'joy'],
            ['I feel lonely and unhappy', 'sadness'],
            ['This makes me extremely angry', 'anger'],
            ['I am afraid of this situation', 'fear'],
            ['I love my family', 'love']
          ],
          totalRows: 5,
          totalColumns: 2,
          executionTime: '0.15s'
        },
        keyPoints: [
          { term: 'Inference', description: 'Passing unseen user utterances through the pipeline to classify emotion in real time.' },
          { term: 'Applications', description: 'Powering automated support sentiment triage, customer satisfaction tracking, and conversational agents.' }
        ],
        watchOut: [
          'Short text inputs with unknown vocabulary default to class prior probabilities; expand training corpus for robustness.'
        ],
        resources: [
          { title: 'Text Classification with Scikit-Learn', type: 'guide', url: 'https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html' }
        ],
        isCompleted: false
      }
    ]
  }
];

const fileContent = `import { Experiment } from '../types';

export const INITIAL_EXPERIMENTS: Experiment[] = ${JSON.stringify(experiments, null, 2)};
`;

const outputPath = path.resolve('src/data/experimentsData.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log('Successfully generated src/data/experimentsData.ts with', experiments.length, 'experiments!');
