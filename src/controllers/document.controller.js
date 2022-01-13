const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { documentService } = require("../services");

const pollResource = catchAsync(async (req, res) => {
    documentService.pollResource(req, res);
});

module.exports = {
    pollResource,
};
