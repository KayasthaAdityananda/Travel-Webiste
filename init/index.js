const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongoURI = 'mongodb://localhost:27017/Just_A_DB';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(MongoURI);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('Database initialized with sample data!');
}

initDB();





// ### Database Seeding Script (`init/index.js`)

// ---

// ## Purpose

// * Connect to MongoDB
// * Remove existing data from the collection
// * Insert fresh sample data
// * Used during development/testing to reset the database

// ---

// ## Imports

// ```js
// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");
// ```

// ### Concepts

// * **mongoose** → MongoDB ODM (Object Data Modeling)
// * **initData** → Sample data source
// * **Listing** → Mongoose model representing the listings collection

// ### Key Idea

// ```text
// Model
//   ↓
// Collection
//   ↓
// Documents
// ```

// ---

// ## Database Connection

// ```js
// const MongoURI = 'mongodb://localhost:27017/Just_A_DB';
// ```

// ### Structure

// ```text
// mongodb://
//     ↓
// localhost
//     ↓
// 27017 (default MongoDB port)
//     ↓
// Just_A_DB (database name)
// ```

// ### Key Idea

// * MongoDB automatically creates the database if it doesn't exist.

// ---

// ## Connecting to MongoDB

// ```js
// main()
// ```

// ```js
// async function main() {
//     await mongoose.connect(MongoURI);
// }
// ```

// ### Concepts

// * `async` → function can use `await`
// * `await` → pause execution until Promise resolves
// * `mongoose.connect()` returns a Promise

// ### Flow

// ```text
// Start Script
//     ↓
// Connect to MongoDB
//     ↓
// Connection Success / Failure
// ```

// ---

// ## Promise Handling

// ```js
// main()
// .then(...)
// .catch(...)
// ```

// ### Purpose

// Handle connection results.

// #### Success

// ```js
// .then(() => {
//     console.log("Connected");
// })
// ```

// #### Failure

// ```js
// .catch(err => {
//     console.error(err);
// })
// ```

// ### Key Idea

// ```text
// Promise
//    ↓
// then()  → success
// catch() → failure
// ```

// ---

// ## Database Initialization Function

// ```js
// const initDB = async () => {
// ```

// ### Purpose

// Reset the database.

// ---

// ## Delete Existing Data

// ```js
// await Listing.deleteMany({});
// ```

// ### Concept

// ```js
// {}
// ```

// means:

// ```text
// Match everything
// ```

// Equivalent MongoDB command:

// ```js
// db.listings.deleteMany({})
// ```

// ### Effect

// ```text
// Before:
// A
// B
// C

// After:
// (empty)
// ```

// ---

// ## Insert Sample Data

// ```js
// await Listing.insertMany(initData.data);
// ```

// ### Concept

// Bulk insertion of multiple documents.

// Example:

// ```js
// [
//   { title: "Goa Beach" },
//   { title: "Mountain Cabin" }
// ]
// ```

// gets inserted in one operation.

// ### Why use `insertMany()`

// * Faster than multiple `save()` calls
// * Convenient for seeding databases

// ---

// ## Running the Seeder

// ```js
// initDB();
// ```

// ### Flow

// ```text
// Connect Database
//       ↓
// Delete Old Data
//       ↓
// Insert Sample Data
//       ↓
// Database Ready
// ```

// ---

// ## Important Methods Used

// | Method               | Purpose                       |
// | -------------------- | ----------------------------- |
// | `mongoose.connect()` | Connect to MongoDB            |
// | `deleteMany({})`     | Delete all matching documents |
// | `insertMany()`       | Insert multiple documents     |
// | `await`              | Wait for async operation      |
// | `.then()`            | Handle success                |
// | `.catch()`           | Handle failure                |

// ---

// ## Common Mistake

// Current code:

// ```js
// main();
// initDB();
// ```

// Potential issue:

// ```text
// Connection may not finish
// before initDB starts.
// ```

// Safer version:

// ```js
// main()
// .then(async () => {
//     await initDB();
// })
// .catch(err => {
//     console.log(err);
// });
// ```

// ### Key Idea

// ```text
// Connect First
//       ↓
// Seed Database
//       ↓
// Done
// ```

// ---

// ## Revision Summary

// * **Seeder Script** = script that fills database with initial data.
// * **Mongoose Model** represents a MongoDB collection.
// * **deleteMany({})** removes all documents.
// * **insertMany()** inserts multiple documents at once.
// * **await** waits for database operations to finish.
// * **then/catch** handle Promise success and failure.
// * Always ensure database connection is established before seeding.