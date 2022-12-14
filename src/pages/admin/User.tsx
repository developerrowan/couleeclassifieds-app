import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { UserDto } from '../../models/user.dto';
import { UserRoleDto } from '../../models/user-role.dto';
import {
  getAllUserRoles,
  getUserById,
  insertUser,
  setPageTitle,
  updateUser
} from '../../services/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

export default function User() {
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = async (data: any) => {
    const userRole = roles.find((role) => role.name == data.role);

    const updatedUser: UserDto = {
      userId: creationMode ? 0 : user!.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      role: userRole.userRoleId,
      active: data.active
    };

    if (creationMode) {
      insertUser(updatedUser).then((result) => {
        if (result === -1) {
          setSaved(false);
          setFailed(true);
        } else {
          setCreationMode(false);
          setUser(updatedUser);
          window.location.href = `/admin/users/${result}?redirectFromSuccess=true`;
        }
      });
    } else {
      updateUser(updatedUser).then((result) => {
        if (result) {
          setSaved(true);
          setFailed(false);
        } else {
          setFailed(true);
          setSaved(false);
        }
      });
    }
  };

  const [user, setUser] = useState<UserDto | undefined>(undefined);
  const [roles, setRoles] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [creationMode, setCreationMode] = useState(false);
  const [searchParams] = useSearchParams();
  const { userId } = useParams();

  useEffect(() => {
    getAllUserRoles().then((roles) => {
      setRoles(roles);
    });

    const uid = +userId!;

    setPageTitle(`User ${uid}`);

    if (uid > 0) {
      getUserById(+userId!).then((user) => {
        setCreationMode(false);
        setUser(user);
      });
    } else {
      // We are adding a new user
      setCreationMode(true);

      setUser({
        userId: 0,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 1,
        active: true
      } as UserDto);
    }
  }, []);

  const confirmFormBeforeExit = (e: React.MouseEvent<HTMLAnchorElement> | undefined) => {
    if (formState.isDirty) {
      const confirmation = window.confirm(
        'You have unsaved changes! Do you really want to discard them?'
      );

      if (!confirmation) e?.preventDefault();
      return;
    }
  };

  return (
    <>
      {user ? (
        <div className="container-fluid form-signin d-flex justify-content-center align-items-center">
          <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
            <div className="col-12">
              <a href="/admin/users" onClick={confirmFormBeforeExit} className="btn btn-secondary">
                <FontAwesomeIcon icon="arrow-left" /> Back
              </a>
            </div>
            <div className="col-md-12">
              <div className="col-md-4">
                <label htmlFor="inputId" className="form-label">
                  ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputId"
                  defaultValue={user.userId}
                  disabled
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                {...register('firstName', { required: true, minLength: 1, maxLength: 64 })}
                type="text"
                className="form-control"
                id="firstName"
                defaultValue={user.firstName}
              />
              {formState.errors.firstName && (
                <p className="text-danger">Please enter your first name</p>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                {...register('lastName', { required: true, minLength: 1, maxLength: 64 })}
                type="text"
                className="form-control"
                id="lastName"
                defaultValue={user.lastName}
              />
              {formState.errors.lastName && (
                <p className="text-danger">Please enter your last name</p>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                <FontAwesomeIcon icon="envelope" /> Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                defaultValue={user.email}
                {...register('email', {
                  required: true,
                  pattern:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                })}
              />
              {formState.errors.email && <p className="text-danger">Please enter your email</p>}
            </div>
            <div className="col-12">
              <label htmlFor="password" className="form-label">
                <FontAwesomeIcon icon="lock" /> Password
              </label>
              <input
                {...register('password', { required: true })}
                type="password"
                className="form-control"
                id="password"
                defaultValue={user.password}
              />
              {formState.errors.password && <p className="text-danger">Please enter a password</p>}
            </div>
            <div className="col-md-10">
              <label htmlFor="role" className="form-label">
                <FontAwesomeIcon icon="user-group" /> Role
              </label>
              <select {...register('role', { required: true })} id="role" className="form-select">
                {roles &&
                  roles.map((role, i) => {
                    return (
                      <option key={i} selected={role.userRoleId === user.role}>
                        {role.name}
                      </option>
                    );
                  })}
              </select>
              {formState.errors.role && <p className="text-danger">Please select a role</p>}
            </div>
            <div className="col-md-2">
              <label className="form-check-label" htmlFor="active">
                <FontAwesomeIcon icon="chart-line" /> Active
              </label>
              <input
                {...register('active')}
                className="form-check-input"
                type="checkbox"
                id="active"
                defaultChecked={user.active}
              />
            </div>
            <div className="col-12">
              <button
                type="submit"
                className={clsx('btn btn-primary', !formState.isDirty ? 'disabled' : '')}
              >
                {creationMode ? 'Add' : 'Save'}
              </button>
            </div>
            {saved && <p className="text-success text-center">User successfully updated!</p>}
            {searchParams.get('redirectFromSuccess') && (
              <p className="text-success text-center">User successfully added!</p>
            )}
            {failed && (
              <p className="text-danger text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}
