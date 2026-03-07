## 1. What is the difference between var, let, and const?
**var**: Function scoped, Changable, Redeclarable.

**let**: Block scoped, Changable value, not Redeclarable.

**const**: Block scoped, not Changable, not Redeclarable.

## 2. What is the spread operator (...)?

The spread operator (...) is used to extract elements from an array, pass them as function arguments, or copy/merge arrays.

It is written before the variable name like this: ...variable.

## 3. What is the difference between map(), filter(), and forEach()?

**map()**: Create a new array without changing the original array.

**filter()**: Create a new array with elements that meet the condition, without changing the original array.

**forEach()**: Returns no value, the original array can be modified manually.

## 4. What is an arrow function?

**arrow function**:

It is a function but it is declared like a variable. You don’t need to explicitly return a value for a single operation.

- If there is one parameter, you can write it directly.

- If there are zero or multiple parameters, declare them inside ().

- Then use the => symbol to define the operation.

- If there are multiple operations, wrap them in { }.

- If there are multiple operations inside { }, you need to use return explicitly.

**example**:
```js
const square = x => x * x;
console.log(square(5));
```

## 5. What are template literals?

**template literals**

Template literals allow you to declare multiline strings and use previously declared strings inside them.
To include a string or variable, use ${variableName}.

Template literals: ( `` )

**example**:

```js
const name = "Abid";
const message = `Hello ${name},
Welcome to JavaScript!`;
console.log(message);
```