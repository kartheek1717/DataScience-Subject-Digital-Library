import { Project, Resource, LabFile, StudentProfile, NotificationItem, NotebookCell } from '../types';
export { INITIAL_EXPERIMENTS } from './experimentsData';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-btc',
    title: 'BTC AI Trader — Automated Cryptocurrency Trading & Analytics Platform',
    description: 'Designed and deployed an automated cryptocurrency intelligence platform delivering real-time technical analytics and algorithmic trade signals. Implemented data ingestion pipelines to compute momentum indicators (RSI, moving averages) and evaluate risk-adjusted trading strategies. Deployed live on Whop with low-latency user access.',
    category: 'Quantitative Systems',
    technology: ['Python', 'Machine Learning', 'Data Analytics', 'REST APIs', 'Whop Platform'],
    progress: 100,
    status: 'active',
    githubUrl: 'https://github.com/kartheek1717',
    demoUrl: 'https://btc-ai-trader.whop.site/',
    stars: 85,
    lastUpdated: 'Live on Whop',
    thumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'proj-block-survive',
    title: 'Block Survive — Interactive Web-Based Survival Game',
    description: 'Built and deployed an interactive 2D survival game featuring real-time collision detection, physics calculation, and persistent score tracking. Optimized browser canvas redraw cycles and keyboard event handlers to deliver fluid frame rates. Managed modular application state for difficulty ramping and obstacle generation; deployed production build to Render.',
    category: 'Web Applications',
    technology: ['JavaScript (ES6+)', 'HTML5 Canvas', 'CSS3', 'Node.js', 'Express', 'Render'],
    progress: 100,
    status: 'completed',
    githubUrl: 'https://github.com/kartheek1717',
    demoUrl: 'https://block-survive.onrender.com/',
    stars: 64,
    lastUpdated: 'Live on Render',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Pandas 2.0 In-Depth Performance & Vectorization Guide',
    description: 'Master PyArrow backend integration, copy-on-write semantics, and vectorization idioms.',
    category: 'Pandas',
    type: 'Guide',
    url: 'https://pandas.pydata.org/docs/user_guide/index.html',
    readTime: '12 min',
    featured: true
  },
  {
    id: 'res-2',
    title: 'NumPy Broadcasting & Tensor Slicing Cheatsheet',
    description: 'Visual companion to high-dimensional array manipulation and linear algebra operations.',
    category: 'NumPy',
    type: 'Cheatsheet',
    url: 'https://numpy.org/doc/stable/user/basics.broadcasting.html',
    readTime: '6 min',
    featured: true
  },
  {
    id: 'res-3',
    title: 'Publication-Ready Scientific Data Visualization with Matplotlib',
    description: 'Best practices for typography, color palette accessibility, and multi-panel figures.',
    category: 'Matplotlib',
    type: 'Tutorial',
    url: 'https://matplotlib.org/stable/tutorials/index.html',
    readTime: '15 min'
  },
  {
    id: 'res-4',
    title: 'Scikit-Learn Production ML Pipelines & Transformers',
    description: 'Design robust preprocessing pipelines, cross-validation folds, and custom column transformers.',
    category: 'Machine Learning',
    type: 'Documentation',
    url: 'https://scikit-learn.org/stable/modules/compose.html',
    readTime: '20 min'
  },
  {
    id: 'res-5',
    title: 'Modern SQL Window Functions for Data Analysts',
    description: 'ROW_NUMBER(), RANK(), DENSE_RANK(), and sliding partition aggregate calculations.',
    category: 'SQL',
    type: 'Notes',
    url: 'https://mode.com/sql-tutorial/sql-window-functions/',
    readTime: '10 min'
  },
  {
    id: 'res-6',
    title: 'Interactive Python Data Science Crash Course',
    description: 'Curated 15-minute primer covering list comprehensions, generators, and OOP for data scientists.',
    category: 'Python',
    type: 'Video',
    url: 'https://docs.python.org/3/tutorial/',
    readTime: '18 min'
  }
];

