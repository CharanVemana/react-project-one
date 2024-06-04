import React, { useEffect, useState } from 'react';
import './App.css';

const userDetails = 'https://jsonplaceholder.typicode.com/users';

export default function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch(userDetails);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await fetch(`${userDetails}/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEditedName(user.name);
    setEditedUsername(user.username);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditedName('');
    setEditedUsername('');
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`${userDetails}/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editedName, username: editedUsername }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const updatedUser = { ...editingUser, name: editedName, username: editedUsername };
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      cancelEditing();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="centered">
      <table border={1}>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{editingUser === user ? <input value={editedName} onChange={(e) => setEditedName(e.target.value)} /> : user.name}</td>
              <td>{editingUser === user ? <input value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} /> : user.username}</td>
              <td>
                {editingUser === user ? (
                  <>
                    <button onClick={saveChanges}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEditing(user)}>Edit</button>
                )}
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}