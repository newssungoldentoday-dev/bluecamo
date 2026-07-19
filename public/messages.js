// core/messages.js — direct messaging logic
const Message = require("../db/models/Message");
const Notification = require("../db/models/Notification");

function sendMessage(fromId, toId, body) {
  if (!body || !body.trim()) throw new Error("message cannot be empty");
  if (fromId === toId) throw new Error("cannot message yourself");
  const msg = Message.send({ fromId, toId, body: body.trim() });
  Notification.create({ userId: toId, type: "message", payload: { fromId, messageId: msg.id } });
  return msg;
}

function getThread(userAId, userBId) {
  return Message.thread(userAId, userBId);
}

module.exports = { sendMessage, getThread };
  
