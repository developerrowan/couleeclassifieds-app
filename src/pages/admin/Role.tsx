import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { UserRoleDto } from '../../models/user-role.dto';
import { getRoleById, insertRole, setPageTitle, updateRole } from '../../services/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

export default function Role() {
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = async (data: any) => {
    const updatedRole: UserRoleDto = {
      userRoleId: creationMode ? 0 : role!.userRoleId,
      name: data.name,
      description: data.description
    };

    console.log(updatedRole);

    if (creationMode) {
      insertRole(updatedRole).then((result) => {
        if (result === -1) {
          setSaved(false);
          setFailed(true);
        } else {
          setCreationMode(false);
          setRole(updatedRole);
          window.location.href = `/admin/roles/${result}?redirectFromSuccess=true`;
        }
      });
    } else {
      updateRole(updatedRole).then((result) => {
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

  const [role, setRole] = useState<UserRoleDto | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [creationMode, setCreationMode] = useState(false);
  const [searchParams] = useSearchParams();
  const { roleId } = useParams();

  useEffect(() => {
    const rid = +roleId!;

    setPageTitle(`Role ${rid}`);

    if (rid > 0) {
      getRoleById(+roleId!).then((role) => {
        setCreationMode(false);
        setRole(role);
      });
    } else {
      // We are adding a new role
      setCreationMode(true);

      setRole({
        userRoleId: 0,
        name: '',
        description: ''
      } as UserRoleDto);
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
      {role ? (
        <div className="container-fluid form-signin d-flex justify-content-center align-items-center">
          <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
            <div className="col-12">
              <a href="/admin/roles" onClick={confirmFormBeforeExit} className="btn btn-secondary">
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
                  defaultValue={role.userRoleId}
                  disabled
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Role Name
              </label>
              <input
                {...register('name', { required: true, minLength: 3, maxLength: 32 })}
                type="text"
                className="form-control"
                id="name"
                defaultValue={role.name}
              />
              {formState.errors.name && <p className="text-danger">Please enter the role name</p>}
            </div>
            <div className="col-md-6"></div>
            <div className="col-md-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                {...register('description', { required: true, minLength: 1, maxLength: 64 })}
                className="form-control"
                id="description"
                defaultValue={role.description}
              />
              {formState.errors.description && (
                <p className="text-danger">Please enter the role description</p>
              )}
            </div>
            <div className="col-12">
              <button
                type="submit"
                className={clsx('btn btn-primary', !formState.isDirty ? 'disabled' : '')}
              >
                {creationMode ? 'Add' : 'Save'}
              </button>
            </div>
            {saved && <p className="text-success text-center">Role successfully updated!</p>}
            {searchParams.get('redirectFromSuccess') && (
              <p className="text-success text-center">Role successfully added!</p>
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