export const INITIAL_FILES: LabFile[] = [
  {
    id: 'file-1',
    name: 'data_ingestion_pipeline.py',
    type: '.py',
    size: '4.2 KB',
    modified: 'Today at 14:20',
    content: `import pandas as pd
import numpy as np

def load_and_preprocess(filepath: str) -> pd.DataFrame:
    """Loads CSV dataset and applies standard imputation."""
    df = pd.read_csv(filepath)
    df.fillna(df.median(numeric_only=True), inplace=True)
    return df

if __name__ == "__main__":
    print("Pipeline ready.")`
  },
  {
    id: 'file-2',
    name: 'titanic_passengers.csv',
    type: '.csv',
    size: '60.3 KB',
    modified: 'Yesterday',
    content: `PassengerId,Survived,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Cabin,Embarked
1,0,3,"Braund, Mr. Owen Harris",male,22,1,0,A/5 21171,7.25,,S
2,1,1,"Cumings, Mrs. John Bradley",female,38,1,0,PC 17599,71.2833,C85,C
3,1,3,"Heikkinen, Miss. Laina",female,26,0,0,STON/O2. 3101282,7.925,,S`
  },
  {
    id: 'file-3',
    name: 'experiment_config.json',
    type: '.json',
    size: '1.8 KB',
    modified: 'Oct 02, 2026',
    content: `{
  "experiment_name": "titanic_classifier",
  "model_type": "RandomForestClassifier",
  "hyperparameters": {
    "n_estimators": 150,
    "max_depth": 8,
    "random_state": 42
  },
  "metrics": ["accuracy", "f1_score", "roc_auc"]
}`
  },
  {
    id: 'file-4',
    name: 'lab_notes_week4.txt',
    type: '.txt',
    size: '2.1 KB',
    modified: 'Sep 28, 2026',
    content: `WEEK 4 LAB SUMMARY:
1. Implemented URL stream ingestion.
2. Verified CSV delimiter preservation with pipe syntax.
3. Next steps: Check OpenPyXL multi-sheet write buffers.`
  },
  {
    id: 'file-5',
    name: 'q1_financial_metrics.xlsx',
    type: '.xlsx',
    size: '18.4 KB',
    modified: 'Sep 24, 2026',
    content: `[Binary Excel Spreadsheet Data]`
  },
  {
    id: 'file-6',
    name: 'exploratory_data_analysis.ipynb',
    type: '.ipynb',
    size: '124.8 KB',
    modified: 'Sep 20, 2026',
    content: `{\n "cells": [\n  {\n   "cell_type": "code",\n   "source": ["import pandas as pd\\ndf = pd.read_csv('data.csv')"]\n  }\n ]\n}`
  }
];

