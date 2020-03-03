import events from "events";

const EventEmitter = events.EventEmitter;
const localEmitter = new EventEmitter();

export default localEmitter;
