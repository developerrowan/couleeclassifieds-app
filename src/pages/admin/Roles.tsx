import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { UserRoleDto } from '../../models/user-role.dto';
import {
  getAllUserRoles,
  getAllUsers,
  deleteUser,
  setPageTitle
} from '../../services/auth.service';

export default function Roles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setPageTitle('Roles');

    getAllUserRoles().then((roles) => {
      setRoles(roles);
    });
  }, []);

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
              <th scope="col">
                <FontAwesomeIcon icon="signature" /> Role Name
              </th>
              <th scope="col">
                <FontAwesomeIcon icon="comment" /> Role Description
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r: UserRoleDto, i) => {
              return (
                <tr key={i}>
                  <td>
                    <a href={`/admin/roles/${r.userRoleId}`} className="btn btn-primary">
                      <FontAwesomeIcon icon="pen-to-square" />
                    </a>
                  </td>
                  <td>
                    <a className="btn btn-danger disabled">
                      <FontAwesomeIcon icon="trash" />
                    </a>
                  </td>
                  <th scope="row">{r.userRoleId}</th>
                  <td>{r.name}</td>
                  <td>{r.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <a href="/admin/roles/0" className="btn btn-primary">
          Add Role
        </a>
      </div>
    </div>
  );
}
