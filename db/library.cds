entity Copies {
    key ID   : UUID;
        book : Association to Books @mandatory;
        history: Association to many Histories on history.copy = $self;
}

entity Books {
    key ID             : UUID;
        book_name      : String(100);
        genre          : String(100);
        edition        : Integer;
        published_year : Date;
        author         : Association to Authors  @mandatory;
        copy         : Association to many Copies on copy.book = $self;
}

entity Authors {
    key ID         : UUID;
        first_name : String(100);
        last_name  : String(100);
        dob        : Date;
        book       : Association to  many Books on book.author = $self ;
}

entity Users {
    key ID         : UUID;
        first_name : String(100);
        last_name  : String(100);
        dob        : Date;
        history    : Association to many Histories on history.user = $self;
}

entity Histories{
    key ID: UUID;
    assign_time: Timestamp @mandatory;
    return_time: Timestamp;
    user: Association to Users @mandatory;
    copy: Association to Copies @mandatory;
    test: String(10);

}

