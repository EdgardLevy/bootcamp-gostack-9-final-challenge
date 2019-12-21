export default function totalizeRecords(result, _limit, _page) {
  const limit = Number(_limit);
  const page = Number(_page);

  /*
  ex 
    total_records = 7
    limit = 3
    page = 1
  */
  const total_records = result.count;

  let total_pages = 0;

  //  7  <  3
  if (result.count < limit) {
    total_pages = 1;
  } else {
    const x = Math.ceil(total_records / limit);
    total_pages = x;
  }
  // 1 < 1
  const has_next = page < total_pages;
  const has_prev = page > 1 && page <= total_pages;

  return {
    records: result.rows,
    meta: {
      total_records,
      total_pages,
      page,
      has_next,
      has_prev,
    },
  };
}
