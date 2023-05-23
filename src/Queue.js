// import EventEmitter from "events"
// import uuid from "uuid";
//
// export default class Queue {
//     #jobs = new Map();
//
//     #eventEmitter;
//
//     constructor() {
//         this.#eventEmitter = new EventEmitter()
//     }
//
//     addJob(job) {
//         const id = uuid()
//         job.id = id;
//         job.created = new Date();
//         job.status = "queued";
//
//         this.#jobs.set(id, job);
//         this.#eventEmitter.emit("job added", this.#jobs);
//     }
//
//     nextJob() {
//         const openJobsSorted = Array.from(this.#jobs.values())
//             .filter(job => job.status === "queued")
//             .sort((a, b) => {
//                 return a.created - b.created;
//             });
//
//         if (openJobsSorted.length === 0) {
//             return false
//         }
//
//         this.#jobs.get(openJobsSorted[0].id).status = "in progress";
//         return this.#jobs.get(openJobsSorted[0].id);
//     }
//
//     finishJob(id) {
//         const job = this.#jobs.get(id);
//         job.status = "finished";
//         this.#jobs.set(id, job);
//     }
//
//     count() {
//         return this.#jobs.length;
//     }
// }