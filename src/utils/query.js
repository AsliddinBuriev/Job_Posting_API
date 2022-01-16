class Query {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // Query => filter
  filter() {
    const filterObj = { ...this.queryStr };
    const excludedFields = ['sort', 'load', 'fields'];
    excludedFields.forEach((el) => delete filterObj[el]);

    let filterStr = JSON.stringify(filterObj);
    filterStr = filterStr.replace(/\b-\b/g, (match) => ' ');
    this.query = this.query.find(JSON.parse(filterStr));
    return this;
  }
  //  Query => sort
  sort() {
    if (this.queryStr.sort) {
      const sortStr = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortStr);
    }
    return this;
  }
  //  Query => select
  select() {
    if (this.queryStr.fields) {
      const selectStr = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(selectStr);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  //  Query => load
  load() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
export default Query;
