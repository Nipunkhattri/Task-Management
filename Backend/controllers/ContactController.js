import Contact from '../models/ContactModel.js'

export const CreateContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, company, jobTitle } = req.body;

        const existingContact = await Contact.findOne({ email });
        if (existingContact) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const contact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            company,
            jobTitle
        });

        const savedContact = await contact.save();
        res.status(201).json(savedContact);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
}

export const GetContacts = async (req, res) => {
    try {
        const { sortField = 'lastName', sortOrder = 'asc' } = req.query;

        const sort = {
            [sortField]: sortOrder === 'asc' ? 1 : -1
        };

        const contacts = await Contact.find()
            .sort(sort)
            .select('-__v');

        res.json(contacts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export const UpdateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, company, jobTitle } = req.body;

        const existingContact = await Contact.findById(id);
        if (!existingContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        const duplicateEmail = await Contact.findOne({
            email,
            _id: { $ne: id }
        });

        if (duplicateEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
                email,
                phone,
                company,
                jobTitle
            },
            { new: true, runValidators: true }
        );

        res.json(updatedContact);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
}

export const DeleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}