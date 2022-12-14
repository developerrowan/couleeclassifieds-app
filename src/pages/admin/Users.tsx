import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { UserRoleDto } from '../../models/user-role.dto';
import { UserDto } from '../../models/user.dto';
import { getAllUserRoles, getAllUsers, deleteUser } from '../../services/auth.service';
import Modal from 'bootstrap/js/dist/modal';
import clsx from 'clsx';
import { useAuth } from '../../hooks/auth.hook';

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState(0);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    getAllUserRoles().then((roles) => {
      setRoles(roles);
    });

    getAllUsers().then((users) => {
      setUsers(users);
    });
  };

  const closeModal = () => {
    const modal = new Modal(document.getElementById('modal')!);
    modal.hide();
  };

  const removeUser = async (userId: number) => {
    const result = await deleteUser(userId);

    if (!result) {
      closeModal();
      return;
    }

    initialize();

    closeModal();
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <FontAwesomeIcon icon="pencil" /> Action
              </th>
              <th scope="col"></th>
              <th scope="col">#</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">
                <FontAwesomeIcon icon="envelope" /> Email
              </th>
              <th scope="col">
                <FontAwesomeIcon icon="lock" /> Password
              </th>
              <th scope="col">
                <FontAwesomeIcon icon="user-group" /> Role
              </th>
              <th scope="col">
                <FontAwesomeIcon icon="chart-line" /> Active
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: UserDto, i) => {
              /* @ts-ignore */
              const role: UserRoleDto = roles.find(
                (role: UserRoleDto) => role.userRoleId === u.role
              );

              return (
                <tr key={i}>
                  <td>
                    <a href={`/admin/users/${u.userId}`} className="btn btn-primary">
                      <FontAwesomeIcon icon="pen-to-square" />
                    </a>
                  </td>
                  <td>
                    <a
                      onClick={() => {
                        setUserIdToDelete(u.userId);
                        const myModal = new Modal(document.getElementById('modal')!);
                        myModal.show();
                      }}
                      className={clsx(
                        'btn btn-danger',
                        user && user.userId === u.userId ? 'disabled' : ''
                      )}
                    >
                      <FontAwesomeIcon icon="trash" />
                    </a>
                  </td>
                  <th scope="row">{u.userId}</th>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.password}</td>
                  <td>{role.name}</td>
                  <td>{u.active ? 'Yes' : 'No'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <a href="/admin/users/0" className="btn btn-primary">
          Add User
        </a>
      </div>
      <div
        className="modal fade"
        id="modal"
        tabIndex={-1}
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalLabel">
                Careful!
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete user with ID {userIdToDelete}?{' '}
              <b>This action may not be undone.</b>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                No
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeUser(userIdToDelete)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
