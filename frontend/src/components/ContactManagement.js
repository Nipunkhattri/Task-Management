import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
} from '@mui/material';
import { Edit, Delete } from 'lucide-react';
import axios from 'axios';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('firstName');
  const [order, setOrder] = useState('asc');
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch all the Contacts
  const fetchContacts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/contacts`);
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts');
    }
  };

  // Edit the Contact with id or update the contact 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editMode
        ? `${BACKEND_URL}/api/contacts/${editId}`
        : `${BACKEND_URL}/api/contacts`;
      const method = editMode ? axios.put : axios.post;

      await method(url, formData);
      await fetchContacts();
      resetForm();
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to save contact');
    }
  };

  // Delete a Contact with id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/contacts/${id}`);
      await fetchContacts();
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  // Set the form with contact it clicked and allow edit mode 
  const handleEdit = (contact) => {
    setFormData(contact);
    setEditMode(true);
    setEditId(contact._id);
    setOpenDialog(true);
  };

  // Rest the form and close edit mode
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
    });
    setEditMode(false);
    setEditId(null);
  };

  // sort the contact by property
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // sort all the contact
  const sortedContacts = [...contacts].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  // Set the page with newPage
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Change per page row
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-6">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          resetForm();
          setOpenDialog(true);
        }}
        className="mb-4"
      >
        Add New Contact
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editMode ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} className="mt-2">
              <TextField
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <TextField
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              <TextField
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <TextField
                label="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <TextField
                label="Company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <TextField
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  direction={orderBy === 'firstName' ? order : 'des'}
                  onClick={() => handleSort('firstName')}
                >
                  First Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                  Last Name
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedContacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.jobTitle}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(contact)}
                      size="small"
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(contact._id)}
                      size="small"
                      color="error"
                    >
                      <Delete className="h-4 w-4" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default ContactManagement;
