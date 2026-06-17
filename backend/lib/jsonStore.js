const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

const COLLECTION_FILES = {
  customers: "customers.json",
  bills: "bills.json",
  cashIn: "cash-in.json",
  cheques: "cheques.json",
  users: "users.json",
};

function getFilePath(collection) {
  const fileName = COLLECTION_FILES[collection];
  if (!fileName) {
    throw new Error(`Unknown collection: ${collection}`);
  }
  return path.join(DATA_DIR, fileName);
}

async function readCollection(collection) {
  const filePath = getFilePath(collection);

  try {
    const content = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      throw new Error(`${collection} data must be a JSON array`);
    }

    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeCollection(collection, data) {
  if (!Array.isArray(data)) {
    throw new Error("Data must be a JSON array");
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = getFilePath(collection);
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function isValidCollection(collection) {
  return Object.prototype.hasOwnProperty.call(COLLECTION_FILES, collection);
}

module.exports = {
  COLLECTION_FILES,
  readCollection,
  writeCollection,
  isValidCollection,
};
