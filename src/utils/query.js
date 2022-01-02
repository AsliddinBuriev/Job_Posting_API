class Query {
  constructor(query, queryStr){
    this.query = query;
    this.queryStr = queryStr
  }
  // Query => filter
  filter(){
    const filterObj = { ...this.queryStr}
    const excludedFields = ['sort', 'load']
		excludedFields.forEach(el=> delete filterObj[el])

    let filterStr = JSON.stringify(filterObj)
    filterStr = filterStr.replace(/\b-\b/g, match => ' ')
    this.query = this.query.find(JSON.parse(filterStr))
    return this
  }
  //  Query => sort 
  sort(){
    if(this.queryStr.sort){
      const sortStr = this.queryStr.sort.split(',').join(' ')
      this.query = this.query.sort(sortStr)
    }
    return this
  }
  //  Query => select
  select(){
    if(this.queryStr.fields){
      this.query = this.query.select(this.queryStr.fields)
    }else{
      this.query = this.query.select(['-__v'])
    }
    return this
  }
  //  Query => load
  load(){
    const load = this.queryStr.load * 1 || 1
    const limit = 20
    const skip = (load - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}
export default Query