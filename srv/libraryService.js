const cds = require("@sap/cds");
const {Authors,Books,Histories,Users} = cds.entities;


module.exports = cds.service.impl(async (srv)=>{

srv.on('READ','authors',async (req,res)=>{
    console.log(req)
    let authSearch={},booksSearch={}

    if(req.data.ID) {
        authSearch={ID: req.data.ID}
        booksSearch={author_ID: req.data.ID}
    }
    const authors = await SELECT.from(Authors).where(authSearch)
    const books = await SELECT.from(Books).where(booksSearch)
    for (author of authors) author['books']=[]
    for (book of books){
        for(author of authors){
            if(book['author_ID'] == author['ID']) {
                author['books'].push(book)
                break
            }
        }
    }
    return authors
})

srv.on("READ","copies",async (req)=>{
    let query = 'select C.ID as CopyID,B.ID as BookID,B.book_name,B.genre,B.edition,B.published_year,B.author_ID from Copies as C join Books as B on C.book_ID = B.ID'
    if(req.data.ID) query+=` where C.ID = '${req.data.ID}'`
    const parsedQuery = cds.parse.cql(query)
    const copies  = await cds.run(parsedQuery);
    const histories = await SELECT.from(Histories).where({return_time: null})
        for(copy of copies){
            let book_status = "UA"
        for(history of histories){
            if(copy['CopyID'] === history['copy_ID']) book_status = "A"
        }
        copy['status'] = book_status
        }
        return copies;

})

srv.on("READ","users",async (req)=>{
    let userSearch={},histSearch={}
    if(req.data.ID) {
        userSearch={ID: req.data.ID}
        histSearch={user_ID: req.data.ID}
    }
const users = await SELECT.from(Users).where(userSearch);
const histories = await SELECT.from(Histories).where(histSearch);
for (user of users) user['histories']=[]
for (history of histories){
    for(user of users){
        if(history['user_ID'] == user['ID']) {
            user['histories'].push(history)
            break
        }
    }
}
return users
})

srv.on('availableBooks',async (req)=>{
    const query = cds.parse.cql(`SELECT b.book_name,b.genre,b.edition,b.published_year,count(*) as available_count from Copies as c join Books as b on c.book_ID = b.ID and c.ID not in (SELECT copy_ID from histories where return_time is null) group by b.ID`)
    const result = await cds.run(query)
    return result
})

srv.on('search',async(req)=>{
    const results = await SELECT.from(Books).where(req.data)
    return results
})

srv.on('issue',async (req)=>{
    const query= cds.parse.cql(`SELECT c.ID as cid from Copies as c join Books as b on c.book_ID = b.ID where b.ID='${req.data.book_id}' and c.ID not in (SELECT copy_ID from histories where return_time is null)`)
    const result = await cds.run(query)
    if(result.length === 0) return "Book is not available currently"
    const copy_id = result[0]['cid']
    await INSERT.into(Histories).entries({user_ID: req.data.user_id,copy_ID: copy_id,assign_time: Date.now()})
    const val = await SELECT.one.from(Histories).where({user_ID: req.data.user_id,copy_ID: copy_id})
    return "Your Book issue Id: "+val.ID;
})

srv.on('return',async (req)=>{
    const val = await UPDATE(Histories).set({return_time: Date.now()}).where({ID: req.data.book_issue_id})
    if(val === 1) return "Book Returned Successfully"
    return "Error Returning Book"
})
})
