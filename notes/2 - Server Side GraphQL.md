# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## What is GraphQL?

Well first things first, GraphQL is nothing more than an API specification. There are a set of rules that define a GraphQL API, mainly how to interact with one in the **frontend**, via _queries_, _mutations_, and _subscriptions_, and how it is strucured on the **backend** to handle the _requests_. GraphQL APIs are conceptual, so they are _language-agnostic_. For the purpose of this course, we'll be using the context of JavaScript for both the entire stack.

The main reason why GraphQL is different, and in some cases, _preferable_ to the classic REST API structure, is because you can avoid things like receiveing extra, useless data, and loosly typed APIs. Via the specification, the frontend is able to send a `query` or a `mutation` that will specify the exact type of data to be returned. There's a lot of idiosyncracies that are odd about GraphQL compared to REST, but since I write these notes for myself, and I already did another course on GraphQL, I'm going to direct you, my dear reader, to another set of notes about the basics. Check out this [link for more info on what GraphQL](https://github.com/leeandher/programming-notes/tree/master/How%20To%20GraphQL), going forward these notes will specifically cover _Server Side GraphQL_!

---

## Specifying a Data Model / Schema

Part of creating any API is to define your datamodel. GraphQL is no different, except for the fact that you use a special language known as SDL (Schema Definition Language). It sorta looks like error-filled JSON, or YAML, but it reads easy, so it's not too bad.

In your SDL file, in this case `$backend-root/datamodel.prisma`, we can define the data model using a combination of the following key components:

- types
- fields
- built-in types
- non-nullable fields
- list fields
- enumerations
- interfaces
- directives

I'm going to run through them to give you a bit of an overview.

### Types, Fields, Built-in Types

_Types_ are the basis of your models. They are defined by their _fields_ and those fields are defined by their _types_. There are some _built-in types_ which you'll recognize from every programming language, but you can easily use your own custom types to apply to some fields. Let me show you an example:

```graphql
type User {
  name: String
  email: String
}
```

Here I've declared my own new _type_ called **User**. The User type is composed of two _fields_, **name** and **email**. Each of those fields has an assigned _built-in type_ of **String**. The built-in types include:

- Int
- Float
- String
- Boolean
- ID _(a special type used for identifiers)_

### Non-nullable and List Fields

There are plenty of situations in whicy you'll want to ensure you don't get _undefined_ fields populated all over your database. In these situations, you'll want to use a **non-nullable** flag, which is depicted as an exclamation mark (`!`). The following example says: "If you want to make a user, you _MUST_ supply a name, but the email is optional".

```graphql
type User {
  name: String!
  email: String
}
```

Additionally, there are plenty of times when a type may consist of an unknown number of items in one field. This is where you can use lists. They are denoted like arrays in JavaScript, by square brackets (`[]`). The example below suggests that a `User` may or may not have _medals_, denoted as a list of `String`s.

```graphql
type User {
  name: String!
  email: String
  medals: [String]
}
```

If you'd like to combine these, you can, just note how they should be combined using the following table:


 | Accepts:     | `null` | `[]` | `[null]` | `["test"]` |
 | ------------ | ------ | ---- | -------- | ---------- |
 | `[String!]!` | **No** | Yes  | **No**   | Yes        |
 | `[String]!`  | **No** | Yes  | Yes      | Yes        |
 | `[String!]`  | Yes    | Yes  | **No**   | Yes        |
 | `[String] `  | Yes    | Yes  | Yes      | Yes        |

### Enumerations

Enumerations or *enums* are scalar values which have a specified set of possible values to choose from. They one of the built-in types, just a bit unique. In the following example, we can see the `User`'s `role` is non-nullable, and can only be one of three options: *ADMIN*, *MOD*, or *DEFAULT*.

```graphql
enum UserRole {
  ADMIN
  MOD
  DEFAULT
}

type User {
  name: String
  email: String
  role: UserRole!
}
```

### Interfaces

Interfaces are kind of like constructor types. They contain a set of fields (with their associated types), and all other types who *implement* that **interface** will have to follow suit, but they are allowed to add other fields as well. Take a look at the following:

```graphql
interface User {
  name: String!
  email: String!
}

type Admin implements User {
  name: String!
  email: String!
  accessKey: String
  userGroups: [String!]!
}

type Mod implements User {
  name: String!
  email: String!
  modChats: [String!]!
}
```

### Directives

Directives are special indicator flags that can some logic or context to certain fields that they are attached to. For example, here are some directives in use:

```graphql
type User {
  name: String!
  email: String!
  username: String! @unique
}
```

There are plenty more that can be used when *using the API*, as arguments, but we'll get there eventually.

_**Even though this note is long, there's still plenty more to learn about SDL. Check out the [actual documentation here](https://graphql.org/learn/schema/)!**_

---

## What is Prisma?

Prisma is an Opensource GraphQL Database Interface. Lots of big words, but simply put, this guy lets you perform CRUD operations on your data without ever having to worry about writing custom queries. That means you don't have to write any SQL or MongoDB queries. 

Instead you let Prisma do the heavy lifting and just focus on your app. All you do is pass it a *data model* using SDL (as specified above) and calling `prisma deploy` will create a complete `.graphql` schema for you, with the necessary `queries` and `mutations` that you'll need to get started. This is ALSO written in SDL, and is essentially a complete access API generated for you!

However, it should be noted that you CANNOT use this API outright in the frontend. There is no authentication layer, no security layer, or any sort of custom logic if we want to add anything. Stuff like permissions, emails, hashing passwords, reset flows, all still needs to be developed. Thats where GraphQL Yoga comes in.

---

## What is GraphQL Yoga?
- what is built on
- How the process works db > create Server > index (+ resolvers)
- schema.graphql typedefs and resolvers Query and Mutation