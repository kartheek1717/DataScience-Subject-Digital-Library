export interface ToolInfo {
  id: string;
  name: string;
  version: string;
  category: 'Core Runtime' | 'Interactive Notebooks' | 'Data Wrangling' | 'Visualization' | 'Machine Learning' | 'Database' | 'Statistics';
  description: string;
  icon: string;
  docsUrl: string;
  launchUrl?: string;
  mappedExpId: string;
  mappedExpTitle: string;
  codeSnippet: string;
  tags: string[];
}

export const TOOLS_DIRECTORY: ToolInfo[] = [
  {
    id: 'python',
    name: 'Python 3.10',
    version: 'v3.10.12',
    category: 'Core Runtime',
    description: 'Dynamic, high-level language powering modern data pipelines, vector computations, and scientific computing.',
    icon: '🐍',
    docsUrl: 'https://docs.python.org/3/',
    launchUrl: 'https://www.python.org/shell/',
    mappedExpId: 'exp-1',
    mappedExpTitle: 'Exp 01 • Pandas I/O & Foundations',
    codeSnippet: `import sys\nprint(f"Python Runtime: {sys.version.split()[0]}")\n# List comprehension and lambda primitives\nsquares = [x**2 for x in range(10) if x % 2 == 0]`,
    tags: ['Python', 'Runtime', 'Standard Library', 'List Comprehensions']
  },
  {
    id: 'jupyter-notebook',
    name: 'Jupyter Notebook',
    version: 'v7.1.0',
    category: 'Interactive Notebooks',
    description: 'De-facto web-based interactive computational environment for creating notebook documents (.ipynb) with live Python code, equations, visualizations, and narrative text.',
    icon: '🪐',
    docsUrl: 'https://jupyter.org/documentation',
    launchUrl: 'https://jupyter.org/try',
    mappedExpId: 'exp-1',
    mappedExpTitle: 'Exp 01 • Interactive Notebook I/O',
    codeSnippet: `# Jupyter Interactive Cell Routine\nimport pandas as pd\nimport matplotlib.pyplot as plt\n%matplotlib inline\n\ndf = pd.read_csv('students.csv')\ndf.plot(kind='bar', x='Name', y='Marks')\nplt.title("Jupyter Cell Output")\nplt.show()`,
    tags: ['Jupyter', '.ipynb', 'Cell Execution', 'Kernel', 'Markdown', 'IPython', 'Interactive']
  },
  {
    id: 'google-colab',
    name: 'Google Colab',
    version: 'Cloud Hosted',
    category: 'Interactive Notebooks',
    description: 'Free cloud-hosted Jupyter notebook service by Google with zero configuration, free access to GPUs (NVIDIA T4/V100) and TPUs, Google Drive integration, and live team collaboration.',
    icon: '⚡',
    docsUrl: 'https://colab.research.google.com/',
    launchUrl: 'https://colab.research.google.com/',
    mappedExpId: 'exp-5',
    mappedExpTitle: 'Exp 05 • Cloud GPU & ML Experiments',
    codeSnippet: `# Google Colab GPU Acceleration & Drive Mounting\nfrom google.colab import drive\ndrive.mount('/content/drive')\n\nimport torch\nprint(f"CUDA Hardware Acceleration: {torch.cuda.is_available()}")\nif torch.cuda.is_available():\n    print(f"Device Name: {torch.cuda.get_device_name(0)}")`,
    tags: ['Google Colab', 'Cloud GPU', 'TPU', 'Free Hardware', 'Google Drive', 'PyTorch', 'TensorFlow']
  },
  {
    id: 'pandas',
    name: 'Pandas',
    version: 'v2.2.1',
    category: 'Data Wrangling',
    description: 'High-performance DataFrame structures, indexing, multi-format ingestion (CSV, JSON, Excel), and transformation.',
    icon: '🐼',
    docsUrl: 'https://pandas.pydata.org/docs/',
    mappedExpId: 'exp-1',
    mappedExpTitle: 'Exp 01 • Import & Export Formats',
    codeSnippet: `import pandas as pd\ndf = pd.read_csv('students.csv')\nsummary = df.groupby('branch')['marks'].mean()`,
    tags: ['DataFrame', 'Series', 'CSV / JSON / Excel', 'GroupBy', 'Pivot']
  },
  {
    id: 'numpy',
    name: 'NumPy',
    version: 'v1.26.4',
    category: 'Data Wrangling',
    description: 'Fundamental package for scientific computing with N-dimensional arrays, broadcasting, vectorization, and matrix algebra.',
    icon: '🔢',
    docsUrl: 'https://numpy.org/doc/',
    mappedExpId: 'exp-2',
    mappedExpTitle: 'Exp 02 • Data Cleaning with NumPy',
    codeSnippet: `import numpy as np\narr = np.array([10.5, np.nan, 22.0, 45.8, 120.0])\n# Mask outliers and impute median\nclean_arr = np.nan_to_num(arr, nan=np.nanmedian(arr))`,
    tags: ['ndarray', 'Vectorization', 'Broadcasting', 'Linear Algebra', 'Masking']
  },
  {
    id: 'matplotlib-seaborn',
    name: 'Matplotlib & Seaborn',
    version: 'v3.8.3 / v0.13.2',
    category: 'Visualization',
    description: 'Comprehensive 2D canvas plotting engine and statistical visualization library with built-in themes and FacetGrids.',
    icon: '📊',
    docsUrl: 'https://seaborn.pydata.org/',
    mappedExpId: 'exp-3',
    mappedExpTitle: 'Exp 03 • Data Visualization',
    codeSnippet: `import matplotlib.pyplot as plt\nimport seaborn as sns\nsns.set_theme(style="whitegrid")\nsns.histplot(data=df, x="marks", hue="branch", kde=True)\nplt.title("Score Distribution")`,
    tags: ['Plotting', 'KDE', 'Histograms', 'FacetGrid', 'Scatter', 'Heatmaps']
  },
  {
    id: 'sqlite',
    name: 'SQLite3',
    version: 'v3.45.1',
    category: 'Database',
    description: 'Self-contained, serverless, zero-configuration SQL relational database engine integrated natively into Python.',
    icon: '🗄️',
    docsUrl: 'https://www.sqlite.org/docs.html',
    mappedExpId: 'exp-4',
    mappedExpTitle: 'Exp 04 • SQL Relational Queries',
    codeSnippet: `import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute("CREATE TABLE users (id INT, score REAL)")\nconn.execute("INSERT INTO users VALUES (1, 94.5)")`,
    tags: ['SQL', 'Relational DB', 'ACID', 'Table Joins', 'Aggregations']
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-Learn',
    version: 'v1.4.1',
    category: 'Machine Learning',
    description: 'Standard library for predictive modeling, feature extraction, Decision Trees, Random Forests, PCA, and classification.',
    icon: '🤖',
    docsUrl: 'https://scikit-learn.org/stable/',
    mappedExpId: 'exp-5',
    mappedExpTitle: 'Exp 05 • EDA & Feature Engineering',
    codeSnippet: `from sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import train_test_split\nclf = DecisionTreeClassifier(max_depth=4)\nclf.fit(X_train, y_train)`,
    tags: ['Machine Learning', 'Decision Trees', 'Random Forests', 'PCA', 'Metrics']
  },
  {
    id: 'scipy',
    name: 'SciPy Stats',
    version: 'v1.12.0',
    category: 'Statistics',
    description: 'Fundamental algorithms for scientific computing, statistical distributions (Normal, PMF, CDF), and hypothesis testing.',
    icon: '📐',
    docsUrl: 'https://docs.scipy.org/doc/scipy/',
    mappedExpId: 'exp-6',
    mappedExpTitle: 'Exp 06 • Hypothesis Testing',
    codeSnippet: `from scipy import stats\nt_stat, p_val = stats.ttest_ind(group_a, group_b)\nprint(f"p-value: {p_val:.4f} (Significant: {p_val < 0.05})")`,
    tags: ['Hypothesis Testing', 'T-Test', 'Chi-Square', 'p-value', 'Distributions']
  }
];
