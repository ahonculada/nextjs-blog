---
title: 'Bell Numbers'  
date: '2025-03-07'  
---

# Bell Numbers
Bell numbers are a sequence of numbers that are used to count the number of ways to partition a set.

The Bell number for a set of size n is the number of ways to partition the set into non-empty subsets.

## Recurrence Relation
The Bell numbers are given by the following recurrence relation:

$$
B(n+1) = \sum_{k=0}^{n} \binom{n}{k} B(k)
$$

The first few Bell numbers are:

| n  | B(n)         |
|----|--------------|
| 0  | 1            |
| 1  | 1            |
| 2  | 2            |
| 3  | 5            |
| 4  | 15           |
| 5  | 52           |
| 6  | 203          |
| 7  | 877          |
| 8  | 4140         |
| 9  | 21147        |
| 10 | 115975       |
| 11 | 678570       |
| 12 | 4213597      |
| 13 | 27644437     |
| 14 | 190899322    |
| 15 | 1382958545   |


### Code

```python
from math import comb

def bell_number(n: int) -> int:
    # Initialize the Bell number for n = 0
    bell = [0] * (n + 1)
    bell[0] = 1

    for i in range(1, n + 1):
        bell[i] = sum(comb(i-1, k) * bell[k] for k in range(i))

    return bell[n]
```

