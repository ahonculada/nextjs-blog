---
title: 'Bell Numbers'  
date: '2025-03-07'  
topic: 'number-theory'
---

# Table of Contents

- [Definition](#definition)
- [Recurrence Relation](#recurrence-relation)
- [Code](#code)
- [References](#references)

# Definition
Bell numbers are a sequence of numbers that are used to count the number of ways to partition a set.

The Bell number for a set of size n is the number of ways to partition the set into non-empty subsets.

# Recurrence Relation
The Bell numbers are given by the following recurrence relation:

$$
B(n+1) = \sum_{k=0}^{n} \binom{n}{k} B(k)
$$

The first few Bell numbers are:
$$
\begin{array}{c:c}
\text{n} & \text{B(n)} \\
\hline
0 & 1 \\
1 & 1 \\
2 & 2 \\
3 & 5 \\
4 & 15 \\
5 & 52 \\
6 & 203 \\
7 & 877 \\
8 & 4140 \\
9 & 21147 \\
10 & 115975 \\
\end{array}
$$


# Code

```python
from math import comb

def bell_number(n: int) -> int:
    # Initialize the Bell number for n = 0
    bell = [0 for _ in range(n + 1)]
    bell[0] = 1

    for i in range(1, n + 1):
        bell[i] = sum(comb(i-1, k) * bell[k] for k in range(i))

    return bell[n]
```

# References
- [Bell Numbers](https://en.wikipedia.org/wiki/Bell_number)