export const INITIAL_NOTEBOOK_CELLS: NotebookCell[] = [
  {
    id: 'cell-1',
    type: 'markdown',
    content: `# DS LAB Workspace Notebook: Interactive Exploration
This interactive notebook allows you to experiment with Python, Pandas, and Data Science models in real-time.
- Execute cells individually with **Shift+Enter** or the **Run** button.
- Inspect resulting DataFrames, plots, and standard output below.`
  },
  {
    id: 'cell-2',
    type: 'code',
    content: `import pandas as pd
import numpy as np

# Create synthetic high-dimensional experiment records
np.random.seed(42)
categories = ['Alpha', 'Beta', 'Gamma', 'Delta']
df = pd.DataFrame({
    'Trial_ID': [f"TR-{100+i}" for i in range(5)],
    'Cohort': np.random.choice(categories, 5),
    'Accuracy': np.round(np.random.uniform(0.85, 0.99, 5), 4),
    'Latency_ms': np.random.randint(12, 48, 5)
})

print("Generated Experiment Trial Matrix:")
df`,
    output: {
      type: 'dataframe',
      data: {
        columns: ['Trial_ID', 'Cohort', 'Accuracy', 'Latency_ms'],
        rows: [
          ['TR-100', 'Gamma', 0.9234, 38],
          ['TR-101', 'Alpha', 0.9612, 14],
          ['TR-102', 'Beta', 0.8845, 27],
          ['TR-103', 'Gamma', 0.9781, 19],
          ['TR-104', 'Delta', 0.9420, 31]
        ]
      },
      logs: ['[OK] In-memory execution completed in 0.12s'],
      executionTime: '0.12s'
    }
  },
  {
    id: 'cell-3',
    type: 'code',
    content: `# Compute grouped summary aggregations
summary = df.groupby('Cohort')[['Accuracy', 'Latency_ms']].mean()
print("Cohort Aggregated Performance:")
summary`,
    output: {
      type: 'dataframe',
      data: {
        columns: ['Cohort', 'Mean_Accuracy', 'Mean_Latency_ms'],
        rows: [
          ['Alpha', 0.9612, 14.0],
          ['Beta', 0.8845, 27.0],
          ['Delta', 0.9420, 31.0],
          ['Gamma', 0.9507, 28.5]
        ]
      },
      logs: ['[CALC] Vectorized groupby aggregation computed'],
      executionTime: '0.08s'
    }
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'BADABAGNI KARTHEEK',
  rollNo: '24102A030006',
  branch: 'Data Science',
  section: '1',
  avatar: '/kartheek_profile.jpg',
  overallProgress: 85,
  email: 'kartheek1717@gmail.com',
  joinedDate: 'August 2024',
  facultyName: 'S Bosubabu',
  designation: 'Assistant Professor',
  collegeName: 'Mohan Babu University, Tirupathi, Andhra Pradesh, India',
  labIncharge: 'Assistant Professor',
  phone: '+91 7569270943',
  location: 'Nellore, Andhra Pradesh, India',
  githubUrl: 'https://github.com/kartheek1717',
  linkedinUrl: 'https://www.linkedin.com/in/kartheek-badabagni-950431323/',
  leetcodeUrl: 'https://leetcode.com/u/pandu_17/',
  bio: 'B.Tech Data Science student at Mohan Babu University with certified competencies across full-stack development, AWS cloud concepts, and data analytics. Hands-on experience developing and hosting responsive web applications and algorithmic trading tools using Python, Java, SQL, and modern web frameworks. Proven problem-solving ability in Data Structures and Algorithms with a focus on writing scalable, clean code. Seeking an internship or entry-level software development opportunity to contribute to real-world engineering projects.',
  skills: [
    'Python',
    'Java',
    'SQL',
    'JavaScript (ES6+)',
    'HTML5',
    'CSS3',
    'Front-End Architecture',
    'Back-End Architecture',
    'AWS Cloud Services',
    'Git',
    'GitHub',
    'VS Code',
    'IntelliJ IDEA',
    'Render',
    'Whop',
    'Data Structures & Algorithms (DSA)',
    'OOP',
    'Relational Database Management',
    'Data Analysis'
  ],
  education: [
    {
      degree: 'B.Tech in Data Science',
      institution: 'Mohan Babu University',
      period: '2024 – 2028',
      location: 'Tirupati, AP',
      score: 'CGPA: 8.3 / 10'
    },
    {
      degree: 'Intermediate (Class XII), MPC',
      institution: 'Narayana Junior College',
      period: '2022 – 2024',
      location: 'Nellore, AP',
      score: 'Percentage: 95.0%'
    },
    {
      degree: 'Secondary School Certificate (Class X)',
      institution: 'VBR EM High School',
      period: '2022',
      location: 'Nellore, AP',
      score: 'Percentage: 90.0%'
    }
  ],
  certifications: [
    {
      title: 'Front-End Development Specialization',
      issuer: 'Coursera'
    },
    {
      title: 'Back-End Development Specialization',
      issuer: 'Coursera'
    },
    {
      title: 'AWS Cloud Fundamentals / Practitioner',
      issuer: 'Coursera'
    },
    {
      title: 'Data Analytics Specialization',
      issuer: 'Coursera'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'LeetCode Problem Solver',
      description: 'Active problem solver on LeetCode (pandu_17), regularly practicing core data structures, algorithms, and complexity optimization.',
      icon: '⚡',
      unlockedAt: 'Oct 2026',
      isUnlocked: true
    },
    {
      id: 'ach-2',
      title: 'Production Web & Cloud Deployments',
      description: 'Engineered and deployed multiple live, publicly accessible applications across cloud and web hosting environments (Render, Whop).',
      icon: '🚀',
      unlockedAt: 'Oct 2026',
      isUnlocked: true
    },
    {
      id: 'ach-3',
      title: 'Academic Excellence (95% Intermediate)',
      description: 'Secured 95.0% in Intermediate Class XII (MPC) at Narayana Junior College and 90.0% in SSC Class X at VBR EM High School.',
      icon: '🏆',
      unlockedAt: '2024',
      isUnlocked: true
    },
    {
      id: 'ach-4',
      title: 'Certified Full-Stack & AWS Practitioner',
      description: 'Earned 4 professional specializations on Coursera across Front-End, Back-End, AWS Cloud, and Data Analytics.',
      icon: '📜',
      unlockedAt: '2026',
      isUnlocked: true
    },
    {
      id: 'ach-5',
      title: 'Laboratory Research & Coursework Rigor',
      description: 'Data Science Laboratory (Course Code: 22DS102006) completed under mentorship of S Bosubabu (Assistant Professor).',
      icon: '🔬',
      unlockedAt: 'Oct 2026',
      isUnlocked: true
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Experiment 2 completed',
    message: 'Data Cleaning with NumPy verified by automated lab autograder.',
    time: '10m ago',
    type: 'success',
    read: false
  },
  {
    id: 'notif-2',
    title: 'New Pandas resource added',
    message: 'Dr. Rao published "Pandas 2.0 In-Depth Performance Guide".',
    time: '1h ago',
    type: 'info',
    read: false
  },
  {
    id: 'notif-3',
    title: 'BTC AI Trader deployment synced',
    message: 'BTC AI Trader platform live signals auto-synced with Whop portal.',
    time: '4h ago',
    type: 'success',
    read: false
  },
  {
    id: 'notif-4',
    title: 'GitHub repository updated',
    message: 'Auto-synced latest commits to ds-lab-exp1-io.',
    time: 'Yesterday',
    type: 'info',
    read: true
  }
];
