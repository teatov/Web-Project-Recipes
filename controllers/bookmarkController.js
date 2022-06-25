const Bookmark = require("../models/bookmarkModel");
const factory = require("./handlerFactory");

exports.createBookmark = factory.createOne(Bookmark);
exports.getBookmark = factory.getOne(Bookmark);
exports.getAllBookmarks = factory.getAll(Bookmark);
exports.updateBookmark = factory.updateOne(Bookmark);
exports.deleteBookmark = factory.deleteOne(Bookmark);
