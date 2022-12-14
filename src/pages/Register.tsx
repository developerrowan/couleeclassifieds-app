import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hook';
import { login, registerUser, userWithEmailExists } from '../services/auth.service';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [employer, setEmployer] = useState(false);
  const { user, setUser } = useAuth();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, []);

  const onSubmit = async (data: any) => {
    const doesEmailExist = await userWithEmailExists(decodeURIComponent(data.email));

    if (doesEmailExist) {
      setEmailExists(true);
      return;
    }

    const tryRegister = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      employer
    });

    if (!tryRegister) {
      setFailed(true);
      return;
    }

    let next = searchParams.get('next');

    if (searchParams.get('next')) {
      if (next?.charCodeAt(0) === 47) {
        next = next.slice(1);
      }
    }

    navigate(
      `/login${next ? `?next=${next}&` : '?'}successMessage=${encodeURIComponent(
        'Successfully registered! Please log in with your new credentials.'
      )}`
    );
  };

  return (
    <div className="container-fluid form-signin d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="text-center flex-fill">
        <h1 className="h3 mb-3 fw-normal">Welcome aboard!</h1>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="First name"
            autoComplete="off"
            {...register('firstName', { required: true, minLength: 1, maxLength: 64 })}
          />
          {errors.firstName && <p className="text-danger">Please enter your first name</p>}
          <label htmlFor="firstName">First name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Last name"
            autoComplete="off"
            {...register('lastName', { required: true, minLength: 2, maxLength: 64 })}
          />
          {errors.lastName && <p className="text-danger">Please enter your last name</p>}
          <label htmlFor="lastName">Last name</label>
        </div>
        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            autoComplete="off"
            {...register('email', {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            })}
          />
          {errors.email && <p className="text-danger">Please enter your email</p>}
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            autoComplete="off"
            {...register('password', { required: true, pattern: /^(?=.*\d)(?=.*[a-z]).{8,16}$/ })}
          />
          {errors.password && <p className="text-danger">Please enter your password</p>}
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="checkbox mb-3">
          <label>
            <input type="checkbox" checked={employer} onChange={() => setEmployer(!employer)} /> I
            am an employer
          </label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Register
        </button>
        {emailExists && (
          <p className="text-danger">
            The email you provided already belongs to a registered user.
          </p>
        )}
        {failed && <p className="text-danger">Something went wrong. Please try again.</p>}
        {searchParams.get('message') && (
          <p className="text-danger">{decodeURIComponent(searchParams.get('message')!)}</p>
        )}
        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
      </form>
    </div>
  );
}
