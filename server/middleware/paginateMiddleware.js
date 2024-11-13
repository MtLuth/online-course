import paginate from "express-paginate";
import catchAsync from "../utils/catchAsync.js";

const pagination = catchAsync(async (req, res, next) => {
  const results = req.results;
  const page = req.query.page || 1;
  const limit = req.query.limit;
  const pageCount = Math.ceil(results.length / limit);

  res.status(200).json({
    status: "Successfully",
    message: {
      results: results.slice((page - 1) * limit, page * limit),
      pageCount: pageCount,
      itemCount: results.length,
      pages: paginate.getArrayPages(req)(3, pageCount, page),
    },
  });
});

export default pagination;
