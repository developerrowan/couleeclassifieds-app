import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import { UserDto } from '../models/user.dto';
import { getAllUserRoles, getUser, getUserById, updateUser } from '../services/auth.service';

export default function UserProfile() {
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = async (data: any) => {
    const updatedUser: UserDto = {
      userId: user!.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      role: 99,
      active: true
    };

    updateUser(updatedUser).then((result) => {
      if (result) {
        setSaved(true);
        setFailed(false);
      } else {
        setFailed(true);
        setSaved(false);
      }
    });
  };

  const [user, setUser] = useState<UserDto | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const uid = getUser().userId;
    getUserById(uid).then((user) => {
      setUser(user);
    });
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
              <h1>Hi, {user.firstName}.</h1>
            </div>
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                {...register('firstName')}
                type="text"
                className="form-control"
                id="firstName"
                defaultValue={user.firstName}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                {...register('lastName')}
                type="text"
                className="form-control"
                id="lastName"
                defaultValue={user.lastName}
              />
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                <FontAwesomeIcon icon="envelope" /> Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="form-control"
                id="email"
                defaultValue={user.email}
              />
            </div>
            <div className="col-12">
              <label htmlFor="password" className="form-label">
                <FontAwesomeIcon icon="lock" /> Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="form-control"
                id="password"
                defaultValue={user.password}
              />
            </div>
            <div className="col-12">
              <button
                type="submit"
                className={clsx('btn btn-primary', !formState.isDirty ? 'disabled' : '')}
              >
                Save
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
