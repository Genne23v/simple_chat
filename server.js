let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let mongoose = require('mongoose');

//const MongoClient = require('mongodb').MongoClient;
//const url = 'mongodb+srv://genne:<2456>@cluster0.t6z9c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.Promise = Promise;

let dbUrl = 'mongodb+srv://genne:2456@cluster0.t6z9c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//dbUrl = 'mongodb://user:user@ds155424.mlab.com:55424/learning-node'


let Message = mongoose.model("Message", {
    name: String,
    message: String
});

// let messages = [
//     { name: 'Tim', message: 'Hi' }, { name: 'Jane', message: 'Hello' }
// ]
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.post('/messages', async(req, res) => {
    try {
        let message = new Message(req.body);

        let savedMessage = await message.save();
        console.log("Saved");
        let censored = await Message.findOne({ message: "badword" });

        if (censored) {
            await Mesaage.remove({ _id: censored.id });
        } else {
            io.emit("message", req.body);
            res.sendStatus(200);
        }
    } catch (error) {
        res.sendStatus(500);
        return console.error(error);
    } finally {
        //logger.log("Message post called");
    }
})



io.on('connection', (socket) => {
    console.log("A user connected");
});
mongoose.connect(dbUrl, { useNewUrlParser: true }, { useMongoClient: true },
    (err) => {
        console.log('mongo db connection', err);
    });

let server = http.listen(3000, () => {
    console.log('sever is listening on port', server.address().port);
});