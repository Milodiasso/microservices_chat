const Discussion = require('../model/microservice_chat')

const Controller = {
    async createChat(req, res) {
        const msg = new Discussion({
            user_id : [req.body.creatorId],
            name_chat : req.body.nameChat
        })
        try {
            const savedMsg = await msg.save();
            res.send("Msg saved");
        } catch(err) {
            res.status(400).send("Message not saved !")
        }
    },

    async channels  (req, res){
        try {
            const users = await Discussion.find({name_chat : {$exists : true}})
            res.send(users.map(val => [val.name_chat, val._id]));
        } catch(err) {
            res.status(400).send("Channels no found !")
        }
    },

    async channel_id  (req, res){
        try {
            const users = await Discussion.findOne({name_chat : req.params.name})
            res.send(users._id );
        } catch(err) {
            res.status(400).send("Channels no found !")
        }
    },

    async channel_master(req, res){
        try {
            const channel = await Discussion.find({name_chat : req.body.nameChat})
            const master =  channel[0].user_id[0]
            res.status(200).send([master])
        } catch(err) {
            res.status(400).send("Channel no found ! " +  err)
        }
    },

    async delete_channel (req, res){
        try {
            const channel = await Discussion.find({name_chat : req.body.nameChat })
            if (req.body.idUser == channel[0].user_id[0]){
                Discussion.findOneAndDelete({name_chat : req.body.nameChat}, (err, result)=>{
                    if (err) return res.send(500, err)
                })
                res.send("The channel " + channel[0].name_chat + " is deleted")
            } else {
                res.send("only creator could delete channel ")
            }
        } catch(err) {
            res.status(400).send("Channels no found !")
        }
    },

    async chat (req, res){
        try {
            const users = await Discussion.find({name_chat : req.params.name})
            res.send(users[0].user_id);
        } catch(err) {
            res.status(400).send("Users not found !")
        }
    },

    async addUser (req,res){
        try{
            await Discussion.findOneAndUpdate(
                {name_chat: req.body.channel},
                {$addToSet : {user_id : req.body.id} }
            )
            res.status(202).send('new user had join the channel')
        } catch (err){
            console.log(err);
            res.status(401).send('error 401')
        }
    },

    async removeUser (req,res){
        try{
            await Discussion.findOneAndUpdate(
                {name_chat: req.body.channel},
                {$pull : {user_id : req.body.id} }
            )
            res.status(202).send('the user ' + req.body.id + ' was removed from channel')
        } catch (err){
            console.log(err);
            res.status(401).send('error 401')
        }
    }

    

}

module.exports =  Controller 