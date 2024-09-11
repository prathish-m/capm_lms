using {Authors,Users,Books,Copies,Histories} from '../db/library';
type cust_books {
    ID: Integer;
    book_name: String;
    edition: Integer;
    published_year: Date;
    genre: String;
}

type avail_books {
    available_count: Integer;
    book_name: String;
    edition: Integer;
    published_year: Date;
    genre: String;
}




service srv@(path:'/service'){
    entity authors as projection on Authors;  //working
    entity users as projection on Users;       //working
    entity books as projection on Books;        //working
    entity copies as projection on Copies;      //working
    entity history as projection on Histories;  //working
    // entity sample as SELECT b.book_name,b.genre,b.edition,b.published_year,count(*) as available_count from Copies as c join Books as b on c.book.ID = b.ID and c.ID not in (SELECT copy.ID from Histories where return_time is null) group by b.ID;
    function availableBooks() returns Array of avail_books;
    function search(genre: String,edition: Integer,book_name: String,published_year: Date) returns Array of cust_books;     //working
    action issue(book_id: Integer,user_id: Integer) returns String;
    action return(book_issue_id: UUID) returns String;
}
