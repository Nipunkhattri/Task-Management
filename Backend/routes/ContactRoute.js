import express from "express";
import { CreateContact , GetContacts , UpdateContact , DeleteContact } from "../controllers/ContactController.js";
import { validateContact } from "../middleware/Validation.js";

const router = express.Router();

router.post('/contacts',validateContact,CreateContact)
router.get('/contacts',GetContacts)
router.put('/contacts/:id',validateContact,UpdateContact)
router.delete('/contacts/:id',DeleteContact)

export default router;