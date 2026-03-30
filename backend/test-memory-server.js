const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'test_db');
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

(async () => {
  try {
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath,
        storageEngine: 'wiredTiger'
      }
    });
    console.log("Memory server URI:", mongoServer.getUri());
    process.exit(0);
  } catch(e) {
    console.error(e);
  }
})();
