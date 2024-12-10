import TaskModel from '../models/TaskModel.js';
import UserModel from '../models/AuthModel.js';

// 1. Get all the users and their tasks
export const getAllUserTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find().populate('AssignedUser');
        const users = {};

        tasks.forEach(task => {
            const userId = task.AssignedUser._id;
            if (!users[userId]) {
                users[userId] = {
                    user: task.AssignedUser,
                    tasks: []
                };
            }
            users[userId].tasks.push(task);
        });

        res.status(200).json(Object.values(users));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Admin creates a task and assigns it to a user
export const createTask = async (req, res) => {
    const { TaskName, TaskDeadline, TaskDescription, TaskStatus, AssignUserEmail } = req.body;
    try {
        const user = await UserModel.findOne({ email: AssignUserEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const role = req.user.role;
        let task;

        if(role == 'Admin'){   
            task = new TaskModel({
                TaskName,
                TaskDeadline,
                TaskDescription,
                TaskStatus,
                AssignedUser: user._id,
                UserTaskValidation : 'Approved'
            });
        }
        else{
            task = new TaskModel({
                TaskName,
                TaskDeadline,
                TaskDescription,
                TaskStatus,
                AssignedUser: user._id
            });
        }

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. User fetches tasks by user ID
export const getUserTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find({ AssignedUser: req.userId });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Admin updates task details
export const updateTask = async (req, res) => {
    try {
        let updateData = { ...req.body };
        
        if (updateData.AssignUserEmail) {
            const user = await UserModel.findOne({ email: updateData.AssignUserEmail });
            if (!user) {
                return res.status(404).json({ message: 'Assigned user not found' });
            }
            updateData.AssignedUser = user._id;
            delete updateData.AssignUserEmail;
        }

        const task = await TaskModel.findByIdAndUpdate(
            req.params.taskId, 
            updateData,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. Admin deletes a task by task ID
export const deleteTask = async (req, res) => {
    try {
        const task = await TaskModel.findByIdAndDelete(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. User updates task status by task ID
export const updateTaskStatus = async (req, res) => {
    try {
        const task = await TaskModel.findOne({ _id: req.params.taskId, AssignedUser: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        task.TaskStatus = req.body.TaskStatus;
        await task.save();
        res.status(200).json({ message: 'Task status updated', task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 7. Admin deletes a user and their tasks
export const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await TaskModel.deleteMany({ AssignedUser: req.params.userId });
        res.status(200).json({ message: 'User and their tasks deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ role: { $ne: 'Admin' } })
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};