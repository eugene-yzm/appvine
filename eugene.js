$( document ).ready(function() {
    db = dbCreate(); //creates new or locates exisitng local db
    addFakeUsers(); //adds a set of fake users
    drawTable();

    validator = $('#register').validator();

    validator.on('submit', function (e) {
      if (e.isDefaultPrevented()) {
        console.log(e);
      } else {
            var user = $('#inputName').val();
            var pass = $('#inputPassword').val();
            checkUser(user).then(function(ret){
                if(!ret) {
                    addUser(user,pass);
                    getUser(user).then(function(obj){
                        drawRow(obj);
                    });                    
                }
            });
            
        };
    });
    $('#nuke').click(function(){
        nukeDB();
    });
});

function drawRow(row) {
    var tr = "<tr>";
    tr += "<td>" + row.username + "</td>" + "<td>" + row.password + "</td></tr>";
    $("#tbody").append(tr);
};

function drawTable() {
    db.allDocs().then(function (result) {
        for (var i = 0; i < result.total_rows; i++) {
            obj = db.get(result.rows[i].id).then(function(item){
                drawRow(item);
            }); 
        };        
    });
};

function removeRow(row) {
    row.remove();
}

function cascadingTableDelete() {
    children = $('tbody').children();
    for (var i=children.length-1; i>=0; i--){
        $(children[i]).find('td').slideUp({padding: '0px'}, {duration: 300});
    };
    children = $('tbody').children().remove();
};

function checkUser(user) {
    //check username against database
    return db.get(user, function(err, doc) {
    if (err) { 
        console.log('1');
        return true; 
    }
    else {
        return false;
    };
    });
}

function addFakeUsers() {
    db.bulkDocs([
      {
        _id: 'Kitten',
        username: 'Kitten',
        password: 'passWord44'
      },
      {
        _id: 'DaenerysT',
        username: 'DaenerysT',
        password: 'imDaQueen1'
      },
      {
        _id: 'hodor321',
        username: 'hodor321',
        password: 'holdTheDoor2'
      }
    ]);
};

//adds user to database
function addUser(user, password) {   
    db.put(
    {
        '_id': user,
        'username': user,
        'password': password
    });
};

//returns promise of user
function getUser(user) {
    return db.get(user);
}

//resets the database
function nukeDB() {
    delDatabase().then(function(ret){
    if(ret==true){
        db = dbCreate();
        cascadingTableDelete();
    }
    else {
    //cry
    };
    });
}

//destroys database
function delDatabase() {
    return db.destroy().then(function(){
        return true;
    });
};

//creates or finds existing database
function dbCreate() {
    var db = new PouchDB('localdb');
    return db
};