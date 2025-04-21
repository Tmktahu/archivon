# A Guide to the Multiple-Symbol Cipher Method

## Introduction

This guide explains a secure method of secret writing that uses multiple symbols for each letter. Unlike common ciphers where each letter is replaced by exactly one symbol, this method assigns several symbols to each letter, with more common letters receiving more symbols. This approach confounds attempts to decipher messages through letter frequency examination.

## Materials Required

- Paper and pencil or pen
- This guide
- A secret phrase known only to you and your correspondent
- The complete set of symbols: All capital letters (A-Z), numerals (0-9), and small letters (a-z)
- The letter assignment table (provided below)

## Letter Assignment Table

This table shows how many different symbols should be assigned to each letter:

```
A: 5 symbols    J: 1 symbol    S: 4 symbols
B: 1 symbol     K: 1 symbol    T: 6 symbols
C: 2 symbols    L: 2 symbols   U: 1 symbol
D: 2 symbols    M: 1 symbol    V: 1 symbol
E: 7 symbols    N: 4 symbols   W: 1 symbol
F: 1 symbol     O: 5 symbols   X: 1 symbol
G: 1 symbol     P: 1 symbol    Y: 1 symbol
H: 3 symbols    Q: 1 symbol    Z: 1 symbol
I: 4 symbols    R: 3 symbols
```

## Cipher Setup

### Step 1: Prepare Your Secret Phrase

1. Write down your secret phrase
2. Strike out any repeated letters (keeping only the first occurrence)
3. Remove all spaces

**Example:**

- Secret phrase: `secret message`
- After removing repeated letters: `secrtmag`
- After removing spaces: `secrtmag`

### Step 2: Create the Complete Symbol List

1. Begin with your prepared secret phrase
2. Add all remaining letters and numerals that aren't already in your phrase

**Example:**

- Original symbol set: `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz`
- Prepared phrase: `secrtmag`
- Complete list: `secrtmagABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789bdfhijklnopquvwxyz`

### Step 3: Create the Letter-to-Symbol Assignments

This step uses a "dealing" method, similar to dealing cards:

1. Take the complete symbol list from Step 2
2. Begin with the first symbol in your list
3. Deal symbols one at a time to each letter of the alphabet in sequence (A, B, C, etc.)
4. Only deal a symbol to a letter if that letter still needs more symbols (according to the assignment table)
5. Skip letters that have already received their full allocation of symbols
6. Continue dealing until all symbols have been assigned or all letters have their required symbols

**Example of the dealing process:**

- First round: A gets `s`, B gets `e`, C gets `c`, etc.
- Second round: A gets `r`, (skip B as it only needs 1 symbol), C gets `t`, etc.
- Continue until all letters have their required number of symbols

**Example of a completed letter-to-symbol assignment table:**

```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-
s e c r t m a g A B C D E F G H I J K L M N O P Q R
S   T U V     W X     Y   Z 0     1 2 3
4       5     6 7         8 9     b d f
h       i       j         k l       n o
p       q                   u         v
        w                             x
        y
```

In this table, each column shows the symbols assigned to a letter. For example, letter A has 5 symbols: `s, S, 4, h, p`. Letter E has 7 symbols: `t, V, 5, i, q, w, y`, and so on.

## Encoding Process

Once your cipher is set up, encoding a message is straightforward:

1. For each letter in your message:
   - Arbitrarily select one of the symbols assigned to that letter
   - Write down the chosen symbol
2. For spaces, punctuation, and other marks, leave them unchanged

## Decoding Process

To decode a message:

1. Use the same letter-to-symbol assignment table that was created during setup
2. For each symbol in your encoded message:
   - Find the symbol in the table
   - Note which letter's column it appears in - this is your decoded letter
3. For spaces, punctuation, and other marks, leave them unchanged

For example, using the table above, if you see the symbol `S` in an encoded message, you would look for `S` in the table, find it in column A (the second symbol for A), and thus decode it as the letter A.

## Complete Example

Let us work through a practical example:

### Setup

**Secret Phrase:** `Imperial Eagle`

**Step 1: Prepare the secret phrase**

- Remove repeated letters and spaces: `ImperialEg`

**Step 2: Create the complete symbol list**

- Original symbol set: `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz`
- Begin with: `ImperialEg`
- Add remaining symbols: `ImperialEgABCDFGHJKLMNOPQRSTUVWXYZ0123456789bcdfhjknoqstuvwxyz`

**Step 3: Create the letter-to-symbol assignments using the dealing method**

Let us deal the symbols to each letter in sequence:

Round 1:

- A gets `I`
- B gets `m`
- C gets `p`
- D gets `e`
- E gets `r`
- F gets `i`
- G gets `a`
- H gets `l`
- I gets `E`
- J gets `g`
- K gets `A`
- L gets `B`
- ...and so on

Round 2:

- A gets `S`
- (skip B as it only needs 1 symbol)
- C gets `T`
- D gets `U`
- E gets `V`
- (skip F as it only needs 1 symbol)
- ...and so on

We continue dealing until each letter has received its required number of symbols, resulting in the complete assignment table as shown in the Cipher Setup section.

### Encoding

Message: `Meet at the bridge`

- M => options are `C`, selected into `C`
- e => options are `r, V, 5, h, t, w, y`, selected `t`
- e => options are `r, V, 5, h, t, w, y`, selected `V`
- t => options are `L, 3, d, q, v, x`, selected into `q`
- (space) => spaces are left unchanged
- a => options are `I, S, 4, f, s`, selected into `4`
- t => options are `L, 3, d, q, v, x`, selected into `q`
- (space) => spaces are left unchanged
- t => options are `L, 3, d, q, v, x`, selected into `x`
- h => options are `l, W, 6`, selected into `W`
- e => options are `r, V, 5, h, t, w, y`, selected `y`
- (space) => spaces are left unchanged
- b → options are `m`, selected `m`
- r → options are `J, 1, b`, selected `1`
- i → options are `E, X, 7, j`, selected `E`
- d → options are `e, U`, selected `e`
- g → options are `a`, selected `a`
- e => options are `r, V, 5, h, t, w, y`, selected `5`

Encoded message: `CtVq 4q xWy m1Eea5`

### Decoding

To decode the message `CtVq 4q xWy m1Eea5`, we would:

1. Use the same letter-to-symbol assignment table we created during setup
2. Look up each symbol in the table to find which letter's column it appears in:
   - `C` appears in column M → M
   - `t` appears in column E → E
   - `V` appears in column E → E
   - `q` appears in column T → T
   - (space) spaces are left unchanged
   - And so on for each symbol

Resulting in: `meet at the bridge`  
Note that capitilization is not preserved.
