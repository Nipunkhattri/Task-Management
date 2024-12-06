import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    TaskName: {
        type: String,
        required: true,
    },
    TaskDeadline: {
        type: Date,
        required: true,
    },
    TaskDescription: {
        type: String,
        required: true,
    },
    TaskStatus: {
        type: String,
        required: true,
    },
    AssignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

export default mongoose.model('Task', TaskSchema);