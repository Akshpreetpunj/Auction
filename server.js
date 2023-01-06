/* "StAuth10222: I Akshpreet Singh Punj, 000820040 certify that this material is my original work. 
    No other person's work has been used without due acknowledgement. 
    I have not made my work available to anyone else." 
*/

// Required packages
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Return the Auctioneer page
app.get('/auctioneer', function(req,res){
    res.sendFile(__dirname + '/auctioneer.html');
});
  
// Return the Bidder page
app.get('/bidder', function(req,res){
    res.sendFile(__dirname + '/bidder.html');
});

// If we have a connection....
io.on('connection', function(socket){

    // when the auctioneer submits an item...
    socket.on("submititem", function(itemdata)
    {
        // Make sure we've received the item OK
        console.log("Item submitted: " + JSON.stringify(itemdata));
        
        // Broadcast the auction item to all the bidders (but not the auctioneer/sender)
        socket.broadcast.emit("deliveritem", itemdata);
    });

    // when a bidder submits a bid...
    socket.on("submitbid", function(biddata){

        // Make sure we've received the bid OK
        console.log("Bid submitted: " + JSON.stringify(biddata));

        // Send back the bid data to all the connected clients (auctioneer and bidder)
        io.emit("deliverbid", biddata);
    });
});

// Start the server
http.listen(3000, function(){
    console.log('listening on port 3000!');
});