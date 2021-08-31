'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = async function (db) {
    return db.runSql(`
    ALTER TABLE
      clips
    ADD COLUMN machine_verified BOOLEAN DEFAULT FALSE NOT NULL,,
    ADD COLUMN marosijo_score FLOAT DEFAULT NULL,
  `);
};

exports.down = function () {
    return null;
};

exports._meta = {
    version: 1,
};
